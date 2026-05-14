"""Framebuffer and LED-strip flushing.

The renderer owns two things:

1. A 144 × 3 byte framebuffer (``bytearray(144 * 3)``) holding the current
   RGB target for each cell, indexed by ``(col, row)`` via
   :mod:`hexmap`.
2. A flush primitive that writes the framebuffer to the WS2812B strip,
   typically via the ``neopixel`` module or a hand-written PIO program.

Apps mutate the framebuffer through high-level helpers (``set_cell``,
``fill``, ``blit_glyph``) and call ``flush()`` once per frame. The
framebuffer lives on core 1 alongside the render loop; apps running on
core 0 hand frames over a lock-protected swap buffer (design TBD).
"""

from typing import Protocol


class StripDriver(Protocol):
    """Minimal interface needed from a WS2812B driver (e.g. ``neopixel.NeoPixel``)."""

    def __setitem__(self, index: int, color: tuple[int, int, int]) -> None: ...

    def write(self) -> None: ...


class Renderer:
    """Owns the framebuffer and pushes frames to the LED strip.

    Parameters
    ----------
    strip : StripDriver
        A WS2812B driver supporting indexed RGB assignment and a ``write()``
        flush. ``machine.Pin`` setup happens outside this class.
    n_cells : int, optional
        Total number of cells in the display, by default ``144``.
    """

    def __init__(self, strip: StripDriver, n_cells: int = 144) -> None:
        self.strip = strip
        self.n_cells = n_cells
        self.framebuffer = bytearray(n_cells * 3)

    def set_cell(self, col: int, row: int, r: int, g: int, b: int) -> None:
        """Set the RGB color of a cell in the framebuffer (no I/O)."""
        raise NotImplementedError

    def fill(self, r: int, g: int, b: int) -> None:
        """Set every cell in the framebuffer to ``(r, g, b)`` (no I/O)."""
        raise NotImplementedError

    def clear(self) -> None:
        """Zero the framebuffer (no I/O)."""
        raise NotImplementedError

    def flush(self) -> None:
        """Push the framebuffer to the LED strip via ``hexmap`` ordering."""
        raise NotImplementedError
