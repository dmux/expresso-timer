import { parseSprite, type SpriteLegend } from "../sprite"

const LEGEND: SpriteLegend = {
  "#": "ink",
  C: "cream",
  S: "sand",
  L: "coffee",
}

/**
 * The takeaway cup, 45×33 — the same size as the espresso cup on purpose, so switching
 * design never resizes the canvas.
 *
 * Same two colours as the espresso cup, and the same cutaway: what tells the two apart
 * is silhouette alone — a flat lid whose crown flares onto a brim wider than the cup,
 * straight tapering sides, a flat base. Steam rises off the closed lid rather than out
 * of an open rim.
 */
const ROWS = [
  "................#############................",
  "...............#CCCCCCCCCCCCC#...............",
  "..............#CCCCCCCCCCCCCCC#..............",
  ".............#CCCCCCCCCCCCCCCCC#.............",
  "........#####CCCCCCCCCCCCCCCCCCC#####........",
  "........#CCCCCCCCCCCCCCCCCCCCCCCCCCC#........",
  "........#############################........",
  "...........#CCLLLLLLLLLLLLLLLLLCS#...........",
  "...........#CCLLLLLLLLLLLLLLLLLCS#...........",
  "...........#CCLLLLLLLLLLLLLLLLLCS#...........",
  "...........#CCLLLLLLLLLLLLLLLLLCS#...........",
  "...........#CCLLLLLLLLLLLLLLLLLCS#...........",
  "...........#CCLLLLLLLLLLLLLLLLLCS#...........",
  "...........#CCLLLLLLLLLLLLLLLLLCS#...........",
  "............#CCLLLLLLLLLLLLLLLCS#............",
  "............#CCLLLLLLLLLLLLLLLCS#............",
  "............#CCLLLLLLLLLLLLLLLCS#............",
  "............#CCLLLLLLLLLLLLLLLCS#............",
  "............#CCLLLLLLLLLLLLLLLCS#............",
  "............#CCLLLLLLLLLLLLLLLCS#............",
  ".............#CCLLLLLLLLLLLLLCS#.............",
  ".............#CCLLLLLLLLLLLLLCS#.............",
  ".............#CCLLLLLLLLLLLLLCS#.............",
  ".............#CCLLLLLLLLLLLLLCS#.............",
  ".............#CCLLLLLLLLLLLLLCS#.............",
  ".............#CCLLLLLLLLLLLLLCS#.............",
  "..............#CCLLLLLLLLLLLCS#..............",
  "..............#CCLLLLLLLLLLLCS#..............",
  "..............#CCLLLLLLLLLLLCS#..............",
  "..............#CCLLLLLLLLLLLCS#..............",
  "..............#CCLLLLLLLLLLLCS#..............",
  "..............#CCLLLLLLLLLLLCS#..............",
  "..............#################..............",
]

export const PAPER_CUP_SPRITE = parseSprite(ROWS, LEGEND, { liquidChar: "L" })

/** Above the closed lid, in sprite pixels, where steam is emitted from. */
export const PAPER_CUP_STEAM_ORIGIN = { x: 22, y: 0 } as const
