# 004 — Three-layer MQTT protocol (mode / frame / state)

**Status:** Accepted

## Context

Two extreme designs are possible:

1. **Pure semantic protocol** — publishers only ever set "modes" (`{"app": "clock", ...}`), the device renders. Clean, but it can't express bespoke animations or the kind of free-form pixel art the simulator will want to push.
2. **Pure frame protocol** — publishers push raw RGB frames, the device is a dumb sink. Flexible, but the device can't render anything unless *someone* is actively streaming — so the clock stops when your laptop sleeps.

Neither is right on its own. We want:

- The device to render the clock / weather / ambient autonomously, even when no publisher is online.
- The simulator (and any future creative tool) to be able to take over and push arbitrary frames.
- Home Assistant to integrate via clean semantic entities (a light + a select), not raw pixel data.

## Decision

Three layers, each owning one job (full spec: [`../../shared/protocol.md`](../../shared/protocol.md)):

1. **`hexled/<id>/mode/set`** — JSON, retained. App selection + params. Device runs the chosen app autonomously.
2. **`hexled/<id>/frame/set`** — binary RGB565, not retained. Active only when the device is in `raw_frame` mode. Simulator's primary channel.
3. **`hexled/<id>/state` + `hexled/<id>/available`** — JSON + LWT, retained. Device-published, for observers (HA, dashboards).

Switching into `raw_frame` is itself a `mode/set`, so the device is always in *some* explicit state.

## Consequences

- Built-in apps survive publisher outages (retained mode + on-device logic).
- The simulator's hot path is short: binary blob in, framebuffer out. No JSON parsing per frame.
- Home Assistant integrates against layer 1 + 3 (semantic + state). It never has to know layer 2 exists.
- We need to be careful that an app's `params` schema is well-documented — these payloads are the device's public API and HA discovery payloads will encode them.
- Bandwidth: 288 bytes/frame × ~30 fps × overhead ≈ 10 KB/s sustained per device on layer 2. Comfortably within home-LAN MQTT.
