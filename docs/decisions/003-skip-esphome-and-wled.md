# 003 — Not using ESPHome or WLED

**Status:** Accepted

## Context

Both ESPHome and WLED would give us Home Assistant integration nearly for free, so they're the obvious candidates to evaluate before writing firmware from scratch.

**WLED** is a polished WS2812 controller with great HA support, but:

- No Raspberry Pi Pico W support — WLED targets ESP32 / ESP8266. There's no roadmap for RP2040.
- Even if it did, WLED's model is *1D effects on a strip* with optional 2D mappings. A 24×6 hex with a custom font is well outside its sweet spot.

**ESPHome** does technically support the Pico W via `rp2040_pio_led_strip`, but:

- It treats an LED strip as a single 1D light entity. Rendering a clock, weather glyphs, or anything addressable per-cell would require `addressable_lambda` blocks — i.e. embedding C++ in YAML.
- Once you're writing C++ in YAML, you've lost ESPHome's main value proposition (declarative, no compilation per change).
- ESPHome's update cycle for Pico W support has historically lagged the ESP32 path.

The other reason both options drop out: a chunk of the *fun* of this project is the simulator + custom apps, and that's hard to bolt onto a framework whose abstractions assume a 1D strip.

## Decision

Roll our own firmware (see [002](002-firmware-language-micropython.md)) and integrate with Home Assistant via hand-written **MQTT discovery** payloads on the topics defined in [`../../shared/protocol.md`](../../shared/protocol.md).

## Consequences

- We own the firmware lifecycle (boot, OTA, watchdog, error reporting) instead of inheriting it.
- HA integration becomes a small amount of MQTT-discovery JSON to publish on boot — straightforward, well-documented, and gives us first-class control over what entities appear.
- We can design the protocol around our actual use cases (semantic apps + raw frame streaming), which would be awkward in either framework.
- We give up "it just works in HA out of the box". Acceptable given the rest of the project's goals.
