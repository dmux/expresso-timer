export type Phase = "focus" | "shortBreak" | "longBreak"

export const PHASE_LABELS: Record<Phase, string> = {
  focus: "FOCO",
  shortBreak: "PAUSA",
  longBreak: "PAUSA LONGA",
}

export function isBreak(phase: Phase): boolean {
  return phase !== "focus"
}
