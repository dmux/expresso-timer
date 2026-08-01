import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

import { COLOR_NAMES, cssVarName, DARK_PALETTE, PALETTE } from "./palette"

const CSS_PATH = fileURLToPath(new URL("../../app/globals.css", import.meta.url))
const css = readFileSync(CSS_PATH, "utf8")

/** The base `:root` block, and the explicit `[data-theme="dark"]` override. */
function themeBlocks(): { light: string; dark: string } {
  const darkStart = css.indexOf(':root[data-theme="dark"]')
  expect(darkStart, "no [data-theme=dark] block in globals.css").toBeGreaterThan(-1)

  return { light: css.slice(0, darkStart), dark: css.slice(darkStart) }
}

function declaredSpriteVars(block: string): Map<string, string> {
  const found = new Map<string, string>()
  for (const match of block.matchAll(/(--px-[a-z-]+):\s*(#[0-9a-fA-F]{3,8});/g)) {
    found.set(match[1], match[2].toLowerCase())
  }
  return found
}

/**
 * The guard on the visual DRY. The canvas resolves sprite colours through these CSS
 * variables at runtime, so if the stylesheet and the TypeScript constants drift the cup
 * silently renders in the wrong palette — and in one theme only, which is exactly the
 * kind of bug nobody notices until a user on the other theme complains.
 */
describe("sprite palette / globals.css", () => {
  const blocks = themeBlocks()

  it.each([
    ["light", PALETTE as Record<string, string>, blocks.light],
    ["dark", DARK_PALETTE as Record<string, string>, blocks.dark],
  ])("declares every %s sprite colour with the same value", (theme, palette, block) => {
    const declared = declaredSpriteVars(block)

    for (const name of COLOR_NAMES) {
      const variable = cssVarName(name)
      expect(
        declared.get(variable),
        `${variable} missing or wrong in the ${theme} block`
      ).toBe(palette[name].toLowerCase())
    }
  })

  it("declares no orphan sprite variable the palette does not know about", () => {
    const known = new Set(COLOR_NAMES.map(cssVarName))
    // The semantic interface layer shares the --px- prefix but is CSS-only by design.
    const semantic = new Set([
      "--px-page",
      "--px-page-texture",
      "--px-surface",
      "--px-surface-alt",
      "--px-text",
      "--px-text-muted",
      "--px-line",
      "--px-bevel-light",
      "--px-bevel-dark",
      "--px-accent",
      "--px-accent-hover",
      "--px-on-accent",
      "--px-rest",
    ])

    for (const variable of declaredSpriteVars(css).keys()) {
      expect(
        known.has(variable) || semantic.has(variable),
        `${variable} belongs to neither layer`
      ).toBe(true)
    }
  })

  it("defines the semantic layer in both themes", () => {
    const light = declaredSpriteVars(blocks.light)
    const dark = declaredSpriteVars(blocks.dark)

    for (const variable of ["--px-page", "--px-surface", "--px-text", "--px-line"]) {
      expect(light.has(variable), `${variable} missing from the light block`).toBe(true)
      expect(dark.has(variable), `${variable} missing from the dark block`).toBe(true)
      expect(light.get(variable), `${variable} does not change between themes`).not.toBe(
        dark.get(variable)
      )
    }
  })

  it("keeps every sprite colour distinct within a theme", () => {
    for (const palette of [PALETTE, DARK_PALETTE]) {
      const values = COLOR_NAMES.map((name) => palette[name])
      expect(new Set(values).size).toBe(values.length)
    }
  })
})
