# Firmware

MicroPython code that runs on the Raspberry Pi Pico W behind the display.

## Target

- **Board:** Raspberry Pi Pico W (RP2040 + CYW43 wireless)
- **Runtime:** MicroPython 1.23 or newer — flash the latest stable release from <https://micropython.org/download/RPI_PICO_W/>. Pin the version you ship in the boot log so reflashes are reproducible.
- **Output:** 144 WS2812B LEDs on a single data line (typically PIO-driven via `neopixel`-style code or `rp2.PIO`)

## Boot flow

```
boot.py     → minimal: import main
main.py     → connect WiFi → connect MQTT → load saved mode → start renderer (core 1) + asyncio loop (core 0)
```

The split is deliberate (see [`docs/decisions/002-firmware-language-micropython.md`](../docs/decisions/002-firmware-language-micropython.md)):

- **Core 1** runs the render loop with `_thread` — it owns the framebuffer and the LED strip.
- **Core 0** runs `asyncio` — MQTT, WiFi, time sync, app state. App handlers compute the next frame and hand it to core 1.

## Deploying with `mpremote`

```bash
# One-time: copy vendored libs
mpremote cp -r lib/ :lib/

# Push current src/
mpremote cp -r src/. :/

# Reset and watch the REPL
mpremote reset && mpremote
```

Iterate without copying everything by using `mpremote mount src/` during dev, then `cp -r` for a real install.

## Off-device testing

Pure-Python modules (`hexmap`, parts of `font`, the protocol parser) are run under CPython for fast iteration:

```bash
uv sync                           # from repo root, installs dev deps
uv run --package hexled-firmware pytest firmware/tests
```

Tests must stub out anything hardware-touching (`machine`, `neopixel`, `network`, `umqtt`). Keep those imports inside functions or behind a `try / except ImportError` so the test runner can import the module under CPython.

## Vendored libraries (`lib/`)

`mip` install on-device is fragile (WiFi must be up first, packages can disappear). Vendor any MicroPython library you depend on into `lib/` so `mpremote cp -r lib/ :lib/` is a one-shot setup.

Likely contents (add as needed):
- `umqtt/simple.py` — MQTT client (from `micropython-lib`)
- `umqtt/robust.py` — auto-reconnecting wrapper

## Pico W gotchas

- **Onboard LED:** the user LED is wired through the CYW43 wireless chip, **not** GPIO 25. Use `Pin("LED", Pin.OUT)`. `Pin(25)` is the LED on the non-W Pico and will silently do nothing on a Pico W.
- **WiFi must be initialized before first use of the onboard LED** on some MicroPython builds — bring up `network.WLAN(network.STA_IF).active(True)` early in `main.py`.
- **Flash storage is small** (≈848 KB after the firmware). Strip docstrings with `mpy-cross -O3` if you bump into it.
- **PIO programs are limited to 32 instructions** — most WS2812 PIO snippets fit, but custom timing tweaks can blow the budget.

## TBDs

- Exact GPIO pin for the LED data line (after level shifter)
- WiFi credentials handling (probably `secrets.py` in `lib/`, gitignored)
- Watchdog / OTA story
