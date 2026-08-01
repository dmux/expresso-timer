import { parseSprite, type SpriteLegend } from "../sprite"

const LEGEND: SpriteLegend = {
  "#": "ink",
  C: "cream",
  S: "sand",
  L: "coffee",
}

/**
 * A white ceramic mug, 45×32, matching the reference: no saucer, straight sides that
 * curve into a rounded shield-shaped base, a white lip band across the top, and a
 * rounded ring handle on the right. `S` shades the inside of the right wall so the
 * body reads as round rather than flat.
 *
 * The interior is one continuous 29-row liquid well, which is what gives the drain its
 * resolution. `L` cells are that region — `resolveCells` picks their real colour from
 * the level, so there is no second sprite for a half-full cup.
 *
 * The 1px `ink` outline is not in the reference (which sits on black); it is what lets
 * a white mug read against the light theme's cream page.
 */
const ROWS = [
  ".........#SSSSSSSSSSSSSSSSSSSSSSSSS#.........",
  ".........#CCCCCCCCCCCCCCCCCCCCCCCCC#.........",
  ".........#CCLLLLLLLLLLLLLLLLLLLLLCS#.........",
  ".........#CCLLLLLLLLLLLLLLLLLLLLLCS#.........",
  ".........#CCLLLLLLLLLLLLLLLLLLLLLCS#.........",
  ".........#CCLLLLLLLLLLLLLLLLLLLLLCS#.........",
  ".........#CCLLLLLLLLLLLLLLLLLLLLLCS#CCCCCS...",
  ".........#CCLLLLLLLLLLLLLLLLLLLLLCS#CCCCCCS..",
  ".........#CCLLLLLLLLLLLLLLLLLLLLLCS#CC..CCS..",
  ".........#CCLLLLLLLLLLLLLLLLLLLLLCS#....CCCS.",
  ".........#CCLLLLLLLLLLLLLLLLLLLLLCS#.....CCS.",
  ".........#CCLLLLLLLLLLLLLLLLLLLLLCS#.....CCS.",
  ".........#CCLLLLLLLLLLLLLLLLLLLLLCS#.....CCS.",
  ".........#CCLLLLLLLLLLLLLLLLLLLLLCS#.....CCS.",
  ".........#CCLLLLLLLLLLLLLLLLLLLLLCS#....CCCS.",
  ".........#CCLLLLLLLLLLLLLLLLLLLLLCS#CC..CCS..",
  ".........#CCLLLLLLLLLLLLLLLLLLLLLCS#CCCCCCS..",
  ".........#CCLLLLLLLLLLLLLLLLLLLLLCS#CCCCCS...",
  ".........#CCLLLLLLLLLLLLLLLLLLLLLCS#.........",
  ".........#CCLLLLLLLLLLLLLLLLLLLLLCS#.........",
  ".........#CCLLLLLLLLLLLLLLLLLLLLLCS#.........",
  ".........#CCLLLLLLLLLLLLLLLLLLLLLCS#.........",
  ".........#CCLLLLLLLLLLLLLLLLLLLLLCS#.........",
  "..........#CCLLLLLLLLLLLLLLLLLLLCS#..........",
  "...........#CCLLLLLLLLLLLLLLLLLCS#...........",
  "............#CCLLLLLLLLLLLLLLLCS#............",
  ".............#CCLLLLLLLLLLLLLCS#.............",
  "...............#CCLLLLLLLLLCS#...............",
  "................#CCLLLLLLLCS#................",
  ".................#CCLLLLLCS#.................",
  "..................#CCLLLCS#..................",
  "..................#CCCCCCC#..................",
]

export const CUP_SPRITE = parseSprite(ROWS, LEGEND, { liquidChar: "L" })

/** Horizontal centre of the mug opening, where steam is emitted from. */
export const CUP_STEAM_ORIGIN_X = 22

/** Top of the mug, in sprite rows. */
export const CUP_STEAM_ORIGIN_Y = 0
