# Local setup

Run all Python commands from the server repository root with the virtual environment active. Relative paths for the public key and storage resolve from the repository root.

## Requirements

- Python 3.12 or newer.
- Docker Compose.
- A public verification key for the publisher keypair used by the test app.

## 1. Configure the environment

```sh
cp .env.example .env
```

Set both database passwords and `OTA_ADMIN_TOKEN` in `.env`. Point `OTA_SIGNING_PUBLIC_KEY_PATH` at the public PEM that matches the keypair trusted by the test app.

For example:

```ini
OTA_SIGNING_PUBLIC_KEY_PATH=.local-keys/development/ota-publisher-public.pem
```

See [Configuration](/server/configuration) for every setting.

## 2. Install Python dependencies

```sh
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

## 3. Start PostgreSQL

```sh
docker compose up -d db
```

## 4. Apply migrations

```sh
alembic upgrade head
```

## 5. Start the API

```sh
uvicorn app.main:app --reload
```

The API is available at `http://127.0.0.1:8000`.

Check:

```sh
curl http://127.0.0.1:8000/healthz/live
curl http://127.0.0.1:8000/healthz/ready
```

Open `http://127.0.0.1:8000/docs` for the interactive API docs.

If you change `.env`, stop and restart Uvicorn. The reload watcher does not watch `.env`.

## Run the tests

```sh
pytest
```

## Next steps

- [Configuration](/server/configuration)
- [Release workflow](/server/releases)
- [Troubleshooting](/server/troubleshooting)
