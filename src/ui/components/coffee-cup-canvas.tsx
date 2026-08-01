"use client"

import { useEffect, useRef, useState } from "react"

import { levelFor, steamIntensity } from "@/domain/cup/cup-level"
import { advanceSteam, type SteamParticle } from "@/domain/cup/steam"
import { CUP_STEAM_ORIGIN_X, CUP_STEAM_ORIGIN_Y } from "@/domain/pixelart/sprites/cup"
import { progress, type Session } from "@/domain/timer/session"
import {
  createCanvasCupRenderer,
  VIEWPORT_HEIGHT,
  VIEWPORT_WIDTH,
  type CupRenderer,
} from "@/infrastructure/canvas-cup-renderer"
import {
  useAnimationFrame,
  usePrefersReducedMotion,
} from "@/ui/hooks/use-animation-frame"
import { useTheme } from "@/ui/theme"

const STEAM_ORIGIN = { x: CUP_STEAM_ORIGIN_X, y: CUP_STEAM_ORIGIN_Y }

/** One sprite pixel every 600ms of bob — a whole pixel, never a fraction. */
const BOB_PERIOD_MS = 1200

/**
 * Sprite pixels per logical pixel. The 45-wide mug is nearly twice the old sprite, so
 * it draws at 2× rather than 3× to land at a similar size on screen — and staying an
 * integer multiple of `--px` is what keeps every edge sharp.
 */
const SPRITE_SCALE = 2

type CoffeeCupCanvasProps = {
  session: Session
}

export function CoffeeCupCanvas({ session }: CoffeeCupCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<CupRenderer | null>(null)
  const steamRef = useRef<SteamParticle[]>([])
  const elapsedRef = useRef(0)
  const [pixelSize, setPixelSize] = useState(0)
  const reducedMotion = usePrefersReducedMotion()
  const { resolved: theme } = useTheme()

  // The sprite tracks the same integer scale as the rest of the layout instead of
  // stretching to fill a container, which is what keeps it on the pixel grid.
  useEffect(() => {
    const read = () => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue("--px")
      const parsed = Number.parseInt(raw, 10)
      setPixelSize((Number.isFinite(parsed) ? parsed : 3) * SPRITE_SCALE)
    }

    read()
    window.addEventListener("resize", read)
    return () => window.removeEventListener("resize", read)
  }, [])

  useEffect(() => {
    if (!canvasRef.current || pixelSize <= 0) return
    rendererRef.current ??= createCanvasCupRenderer(canvasRef.current)
    rendererRef.current.resize(pixelSize)
  }, [pixelSize])

  // The stylesheet has already swapped the variables by the time this runs; the cached
  // palette in the renderer is the only copy that needs telling.
  useEffect(() => {
    rendererRef.current?.refreshPalette()
  }, [theme])

  // The whole animation lives outside React: 60fps of setState would re-render the
  // entire tree for pixels that only the canvas cares about.
  useAnimationFrame((dtMs) => {
    const renderer = rendererRef.current
    if (!renderer) return

    elapsedRef.current += dtMs
    const level = levelFor(session.phase, progress(session, Date.now()))
    const running = session.status === "running"

    if (!reducedMotion) {
      steamRef.current = advanceSteam(
        steamRef.current,
        dtMs,
        running ? steamIntensity(level) : 0,
        STEAM_ORIGIN,
        Math.random
      )
    }

    renderer.draw({
      level,
      steam: steamRef.current,
      bobOffset:
        running && !reducedMotion
          ? Math.floor((elapsedRef.current % BOB_PERIOD_MS) / (BOB_PERIOD_MS / 2))
          : 0,
    })
  }, pixelSize > 0)

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="mx-auto block"
      style={{
        width: VIEWPORT_WIDTH * pixelSize,
        height: VIEWPORT_HEIGHT * pixelSize,
      }}
    />
  )
}
