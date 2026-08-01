import { parseSprite, type SpriteLegend } from "../sprite"

const LEGEND: SpriteLegend = {
  "#": "ink",
  C: "cream",
  S: "sand",
  L: "coffee",
}

/**
 * An espresso cup on its saucer, 45×33, following the reference: a flat lip, walls that
 * run straight for the top third, and a base that sweeps into a half-round bowl. The
 * earlier version tapered in a straight diagonal from mid-body down, which is what made
 * it read as a funnel — the difference here is that the sides stay vertical until the
 * curve begins and then close in faster the lower they get, the way an arc does.
 *
 * The bowl is an ellipse 29 wide and 32 tall, so it is a touch deeper than a true
 * semicircle; at this resolution a perfect circle loses the bulge to rounding.
 *
 * The body — not the body plus the handle — is what the eye centres on, so it sits on
 * the viewport's middle column and the handle spends the whole right margin. Centring
 * the pair instead leaves the cup looking pushed to the left.
 *
 * The interior is one continuous liquid well spanning the lip down to the bowl, which is
 * what gives the drain its resolution. `L` cells are that region — `resolveCells` picks
 * their real colour from the level, so there is no second sprite for a half-full cup.
 *
 * The saucer is detached by two rows, as in the reference, and carries no liquid.
 *
 * The 1px `ink` outline is not in the reference (which sits on white); it is what lets a
 * white cup read against the light theme's cream page.
 */
const ROWS = [
  "........#############################........",
  "........#CCCCCCCCCCCCCCCCCCCCCCCCCCC#........",
  "........#CCLLLLLLLLLLLLLLLLLLLLLLLCS#CCCCCS..",
  "........#CCLLLLLLLLLLLLLLLLLLLLLLLCS#CCCCCCS.",
  "........#CCLLLLLLLLLLLLLLLLLLLLLLLCS#CC..CCS.",
  "........#CCLLLLLLLLLLLLLLLLLLLLLLLCS#....CCCS",
  "........#CCLLLLLLLLLLLLLLLLLLLLLLLCS#.....CCS",
  "........#CCLLLLLLLLLLLLLLLLLLLLLLLCS#.....CCS",
  "........#CCLLLLLLLLLLLLLLLLLLLLLLLCS#.....CCS",
  "........#CCLLLLLLLLLLLLLLLLLLLLLLLCS#.....CCS",
  "........#CCLLLLLLLLLLLLLLLLLLLLLLLCS#....CCCS",
  "........#CCLLLLLLLLLLLLLLLLLLLLLLLCS#CC..CCS.",
  "........#CCLLLLLLLLLLLLLLLLLLLLLLLCS#CCCCCCS.",
  "........#CCLLLLLLLLLLLLLLLLLLLLLLLCS#CCCCCS..",
  "........#CCLLLLLLLLLLLLLLLLLLLLLLLCS#........",
  "........#CCLLLLLLLLLLLLLLLLLLLLLLLCS#........",
  "........#CCLLLLLLLLLLLLLLLLLLLLLLLCS#........",
  ".........#CCLLLLLLLLLLLLLLLLLLLLLCS#.........",
  ".........#CCLLLLLLLLLLLLLLLLLLLLLCS#.........",
  ".........#CCLLLLLLLLLLLLLLLLLLLLLCS#.........",
  "..........#CCLLLLLLLLLLLLLLLLLLLCS#..........",
  "...........#CCLLLLLLLLLLLLLLLLLCS#...........",
  "...........#CCLLLLLLLLLLLLLLLLLCS#...........",
  "............#CCLLLLLLLLLLLLLLLCS#............",
  ".............#CCLLLLLLLLLLLLLCS#.............",
  "..............#CCLLLLLLLLLLLCS#..............",
  "...............#CCLLLLLLLLLCS#...............",
  ".................#CCLLLLLCS#.................",
  ".............................................",
  ".............................................",
  "............#####################............",
  "............#CCCCCCCCCCCCCCCCCCC#............",
  "............#####################............",
]

export const MUG_SPRITE = parseSprite(ROWS, LEGEND, { liquidChar: "L" })

/** Centre of the cup's mouth, in sprite pixels, where steam is emitted from. */
export const MUG_STEAM_ORIGIN = { x: 22, y: 0 } as const
