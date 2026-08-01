#!/usr/bin/env node
/**
 * Enforces the two conventions this codebase relies on that no off-the-shelf linter
 * knows about:
 *
 *   1. The pixel-art grammar — no rounded corners, blur, easing or vector icons.
 *      These creep back in every time a shadcn component is re-added or updated,
 *      because the registry ships them by default.
 *   2. The colour layering — sprite colours belong to the canvas, semantic colours to
 *      the interface. Mixing them is what silently breaks one theme and not the other.
 *
 * The hexagonal boundary is checked by ESLint (no-restricted-imports) instead, since
 * it works on imports, which ESLint already understands.
 */

import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const ROOT = new URL("..", import.meta.url).pathname

const RULES = [
  {
    name: "no rounded corners, blur or continuous easing in shadcn components",
    dir: "src/ui/components/ui",
    pattern:
      /\b(rounded-(?!none)[\w[\]/.-]*|blur-|backdrop-blur|animate-in|animate-out|fade-in|fade-out|zoom-in|zoom-out|duration-\d+|ease-(in|out|linear))\b/,
    hint: "use pixel-bevel / pixel-shadow / transition-pixel instead",
  },
  {
    name: "no dark: variants (the theme is driven by [data-theme] on :root)",
    dir: "src/ui",
    pattern: /\bdark:/,
    hint: "add the value to the [data-theme='dark'] block in globals.css",
  },
  {
    name: "no vector icon library",
    dir: "src",
    pattern: /["']lucide-react["']/,
    hint: "use a sprite from domain/pixelart/sprites/icons.ts via <PixelSprite>",
  },
  {
    name: "no sprite colours in the interface layer",
    dir: "src/ui",
    pattern: /--px-(ink|cream|sand|coffee|crema|void|steam)\b/,
    hint: "use --px-surface / --px-text / --px-line / --px-accent instead",
  },
  {
    name: "no raw hex colours outside the palette",
    dir: "src/ui",
    pattern: /#[0-9a-fA-F]{3,8}\b/,
    hint: "reference a --px-* variable so both themes stay in sync",
  },
]

const SOURCE = /\.(ts|tsx|css)$/

function* walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) yield* walk(path)
    else if (SOURCE.test(entry)) yield path
  }
}

let failures = 0

for (const rule of RULES) {
  for (const file of walk(join(ROOT, rule.dir))) {
    // Sprites are the one place sprite colours and matrices legitimately live.
    if (file.includes("/pixelart/")) continue

    const lines = readFileSync(file, "utf8").split("\n")
    lines.forEach((line, index) => {
      if (!rule.pattern.test(line)) return

      failures += 1
      console.error(
        `${relative(ROOT, file)}:${index + 1}  ${rule.name}\n` +
          `  ${line.trim().slice(0, 100)}\n` +
          `  → ${rule.hint}\n`
      )
    })
  }
}

if (failures > 0) {
  console.error(`✗ ${failures} design-rule violation(s)`)
  process.exit(1)
}

console.log("✓ design rules")
