import { clamp } from "../shared/duration"
import { isBreak, type Phase } from "../timer/phase"

/**
 * The metaphor, in one line: focus drains the cup — you drink while you work —
 * and a break pours a fresh one. 1 = full, 0 = empty.
 */
export function levelFor(phase: Phase, progress: number): number {
  const p = clamp(progress, 0, 1)
  return isBreak(phase) ? p : 1 - p
}

/**
 * Steam fades faster than the coffee drains, so the cup visibly cools before it
 * empties. The exponent is what makes the two curves diverge.
 */
export function steamIntensity(level: number): number {
  return clamp(level, 0, 1) ** 1.5
}
