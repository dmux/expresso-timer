import { PomodoroService } from "@/application/pomodoro-service"
import { createBrowserNotifier } from "@/infrastructure/browser-notifier"
import { createCompositeNotifier } from "@/infrastructure/composite-notifier"
import { createLocalStorageSessionLog } from "@/infrastructure/local-storage-session-log"
import { createLocalStorageSettingsRepository } from "@/infrastructure/local-storage-settings-repository"
import {
  nullNotifier,
  nullSessionLog,
  nullSettingsRepository,
} from "@/infrastructure/null-adapters"
import { systemClock } from "@/infrastructure/system-clock"
import { createWebAudioNotifier } from "@/infrastructure/web-audio-notifier"

/**
 * Composition root — the only place concrete adapters are named. Swapping any of them
 * out is a one-line change here, and nothing else in the app knows the difference.
 */
export function createPomodoroService(): PomodoroService {
  const browser = typeof window !== "undefined"

  return new PomodoroService({
    clock: systemClock,
    settingsRepository: browser
      ? createLocalStorageSettingsRepository(window.localStorage)
      : nullSettingsRepository,
    sessionLog: browser
      ? createLocalStorageSessionLog(window.localStorage)
      : nullSessionLog,
    notifier: browser
      ? createCompositeNotifier([createWebAudioNotifier(), createBrowserNotifier()])
      : nullNotifier,
  })
}
