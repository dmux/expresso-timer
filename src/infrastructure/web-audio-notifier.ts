import type { Notifier } from "@/application/ports"

/** Two short square-wave blips — close enough to an 8-bit chime, and no asset to load. */
const CHIME_NOTES = [
  { frequency: 880, startMs: 0, durationMs: 110 },
  { frequency: 1318.5, startMs: 130, durationMs: 200 },
]

export function createWebAudioNotifier(): Notifier {
  let context: AudioContext | null = null

  const ensureContext = (): AudioContext | null => {
    if (typeof window === "undefined") return null
    if (!context) {
      const Ctor = window.AudioContext ?? window.webkitAudioContext
      if (!Ctor) return null
      context = new Ctor()
    }
    // Browsers start the context suspended until a user gesture resumes it.
    if (context.state === "suspended") void context.resume()
    return context
  }

  return {
    prepare() {
      ensureContext()
    },

    chime() {
      const ctx = ensureContext()
      if (!ctx) return

      for (const note of CHIME_NOTES) {
        const startAt = ctx.currentTime + note.startMs / 1000
        const endAt = startAt + note.durationMs / 1000

        const oscillator = ctx.createOscillator()
        oscillator.type = "square"
        oscillator.frequency.setValueAtTime(note.frequency, startAt)

        const gain = ctx.createGain()
        gain.gain.setValueAtTime(0.08, startAt)
        gain.gain.exponentialRampToValueAtTime(0.0001, endAt)

        oscillator.connect(gain).connect(ctx.destination)
        oscillator.start(startAt)
        oscillator.stop(endAt)
      }
    },

    notify() {
      // Sound only; notifications are a separate adapter.
    },
  }
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}
