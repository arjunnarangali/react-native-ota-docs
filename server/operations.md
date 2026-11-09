# Operations

Admin operations require a bearer token:

```sh
Authorization: Bearer <OTA_ADMIN_TOKEN>
```

If `OTA_ADMIN_TOKEN` is not configured, admin endpoints return 503.

## List releases

```sh
curl -H "Authorization: Bearer $OTA_ADMIN_TOKEN" \
  https://ota.example.com/api/v1/admin/releases
```

The response includes each release manifest, signature, channel, state, rollout percentage, rollback flag, and publish time.

## Change rollout

```sh
curl -X PATCH \
  -H "Authorization: Bearer $OTA_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rollout_percentage":25}' \
  https://ota.example.com/api/v1/admin/releases/<release_id>/rollout
```

Only an active release can change rollout. The API assigns installations to a stable bucket from the release ID and installation ID.

## Disable a release

```sh
curl -X POST \
  -H "Authorization: Bearer $OTA_ADMIN_TOKEN" \
  https://ota.example.com/api/v1/admin/releases/<release_id>/disable
```

The API does not serve a disabled release to update checks. Its bundle download returns 404.

## Roll back to a previous release

```sh
curl -X POST \
  -H "Authorization: Bearer $OTA_ADMIN_TOKEN" \
  https://ota.example.com/api/v1/admin/releases/<release_id>/rollback
```

The API marks the target release active at 100% and archives the current active release for the same platform, app ID, runtime version, and channel. Compatible clients with a higher current version receive `action: rollback`.

## Health checks

```sh
curl https://ota.example.com/healthz/live
curl https://ota.example.com/healthz/ready
```

`/healthz/live` checks the API process. `/healthz/ready` checks the database connection and returns 503 when PostgreSQL is unavailable.

## Logs

Use the Compose logs for the API and Nginx:

```sh
docker compose --env-file .env.production -f compose.production.yaml logs -f api
docker compose --env-file .env.production -f compose.production.yaml logs -f nginx
```

The API logs database readiness failures, missing artifacts, and signing configuration errors.

## Backups

Back up both persistent volumes:

- `postgres_data` for release metadata and state.
- `ota_releases` for immutable release ZIPs.

A database backup without the artifact volume cannot restore downloads. An artifact backup without the database cannot restore release selection or rollout state.

## Migrations

Apply migrations with:

```sh
alembic upgrade head
```

The production API container runs `alembic upgrade head` before starting Uvicorn.

## Monitoring

- Check `/healthz/ready` from your monitor.
- Check disk space for PostgreSQL and artifact storage.
- Check TLS certificate expiry.
- Verify that the public key file is readable by the API.
- Verify that recent releases can be downloaded through the public origin.

## Security

- Keep the admin token out of client apps and public repositories.
- Use HTTPS for every non-local origin.
- Keep the publisher private key outside the API host.
- Restrict access to the production environment file and the public key mount.
