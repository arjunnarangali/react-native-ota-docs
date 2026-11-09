# Troubleshooting

## API and configuration

| Symptom | Check |
| --- | --- |
| `Publisher public signing key is unavailable` (503) | The API cannot open or parse the configured public key. Check `OTA_SIGNING_PUBLIC_KEY_PATH`, resolve relative paths from the server repository root, confirm the file is a readable PEM, and restart the API after changing `.env`. |
| `Publisher public key must use P-256 ECDSA` (503) | Replace the configured key with a P-256 public PEM. Generate a matching pair with `ota_signing generate-keys`. |
| `Manifest JSON is invalid or not canonical` (400) | Use the manifest written by `ota_signing sign-manifest` without editing it. The API requires canonical JSON. |
| `Release manifest signature is invalid` (400) | The signing private key does not match the API public key, or the manifest and signature are not from the same signing operation. |
| `Bundle hash does not match signed manifest` (400) | The ZIP changed after signing, or the manifest was created for another bundle. Build and sign again as a pair. |
| Version conflict (409) | Use a version greater than the highest version for the same platform, app ID, runtime version, and channel. |
| `Admin publishing is not configured` (503) | Set `OTA_ADMIN_TOKEN` in the API environment and restart the API. |
| `Admin bearer token required` or `Invalid admin token` (401) | Send `Authorization: Bearer <OTA_ADMIN_TOKEN>` with the exact token. |
| `Database is unavailable` (503) | Start PostgreSQL, check `DATABASE_URL`, and apply migrations with `alembic upgrade head`. |
| `[Errno 48] Address already in use` | Stop the existing Uvicorn process or start the API on another port. |
| Upload returns 413 | The bundle exceeds `OTA_MAX_BUNDLE_SIZE_BYTES` or the 100 MB manifest limit. |
| Package validation fails (400) | Check the platform entrypoint, Hermes header, `ota-manifest.json`, declared files, file sizes, and file hashes. |

## Build and publishing tools

| Symptom | Check |
| --- | --- |
| Metro says `Unable to resolve module ...` | The host app import does not resolve to an installed dependency. Check the app's dependency name, install, and source imports. Bundle generation runs Metro. |
| The build tool cannot find the React Native CLI | Install the host app dependencies. The builder uses the app's local `node_modules` CLI. |
| The Hermes compiler is missing | Install the host app dependencies for the build host operating system. |
| `publish_release` fails because `DATABASE_URL` is missing | The settings require `DATABASE_URL` even though the publishing script does not connect to the database. Add it to `.env`. |
| The app reports no update | Check platform, app ID, runtime version, channel, current version, rollout eligibility, failed release ID, and that the release is active. |
| The app downloads but does not activate | This is a client behavior. Confirm the client stages the release, restarts, and calls `markUpdateSuccessful()` after the first screen mounts. Server tests do not prove device activation. |

## Debug checklist

1. Check `/healthz/live` and `/healthz/ready`.
2. Check the API logs for signature, key, database, or artifact errors.
3. List releases with `GET /api/v1/admin/releases` and confirm the expected release is active.
4. Confirm the platform, app ID, runtime version, and channel match the installed app.
5. Confirm the public key on the API matches the key embedded in the app and the private key used to sign.
6. Confirm the download URL uses the public HTTPS origin.
7. Confirm the artifact exists in `OTA_STORAGE_DIR`.

For the full endpoint list, see the [API reference](/server/api).
