"""Clock service: publishes the current time to a HexLed display over MQTT.

This service exists primarily as a worked example of the service pattern
(see ``services/README.md``); the same job can equally live on-device as
a firmware app. Choose one — running both will cause the device to flicker
between two sources of truth.

Configuration is read from environment variables:

- ``HEXLED_BROKER`` — MQTT broker hostname (default ``localhost``)
- ``HEXLED_PORT`` — MQTT broker port (default ``1883``)
- ``HEXLED_DEVICE_ID`` — target device id (default ``hexled-01``)
- ``HEXLED_TIMEZONE`` — IANA tz name (default ``UTC``)

Behavior (TBD):

1. Connect to the broker.
2. Once a minute, publish to ``hexled/<id>/mode/set`` with
   ``{"app": "clock", "params": {"hh": HH, "mm": MM, "tz": "<name>"}}``.
3. On clean shutdown, optionally publish a final state.

The exact payload schema must agree with ``shared/protocol.md``; revisit
once that doc is concrete.
"""


def main() -> None:
    """Run the clock publisher loop. Implementation TBD."""
    raise NotImplementedError
