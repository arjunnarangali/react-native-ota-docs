# API reference

Base URL:

- Local: `http://127.0.0.1:8000`
- Production: `https://<your-domain>`

Interactive docs: `/docs`
OpenAPI schema: `/openapi.json`

## Authentication

Admin endpoints require a bearer token:

```sh
Authorization: Bearer <OTA_ADMIN_TOKEN>
```

The update check and bundle download endpoints are public. Protect the admin token and use HTTPS in production.

## Health

### `GET /healthz/live`

Returns `{"status":"alive"}`. This endpoint does not check PostgreSQL.

### `GET /healthz/ready`

Returns `{"status":"ready","database":"connected"}` when the API can query PostgreSQL. Returns 503 when the database is unavailable.

## Update check

### `POST /api/v1/updates/check`

Finds an eligible release for an installed app. The request and response are platform-aware.

Request body:

```json
{
  "platform": "android",
  "app_id": "com.example.app",
  "runtime_version": "rn-0.88.0-android-v1",
  "channel": "production",
  "current_version": 6,
  "installation_id": "00000000-0000-4000-8000-000000000000",
  "failed_release_id": null
}
```

Fields:

| Field | Type | Notes |
| --- | --- | --- |
| `platform` | string | `android` or `ios`. |
| `app_id` | string | Reverse-domain app identifier. |
| `runtime_version` | string | Native runtime compatibility value. |
| `channel` | string | Lowercase channel name. |
| `current_version` | integer | Current OTA version. Defaults to `0`. |
| `installation_id` | UUID | Stable installation identifier. |
| `failed_release_id` | UUID or null | Optional release that failed health confirmation. |

Response with an eligible release:

```json
{
  "update_available": true,
  "release": {
    "manifest": {
      "manifest_version": 1,
      "release_id": "8f14e45f-ea2b-4c2c-9f1a-1d2e3f4a5b6c",
      "platform": "android",
      "app_id": "com.example.app",
      "runtime_version": "rn-0.88.0-android-v1",
      "version": 7,
      "artifact_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "artifact_size_bytes": 123456,
      "created_at": "2026-11-09T12:00:00Z"
    },
    "signature": "<base64 P-256 signature>",
    "channel": "production",
    "rollout_percentage": 5,
    "action": "update",
    "download_url": "https://ota.example.com/api/v1/releases/8f14e45f-ea2b-4c2c-9f1a-1d2e3f4a5b6c/bundle"
  }
}
```

No eligible release:

```json
{
  "update_available": false
}
```

The server filters by platform, app ID, runtime version, channel, active state, current version, failed release ID, and rollout eligibility. The `action` is `rollback` when the selected release is a rollback target and the client's current version is higher.

## Download a bundle

### `GET /api/v1/releases/{release_id}/bundle`

Returns the immutable ZIP for a release. Disabled or missing releases return 404. The response uses `Cache-Control: public, max-age=31536000, immutable`.

The `download_url` in the update response uses `OTA_PUBLIC_BASE_URL` when configured. Otherwise it uses the request URL.

## Admin endpoints

### `POST /api/v1/admin/releases`

Publishes a signed platform bundle. Use `multipart/form-data` with:

| Field | Type | Notes |
| --- | --- | --- |
| `manifest` | string | Canonical JSON release manifest. |
| `signature` | string | Base64 P-256 ECDSA signature. |
| `channel` | string | Channel name. |
| `bundle` | file | Platform OTA ZIP. |
| `rollout_percentage` | integer | `0` through `100`. Defaults to `100`. |

The API verifies the manifest signature, artifact size and hash, ZIP structure, platform entrypoint, Hermes format, declared files, and per-file hashes. A version must be greater than the highest version for the same platform, app ID, runtime version, and channel.

A successful upload archives the previous active release for that platform, app ID, runtime version, and channel.

### `GET /api/v1/admin/releases`

Lists published releases, newest first. Requires admin authentication.

### `PATCH /api/v1/admin/releases/{release_id}/rollout`

Changes the rollout percentage for an active release.

```json
{
  "rollout_percentage": 25
}
```

### `POST /api/v1/admin/releases/{release_id}/disable`

Stops serving a release to update checks. The API no longer serves the release bundle for download.

### `POST /api/v1/admin/releases/{release_id}/rollback`

Makes a previous signed release active at 100% and marks it as a rollback. The API archives the current active release for the same platform, app ID, runtime version, and channel.

## Validation rules

| Value | Rule |
| --- | --- |
| Platform | `android` or `ios`. |
| App ID | Reverse-domain pattern, up to 255 characters. |
| Runtime version | 1 to 128 characters from letters, numbers, dots, underscores, and hyphens. |
| Channel | Lowercase letters, numbers, dots, underscores, and hyphens, up to 64 characters. |
| Version | Integer from 1 to 2,147,483,647. |
| Rollout | Integer from 0 to 100. |
| Artifact size | At most 100 MB. The configured upload limit can be lower. |

## Error responses

| Status | Meaning |
| --- | --- |
| 400 | Invalid manifest, signature, artifact size or hash, or package structure. |
| 401 | Missing or invalid admin bearer token. |
| 404 | Release or bundle not found. |
| 409 | Version conflict or invalid release state for the operation. |
| 413 | Bundle exceeds the configured upload limit. |
| 422 | Request validation failed. |
| 503 | Admin publishing is not configured, the public key is unavailable, or the database is not ready. |

## Client contract

The client needs an OTA server that issues signed release manifests and serves release artifacts. The server provides:

- A check endpoint that accepts the app ID, runtime version, channel, current version, installation ID, and failed release ID.
- Signed release manifests that name the platform, app, runtime, version, artifact size, artifact hash, and creation time.
- Update responses that add the channel, rollout percentage, action, and download URL.
- Release artifacts that match the signed manifest and contain the declared files.
- Release management for uploads, channels, rollout state, and rollback.

The client verifies:

- The manifest signature with the configured public verification key.
- The platform, app, runtime, channel, version, and action rules.
- The download origin and transport.
- The artifact size and SHA-256 hash.
- The archive structure, declared files, file sizes, file hashes, and the Hermes entrypoint.

The client stages a release only after every check passes.

The server signs release manifests with the publisher private key. The app ships only the public verification key. Never put the publisher private key in the app, the SDK, or this documentation.

For client installation and activation behavior, see the [client documentation](https://docs.ota.arjunis.me/guide/introduction).
