import type { Notifier } from "@/application/ports"

/** Lets sound and system notifications sit behind one port. */
export function createCompositeNotifier(notifiers: readonly Notifier[]): Notifier {
  return {
    prepare() {
      for (const notifier of notifiers) notifier.prepare()
    },
    chime() {
      for (const notifier of notifiers) notifier.chime()
    },
    notify(title, body) {
      for (const notifier of notifiers) notifier.notify(title, body)
    },
  }
}
