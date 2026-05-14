# Architectural Decision Records

Lightweight ADRs capturing the non-trivial choices already made about how
HexLed is built. Each file follows a fixed shape:

- **Status** — `Accepted`, `Superseded by NNN`, etc.
- **Context** — what we were trying to decide and what constrained us
- **Decision** — the call we made
- **Consequences** — what this commits us to (good and bad)

## How to add one

1. Pick the next sequence number (zero-padded, e.g. `006-`).
2. Use a short, decision-shaped slug: `006-something-something.md`.
3. Keep it to ~30–60 lines. Long debates belong in a discussion, not an ADR.
4. If a later decision overrides this one, edit the old file's `Status`
   to `Superseded by NNN` rather than rewriting its content.

## Index

| # | Decision |
| --- | --- |
| [001](001-monorepo-layout.md) | Single monorepo with `firmware/web/services/shared/docs` |
| [002](002-firmware-language-micropython.md) | MicroPython on the Pico W (vs. CircuitPython, C, Rust) |
| [003](003-skip-esphome-and-wled.md) | Not using ESPHome or WLED |
| [004](004-hybrid-mqtt-protocol.md) | Three-layer MQTT protocol: mode / frame / state |
| [005](005-python-tooling-uv.md) | `uv` for the Python workspaces |
