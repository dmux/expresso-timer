import { PHASE_LABELS } from "@/domain/timer/phase"
import {
  advance,
  createSession,
  progress,
  remainingMs,
  reset,
  skip,
  start,
  toggle,
  withSettings,
  type PhaseCompleted,
  type Session,
} from "@/domain/timer/session"
import { DEFAULT_SETTINGS, type PomodoroSettings } from "@/domain/timer/settings"
import type {
  Clock,
  Notifier,
  SessionLog,
  SessionRecord,
  SettingsRepository,
} from "./ports"

/** Everything the UI needs for a frame, already derived. */
export type PomodoroSnapshot = {
  readonly session: Session
  readonly settings: PomodoroSettings
  readonly remainingMs: number
  readonly progress: number
  readonly history: readonly SessionRecord[]
}

export type PomodoroDependencies = {
  readonly clock: Clock
  readonly settingsRepository: SettingsRepository
  readonly sessionLog: SessionLog
  readonly notifier: Notifier
}

type Listener = () => void

/**
 * Composes the pure domain with the driven ports and exposes an observable store,
 * shaped for `useSyncExternalStore`. It owns no rendering and no timers — the UI
 * decides how often to call `tick`.
 */
export class PomodoroService {
  private settings: PomodoroSettings
  private session: Session
  private history: readonly SessionRecord[]
  private snapshot: PomodoroSnapshot
  private readonly listeners = new Set<Listener>()

  constructor(private readonly deps: PomodoroDependencies) {
    this.settings = deps.settingsRepository.load() ?? DEFAULT_SETTINGS
    this.session = createSession(this.settings)
    this.history = deps.sessionLog.recent(HISTORY_LIMIT)
    this.snapshot = this.buildSnapshot()
  }

  getSnapshot = (): PomodoroSnapshot => this.snapshot

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener)
    return () => {
      this.listeners.delete(listener)
    }
  }

  toggle = (): void => {
    const wasIdle = this.session.status !== "running"
    if (wasIdle) this.deps.notifier.prepare()
    this.session = toggle(this.session, this.deps.clock.now())
    this.publish()
  }

  start = (): void => {
    this.deps.notifier.prepare()
    this.session = start(this.session, this.deps.clock.now())
    this.publish()
  }

  reset = (): void => {
    this.session = reset(this.session, this.settings)
    this.publish()
  }

  skip = (): void => {
    const { session, event } = skip(this.session, this.deps.clock.now(), this.settings)
    this.session = session
    this.handle(event)
    this.publish()
  }

  /** Called on an interval by the UI; cheap and idempotent while time remains. */
  tick = (): void => {
    const { session, event } = advance(this.session, this.deps.clock.now(), this.settings)
    this.session = session
    if (event) this.handle(event)
    this.publish()
  }

  updateSettings = (patch: Partial<PomodoroSettings>): void => {
    this.settings = { ...this.settings, ...patch }
    this.deps.settingsRepository.save(this.settings)
    this.session = withSettings(this.session, this.settings)
    if (patch.notificationsEnabled) this.deps.notifier.prepare()
    this.publish()
  }

  private handle(event: PhaseCompleted): void {
    const record: SessionRecord = {
      phase: event.phase,
      elapsedMs: event.elapsedMs,
      completedAt: event.completedAt,
      ranToCompletion: event.ranToCompletion,
    }
    this.deps.sessionLog.append(record)
    this.history = this.deps.sessionLog.recent(HISTORY_LIMIT)

    if (!event.ranToCompletion) return
    if (this.settings.soundEnabled) this.deps.notifier.chime()
    if (this.settings.notificationsEnabled) {
      this.deps.notifier.notify(
        `${PHASE_LABELS[event.phase]} concluído`,
        `Agora: ${PHASE_LABELS[event.next].toLowerCase()}.`
      )
    }
  }

  private buildSnapshot(): PomodoroSnapshot {
    const now = this.deps.clock.now()
    return {
      session: this.session,
      settings: this.settings,
      remainingMs: remainingMs(this.session, now),
      progress: progress(this.session, now),
      history: this.history,
    }
  }

  /** Only notifies when something a renderer would notice actually moved. */
  private publish(): void {
    const next = this.buildSnapshot()
    if (isEquivalent(this.snapshot, next)) return
    this.snapshot = next
    for (const listener of this.listeners) listener()
  }
}

const HISTORY_LIMIT = 8

/**
 * The countdown is only ever shown to the second, so sub-second changes must not
 * wake React up four times a second for nothing.
 */
function isEquivalent(a: PomodoroSnapshot, b: PomodoroSnapshot): boolean {
  return (
    a.session === b.session &&
    a.settings === b.settings &&
    a.history === b.history &&
    Math.ceil(a.remainingMs / 1000) === Math.ceil(b.remainingMs / 1000)
  )
}
