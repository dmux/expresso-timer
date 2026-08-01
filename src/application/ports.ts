import type { Phase } from "@/domain/timer/phase"
import type { PomodoroSettings } from "@/domain/timer/settings"

/** Driven ports. Every one of them is implemented in `infrastructure/`. */

export type Clock = {
  now(): number
}

export type SessionRecord = {
  readonly phase: Phase
  readonly elapsedMs: number
  readonly completedAt: number
  readonly ranToCompletion: boolean
}

export type SettingsRepository = {
  load(): PomodoroSettings | null
  save(settings: PomodoroSettings): void
}

export type SessionLog = {
  append(record: SessionRecord): void
  recent(limit: number): SessionRecord[]
}

export type Notifier = {
  /** Called on a user gesture, so adapters can unlock audio/permission here. */
  prepare(): void
  chime(): void
  notify(title: string, body: string): void
}
