# Font format

The font designer in [`web/`](../web/) produces glyphs that get loaded by
both the firmware text renderer and the web simulator. Both sides must
read the same serialization — this is the source of truth for that format.

> Status: **draft / TBD**. The designer currently uses an in-memory grid
> that doesn't match the on-display geometry. The export format hasn't
> been wired up yet.

## Designer grid (current)

Each character is a **6-row × 4-column** boolean matrix in the designer
(`HexagonFontDesigner.jsx`), with alternating rows offset half a column to
form a hex lattice. The designer serializes this to a URL hash via
`getFontHash()` (comma-separated `${char}${value.toString(36)}` pairs).

## Display geometry

The display itself is 24 × 6. A typical glyph occupies a small subset —
probably 3–4 columns wide and up to 6 rows tall — so glyphs are stored as
*bitmaps on a small hex grid*, and the renderer blits them at an
`(col_origin, row_origin)` of its choice.

**Open question:** the per-glyph grid size in the designer (6×4) and the
size we'll ultimately bake into the file format may need to differ.
Decide once the simulator renders a glyph on a real-sized hex grid and we
can see what reads well.

## Proposed file format (TBD)

A JSON file shipped alongside the firmware and loaded at boot:

```jsonc
{
  "name": "default",
  "glyph_cols": 4,
  "glyph_rows": 6,
  "glyphs": {
    "A": [[0,1,1,0],[1,0,0,1], /* … 6 rows … */],
    // …
  }
}
```

Alternatives to weigh:

- **Bitstring per glyph** (24 bits packed as base36 or base64) — smaller, but harder to inspect by eye.
- **Sparse list of `(col, row)` tuples** — easier to design tiny glyphs, but verbose for dense letters.
- **Variable-width glyphs** — let each glyph declare its own width. Worth it for kerning.

## Loader contract

- Both the firmware (`firmware/src/font.py`) and the simulator JS must produce the same in-memory representation from a given file: a map from `char -> 2D boolean bitmap`.
- Loaders should tolerate missing characters gracefully (return `None` / fall back to a placeholder).
- No floating-point in glyph data — everything is `bool` or `0 | 1`.

## TBD

- Finalize the on-disk format and update both sides.
- Decide whether to ship multiple font files (e.g. compact 3-col digits for the clock, wider letters for scrollers).
- Decide whether the firmware should ingest the designer's URL-hash format directly or only a "compiled" JSON.
