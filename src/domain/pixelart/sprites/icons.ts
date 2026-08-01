import { parseSprite, type Sprite, type SpriteLegend } from "../sprite"

const LEGEND: SpriteLegend = { "#": "ink" }

/**
 * Every icon is 8×8 and single-colour; `PixelSprite` recolours them at render time.
 * Vector icons are deliberately absent — a lucide glyph next to a pixel sprite
 * reads as a bug.
 */
function icon(rows: readonly string[]): Sprite {
  return parseSprite(rows, LEGEND)
}

export const ICON_PLAY = icon([
  "........",
  ".##.....",
  ".####...",
  ".######.",
  ".######.",
  ".####...",
  ".##.....",
  "........",
])

export const ICON_PAUSE = icon([
  "........",
  ".##..##.",
  ".##..##.",
  ".##..##.",
  ".##..##.",
  ".##..##.",
  ".##..##.",
  "........",
])

export const ICON_RESET = icon([
  "........",
  ".#...##.",
  ".#..###.",
  ".#.####.",
  ".#.####.",
  ".#..###.",
  ".#...##.",
  "........",
])

export const ICON_SKIP = icon([
  "........",
  ".##...#.",
  ".###..#.",
  ".####.#.",
  ".####.#.",
  ".###..#.",
  ".##...#.",
  "........",
])

export const ICON_GEAR = icon([
  "........",
  "..#..#..",
  ".######.",
  "..####..",
  "..####..",
  ".######.",
  "..#..#..",
  "........",
])

export const ICON_CLOSE = icon([
  "........",
  ".#....#.",
  ".##..##.",
  "..####..",
  "..####..",
  ".##..##.",
  ".#....#.",
  "........",
])

/** Filled bean = a focus already banked in the current cycle. */
export const ICON_BEAN_FULL = icon([
  "........",
  "..####..",
  ".###.##.",
  ".##..##.",
  ".##..##.",
  ".##.###.",
  "..####..",
  "........",
])

export const ICON_BEAN_EMPTY = icon([
  "........",
  "..####..",
  ".#....#.",
  ".#....#.",
  ".#....#.",
  ".#....#.",
  "..####..",
  "........",
])

export const ICON_SUN = icon([
  "........",
  "...##...",
  ".#.##.#.",
  "..####..",
  ".######.",
  "..####..",
  ".#.##.#.",
  "...##...",
])

export const ICON_MOON = icon([
  "........",
  "..####..",
  ".###....",
  ".##.....",
  ".##.....",
  ".###....",
  "..####..",
  "........",
])

/** Half-lit disc — the conventional "follow the system" mark. */
export const ICON_AUTO = icon([
  "........",
  "..####..",
  ".##.###.",
  ".#..####",
  ".#..####",
  ".##.###.",
  "..####..",
  "........",
])

export const ICON_CHECK = icon([
  "........",
  "......#.",
  ".....##.",
  ".#..##..",
  ".##.##..",
  "..###...",
  "...#....",
  "........",
])
