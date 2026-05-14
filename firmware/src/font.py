"""Font loading and glyph lookup.

The font file format is defined in ``shared/font_format.md`` and is produced
by the designer in ``web/``. Firmware and web simulator must agree on the
exact serialization — see that doc for the source of truth.

A glyph is a sparse bitmap over a small hex grid (designer currently uses
6 rows × 4 cols; final on-device size TBD). The font loader converts the
serialized form to a structure the renderer can blit into the framebuffer
at an arbitrary ``(col, row)`` origin.
"""


class Font:
    """A loaded font: ``char -> glyph bitmap``."""

    def __init__(self, glyphs: dict[str, list[list[bool]]]) -> None:
        self.glyphs = glyphs

    @classmethod
    def from_json(cls, data: str | bytes) -> "Font":
        """Parse a font file produced by the web designer.

        Parameters
        ----------
        data : str | bytes
            Raw JSON payload.

        Returns
        -------
        Font
            Parsed font, ready for ``glyph()`` lookups.

        Notes
        -----
        Schema is TBD; see ``shared/font_format.md``.
        """
        raise NotImplementedError

    def glyph(self, ch: str) -> list[list[bool]] | None:
        """Return the bitmap for ``ch`` or ``None`` if unmapped."""
        return self.glyphs.get(ch)
