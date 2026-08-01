/**
 * Which vessel the timer draws. Only the name lives here — the art itself is in
 * `pixelart/sprites/cups.ts`, so the settings can carry a design without dragging a
 * sprite matrix along with them.
 */
export const CUP_DESIGNS = ["mug", "paper"] as const

export type CupDesign = (typeof CUP_DESIGNS)[number]

export const DEFAULT_CUP_DESIGN: CupDesign = "mug"
