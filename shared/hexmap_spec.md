# Hex coordinate system

The display is **24 columns × 6 rows** of pointy-top hexagons (144 cells
total), driven by a single serpentine WS2812B strip.

## Conventions

- **Orientation:** pointy-top (vertex on top), not flat-top.
- **Offset coordinates:** [odd-r offset](https://www.redblobgames.com/grids/hexagons/#coordinates-offset) — odd-numbered rows are shifted half a column to the right.
- **Origin:** `(col=0, row=0)` is the **lower-right** cell of the physical display. The physical wiring starts there because that's where the data line enters the panel.
- **Axes:** `col` increases moving **left** across a row; `row` increases moving **up**.
- **Wiring:** serpentine — adjacent rows traverse in opposite directions. The exact direction (which edge each row enters from) is **TBD** until the physical build is verified.

## Reference

[Red Blob Games — Hexagonal Grids](https://www.redblobgames.com/grids/hexagons/) is the canonical primer for everything here. When in doubt, check the offset-coordinate section against this spec.

## API

Firmware exposes `coord_to_index(col, row) -> int` and the inverse
`index_to_coord(index) -> (col, row)` in `firmware/src/hexmap.py`. Both
must round-trip — `index_to_coord(coord_to_index(c, r)) == (c, r)` for all
valid `(c, r)` — and that property is the first real test once the
physical wiring direction is locked in.

## Web simulator note

The simulator in `web/` should use the **same coordinate system** so a
glyph or animation designed in the browser maps unambiguously to the
device. Until the JS-side translation lands, document mismatches here.

## TBD

- Verify serpentine direction on the physical build and pin it down here.
- Decide whether to expose axial / cube coordinates as helpers (useful for distance calculations and rotation; not needed for the basic render loop).
