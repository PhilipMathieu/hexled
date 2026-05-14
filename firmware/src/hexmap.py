"""Hex coordinate <-> WS2812 strip-index mapping.

See ``shared/hexmap_spec.md`` for the canonical description of the coordinate
system. Summary: pointy-top hexagons, odd-r offset coordinates, 24 columns
and 6 rows (144 cells total), origin at the lower-right of the physical
display, serpentine wiring between rows.
"""


def coord_to_index(col: int, row: int) -> int:
    """Convert ``(col, row)`` hex coordinates to a WS2812 strip index.

    Uses pointy-top, odd-r offset coordinates. Origin ``(col=0, row=0)`` is
    the **lower-right** corner of the display per the physical wiring.
    Serpentine direction alternates per row.

    Parameters
    ----------
    col : int
        Column index, 0–23.
    row : int
        Row index, 0–5.

    Returns
    -------
    int
        Index into the 144-LED strip, 0–143.

    Notes
    -----
    Implementation TBD. The exact serpentine direction (which edge each row
    enters from) needs to be verified against the physical build.
    """
    raise NotImplementedError


def index_to_coord(index: int) -> tuple[int, int]:
    """Convert a WS2812 strip index to ``(col, row)`` hex coordinates.

    Inverse of :func:`coord_to_index`. Same conventions apply.

    Parameters
    ----------
    index : int
        Index into the 144-LED strip, 0–143.

    Returns
    -------
    tuple[int, int]
        ``(col, row)`` with ``0 <= col < 24`` and ``0 <= row < 6``.

    Notes
    -----
    Implementation TBD. Must round-trip with :func:`coord_to_index`.
    """
    raise NotImplementedError
