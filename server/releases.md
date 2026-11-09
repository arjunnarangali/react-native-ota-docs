# Release workflow

An OTA release moves through these stages: build the JavaScript bundle, package it as a platform OTA ZIP, sign the release manifest, upload the artifacts, and let the installed app verify and activate the release.

The server stores and distributes signed JavaScript and assets. It does not replace native code. Native changes, permission changes, React Native or Hermes upgrades, and Codegen contract changes require a new APK or IPA.

## Release values

These values isolate every release:

| Value | Example | Notes |
| --- | --- | --- |
| Platform | `android` or `ios` | Must match the installed app. |
| App ID | `com.example.app` | Must match the app and the signed manifest. |
| Runtime version | `rn-0.88.0-android-v1` | Represents native runtime compatibility. Keep it stable for compatible native builds. |
| Channel | `development` or `production` | Must match the channel compiled into the app. |
| Version | `7` | Must be greater than the highest version for the same platform, app ID, runtime version, and channel. |

Use the keypair that the app already trusts. Do not generate a replacement keypair to publish another update.

## 1. Prepare the host app

The React Native app is a separate project. Install its dependencies and confirm that Metro can resolve every import:

```sh
cd "/absolute/path/to/your/react-native-app"
npm ci
```

The bundle builders use the app's local React Native CLI and Hermes compiler. They do not install or repair app dependencies.

## 2. Configure and start the API

Follow [Local setup](/server/local-setup) or [Production deployment](/server/deployment). The API must have the public key that matches the signing private key and the app's embedded public key.

## 3. Build the OTA ZIP

Android:

```sh
python -m tools.build_android_bundle \
  --app-dir "/absolute/path/to/your/react-native-app" \
  --output storage/outgoing/ota-android.zip
```

iOS:

```sh
python -m tools.build_ios_bundle \
  --app-dir "/absolute/path/to/your/react-native-app" \
  --output storage/outgoing/ota-ios.zip
```

The ZIP contains the platform entrypoint, `ota-manifest.json`, and any Metro assets. Android uses `index.android.bundle`. iOS uses `main.jsbundle`. The entrypoint must be Hermes bytecode.

The builders create an OTA ZIP, not an APK or IPA. They do not sign or upload the release.

## 4. Sign the release manifest

Android:

```sh
NEXT_VERSION=7
python -m tools.ota_signing sign-manifest \
  --bundle storage/outgoing/ota-android.zip \
  --platform android \
  --private-key .local-keys/development/ota-publisher-private.pem \
  --app-id com.example.app \
  --runtime-version rn-0.88.0-android-v1 \
  --version "$NEXT_VERSION" \
  --manifest-output "storage/outgoing/android-${NEXT_VERSION}-manifest.json" \
  --signature-output "storage/outgoing/android-${NEXT_VERSION}-signature.txt"
```

iOS:

```sh
NEXT_VERSION=1
python -m tools.ota_signing sign-manifest \
  --bundle storage/outgoing/ota-ios.zip \
  --platform ios \
  --private-key .local-keys/development/ota-publisher-private.pem \
  --app-id com.example.ios \
  --runtime-version rn-0.88-ios-v1 \
  --version "$NEXT_VERSION" \
  --manifest-output "storage/outgoing/ios-${NEXT_VERSION}-manifest.json" \
  --signature-output "storage/outgoing/ios-${NEXT_VERSION}-signature.txt"
```

Signing validates the package entrypoint and Hermes header, then records the artifact SHA-256 and size in the signed manifest. The private key must match the public key configured on the API and embedded in the app.

## 5. Publish to the API

```sh
python -m tools.publish_release \
  --bundle storage/outgoing/ota-android.zip \
  --manifest "storage/outgoing/android-${NEXT_VERSION}-manifest.json" \
  --signature "storage/outgoing/android-${NEXT_VERSION}-signature.txt" \
  --channel development \
  --rollout 100
```

The API verifies the manifest signature, artifact size and hash, ZIP structure, platform entrypoint, Hermes format, declared files, and per-file hashes. It also enforces version ordering.

A successful upload archives the previously active release for the same platform, app ID, runtime version, and channel, then makes the new release active.

## 6. Verify in the app

Install a build that has the matching public key, app ID, runtime version, channel, and API origin. Trigger the client update check.

The server selects only active releases that match the request platform, app ID, runtime version, and channel. Rollout eligibility also applies.

A successful upload does not prove that a device downloaded or activated the release. Confirm the client stages, restarts, and marks the update healthy.

## Production releases

Android production orchestrator:

```sh
python -m tools.release_production \
  --env-file .env.production \
  --app-dir "/absolute/path/to/your/react-native-app" \
  --app-id com.example.app \
  --runtime-version rn-0.88.0-android-v1 \
  --rollout 5
```

The default rollout is 5%. Increase it after validating the release. The tool reads credentials and the API origin from `.env.production`.

For prepared artifacts, use `publish_production_release`:

```sh
python -m tools.publish_production_release \
  --env-file .env.production \
  --bundle storage/outgoing/production-ota.zip \
  --manifest storage/outgoing/production-7-manifest.json \
  --signature storage/outgoing/production-7-signature.txt \
  --rollout 5
```

The production orchestrator builds Android bundles only. For iOS production, build with `build_ios_bundle`, sign with the production app ID, runtime, and private key, then publish with `publish_production_release`.

Production origins must use HTTPS. The API host must have the matching production public key.

## Next steps

- [Tools reference](/server/tools)
- [Operations](/server/operations)
- [API reference](/server/api)
- [Troubleshooting](/server/troubleshooting)
