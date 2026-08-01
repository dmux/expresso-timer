import { DEFAULT_CUP_DESIGN, type CupDesign } from "../cup/cup-design"
import { MINUTE } from "../shared/duration"
import type { Phase } from "./phase"

export type PomodoroSettings = {
  readonly focusMinutes: number
  readonly shortBreakMinutes: number
  readonly longBreakMinutes: number
  readonly cyclesUntilLongBreak: number
  readonly autoStartNext: boolean
  readonly soundEnabled: boolean
  readonly notificationsEnabled: boolean
  /** Purely cosmetic — `withSettings` leaves the running phase alone when it changes. */
  readonly cupDesign: CupDesign
}

export const DEFAULT_SETTINGS: PomodoroSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  cyclesUntilLongBreak: 4,
  autoStartNext: false,
  soundEnabled: true,
  notificationsEnabled: false,
  cupDesign: DEFAULT_CUP_DESIGN,
}

/** Shared by the settings sliders and by the persistence schema, so both agree. */
export const SETTINGS_LIMITS = {
  focusMinutes: { min: 1, max: 90 },
  shortBreakMinutes: { min: 1, max: 30 },
  longBreakMinutes: { min: 1, max: 60 },
  cyclesUntilLongBreak: { min: 2, max: 8 },
} as const

export function durationFor(phase: Phase, settings: PomodoroSettings): number {
  switch (phase) {
    case "focus":
      return settings.focusMinutes * MINUTE
    case "shortBreak":
      return settings.shortBreakMinutes * MINUTE
    case "longBreak":
      return settings.longBreakMinutes * MINUTE
  }
}
