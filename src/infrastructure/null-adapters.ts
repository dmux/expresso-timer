import type { Notifier, SessionLog, SettingsRepository } from "@/application/ports"

/**
 * No-op implementations for the server render and for tests. They are what keeps
 * `typeof window` checks out of the service and the components.
 */

export const nullSettingsRepository: SettingsRepository = {
  load: () => null,
  save: () => {},
}

export const nullSessionLog: SessionLog = {
  append: () => {},
  recent: () => [],
}

export const nullNotifier: Notifier = {
  prepare: () => {},
  chime: () => {},
  notify: () => {},
}
