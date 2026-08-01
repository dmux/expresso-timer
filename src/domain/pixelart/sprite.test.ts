import { describe, expect, it } from "vitest"

import { CUP_DESIGNS } from "../cup/cup-design"
import { PALETTE } from "./palette"
import { parseSprite, resolveCells, type Sprite } from "./sprite"
import { CUP_ART, CUP_HEIGHT, CUP_WIDTH } from "./sprites/cups"
import * as icons from "./sprites/icons"

describe("parseSprite", () => {
  it("rejects ragged rows", () => {
    expect(() => parseSprite(["##", "#"], { "#": "ink" })).toThrow(/wide/)
  })

  it("rejects characters missing from the legend", () => {
    expect(() => parseSprite(["#?"], { "#": "ink" })).toThrow(/legend/)
  })

  it("maps transparent cells to null", () => {
    const sprite = parseSprite([".#"], { "#": "ink" })
    expect(sprite.cells).toEqual([null, "ink"])
  })

  it("records the liquid region only when asked for one", () => {
    const rows = ["LL", "LL"]
    expect(parseSprite(rows, { L: "coffee" }).liquid).toBeNull()

    const withLiquid = parseSprite(rows, { L: "coffee" }, { liquidChar: "L" })
    expect(withLiquid.liquid).toMatchObject({ topRow: 0, bottomRow: 1 })
    expect(withLiquid.liquid?.indices).toHaveLength(4)
  })
})

describe.each(CUP_DESIGNS)("the %s design", (design) => {
  const { sprite, steamOrigin } = CUP_ART[design]

  // The renderer sizes one canvas from CUP_WIDTH/CUP_HEIGHT and then draws whichever
  // design is selected into it, so a sprite of another size would paint out of bounds.
  it("draws into the shared viewport", () => {
    expect(`${sprite.width}x${sprite.height}`).toBe(`${CUP_WIDTH}x${CUP_HEIGHT}`)
  })

  it("uses only palette colours", () => {
    for (const cell of sprite.cells) {
      if (cell !== null) expect(PALETTE).toHaveProperty(cell)
    }
  })

  it("has a liquid region deep enough for the drain to read as gradual", () => {
    const liquid = sprite.liquid
    expect(liquid).not.toBeNull()
    expect(liquid!.bottomRow - liquid!.topRow + 1).toBeGreaterThanOrEqual(10)
  })

  it("has a contiguous liquid region — no floating pockets of coffee", () => {
    const rows = new Set(
      sprite.liquid!.indices.map((index) => Math.floor(index / sprite.width))
    )
    const sorted = [...rows].sort((a, b) => a - b)

    sorted.forEach((row, i) => {
      if (i > 0) expect(row - sorted[i - 1]).toBe(1)
    })
  })

  it("emits steam from above the liquid, inside the silhouette", () => {
    expect(steamOrigin.x).toBeGreaterThan(0)
    expect(steamOrigin.x).toBeLessThan(sprite.width)
    expect(steamOrigin.y).toBeLessThanOrEqual(sprite.liquid!.topRow)
  })

  // The surface can only ever move down, so a well that widened again on the way down
  // would make the level jump sideways as it drained.
  it("never widens on the way down", () => {
    const widths = liquidWidths(sprite)
    for (let i = 1; i < widths.length; i += 1) {
      expect(widths[i]).toBeLessThanOrEqual(widths[i - 1])
    }
  })
})

/** Cells per row of the liquid region — the interior width, handle excluded. */
function liquidWidths(sprite: Sprite): number[] {
  const perRow = new Map<number, number>()
  for (const index of sprite.liquid!.indices) {
    const row = Math.floor(index / sprite.width)
    perRow.set(row, (perRow.get(row) ?? 0) + 1)
  }
  return [...perRow.entries()].sort(([a], [b]) => a - b).map(([, count]) => count)
}

describe("icons", () => {
  it("are all exactly 8x8", () => {
    const sprites = Object.entries(icons).filter((entry): entry is [string, Sprite] =>
      entry[0].startsWith("ICON_")
    )

    expect(sprites.length).toBeGreaterThan(0)
    for (const [name, sprite] of sprites) {
      expect(`${name}:${sprite.width}x${sprite.height}`).toBe(`${name}:8x8`)
    }
  })
})

describe("resolveCells", () => {
  const sprite = parseSprite(["L", "L", "L", "L"], { L: "coffee" }, { liquidChar: "L" })

  it("fills every liquid row when full, topped with crema", () => {
    expect(resolveCells(sprite, 1)).toEqual(["crema", "coffee", "coffee", "coffee"])
  })

  it("empties every liquid row when the level hits zero", () => {
    expect(resolveCells(sprite, 0)).toEqual(["void", "void", "void", "void"])
  })

  it("moves the surface down as the level drops", () => {
    expect(resolveCells(sprite, 0.5)).toEqual(["void", "void", "crema", "coffee"])
  })

  it("clamps levels outside 0..1", () => {
    expect(resolveCells(sprite, 5)).toEqual(resolveCells(sprite, 1))
    expect(resolveCells(sprite, -5)).toEqual(resolveCells(sprite, 0))
  })

  it("leaves sprites without a liquid region untouched", () => {
    const plain = parseSprite(["#"], { "#": "ink" })
    expect(resolveCells(plain, 0)).toBe(plain.cells)
  })
})
