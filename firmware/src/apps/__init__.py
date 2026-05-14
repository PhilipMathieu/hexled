"""Built-in apps that run on-device.

Each app is a small module that renders frames into the shared framebuffer
based on its current parameters. The mode dispatcher (see ``mqtt_client``
+ ``main``) selects which app is active in response to ``mode/set``.

Intended apps (each becomes its own submodule):

- ``clock``: digital clock, configurable 12/24h, color, position.
- ``weather``: current condition icon + temperature, refreshed periodically.
- ``scroller``: marquee text using the font from ``shared/font_format.md``.
- ``raw_frame``: hands the framebuffer over to ``frame/set`` payloads.
- ``idle``: ambient pattern (gradient, noise, breathing) when nothing else
  is selected.

Conventions for each app module:
- Expose ``setup(params: dict) -> None`` and ``tick(t_ms: int) -> None``.
- All hardware access goes through the renderer passed in at setup time.
- Keep state on the module / class, not globals shared across apps.
"""
