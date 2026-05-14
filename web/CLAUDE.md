# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server with HMR
- `npm run build` — production build to `dist/`
- `npm run lint` — ESLint over the whole tree (`eslint .`)
- `npm run preview` — preview the production build locally

Deploys happen via `.github/workflows/deploy-web.yml` on push to `main` (or manual dispatch). No local `deploy` script — Actions is the only path.

There is no test runner configured.

## Architecture

This is a single-page React + Vite app whose entire product is a hexagonal pixel-font designer. Almost all behavior lives in **`src/components/HexagonFontDesigner.jsx`** — `App.jsx` and `main.jsx` are thin shells.

Key concepts inside `HexagonFontDesigner.jsx`:

- **Grid model**: each character is a 6-row × 4-col boolean matrix. Rows alternate horizontal offset to form the hexagonal lattice (`rowIndex % 2 ? horizontalSpacing / 2 : 0`). `fontData` is a `{ [char]: boolean[6][4] }` map kept in component state.
- **Font hash serialization**: `getFontHash()` encodes each defined letter as `${char}${value.toString(36)}` (bit-packed grid → base36) joined by commas. `loadFontFromHash()` is the inverse. ⚠️ `DEFAULT_FONT_HASH` at the top of the file is a base64 blob in a different (older) format — it does not round-trip through the current encoder. Treat the comma/base36 format as the source of truth when changing the schema.
- **Drag-to-paint**: `HexagonGrid` is defined inside the parent and uses `isDragging` / `dragValue` parent state so the user can mousedown then drag across cells; right-click paints "off". Because the component is redefined on every render of the parent, avoid moving state into it without also lifting it out.
- **SVG rendering**: hex points come from `getHexagonPoints(x, y)` (six angles at 60° steps, offset by −30°). The same `HexagonGrid` renders in both interactive (designer) and read-only (preview, character grid) modes, scaled via the `scale` prop.

## UI stack and conventions

- **shadcn/ui** (style `new-york`, base color `neutral`, lucide icons) is configured in `components.json`. New primitives belong under `src/components/ui/` and should consume `cn()` from `@/lib/utils`.
- **Path alias**: `@/*` → `./src/*` (defined in `tsconfig.json`). Prefer it for cross-directory imports; local sibling imports use relative paths.
- **Mixed JS/TS**: app code is `.jsx`, shadcn primitives and `lib/utils.ts` are TypeScript. `tsconfig.json` is strict (`strict`, `noUnusedLocals`, `noUnusedParameters`) — TS files must satisfy it even though Vite would otherwise tolerate sloppier code.
- **Tailwind** uses CSS variables for theming (see `tailwind.config.js` + `src/index.css`); reference colors as `bg-background`, `text-foreground`, etc., rather than hardcoding palette values.

## Deployment

The site deploys to GitHub Pages at `https://philipmathieu.github.io/hexled` from `.github/workflows/deploy-web.yml` (build on Actions, publish via `actions/deploy-pages`). No `gh-pages` branch — Pages source must be set to "GitHub Actions" in repo settings. `vite.config.js` sets `base: '/hexled/'` to match the repo path — if the repo is renamed or forked, update `base` and the `homepage` field in `package.json` together, otherwise asset URLs will 404 in production.
