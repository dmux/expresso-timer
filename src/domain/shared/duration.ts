export const SECOND = 1_000
export const MINUTE = 60 * SECOND

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/** Rounds up so the display only reads 00:00 once the phase is actually over. */
export function msToClock(ms: number): string {
  const totalSeconds = Math.ceil(Math.max(0, ms) / SECOND)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${pad(minutes)}:${pad(seconds)}`
}

function pad(value: number): string {
  return value.toString().padStart(2, "0")
}
