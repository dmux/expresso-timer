"use client"

import type { Sprite } from "@/domain/pixelart/sprite"
import { ICON_AUTO, ICON_MOON, ICON_SUN } from "@/domain/pixelart/sprites/icons"
import { PixelSprite } from "@/ui/components/pixel-sprite"
import { Button } from "@/ui/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/components/ui/tooltip"
import { useTheme, type ThemePreference } from "@/ui/theme"

const OPTIONS: { value: ThemePreference; label: string; sprite: Sprite }[] = [
  { value: "light", label: "Claro", sprite: ICON_SUN },
  { value: "dark", label: "Escuro", sprite: ICON_MOON },
  { value: "system", label: "Sistema", sprite: ICON_AUTO },
]

/**
 * A three-way segmented control rather than a two-state switch: "system" is a real
 * choice, not the absence of one, and collapsing it into a toggle loses the ability to
 * follow the OS after you have touched the control once.
 */
export function ThemeToggle() {
  const { preference, setPreference } = useTheme()

  return (
    <div
      role="radiogroup"
      aria-label="Tema"
      className="flex items-center gap-[var(--px)]"
    >
      {OPTIONS.map((option) => {
        const active = preference === option.value

        return (
          <Tooltip key={option.value}>
            <TooltipTrigger
              render={
                <Button
                  variant={active ? "outline" : "ghost"}
                  size="icon"
                  role="radio"
                  aria-checked={active}
                  aria-label={option.label}
                  className={active ? "shadow-none pixel-bevel-inset" : undefined}
                />
              }
              onClick={() => setPreference(option.value)}
            >
              <PixelSprite
                sprite={option.sprite}
                color="currentColor"
                className="w-[calc(var(--px)*5)]"
              />
            </TooltipTrigger>
            <TooltipContent>{option.label}</TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}
