# Services

Long-running Python processes that publish content to the display over MQTT.
Each service is a [`uv`](https://docs.astral.sh/uv/) workspace member with
its own `pyproject.toml`, runnable independently or behind a process manager
(systemd, Docker, whatever's convenient on the host).

## Intended services

| Service | Job |
| --- | --- |
| [`clock/`](clock/) | Publishes the current time on a schedule. **Note:** the clock can equally live on-device as a firmware app; this exists as the skeleton example of the service pattern. |
| `weather/` *(TBD)* | Periodically fetches forecast/current conditions from the [NWS API](https://www.weather.gov/documentation/services-web-api) and publishes a `mode/set` with the chosen weather scene. |
| `calendar/` *(TBD)* | Reads Google Calendar / iCal and triggers app changes around events (e.g. show next meeting countdown). |

Anything that needs to write to the display from off-device fits here.

## The pattern

A service:

1. Reads config from environment variables (broker URL, device ID, service-specific keys).
2. Connects to MQTT using `paho-mqtt`.
3. On a schedule or external trigger, publishes to a topic defined in [`../shared/protocol.md`](../shared/protocol.md):
    - Semantic updates → `hexled/<id>/mode/set` with `{"app": "...", "params": {...}}`
    - Raw frames → `hexled/<id>/frame/set` with binary RGB565 payload

That's it. The firmware (and any other consumer) doesn't care which service produced the message — services are MQTT publishers like any other.

## Adding a new service

```bash
cd services
mkdir my-service
# create my-service/pyproject.toml as a uv workspace member
# create my-service/src/my_service/__init__.py with a main()
uv sync   # from repo root, picks up the new workspace member
```

Pattern conventions:

- Package name in `pyproject.toml` is `hexled-<service>` (e.g. `hexled-clock`).
- Module name in `src/` uses underscores.
- Validate config with `pydantic` so misconfiguration fails loudly at startup.
- Log to stdout; let the process manager handle log shipping.
