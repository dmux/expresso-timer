import { isBreak, type Phase } from "@/domain/timer/phase"

const SEGMENTS = 20

type PhaseBarProps = {
  phase: Phase
  progress: number
}

/**
 * Discrete blocks rather than a continuous fill: a smoothly growing bar would be the
 * one element on screen not living on the pixel grid.
 */
export function PhaseBar({ phase, progress }: PhaseBarProps) {
  const lit = Math.round(progress * SEGMENTS)
  const color = isBreak(phase) ? "var(--px-rest)" : "var(--px-accent)"

  return (
    <div
      className="flex w-full gap-[var(--px)] bg-[var(--px-surface-alt)] p-[var(--px)] pixel-bevel-inset"
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progresso da fase"
    >
      {Array.from({ length: SEGMENTS }, (_, index) => (
        <span
          key={index}
          className="h-[calc(var(--px)*3)] flex-1"
          style={{
            backgroundColor: index < lit ? color : "var(--px-surface)",
          }}
        />
      ))}
    </div>
  )
}
