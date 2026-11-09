# Production deployment

The production stack runs PostgreSQL, the FastAPI service, and Nginx with Docker Compose. Nginx terminates TLS and proxies requests to the API. The Docker build uses the server repository root as its context.

## Prerequisites

- A Linux host with Docker Engine and Docker Compose.
- A domain name that points to the host.
- A TLS certificate for the domain.
- A production public verification key.
- Strong database passwords and an admin token.

## Production environment

Create `.env.production` from the example and replace every placeholder:

```sh
cp .env.production.example .env.production
```

The file must include:

| Variable | Purpose |
| --- | --- |
| `POSTGRES_DB` | Database name. |
| `POSTGRES_USER` | PostgreSQL admin user. |
| `POSTGRES_PASSWORD` | Password for the admin user. |
| `POSTGRES_APP_USER` | Application database user. |
| `POSTGRES_APP_PASSWORD` | Password for the application user. |
| `DATABASE_URL` | SQLAlchemy URL for the application user. Use `db` as the host inside Compose. |
| `OTA_ADMIN_TOKEN` | Long random bearer token for admin operations. |
| `OTA_PUBLIC_BASE_URL` | Public HTTPS origin used in download URLs. |
| `DOMAIN_NAME` | Public hostname for Nginx and the TLS certificate. |
| `OTA_PUBLIC_KEY_FILE` | Host path to the production public PEM. |

Do not commit `.env.production` or the public key if your repository policy treats environment paths as private.

## Public key

Place the production public PEM on the host and set `OTA_PUBLIC_KEY_FILE` to its absolute path. Compose mounts it read-only at `/run/ota/ota-publisher-public.pem`.

The API receives only the public key. The matching private key stays with the publisher.

## TLS certificates

The Nginx template expects:

```text
/etc/letsencrypt/live/${DOMAIN_NAME}/fullchain.pem
/etc/letsencrypt/live/${DOMAIN_NAME}/privkey.pem
```

Provision the certificate with your preferred ACME client, for example Certbot, and configure renewal. The HTTP server redirects all requests to HTTPS.

## Start the stack

Validate the Compose configuration:

```sh
docker compose --env-file .env.production -f compose.production.yaml config --quiet
```

Build and start:

```sh
docker compose --env-file .env.production -f compose.production.yaml up -d --build
```

The API container applies Alembic migrations before starting Uvicorn. Compose stores PostgreSQL data in the `postgres_data` volume and release artifacts in the `ota_releases` volume.

## Deploy script

`deploy-production.sh` supports deployment from a clean Git checkout. It refuses to run when the repository has local changes, pulls with `--ff-only`, starts the database, rebuilds the API and Nginx, and waits for the API health check.

```sh
./deploy-production.sh
```

## Verify the deployment

```sh
curl https://ota.example.com/healthz/live
curl https://ota.example.com/healthz/ready
curl https://ota.example.com/docs
```

A readiness response includes the database status. A 503 means the API cannot reach PostgreSQL.

## Publishing tools

The API Docker image does not include the `tools/` publishing scripts. Run the build, sign, and publish tools from a trusted checkout with the Python virtual environment active. The publishing host needs the private key and the admin token, not the API host.

## Backups and upgrades

- Back up `postgres_data` and `ota_releases`.
- Pull the intended commit before running `deploy-production.sh`.
- Keep the previous public key available while installed apps still trust it.
- Verify health checks after every deployment.

## Next steps

- [Configuration](/server/configuration)
- [Operations](/server/operations)
- [Troubleshooting](/server/troubleshooting)
