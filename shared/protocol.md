# MQTT protocol

Three layers, each with a clear job. The firmware subscribes to the first
two; publishers (services, web simulator, Home Assistant) write to them.
The third is state that the firmware publishes outward.

> All topics use `<id>` for the device identifier (default placeholder:
> `hexled-01`). Multiple devices on one broker get distinct ids.

## 1. Mode / app layer — semantic, retained

**Topic:** `hexled/<id>/mode/set`
**Payload:** JSON
**Retained:** yes — when the device reboots it picks up the last mode without needing the publisher to be alive.

```jsonc
{
  "app": "clock",          // one of: clock | weather | scroller | raw_frame | idle | ...
  "params": { /* TBD */ }  // app-specific; see each app's docstring in firmware/src/apps/
}
```

When set, the device transitions to that app and runs it autonomously. Publishers don't need to keep streaming.

**TBD:** exact `params` schema per app. Capture each app's schema in this doc once the firmware app exists.

## 2. Frame layer — raw pixels, not retained

**Topic:** `hexled/<id>/frame/set`
**Payload:** binary — 288 bytes (144 pixels × 2 bytes RGB565)
**Retained:** no — frames are transient by definition.

When the device is in `raw_frame` mode (set via layer 1), each frame on this topic is blitted to the LED strip immediately. The web simulator is the primary publisher here.

Pixel order matches the WS2812 strip order, **not** `(col, row)` — translation is the publisher's responsibility using `hexmap_spec.md`. This keeps the on-device hot path trivial: the firmware just copies bytes.

**TBD:**
- Choose between RGB565 (above) and RGB888 (432 bytes). 565 halves the bandwidth; 888 sidesteps gamma headaches. Decide once we have real WiFi numbers.
- Decide whether to support partial-frame updates (dirty regions) as a separate topic.

## 3. State + availability — device → broker

**Topic:** `hexled/<id>/state`
**Payload:** JSON
**Retained:** yes — anyone subscribing later sees current state.

```jsonc
{
  "app": "clock",
  "brightness": 0.6,
  "online_since": "2026-05-13T14:00:00Z"
}
```

**Topic:** `hexled/<id>/available`
**Payload:** `online` (publish on connect) or `offline` (last will and testament)
**Retained:** yes
**LWT:** yes — broker auto-publishes `offline` if the device drops.

## Home Assistant integration (TBD)

The device will announce itself via [MQTT discovery](https://www.home-assistant.io/integrations/mqtt/#mqtt-discovery), creating:

- A `light` entity backed by the state topic for brightness / on-off.
- A `select` entity for picking which app is active.

Exact discovery payloads will land in this doc once they exist. The
discovery prefix is HA-configurable (default `homeassistant`).

## Open questions

- Error topic? (e.g. `hexled/<id>/error` when an app fails to start)
- Command vs. set semantics — do we need a separate command channel for one-shot effects like "flash red 3 times"?
- Auth: TLS + username/password, or trust the home LAN?
