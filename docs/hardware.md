# Hardware

Physical build notes for the HexLed Display.

## Overview

- **Layout:** 24 columns × 6 rows of pointy-top hexagonal cells (144 total)
- **Light source:** WS2812B individually addressable RGB LEDs, one per cell
- **Wiring:** single serpentine data line through all 144 LEDs
- **Cell frame:** 3D-printed, slots a single LED behind each cell with a light-blocking wall between cells
- **Diffuser:** frosted plexiglass sheet sandwiched in front of the cell frame
- **Outer frame:** hand-jointed birdseye maple, finished with [TBD]
- **Controller:** Raspberry Pi Pico W (Wi-Fi via the CYW43)

## Electrical

- **LED strip:** WS2812B, 60 LEDs/m (TBD final pitch — depends on cell size)
- **Logic level shifter:** 74AHCT125. The Pico W is 3.3V; WS2812Bs want ~5V data. The 74AHCT125 has a TTL-compatible input threshold (≈2V) when powered from 5V, so it cleanly translates 3.3V → 5V.
- **Data line:** in series with a **470 Ω** resistor at the strip end, to clamp ringing.
- **Power smoothing:** **1000 µF** electrolytic across the LED rail at the injection point.
- **5V supply:** dedicated rail for the LEDs, **separate** from the Pico W's USB 5V. Tie grounds together at a single point.

### Current draw

- Worst-case theoretical (all 144 LEDs full-white): ~60 mA × 144 ≈ **8.6 A** at 5V.
- Typical operating draw with a brightness cap (~30 %): **3–4 A** is a safe planning number.
- Real PSU choice and brightness ceiling: **TBD** — wait until we measure the real cap that still looks good through the diffuser.

## Wiring diagram

**TBD** — add an actual diagram (Fritzing, KiCad schematic, or a clean
hand-drawn SVG) once the level shifter + data line layout is finalized.

For now, the rough topology:

```
[5V PSU] ─── [1000µF cap] ─── [LED strip 5V/GND]
[Pico W GP?] ── [74AHCT125] ── [470Ω] ── [LED Din]
[Pico W GND] ──────────────── [LED GND]   (single tie point with PSU GND)
```

GPIO pin choice for the data line: TBD (must be PIO-capable on the RP2040 — most GPIOs are).

## BOM

| Item | Qty | Notes |
| --- | --- | --- |
| Raspberry Pi Pico W | 1 | — |
| WS2812B LED strip | 144 LEDs worth | TBD pitch |
| 74AHCT125 level shifter | 1 | Powered from 5V |
| 470 Ω resistor | 1 | Data-line series resistor |
| 1000 µF / 6.3V+ electrolytic cap | 1 | Across LED rail |
| 5V power supply | 1 | Sized for the brightness cap we settle on |
| 3D-printed cell frame | 1 | Single piece or tiled? TBD |
| Frosted plexiglass diffuser | 1 | Sheet sized to display |
| Birdseye maple frame stock | — | Mitred / hand-jointed |

## TBDs

- Final PSU choice and connector
- GPIO pin assignment for the data line
- Enclosure layout for the Pico W (accessible USB? separate access panel?)
- Heat: 3–4 A on the rail isn't significant, but the LEDs sealed behind plexi might warm up — measure before assuming.
