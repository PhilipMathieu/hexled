# 001 — Single monorepo with firmware / web / services / shared / docs

**Status:** Accepted

## Context

HexLed has three runtimes that need to agree on shared concepts:

- **Firmware** (MicroPython, on-device) — owns the render loop and MQTT subscription.
- **Web app** (React/Vite, browser) — font designer plus a planned simulator that streams frames over MQTT-WS.
- **Services** (CPython, off-device) — content publishers like the clock and weather.

The pieces that span all three:

- Hex coordinate system and serpentine wiring direction
- Font glyph format produced in the browser, consumed by firmware and simulator
- MQTT topic structure and payload shapes

If those lived in separate repos, every cross-cutting change would mean two PRs, version coordination, and the risk of one side drifting from the other. Submodules are an option but consistently painful.

## Decision

Use a single monorepo with this top-level layout:

```
firmware/   MicroPython code for the Pico W
web/        React/Vite app (font designer + simulator)
services/   uv-managed Python content publishers
shared/     written specs that cross runtimes (protocol, hexmap, font)
docs/       hardware notes and ADRs
```

`shared/` is documentation-only — no code, just the contract that the runtimes implement and link back to.

## Consequences

- One clone, one PR for cross-cutting changes.
- Per-language tooling stays per-directory (no forced uniformity).
- A future CI pipeline can run firmware tests, Python service checks, and the web build off the same checkout.
- A casual contributor browsing the repo can see *all* the moving parts; the spec layer in `shared/` exists precisely so they don't have to dig through code to find the contract.
- No submodule hassle. Trade-off: the repo grows whatever `web/` accumulates (`node_modules` is gitignored, so this is mostly fine).
