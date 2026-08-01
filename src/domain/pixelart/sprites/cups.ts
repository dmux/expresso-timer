import type { CupDesign } from "../../cup/cup-design"
import type { Sprite } from "../sprite"
import { MUG_SPRITE, MUG_STEAM_ORIGIN } from "./mug"
import { PAPER_CUP_SPRITE, PAPER_CUP_STEAM_ORIGIN } from "./paper-cup"

export type CupArt = {
  readonly sprite: Sprite
  /** Where the plume starts, in sprite pixels — the rim of a mug, a sip hole of a cup. */
  readonly steamOrigin: { readonly x: number; readonly y: number }
}

/**
 * Every design draws into the same viewport, so switching one for another is a repaint
 * and not a relayout — the canvas keeps its size and the page never jumps. `cups.test.ts`
 * is what holds the two sprites to that shared size.
 */
export const CUP_ART: Record<CupDesign, CupArt> = {
  mug: { sprite: MUG_SPRITE, steamOrigin: MUG_STEAM_ORIGIN },
  paper: { sprite: PAPER_CUP_SPRITE, steamOrigin: PAPER_CUP_STEAM_ORIGIN },
}

export const CUP_WIDTH = MUG_SPRITE.width
export const CUP_HEIGHT = MUG_SPRITE.height
