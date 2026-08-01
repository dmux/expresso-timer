export type Phase = "focus" | "shortBreak" | "longBreak"

export function isBreak(phase: Phase): boolean {
  return phase !== "focus"
}
