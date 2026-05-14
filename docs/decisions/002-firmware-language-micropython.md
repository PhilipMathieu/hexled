# 002 — MicroPython on the Pico W

**Status:** Accepted

## Context

Four serious candidates for the on-device runtime:

| Option | Pros | Cons |
| --- | --- | --- |
| **C with Pico SDK** | Best performance; full hardware control. | Highest friction; weakest fit for a hobbyist iteration loop. |
| **Rust + embassy** | Strong type system, modern ergonomics, embedded-graphics. | Steep learning curve here; ecosystem for WS2812 + WiFi + MQTT on the Pico W is less mature than MicroPython's. |
| **CircuitPython** | Easy to flash, USB-mountable storage. | Weaker async story than MicroPython, smaller library set on the W variant. |
| **MicroPython** | Fast iteration via `mpremote` + REPL; mature `_thread` + `asyncio`; Python sharing with services and off-device tests; mainline support for the Pico W. | Slower than C/Rust; runtime errors instead of compile-time. |

The render loop runs at modest frame rates (≤ 60 fps for 144 LEDs is well within MicroPython's reach using PIO), and the asyncio loop only handles MQTT + app state — neither is a bottleneck that demands native speed.

## Decision

Use **MicroPython 1.23+** on the Pico W. Run the render loop on core 1 with `_thread`; run asyncio + MQTT on core 0.

## Consequences

- The dual-core split keeps the render cadence steady even while WiFi / MQTT do their thing.
- Off-device tests for pure-Python modules (hexmap, font parsing, protocol decoding) run under CPython with `pytest`, sharing tooling with `services/`.
- We give up Rust's compile-time safety net for embedded-graphics ergonomics, and we give up C's raw speed. Both are deliberate — at this scale neither is necessary.
- Lib management is `mpremote cp -r lib/` (vendored), not `mip install` — `mip` is unreliable enough that we keep deps in-tree. See `firmware/lib/`.
- Style note: stick to the intersection of CPython and MicroPython in modules that get tested off-device (avoid `walrus` where it's not needed, isolate hardware imports).
