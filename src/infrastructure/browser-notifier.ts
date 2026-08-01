import type { Notifier } from "@/application/ports"

export function createBrowserNotifier(): Notifier {
  const supported = () => typeof window !== "undefined" && "Notification" in window

  return {
    /** Only ever reached from a click, which is the one place permission may be asked. */
    prepare() {
      if (!supported() || Notification.permission !== "default") return
      void Notification.requestPermission()
    },

    chime() {
      // Silent; sound is a separate adapter.
    },

    notify(title, body) {
      if (!supported() || Notification.permission !== "granted") return
      try {
        new Notification(title, { body })
      } catch {
        // Some browsers reject constructed notifications outside a service worker.
      }
    },
  }
}
