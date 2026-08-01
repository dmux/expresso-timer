import { z } from "zod"

import type { SettingsRepository } from "@/application/ports"
import { CUP_DESIGNS, DEFAULT_CUP_DESIGN } from "@/domain/cup/cup-design"
import {
  DEFAULT_SETTINGS,
  SETTINGS_LIMITS,
  type PomodoroSettings,
} from "@/domain/timer/settings"

const STORAGE_KEY = "expresso-timer:settings:v1"

/** Bounds come from the domain, so the sliders and the stored data cannot disagree. */
const minutes = (limits: { min: number; max: number }) =>
  z.number().int().min(limits.min).max(limits.max)

const schema = z.object({
  focusMinutes: minutes(SETTINGS_LIMITS.focusMinutes),
  shortBreakMinutes: minutes(SETTINGS_LIMITS.shortBreakMinutes),
  longBreakMinutes: minutes(SETTINGS_LIMITS.longBreakMinutes),
  cyclesUntilLongBreak: minutes(SETTINGS_LIMITS.cyclesUntilLongBreak),
  autoStartNext: z.boolean(),
  soundEnabled: z.boolean(),
  notificationsEnabled: z.boolean(),
  // Defaulted rather than required: settings saved before the design picker existed
  // must still load, instead of failing the parse and resetting every other field.
  cupDesign: z.enum(CUP_DESIGNS).default(DEFAULT_CUP_DESIGN),
})

export function createLocalStorageSettingsRepository(
  storage: Storage
): SettingsRepository {
  return {
    load() {
      const raw = storage.getItem(STORAGE_KEY)
      if (!raw) return null

      // Corrupted or outdated data falls back to defaults instead of breaking the app.
      try {
        const parsed = schema.safeParse(JSON.parse(raw))
        return parsed.success ? { ...DEFAULT_SETTINGS, ...parsed.data } : null
      } catch {
        return null
      }
    },

    save(settings: PomodoroSettings) {
      try {
        storage.setItem(STORAGE_KEY, JSON.stringify(settings))
      } catch {
        // Private browsing or a full quota must not take the timer down.
      }
    },
  }
}
