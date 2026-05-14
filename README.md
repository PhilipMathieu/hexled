# HexLed Display

A 24×6 pointy-top hexagonal pixel display: 144 WS2812B LEDs in a serpentine
strip behind a 3D-printed cell frame, frosted plexiglass diffuser, and
hand-jointed birdseye maple outer frame. Driven by a Raspberry Pi Pico W
running MicroPython, it subscribes to MQTT and renders both pre-built "apps"
(clock, weather, scrollers, ambient patterns) and raw frame data streamed
from a browser-based simulator. Home Assistant is one of several possible
MQTT publishers.

## Repo layout

| Path | What it is |
| --- | --- |
| [`firmware/`](firmware/) | MicroPython code that runs on the Pico W. Owns the LED render loop, MQTT subscription, and built-in apps. |
| [`web/`](web/) | React/Vite single-page app. Hosts the hex-bitmap **font designer** (existing) and the planned **simulator** for streaming frames over MQTT-WS. |
| [`services/`](services/) | Python content publishers (clock, weather, calendar, …). Each is a [`uv`](https://docs.astral.sh/uv/) workspace member that pushes to MQTT. |
| [`shared/`](shared/) | Specs that span firmware + web + services: MQTT protocol, hex coordinate system, font file format. The contract layer. |
| [`docs/`](docs/) | Hardware notes, BOM/wiring, and **architectural decision records** (`docs/decisions/`). |

## Quickstart

Python tooling is `uv`-based; the JS app uses npm.

```bash
# Set up Python workspaces (services + firmware test deps)
uv sync

# Run firmware tests (off-device, under CPython)
uv run --package hexled-firmware pytest firmware/tests

# Run the web app
cd web && npm install && npm run dev
```

Firmware is deployed to the Pico W with `mpremote`; see [`firmware/README.md`](firmware/README.md).

## Status

Early scaffolding. See [`docs/decisions/`](docs/decisions/) for the architectural choices already made, and the `TBD` markers in [`shared/`](shared/) for everything still open.
