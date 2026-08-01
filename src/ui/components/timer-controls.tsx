"use client"

import {
  ICON_PAUSE,
  ICON_PLAY,
  ICON_RESET,
  ICON_SKIP,
} from "@/domain/pixelart/sprites/icons"
import type { SessionStatus } from "@/domain/timer/session"
import { PixelSprite } from "@/ui/components/pixel-sprite"
import { Button } from "@/ui/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/components/ui/tooltip"
import type { Sprite } from "@/domain/pixelart/sprite"

type TimerControlsProps = {
  status: SessionStatus
  onToggle: () => void
  onReset: () => void
  onSkip: () => void
}

export function TimerControls({ status, onToggle, onReset, onSkip }: TimerControlsProps) {
  const running = status === "running"

  return (
    <div className="flex items-center justify-center gap-[calc(var(--px)*3)]">
      <Button size="lg" onClick={onToggle} className="min-w-[calc(var(--px)*44)]">
        <PixelSprite
          sprite={running ? ICON_PAUSE : ICON_PLAY}
          color="currentColor"
          className="w-[calc(var(--px)*5)]"
        />
        {running ? "Pausar" : status === "paused" ? "Retomar" : "Iniciar"}
      </Button>

      <IconButton label="Reiniciar fase" sprite={ICON_RESET} onClick={onReset} />
      <IconButton label="Pular fase" sprite={ICON_SKIP} onClick={onSkip} />
    </div>
  )
}

/** Sprites carry no text, so every icon button needs both a label and a tooltip. */
function IconButton({
  label,
  sprite,
  onClick,
}: {
  label: string
  sprite: Sprite
  onClick: () => void
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={<Button variant="secondary" size="icon-lg" aria-label={label} />}
        onClick={onClick}
      >
        <PixelSprite
          sprite={sprite}
          color="currentColor"
          className="w-[calc(var(--px)*6)]"
        />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
