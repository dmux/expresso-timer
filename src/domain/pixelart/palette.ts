/**
 * The sprite palette — the colours the cup is physically made of.
 *
 * These are deliberately *not* interface colours. A panel background or a body of text
 * has to invert between themes; a ceramic mug does not. Interface colour lives in the
 * semantic `--px-surface` / `--px-text` layer in `globals.css`, and only these seven
 * names are ever valid inside a sprite.
 *
 * The canvas resolves them through the CSS variables at runtime, so the stylesheet owns
 * the values and the theme switch costs the renderer nothing. `palette.test.ts` asserts
 * both themes stay in sync with the constants below.
 */
export const PALETTE = {
  /** Outline. Absent from the reference, which sits on black — needed here so a white
   *  mug still reads against the light theme's cream page. */
  ink: "#4a4340",
  /** The white ceramic body. */
  cream: "#f4f2ef",
  /** Shading inside the right wall, which is what makes the body look round. */
  sand: "#cdc7c0",
  /** The milky brown of the reference. */
  coffee: "#8a6a55",
  /** Surface line, one shade up from the coffee, so the level stays legible. */
  crema: "#9d7d66",
  /** Empty interior, once the level has dropped past a row. */
  void: "#3a3532",
  steam: "#fbfaf8",
} as const

export type ColorName = keyof typeof PALETTE

/**
 * The mug stays white on a dark page — that is what carries the silhouette — but every
 * value drops in luminance so it does not glare, and the outline goes near-black.
 */
export const DARK_PALETTE: Record<ColorName, string> = {
  ink: "#14100e",
  cream: "#e2dfda",
  sand: "#a29c95",
  coffee: "#8a6a55",
  crema: "#a08069",
  void: "#1c1816",
  steam: "#e8e5e0",
}

export const COLOR_NAMES = Object.keys(PALETTE) as ColorName[]

/** The one bridge between the TypeScript palette and the stylesheet. */
export function cssVarName(name: ColorName): string {
  return `--px-${name}`
}
