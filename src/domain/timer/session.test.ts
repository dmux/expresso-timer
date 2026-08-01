import { describe, expect, it } from "vitest"

import { MINUTE } from "../shared/duration"
import {
  advance,
  createSession,
  elapsedMs,
  pause,
  progress,
  remainingMs,
  reset,
  skip,
  start,
  toggle,
  withSettings,
  type Session,
} from "./session"
import { DEFAULT_SETTINGS, type PomodoroSettings } from "./settings"

const T0 = 1_700_000_000_000
const settings = DEFAULT_SETTINGS

/** Runs a session to the end of its phase and returns the result of the tick. */
function runOut(session: Session, config: PomodoroSettings = settings) {
  return advance(session, T0 + session.durationMs, config)
}

describe("createSession", () => {
  it("starts idle on focus with the configured duration", () => {
    const session = createSession(settings)

    expect(session.phase).toBe("focus")
    expect(session.status).toBe("idle")
    expect(session.completedFocusCount).toBe(0)
    expect(session.durationMs).toBe(25 * MINUTE)
    expect(remainingMs(session, T0)).toBe(25 * MINUTE)
  })
})

describe("elapsed time", () => {
  it("derives from the clock while running", () => {
    const session = start(createSession(settings), T0)

    expect(elapsedMs(session, T0 + 90_000)).toBe(90_000)
    expect(remainingMs(session, T0 + 90_000)).toBe(25 * MINUTE - 90_000)
  })

  it("does not advance while paused, however much wall time passes", () => {
    const paused = pause(start(createSession(settings), T0), T0 + 60_000)

    expect(elapsedMs(paused, T0 + 60_000)).toBe(60_000)
    expect(elapsedMs(paused, T0 + 10 * MINUTE)).toBe(60_000)
  })

  it("banks time across a pause and resume", () => {
    const paused = pause(start(createSession(settings), T0), T0 + 60_000)
    const resumed = start(paused, T0 + 5 * MINUTE)

    expect(elapsedMs(resumed, T0 + 6 * MINUTE)).toBe(120_000)
  })

  it("never reports negative time remaining", () => {
    const session = start(createSession(settings), T0)

    expect(remainingMs(session, T0 + 60 * MINUTE)).toBe(0)
    expect(progress(session, T0 + 60 * MINUTE)).toBe(1)
  })
})

describe("toggle and reset", () => {
  it("alternates between running and paused", () => {
    const running = toggle(createSession(settings), T0)
    expect(running.status).toBe("running")

    const paused = toggle(running, T0 + 1_000)
    expect(paused.status).toBe("paused")
    expect(toggle(paused, T0 + 2_000).status).toBe("running")
  })

  it("clears elapsed time but keeps the cycle count", () => {
    const running = start({ ...createSession(settings), completedFocusCount: 2 }, T0)
    const wasReset = reset(pause(running, T0 + 3 * MINUTE), settings)

    expect(wasReset.status).toBe("idle")
    expect(elapsedMs(wasReset, T0)).toBe(0)
    expect(wasReset.completedFocusCount).toBe(2)
  })
})

describe("advance", () => {
  it("returns the same session while time remains", () => {
    const session = start(createSession(settings), T0)
    const result = advance(session, T0 + MINUTE, settings)

    expect(result.session).toBe(session)
    expect(result.event).toBeUndefined()
  })

  it("emits exactly one completion when the phase runs out", () => {
    const session = start(createSession(settings), T0)
    const first = runOut(session)

    expect(first.event).toMatchObject({
      phase: "focus",
      next: "shortBreak",
      ranToCompletion: true,
    })

    // Ticking the already-transitioned session must not fire a second event.
    expect(advance(first.session, T0 + 25 * MINUTE, settings).event).toBeUndefined()
  })

  it("leaves the next phase idle unless auto-start is on", () => {
    const session = start(createSession(settings), T0)
    expect(runOut(session).session.status).toBe("idle")

    const auto = { ...settings, autoStartNext: true }
    const autoSession = start(createSession(auto), T0)
    expect(runOut(autoSession, auto).session.status).toBe("running")
  })

  it("reaches a long break only after a full cycle of focuses", () => {
    let session = createSession(settings)
    const phases: string[] = []

    // Four focus/break pairs is one full cycle at the default settings.
    for (let i = 0; i < 8; i += 1) {
      const running = start(session, T0)
      const result = advance(running, T0 + running.durationMs, settings)
      phases.push(result.session.phase)
      session = result.session
    }

    expect(phases).toEqual([
      "shortBreak",
      "focus",
      "shortBreak",
      "focus",
      "shortBreak",
      "focus",
      "longBreak",
      "focus",
    ])
    expect(session.completedFocusCount).toBe(4)
  })
})

describe("skip", () => {
  it("moves on early and records the shorter elapsed time", () => {
    const session = start(createSession(settings), T0)
    const { session: next, event } = skip(session, T0 + 3 * MINUTE, settings)

    expect(next.phase).toBe("shortBreak")
    expect(next.completedFocusCount).toBe(1)
    expect(event.ranToCompletion).toBe(false)
    expect(event.elapsedMs).toBe(3 * MINUTE)
  })
})

describe("withSettings", () => {
  it("re-applies the duration to an idle session", () => {
    const session = withSettings(createSession(settings), {
      ...settings,
      focusMinutes: 10,
    })

    expect(session.durationMs).toBe(10 * MINUTE)
  })

  it("keeps elapsed time when the phase is already under way", () => {
    const running = start(createSession(settings), T0)
    const shortened = withSettings(running, { ...settings, focusMinutes: 10 })

    expect(shortened.durationMs).toBe(10 * MINUTE)
    expect(shortened.startedAt).toBe(T0)
    // Shrinking below what has already elapsed ends the phase on the next tick.
    expect(remainingMs(shortened, T0 + 11 * MINUTE)).toBe(0)
  })
})
