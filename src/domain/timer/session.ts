import { clamp } from "../shared/duration"
import type { Phase } from "./phase"
import { durationFor, type PomodoroSettings } from "./settings"

export type SessionStatus = "idle" | "running" | "paused"

/**
 * Time is stored as marks, never accumulated tick by tick: `elapsedMs` is derived
 * from the clock on every read. Background tabs, throttling and system sleep
 * therefore cannot make the countdown drift.
 */
export type Session = {
  readonly phase: Phase
  readonly status: SessionStatus
  readonly completedFocusCount: number
  /** Epoch ms of the last start/resume, or `null` while not running. */
  readonly startedAt: number | null
  /** Time banked before the last pause. */
  readonly elapsedBeforeMs: number
  readonly durationMs: number
}

/** Emitted instead of performing side effects, so the domain stays pure. */
export type PhaseCompleted = {
  readonly phase: Phase
  readonly elapsedMs: number
  readonly completedAt: number
  readonly next: Phase
  /** False when the user skipped ahead before the phase ran out. */
  readonly ranToCompletion: boolean
}

export type AdvanceResult = {
  readonly session: Session
  readonly event?: PhaseCompleted
}

export function createSession(settings: PomodoroSettings): Session {
  return startOfPhase("focus", 0, settings)
}

function startOfPhase(
  phase: Phase,
  completedFocusCount: number,
  settings: PomodoroSettings
): Session {
  return {
    phase,
    status: "idle",
    completedFocusCount,
    startedAt: null,
    elapsedBeforeMs: 0,
    durationMs: durationFor(phase, settings),
  }
}

export function elapsedMs(session: Session, now: number): number {
  return session.status === "running" && session.startedAt !== null
    ? session.elapsedBeforeMs + Math.max(0, now - session.startedAt)
    : session.elapsedBeforeMs
}

export function remainingMs(session: Session, now: number): number {
  return Math.max(0, session.durationMs - elapsedMs(session, now))
}

export function progress(session: Session, now: number): number {
  if (session.durationMs <= 0) return 1
  return clamp(elapsedMs(session, now) / session.durationMs, 0, 1)
}

export function start(session: Session, now: number): Session {
  if (session.status === "running") return session
  return { ...session, status: "running", startedAt: now }
}

export function pause(session: Session, now: number): Session {
  if (session.status !== "running") return session
  return {
    ...session,
    status: "paused",
    startedAt: null,
    elapsedBeforeMs: elapsedMs(session, now),
  }
}

export function toggle(session: Session, now: number): Session {
  return session.status === "running" ? pause(session, now) : start(session, now)
}

/** Restarts the current phase, keeping the cycle count. */
export function reset(session: Session, settings: PomodoroSettings): Session {
  return {
    ...session,
    status: "idle",
    startedAt: null,
    elapsedBeforeMs: 0,
    durationMs: durationFor(session.phase, settings),
  }
}

/** Which phase follows the current one, given how many focuses will then be done. */
export function nextPhase(session: Session, settings: PomodoroSettings): Phase {
  if (session.phase !== "focus") return "focus"
  const focusCount = session.completedFocusCount + 1
  return focusCount % settings.cyclesUntilLongBreak === 0 ? "longBreak" : "shortBreak"
}

function complete(
  session: Session,
  now: number,
  settings: PomodoroSettings,
  ranToCompletion: boolean
): Required<AdvanceResult> {
  const next = nextPhase(session, settings)
  const completedFocusCount =
    session.phase === "focus"
      ? session.completedFocusCount + 1
      : session.completedFocusCount

  return {
    session: startOfPhase(next, completedFocusCount, settings),
    event: {
      phase: session.phase,
      elapsedMs: Math.min(elapsedMs(session, now), session.durationMs),
      completedAt: now,
      next,
      ranToCompletion,
    },
  }
}

/** Jumps to the next phase early; still counts as a completed focus. */
export function skip(
  session: Session,
  now: number,
  settings: PomodoroSettings
): Required<AdvanceResult> {
  return complete(session, now, settings, false)
}

/**
 * The tick. Returns an unchanged session while time remains, and a `PhaseCompleted`
 * event the moment it runs out — the caller decides what to do about sound,
 * notifications and logging.
 */
export function advance(
  session: Session,
  now: number,
  settings: PomodoroSettings
): AdvanceResult {
  if (session.status !== "running" || remainingMs(session, now) > 0) {
    return { session }
  }

  const { session: entered, event } = complete(session, now, settings, true)
  return {
    session: settings.autoStartNext ? start(entered, now) : entered,
    event,
  }
}

/**
 * Re-applies durations after the user edits the settings. A phase already under way
 * keeps its elapsed time, so shortening it below what has passed ends it on the next tick.
 */
export function withSettings(session: Session, settings: PomodoroSettings): Session {
  const durationMs = durationFor(session.phase, settings)
  if (durationMs === session.durationMs) return session
  return session.status === "idle"
    ? { ...session, durationMs, elapsedBeforeMs: 0 }
    : { ...session, durationMs }
}
