# Tools reference

Run commands from the server repository root with the Python virtual environment active. Use `python -m tools.<module>` so the repository `app` package imports correctly.

## Setup

See [Local setup](/server/local-setup) for Python, PostgreSQL, and environment setup.

## Tool summary

| Script | Use it when | Does not do |
| --- | --- | --- |
| `build_android_bundle.py` | Build and package an Android Hermes OTA bundle. | Sign or upload the bundle; build an APK. |
| `build_ios_bundle.py` | Build and package an iOS Hermes OTA bundle. | Sign or upload the bundle; build an IPA. |
| `ota_signing.py` | Generate a P-256 keypair or sign a release manifest. | Upload a release. |
| `publish_release.py` | Upload a built and signed release to an API. | Build or sign the release. |
| `release_production.py` | Choose a version, build or reuse a bundle, sign, and upload to production. | Build the native Android APK. |
| `publish_production_release.py` | Upload a prepared production release using `.env.production`. | Build or sign the release. |

## Build tools

### `build_android_bundle.py`

Builds a Metro Android release bundle, compiles it to Hermes bytecode with the host app's compiler, and packages `index.android.bundle` plus assets into a deterministic ZIP.

```sh
python -m tools.build_android_bundle \
  --app-dir "/absolute/path/to/your/react-native-app" \
  --output storage/outgoing/ota-android.zip
```

The host app must have `node_modules` installed, including the React Native CLI and the Hermes compiler. The default entry file is `index.js`. `OTA_APP_DIR` can provide the app path if it is exported in the process environment.

### `build_ios_bundle.py`

Builds a Metro iOS release bundle, compiles it to Hermes bytecode, and packages `main.jsbundle` plus assets.

```sh
python -m tools.build_ios_bundle \
  --app-dir "/absolute/path/to/your/react-native-app" \
  --output storage/outgoing/ota-ios.zip
```

The output is an OTA ZIP, not an IPA.

## Signing

### Generate a keypair

Use this only when creating a new publisher identity.

```sh
python -m tools.ota_signing generate-keys \
  --private-key .local-keys/development/ota-publisher-private.pem \
  --public-key .local-keys/development/ota-publisher-public.pem
```

The tool creates the private key with owner-only permissions. Keep it out of Git and out of every app.

### Sign a manifest

Android is the default platform. Pass `--platform ios` for an iOS package.

```sh
python -m tools.ota_signing sign-manifest \
  --bundle storage/outgoing/ota-android.zip \
  --platform android \
  --private-key .local-keys/development/ota-publisher-private.pem \
  --app-id com.example.app \
  --runtime-version rn-0.88.0-android-v1 \
  --version 7 \
  --manifest-output storage/outgoing/android-7-manifest.json \
  --signature-output storage/outgoing/android-7-signature.txt
```

Signing validates the package and calculates the SHA-256 and size. It builds the manifest and signs the canonical manifest with P-256 ECDSA. The API enforces version ordering during upload.

## Publishing

### `publish_release.py`

Uploads a built and signed release to `POST /api/v1/admin/releases`.

```sh
python -m tools.publish_release \
  --bundle storage/outgoing/ota-android.zip \
  --manifest storage/outgoing/android-7-manifest.json \
  --signature storage/outgoing/android-7-signature.txt \
  --channel development \
  --rollout 100
```

`--channel` defaults to `production`. `--rollout` defaults to `100` and accepts `0` through `100`.

The script reads `OTA_API_BASE_URL` and `OTA_ADMIN_TOKEN` from `.env`. `DATABASE_URL` must also be present because the settings require it, even though this script does not connect to the database.

### `release_production.py`

Runs the full Android production sequence. It reads `.env.production` and checks release history. It selects the next version when one is not supplied, builds or reuses a bundle, signs it, and uploads it.

```sh
python -m tools.release_production \
  --env-file .env.production \
  --app-dir "/absolute/path/to/your/react-native-app" \
  --app-id com.example.app \
  --runtime-version rn-0.88.0-android-v1 \
  --rollout 5
```

Defaults: app ID `com.ota`, runtime version `rn-0.88.0-android-v4`, channel `production`, rollout `5%`, private key `.local-keys/production/ota-publisher-private.pem`. Pass explicit values for your app.

To reuse a built bundle, pass `--bundle` instead of `--app-dir`.

### `publish_production_release.py`

Uploads a prepared production release using `.env.production`. It is platform-neutral and can publish an iOS ZIP when the signed manifest says `ios`.

```sh
python -m tools.publish_production_release \
  --env-file .env.production \
  --bundle storage/outgoing/production-ota.zip \
  --manifest storage/outgoing/production-7-manifest.json \
  --signature storage/outgoing/production-7-signature.txt \
  --rollout 5
```

## Common failures

See [Troubleshooting](/server/troubleshooting).
