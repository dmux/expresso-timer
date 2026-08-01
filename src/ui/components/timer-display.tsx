import { msToClock } from "@/domain/shared/duration"
import { ICON_BEAN_EMPTY, ICON_BEAN_FULL } from "@/domain/pixelart/sprites/icons"
import { isBreak, PHASE_LABELS, type Phase } from "@/domain/timer/phase"
import { PixelSprite } from "@/ui/components/pixel-sprite"

type TimerDisplayProps = {
  phase: Phase
  remainingMs: number
  completedFocusCount: number
  cyclesUntilLongBreak: number
}

export function TimerDisplay({
  phase,
  remainingMs,
  completedFocusCount,
  cyclesUntilLongBreak,
}: TimerDisplayProps) {
  const beansFilled = completedFocusCount % cyclesUntilLongBreak
  const accent = isBreak(phase) ? "var(--px-rest)" : "var(--px-accent)"

  return (
    <div className="flex flex-col items-center gap-[calc(var(--px)*3)]">
      <p
        className="text-[calc(var(--px)*3)] tracking-[calc(var(--px)*1.5)] uppercase"
        style={{ color: accent }}
      >
        {PHASE_LABELS[phase]}
      </p>

      {/* The countdown is the live region; the canvas beside it is decorative. */}
      <p
        role="timer"
        aria-live="polite"
        aria-atomic="true"
        className="text-[calc(var(--px)*11)] leading-none tabular-nums"
      >
        {msToClock(remainingMs)}
      </p>

      <div
        className="flex items-center gap-[calc(var(--px)*2)]"
        aria-label={`${beansFilled} de ${cyclesUntilLongBreak} focos no ciclo`}
        role="img"
      >
        {Array.from({ length: cyclesUntilLongBreak }, (_, index) => (
          <PixelSprite
            key={index}
            sprite={index < beansFilled ? ICON_BEAN_FULL : ICON_BEAN_EMPTY}
            color={index < beansFilled ? accent : "var(--px-text-muted)"}
            className="w-[calc(var(--px)*5)]"
          />
        ))}
      </div>
    </div>
  )
}
