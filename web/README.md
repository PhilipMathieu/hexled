# Web

The browser-side companion to HexLed. One Vite single-page app, **two
panels** that share a hex grid component and the font format from
[`../shared/font_format.md`](../shared/font_format.md):

1. **Font designer** *(existing)* — `src/components/HexagonFontDesigner.jsx`. Lets you draw glyphs on a small hex grid, encodes them to a URL hash for sharing, and ships as a GitHub Pages site at <https://philipmathieu.github.io/hexled>.
2. **Simulator** *(planned)* — a 24×6 hex canvas that mirrors the physical display. Streams frames to a real device over MQTT-over-WebSocket, and renders glyphs from the designer on the simulated grid as a sanity check before exporting a font.

Both panels live in the **same Vite app** rather than two separate ones, so they can share the hex rendering primitives (`getHexagonPoints`, the `HexagonGrid` component) and the font format loader.

## Run

```bash
npm install
npm run dev
```

Other scripts (defined in `package.json`):

| Script | What it does |
| --- | --- |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint over the whole tree |

## Deployment

`.github/workflows/deploy-web.yml` builds and deploys `web/dist/` to GitHub Pages on every push to `main` that touches `web/**`. You can also trigger it manually from the Actions tab. The site serves from `https://philipmathieu.github.io/hexled/`.

The workflow uses GitHub's first-party Pages actions (`configure-pages`, `upload-pages-artifact`, `deploy-pages`) — no `gh-pages` branch involved. Repo Settings → Pages must have the source set to **GitHub Actions** (the workflow's `configure-pages` step enables Pages on the repo automatically on first run, but the source selector still has to be flipped from "Deploy from a branch" if it's set there).

## Simulator plan (sketch)

When implemented, the simulator panel needs:

- A **hex grid canvas** (SVG or canvas-API) matching the on-device geometry: 24 cols × 6 rows, pointy-top, odd-r offset. Coordinates per [`../shared/hexmap_spec.md`](../shared/hexmap_spec.md).
- An **MQTT-over-WebSocket client** (e.g. `mqtt.js`) connecting to a local Mosquitto with the `websockets` listener enabled.
- A **frame publisher** — sends `bytes` to `hexled/<id>/frame/set` per the layer-2 spec in [`../shared/protocol.md`](../shared/protocol.md). Will need a coordinate→strip-index translation that matches `firmware/src/hexmap.py` exactly.
- A **glyph preview** that reads the in-progress font from the designer panel and renders it on the simulated hex grid, so the designer immediately sees what their work will look like in situ.
- A **mode picker** — sends `hexled/<id>/mode/set` messages so you can flip the device between built-in apps and `raw_frame` without leaving the browser.

Folder layout when the simulator lands (proposed):

```
web/src/
  components/
    HexagonFontDesigner.jsx     (existing)
    HexagonGrid.jsx             (extract from designer; share with simulator)
    Simulator.jsx               (new)
  lib/
    hexmap.ts                   (matches firmware/src/hexmap.py)
    mqtt.ts                     (wraps mqtt.js with our topic conventions)
    fontFormat.ts               (matches firmware/src/font.py)
```

## Path note

`vite.config.js` sets `base: '/hexled/'` to match the GitHub Pages URL (`https://philipmathieu.github.io/hexled/`). Keep `base`, `homepage` in `package.json`, and the repo name in sync if any of them ever changes — otherwise assets 404 in production.

See [`CLAUDE.md`](CLAUDE.md) for the existing architecture / conventions inside the Vite app (carried over from the standalone repo).
