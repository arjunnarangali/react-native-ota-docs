# Configuration

The API reads settings from environment variables and from the repository root `.env` file. Use `.env` for local development and `.env.production` for production. Never commit either file.

## Core settings

| Variable | Default | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | required | SQLAlchemy database URL. |
| `OTA_ADMIN_TOKEN` | empty | Bearer token for admin publishing and release management. If empty, admin endpoints return 503. |
| `OTA_SIGNING_PUBLIC_KEY_PATH` | `.local-keys/ota-publisher-public.pem` | Public P-256 PEM used to verify release manifests. Relative paths resolve from the repository root. |
| `OTA_STORAGE_DIR` | `storage/releases` | Directory for immutable release ZIPs. Relative paths resolve from the repository root. |
| `OTA_MAX_BUNDLE_SIZE_BYTES` | `104857600` | Upload limit in bytes. The manifest schema also caps artifact size at 100 MB. |
| `OTA_API_BASE_URL` | `http://127.0.0.1:8000` | API origin used by the publishing tools. |
| `OTA_PUBLIC_BASE_URL` | empty | Optional public origin used in download URLs. Must be an HTTP(S) origin without a path. Set it in production. |

## PostgreSQL and Docker Compose

These values initialize the PostgreSQL container and the application role.

| Variable | Purpose |
| --- | --- |
| `POSTGRES_DB` | Database name. |
| `POSTGRES_USER` | PostgreSQL admin user created by the container. |
| `POSTGRES_PASSWORD` | Password for `POSTGRES_USER`. |
| `POSTGRES_APP_USER` | Application user created by the init script. |
| `POSTGRES_APP_PASSWORD` | Password for `POSTGRES_APP_USER`. |

`DATABASE_URL` must use the application user and the same database name. For local Compose:

```ini
DATABASE_URL=postgresql+psycopg://ota_app:change-this-local-app-password@127.0.0.1:5432/ota_dev
```

## Production Compose

The production Compose file also reads:

| Variable | Purpose |
| --- | --- |
| `DOMAIN_NAME` | Public hostname used by Nginx and the TLS certificate paths. |
| `OTA_PUBLIC_KEY_FILE` | Host path to the production public PEM. Compose mounts it read-only at `/run/ota/ota-publisher-public.pem`. |
| `OTA_PUBLIC_BASE_URL` | Public HTTPS origin used in download URLs. |
| `OTA_MAX_BUNDLE_SIZE_BYTES` | Optional upload limit. The effective limit is also capped at 100 MB by the manifest schema. |

See [Production deployment](/server/deployment) for the full production flow.

## Keys

The API receives only the public verification key. The publisher private key stays in a trusted environment and must never be committed, embedded in the app, or copied to the API host.

Generate a keypair only when creating a new publisher identity:

```sh
python -m tools.ota_signing generate-keys \
  --private-key .local-keys/development/ota-publisher-private.pem \
  --public-key .local-keys/development/ota-publisher-public.pem
```

Do not replace a keypair that installed apps already trust.

## Storage and limits

The API stores release artifacts as immutable ZIPs under `OTA_STORAGE_DIR`. It writes a temporary upload first, verifies the size, hash, and package structure, then publishes the artifact atomically. A release cannot become active if validation fails.

The effective upload limit is the lower of `OTA_MAX_BUNDLE_SIZE_BYTES` and the 100 MB limit enforced by the release manifest schema.

## Security checklist

- Use a long random `OTA_ADMIN_TOKEN`.
- Keep the publisher private key outside the repository and the API host.
- Use HTTPS for every non-local origin.
- Restrict access to the admin token and the production environment file.
- Back up the PostgreSQL database and the artifact storage volume.
