"""Firmware entry point.

Boot flow
---------
1. Bring up WiFi (`network.WLAN(network.STA_IF)`) using credentials from a
   gitignored ``secrets`` module.
2. Sync time from NTP. Needed for the clock app and for MQTT TLS, if used.
3. Connect to the MQTT broker (see ``mqtt_client``) and subscribe to the
   topics defined in ``shared/protocol.md``.
4. Load the last-known mode from persistent storage (e.g. a small JSON file
   on the flash) so the display restores its state after a power blip.
5. Spawn the render loop on core 1 with ``_thread.start_new_thread``; run
   the asyncio event loop on core 0 for MQTT + app logic.

Nothing in here is implemented yet — this stub exists to document the
intended structure so future work has a target shape to fill in.
"""

# TODO: implement boot flow as described above.
