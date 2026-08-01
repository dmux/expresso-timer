"use client"

import { useEffect, useRef, useState } from "react"

import type { CupDesign } from "@/domain/cup/cup-design"
import { levelFor, steamIntensity } from "@/domain/cup/cup-level"
import { advanceSteam, type SteamParticle } from "@/domain/cup/steam"
import { CUP_ART } from "@/domain/pixelart/sprites/cups"
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

type CoffeeCupCanvasProps = {
  session: Session
  design: CupDesign
}

export function CoffeeCupCanvas({ session, design }: CoffeeCupCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<CupRenderer | null>(null)
  const steamRef = useRef<SteamParticle[]>([])
  const [pixelSize, setPixelSize] = useState(0)
  const reducedMotion = usePrefersReducedMotion()
  const { resolved: theme } = useTheme()

  // The sprite tracks an integer scale set in the stylesheet instead of stretching to
  // fill a container, which is what keeps it on the pixel grid.
  useEffect(() => {
    const read = () => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue("--px-cup")
      const parsed = Number.parseInt(raw, 10)
      setPixelSize(Number.isFinite(parsed) ? parsed : 6)
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

    const level = levelFor(session.phase, progress(session, Date.now()))
    const running = session.status === "running"

    if (!reducedMotion) {
      steamRef.current = advanceSteam(
        steamRef.current,
        dtMs,
        running ? steamIntensity(level) : 0,
        CUP_ART[design].steamOrigin,
        Math.random
      )
    }

    renderer.draw({ design, level, steam: steamRef.current })
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
