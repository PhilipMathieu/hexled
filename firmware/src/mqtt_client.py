"""MQTT client wrapper for the firmware.

Wraps ``umqtt.robust`` (vendored in ``lib/``) and surfaces a small async-
friendly interface for the rest of the firmware.

Topic subscriptions (see ``shared/protocol.md`` for the canonical spec):

- ``hexled/<id>/mode/set`` — JSON, retained. App selection + params.
- ``hexled/<id>/frame/set`` — binary RGB565, not retained. Raw frames from
  the simulator or a publisher streaming bespoke animations.

Publish targets:

- ``hexled/<id>/state`` — JSON, retained. Current mode, brightness, etc.
- ``hexled/<id>/available`` — ``online`` / ``offline``, retained, LWT.
"""

from typing import Callable

ModeHandler = Callable[[dict], None]
FrameHandler = Callable[[bytes], None]


class MqttClient:
    """Async-friendly MQTT wrapper.

    Parameters
    ----------
    broker : str
        Hostname or IP of the MQTT broker.
    device_id : str
        Stable identifier for this device, e.g. ``"hexled-01"``. Used in
        topic names per ``shared/protocol.md``.
    port : int, optional
        TCP port, by default ``1883``.
    """

    def __init__(self, broker: str, device_id: str, port: int = 1883) -> None:
        self.broker = broker
        self.device_id = device_id
        self.port = port

    async def connect(self) -> None:
        """Open the connection, set LWT, subscribe to mode/frame topics."""
        raise NotImplementedError

    def on_mode(self, handler: ModeHandler) -> None:
        """Register a callback fired when ``mode/set`` is received."""
        raise NotImplementedError

    def on_frame(self, handler: FrameHandler) -> None:
        """Register a callback fired when ``frame/set`` is received."""
        raise NotImplementedError

    async def publish_state(self, state: dict) -> None:
        """Publish a JSON state payload to ``hexled/<id>/state``."""
        raise NotImplementedError
