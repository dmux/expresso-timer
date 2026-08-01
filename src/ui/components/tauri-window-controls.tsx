"use client"

import { useEffect, useState } from "react"

import { ICON_CLOSE, ICON_MINIMIZE } from "@/domain/pixelart/sprites/icons"
import { PixelSprite } from "@/ui/components/pixel-sprite"
import { Button } from "@/ui/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/components/ui/tooltip"

export function TauriWindowControls() {
  const [isTauri, setIsTauri] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined" && "__TAURI_INTERNALS__" in window) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsTauri(true)
    }
  }, [])

  if (!isTauri) return null

  const handleClose = async () => {
    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window")
      getCurrentWindow().close()
    } catch (e) {
      console.error("Failed to close Tauri window", e)
    }
  }

  const handleMinimize = async () => {
    try {
      const { getCurrentWindow } = await import("@tauri-apps/api/window")
      getCurrentWindow().minimize()
    } catch (e) {
      console.error("Failed to minimize Tauri window", e)
    }
  }

  return (
    <div className="flex gap-[var(--px)]">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label="Minimizar"
              className="hover:bg-blue-500/10 hover:text-blue-500"
            />
          }
          onClick={handleMinimize}
        >
          <PixelSprite
            sprite={ICON_MINIMIZE}
            color="currentColor"
            className="w-[calc(var(--px)*4)]"
          />
        </TooltipTrigger>
        <TooltipContent>Minimizar</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              aria-label="Fechar"
              className="hover:bg-red-500/10 hover:text-red-500"
            />
          }
          onClick={handleClose}
        >
          <PixelSprite
            sprite={ICON_CLOSE}
            color="currentColor"
            className="w-[calc(var(--px)*4)]"
          />
        </TooltipTrigger>
        <TooltipContent>Fechar</TooltipContent>
      </Tooltip>
    </div>
  )
}
