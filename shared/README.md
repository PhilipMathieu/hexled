# Shared

The contract layer between `firmware/`, `web/`, and `services/`.

Anything that crosses module boundaries lives here as a written spec —
firmware, simulator, and publishers must all agree, so we don't want any
of them to be the de-facto source of truth.

| Spec | What it covers |
| --- | --- |
| [`protocol.md`](protocol.md) | MQTT topics, payload shapes, retention, LWT, HA discovery |
| [`hexmap_spec.md`](hexmap_spec.md) | Hex coordinate system, wiring direction, indexing conventions |
| [`font_format.md`](font_format.md) | Serialization of glyphs produced by the designer in `web/` |

Rules of engagement:

- If you change something on one side that's covered by a spec here, update the spec first or in the same change.
- Mark unresolved details `TBD` rather than guessing; better an obvious hole than a silent disagreement between firmware and simulator.
- Code that implements these specs should link back here (file:line is fine).
