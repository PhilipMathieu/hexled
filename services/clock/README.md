# Clock service

Skeleton example of a HexLed content publisher service. Intended to publish
the current time to a display over MQTT once a minute.

> The clock can equally live on-device as a firmware app — this service
> exists mainly to show the publisher pattern. Pick one home for the clock
> in real use, not both.

## Run

```bash
# from repo root
uv sync
uv run --package hexled-clock hexled-clock
```

## Configuration

Environment variables:

| Var | Default | Notes |
| --- | --- | --- |
| `HEXLED_BROKER` | `localhost` | MQTT broker host |
| `HEXLED_PORT` | `1883` | MQTT broker port |
| `HEXLED_DEVICE_ID` | `hexled-01` | Target device id (topic prefix) |
| `HEXLED_TIMEZONE` | `UTC` | IANA timezone (e.g. `America/New_York`) |

## Status

Skeleton only — `main()` raises `NotImplementedError`. See module docstring for the intended flow.
