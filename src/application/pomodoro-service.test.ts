import { beforeEach, describe, expect, it, vi } from "vitest"

import { MINUTE } from "@/domain/shared/duration"
import { DEFAULT_SETTINGS, type PomodoroSettings } from "@/domain/timer/settings"
import { PomodoroService } from "./pomodoro-service"
import type {
  Clock,
  Notifier,
  SessionLog,
  SessionRecord,
  SettingsRepository,
} from "./ports"

const T0 = 1_700_000_000_000

/** A hand-cranked clock — the whole point of the Clock port. */
function fakeClock(): Clock & { advance(ms: number): void } {
  let now = T0
  return {
    now: () => now,
    advance(ms) {
      now += ms
    },
  }
}

function memorySettingsRepository(
  initial: PomodoroSettings | null = null
): SettingsRepository {
  let stored = initial
  return {
    load: () => stored,
    save: vi.fn((settings) => {
      stored = settings
    }),
  }
}

function memorySessionLog(): SessionLog {
  const records: SessionRecord[] = []
  return {
    append: vi.fn((record) => {
      records.unshift(record)
    }),
    recent: (limit) => records.slice(0, limit),
  }
}

function spyNotifier(): Notifier {
  return { prepare: vi.fn(), chime: vi.fn(), notify: vi.fn() }
}

function build(settings: PomodoroSettings | null = null) {
  const clock = fakeClock()
  const settingsRepository = memorySettingsRepository(settings)
  const sessionLog = memorySessionLog()
  const notifier = spyNotifier()
  const service = new PomodoroService({
    clock,
    settingsRepository,
    sessionLog,
    notifier,
  })
  return { service, clock, settingsRepository, sessionLog, notifier }
}

describe("construction", () => {
  it("falls back to the defaults when nothing is stored", () => {
    const { service } = build()
    expect(service.getSnapshot().settings).toEqual(DEFAULT_SETTINGS)
  })

  it("adopts stored settings", () => {
    const stored = { ...DEFAULT_SETTINGS, focusMinutes: 10 }
    const { service } = build(stored)

    expect(service.getSnapshot().settings.focusMinutes).toBe(10)
    expect(service.getSnapshot().session.durationMs).toBe(10 * MINUTE)
  })
})

describe("completing a phase", () => {
  it("chimes, notifies and logs exactly once", () => {
    const { service, clock, notifier, sessionLog } = build({
      ...DEFAULT_SETTINGS,
      notificationsEnabled: true,
    })

    service.toggle()
    clock.advance(25 * MINUTE)
    service.tick()

    expect(notifier.chime).toHaveBeenCalledTimes(1)
    expect(notifier.notify).toHaveBeenCalledTimes(1)
    expect(sessionLog.append).toHaveBeenCalledTimes(1)

    // Further ticks on the fresh phase must stay silent.
    clock.advance(1_000)
    service.tick()
    expect(notifier.chime).toHaveBeenCalledTimes(1)
    expect(sessionLog.append).toHaveBeenCalledTimes(1)
  })

  it("respects the sound and notification toggles", () => {
    const { service, clock, notifier } = build({
      ...DEFAULT_SETTINGS,
      soundEnabled: false,
      notificationsEnabled: false,
    })

    service.toggle()
    clock.advance(25 * MINUTE)
    service.tick()

    expect(notifier.chime).not.toHaveBeenCalled()
    expect(notifier.notify).not.toHaveBeenCalled()
  })

  it("logs a skipped phase without chiming — nothing was finished", () => {
    const { service, clock, notifier, sessionLog } = build()

    service.toggle()
    clock.advance(3 * MINUTE)
    service.skip()

    expect(sessionLog.append).toHaveBeenCalledTimes(1)
    expect(notifier.chime).not.toHaveBeenCalled()
    expect(service.getSnapshot().session.phase).toBe("shortBreak")
  })

  it("surfaces the completed session in the snapshot history", () => {
    const { service, clock } = build()

    service.toggle()
    clock.advance(25 * MINUTE)
    service.tick()

    expect(service.getSnapshot().history).toHaveLength(1)
    expect(service.getSnapshot().history[0]).toMatchObject({
      phase: "focus",
      ranToCompletion: true,
    })
  })
})

describe("audio unlock", () => {
  it("prepares the notifier on the gesture that starts the timer", () => {
    const { service, notifier } = build()

    service.toggle()
    expect(notifier.prepare).toHaveBeenCalledTimes(1)
  })

  it("does not prepare again when merely pausing", () => {
    const { service, notifier } = build()

    service.toggle()
    service.toggle()
    expect(notifier.prepare).toHaveBeenCalledTimes(1)
  })
})

describe("updateSettings", () => {
  it("persists and re-applies the duration", () => {
    const { service, settingsRepository } = build()

    service.updateSettings({ focusMinutes: 5 })

    expect(settingsRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({ focusMinutes: 5 })
    )
    expect(service.getSnapshot().session.durationMs).toBe(5 * MINUTE)
    expect(service.getSnapshot().remainingMs).toBe(5 * MINUTE)
  })

  it("asks for notification permission only when the toggle is switched on", () => {
    const { service, notifier } = build()

    service.updateSettings({ soundEnabled: false })
    expect(notifier.prepare).not.toHaveBeenCalled()

    service.updateSettings({ notificationsEnabled: true })
    expect(notifier.prepare).toHaveBeenCalledTimes(1)
  })
})

describe("subscribe", () => {
  let listener: () => void

  beforeEach(() => {
    listener = vi.fn()
  })

  it("notifies when the displayed second changes, not on every tick", () => {
    const { service, clock } = build()
    service.toggle()
    service.subscribe(listener)

    // Still inside the same displayed second.
    clock.advance(200)
    service.tick()
    expect(listener).not.toHaveBeenCalled()

    clock.advance(900)
    service.tick()
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it("stops notifying after unsubscribe", () => {
    const { service, clock } = build()
    service.toggle()
    const unsubscribe = service.subscribe(listener)

    unsubscribe()
    clock.advance(2_000)
    service.tick()

    expect(listener).not.toHaveBeenCalled()
  })

  it("keeps the snapshot referentially stable while nothing visible changes", () => {
    const { service, clock } = build()
    service.toggle()
    const before = service.getSnapshot()

    clock.advance(100)
    service.tick()

    expect(service.getSnapshot()).toBe(before)
  })
})
