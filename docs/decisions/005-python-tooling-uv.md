# 005 — `uv` for Python tooling

**Status:** Accepted

## Context

Python lives in two places in this repo:

- `services/*` — long-running CPython processes that publish to MQTT.
- `firmware/` — MicroPython code on-device, but with a CPython-runnable subset (hexmap, protocol parsing, font loading) that we want to test off-device.

We need a single command that sets up everything for a new contributor, manages dependencies reproducibly, and doesn't require remembering "which directory am I in?". The user already uses [`uv`](https://docs.astral.sh/uv/) in other projects.

Alternatives considered: Poetry (slower, less monorepo-friendly), Rye (superseded by uv), bare `venv` + `pip-tools` (works but more moving parts).

## Decision

Use `uv` with a workspace declared at the repo root:

```toml
[tool.uv.workspace]
members = ["firmware", "services/*"]
```

- `uv sync` from the repo root sets up everything (firmware off-device test deps + every service's runtime deps).
- Each workspace member has its own `pyproject.toml` with its own deps and ruff/pyright config.
- Run things with `uv run --package <name>` — e.g. `uv run --package hexled-clock hexled-clock` or `uv run --package hexled-firmware pytest firmware/tests`.

The firmware's `pyproject.toml` is for off-device development only. Actual firmware deployment uses `mpremote`; uv has no role on-device.

## Consequences

- One-command onboarding for any Python work in the repo.
- Reproducible installs via the lockfile uv generates at the root.
- Conventions encoded in tooling rather than vibes: line length 100, numpy-style docstrings, ruff for both lint and format, pyright for type-checking.
- Anyone unfamiliar with uv has a short learning curve (same idioms as `cargo`).
- If we later need to ship a service as a Docker image, uv has good image-building integrations — no need to revisit this decision then.
