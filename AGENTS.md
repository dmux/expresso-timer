<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Expresso Timer

## Checks

`pnpm verify` runs everything: `format:check`, `lint`, `check:design`, `typecheck`, `test`.

Git hooks run them for you — pre-commit does lint-staged plus the whole-project checks
(~4s), pre-push runs the production build (~4s). Commit messages are conventional, with
the scope limited to a hexagon layer (see `commitlint.config.mjs`).

## Two conventions the tooling enforces

**The dependency rule.** `ui → application → domain`; `infrastructure` implements the
ports in `application/ports.ts`. `domain/` and `application/` may not import React,
Next, Base UI, `@/ui/*` or `@/infrastructure/*` — enforced by `no-restricted-imports` in
`eslint.config.mjs`. That is what keeps the core testable with a `FakeClock` and no DOM.

**Two colour layers.** Sprite colours (`--px-ink`, `--px-cream`, `--px-coffee`, …) are
what the mug is physically made of and belong to the canvas. Semantic colours
(`--px-surface`, `--px-text`, `--px-line`, …) are what the interface is made of and are
the ones that invert between themes. Mixing them silently breaks one theme and not the
other, so `scripts/check-design-rules.mjs` rejects sprite colours inside `src/ui`.

That same script enforces the pixel-art grammar — no `rounded-*`, blur, continuous
easing, `dark:` variants or vector icons. These come back every time a shadcn component
is added or updated, because the registry ships them by default; re-style with
`pixel-bevel`, `pixel-shadow` and `transition-pixel` instead.

## Gotchas

- `--px` is the unit of everything. Sizes must be whole multiples, and the responsive
  scale steps by integers — `clamp()` puts edges on half pixels and blurs them.
- The canvas resolves sprite colours from CSS at runtime and caches them; a theme change
  has to call `refreshPalette()`.
- `palette.test.ts` asserts the TypeScript palette and both `globals.css` theme blocks
  agree. If it fails, one of the two halves moved.
- The theme init script in `layout.tsx` must stay inline and blocking, and `<html>` keeps
  `suppressHydrationWarning` because that script sets `data-theme` before React exists.
- Every icon — favicon, iOS, Android, maskable — comes from one 16×16 matrix in
  `scripts/generate-icons.mjs`. Edit the matrix, run `pnpm gen:icons`, commit the output;
  the PNGs are not built on deploy.
- The service worker only registers in production builds, so `pnpm dev` never sees it. If
  you test a production build locally, unregister it afterwards or it keeps serving the
  cached prod assets over your dev server. Bump `CACHE` in `public/sw.js` whenever a
  cached path stops existing.
