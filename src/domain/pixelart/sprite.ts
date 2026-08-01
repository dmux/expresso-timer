import { clamp } from "../shared/duration"
import { PALETTE, type ColorName } from "./palette"

export const TRANSPARENT = "."

/** `null` means "draw nothing here". */
export type SpriteCell = ColorName | null

export type SpriteLegend = Readonly<Record<string, ColorName>>

/** The drainable part of a sprite, resolved to real colours by `resolveCells`. */
export type LiquidRegion = {
  readonly topRow: number
  readonly bottomRow: number
  readonly indices: readonly number[]
}

export type Sprite = {
  readonly width: number
  readonly height: number
  /** Row-major. */
  readonly cells: readonly SpriteCell[]
  readonly liquid: LiquidRegion | null
}

export type ParseOptions = {
  /** Legend char whose cells form the liquid region. */
  readonly liquidChar?: string
}

export function parseSprite(
  rows: readonly string[],
  legend: SpriteLegend,
  options: ParseOptions = {}
): Sprite {
  if (rows.length === 0) throw new Error("sprite has no rows")

  const width = rows[0].length
  const cells: SpriteCell[] = []
  const liquidIndices: number[] = []
  let topRow = Number.POSITIVE_INFINITY
  let bottomRow = -1

  rows.forEach((row, y) => {
    if (row.length !== width) {
      throw new Error(`sprite row ${y} is ${row.length} wide, expected ${width}`)
    }

    for (let x = 0; x < width; x += 1) {
      const char = row[x]
      if (char === TRANSPARENT) {
        cells.push(null)
        continue
      }

      const color = legend[char]
      if (!color)
        throw new Error(`sprite char "${char}" at ${x},${y} is not in the legend`)
      if (!(color in PALETTE))
        throw new Error(`legend maps "${char}" to unknown colour "${color}"`)

      if (char === options.liquidChar) {
        liquidIndices.push(cells.length)
        topRow = Math.min(topRow, y)
        bottomRow = Math.max(bottomRow, y)
      }
      cells.push(color)
    }
  })

  return {
    width,
    height: rows.length,
    cells,
    liquid:
      liquidIndices.length > 0 ? { topRow, bottomRow, indices: liquidIndices } : null,
  }
}

/**
 * Paints the liquid region for a fill level (1 = full, 0 = empty): everything above the
 * surface becomes the empty interior, and the surface row itself gets the lighter crema.
 * The level is therefore purely derived — there is no second sprite for a half-full cup.
 */
export function resolveCells(sprite: Sprite, level: number): readonly SpriteCell[] {
  const { liquid } = sprite
  if (!liquid) return sprite.cells

  const rowCount = liquid.bottomRow - liquid.topRow + 1
  const filledRows = Math.round(clamp(level, 0, 1) * rowCount)
  const surfaceRow = liquid.bottomRow - filledRows + 1

  const resolved = [...sprite.cells]
  for (const index of liquid.indices) {
    const row = Math.floor(index / sprite.width)
    if (row < surfaceRow) resolved[index] = "void"
    else if (row === surfaceRow) resolved[index] = "crema"
    else resolved[index] = "coffee"
  }
  return resolved
}
