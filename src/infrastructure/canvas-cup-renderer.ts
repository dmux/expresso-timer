import {
  particleOpacity,
  particleSize,
  particleX,
  puffOffsets,
  type SteamParticle,
} from "@/domain/cup/steam"
import type { CupDesign } from "@/domain/cup/cup-design"
import {
  COLOR_NAMES,
  cssVarName,
  PALETTE,
  type ColorName,
} from "@/domain/pixelart/palette"
import { resolveCells } from "@/domain/pixelart/sprite"
import { CUP_ART, CUP_HEIGHT, CUP_WIDTH } from "@/domain/pixelart/sprites/cups"

/** Headroom above the cup for steam, in sprite pixels. Matches the particles' reach. */
const STEAM_HEIGHT = 14

export const VIEWPORT_WIDTH = CUP_WIDTH
export const VIEWPORT_HEIGHT = STEAM_HEIGHT + CUP_HEIGHT
export const CUP_OFFSET_Y = STEAM_HEIGHT

export type CupFrame = {
  readonly design: CupDesign
  /** 1 = full, 0 = empty. */
  readonly level: number
  readonly steam: readonly SteamParticle[]
  readonly milkAmount: number
  readonly cappuccinoFoam: boolean
}

export type CupRenderer = {
  /** `pixelSize` is CSS pixels per sprite pixel and must be a whole number. */
  resize(pixelSize: number): void
  /** Re-reads the palette from CSS. Call when the colour scheme changes. */
  refreshPalette(): void
  draw(frame: CupFrame): void
}

type ResolvedPalette = Record<ColorName, string>

/**
 * The stylesheet owns the colour values, including the dark-mode overrides, so the
 * renderer resolves names through CSS instead of holding a second copy. Adding a theme
 * therefore never touches this file.
 */
function readPalette(): ResolvedPalette {
  const styles = getComputedStyle(document.documentElement)
  const resolved = {} as ResolvedPalette

  for (const name of COLOR_NAMES) {
    const value = styles.getPropertyValue(cssVarName(name)).trim()
    resolved[name] = value || PALETTE[name]
  }
  return resolved
}

export function createCanvasCupRenderer(canvas: HTMLCanvasElement): CupRenderer {
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("2d canvas context unavailable")

  // Cached because getComputedStyle at 60fps would cost a layout read every frame.
  let palette = readPalette()

  return {
    resize(pixelSize) {
      // A fractional devicePixelRatio (1.5, 2.25) is the usual reason pixel art
      // comes out blurry, so the backing store only ever scales by whole numbers.
      const dpr = Math.max(1, Math.round(window.devicePixelRatio || 1))
      const unit = pixelSize * dpr

      canvas.width = VIEWPORT_WIDTH * unit
      canvas.height = VIEWPORT_HEIGHT * unit
      canvas.style.width = `${VIEWPORT_WIDTH * pixelSize}px`
      canvas.style.height = `${VIEWPORT_HEIGHT * pixelSize}px`

      // One drawing unit is now exactly one sprite pixel.
      ctx.setTransform(unit, 0, 0, unit, 0, 0)
      ctx.imageSmoothingEnabled = false
    },

    refreshPalette() {
      palette = readPalette()
    },

    draw(frame) {
      ctx.clearRect(0, 0, VIEWPORT_WIDTH, VIEWPORT_HEIGHT)
      drawSteam(ctx, frame.steam, palette)
      drawCup(ctx, frame, palette)
    },
  }
}

function parseColor(c: string): [number, number, number] {
  if (c.startsWith("#")) {
    const hex = c.length === 4 ? "#" + c[1] + c[1] + c[2] + c[2] + c[3] + c[3] : c
    const bigint = parseInt(hex.slice(1), 16)
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255]
  }
  const match = c.match(/\d+/g)
  if (match && match.length >= 3) {
    return [parseInt(match[0], 10), parseInt(match[1], 10), parseInt(match[2], 10)]
  }
  return [0, 0, 0]
}

function blendColors(c1: string, c2: string, amount: number): string {
  const [r1, g1, b1] = parseColor(c1)
  const [r2, g2, b2] = parseColor(c2)
  const r = Math.round(r1 + (r2 - r1) * amount)
  const g = Math.round(g1 + (g2 - g1) * amount)
  const b = Math.round(b1 + (b2 - b1) * amount)
  return `rgb(${r}, ${g}, ${b})`
}

function drawCup(
  ctx: CanvasRenderingContext2D,
  { design, level, milkAmount, cappuccinoFoam }: CupFrame,
  palette: ResolvedPalette
) {
  const { sprite } = CUP_ART[design]
  const cells = resolveCells(sprite, level)
  const { width } = sprite
  let current: string | null = null

  const surfaceIndex = cells.findIndex((c) => c === "crema")
  const surfaceRow = surfaceIndex >= 0 ? Math.floor(surfaceIndex / width) : -1

  for (let index = 0; index < cells.length; index += 1) {
    const cell = cells[index]
    if (!cell) continue

    let cellColor = palette[cell]

    if (cell === "coffee" || cell === "crema") {
      cellColor = blendColors(cellColor, palette.steam, (milkAmount / 100) * 0.8)
    }

    const y = Math.floor(index / width)

    if (cappuccinoFoam && design === "mug" && (cell === "crema" || cell === "coffee")) {
      if (y >= surfaceRow && y < surfaceRow + 4) {
        cellColor = palette.steam
      }
    }

    if (cellColor !== current) {
      ctx.fillStyle = cellColor
      current = cellColor
    }

    const x = index % width
    const canvasY = y + CUP_OFFSET_Y
    ctx.fillRect(x, canvasY, 1, 1)
  }
}

function drawSteam(
  ctx: CanvasRenderingContext2D,
  steam: readonly SteamParticle[],
  palette: ResolvedPalette
) {
  ctx.fillStyle = palette.steam

  for (const particle of steam) {
    // Snapping to the grid is what keeps the wisps reading as pixels rather than blur.
    const originX = Math.round(particleX(particle))
    const originY = Math.round(CUP_OFFSET_Y + particle.y)
    ctx.globalAlpha = particleOpacity(particle)

    for (const [dx, dy] of puffOffsets(particleSize(particle))) {
      const x = originX + dx
      const y = originY + dy
      if (y < 0 || y >= VIEWPORT_HEIGHT || x < 0 || x >= VIEWPORT_WIDTH) continue
      ctx.fillRect(x, y, 1, 1)
    }
  }

  ctx.globalAlpha = 1
}
