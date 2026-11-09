# Introduction

`react-native-ota-client` adds over-the-air updates to React Native apps on Android and iOS. The client checks for signed releases, verifies the release manifest and packaged bundle, stages verified updates, selects the bundle on cold start, and rolls back a release that does not confirm healthy.

## What OTA can update

OTA can update JavaScript and bundled assets.

OTA cannot update native code, permissions or entitlements, React Native or Hermes versions, or Codegen contract changes. Ship a new APK or IPA for those changes.

## Requirements

| Requirement | Details |
| --- | --- |
| Platforms | Android and iOS |
| React Native | 0.88.x |
| Architecture | New Architecture |
| JavaScript engine | Hermes |
| Android | Min SDK 24 |
| iOS | New Architecture and Hermes. Use the deployment target supported by the host app's React Native version. |
| Host app | Release signing setup and a public verification key |

## How updates work

<img class="ota-diagram" src="/release-flow.svg" alt="The app checks for a compatible release, verifies its signature and hashes, stages the bundle, then confirms it or rolls back after a failed health check." />

1. The app sends a check request to the OTA server. The request includes the app ID, runtime version, channel, current version, installation ID, and the last failed release ID when one exists.
2. The client verifies the signed release manifest. It checks the signature with the configured public key and enforces the platform, app, runtime, channel, version, action, and download origin rules.
3. The client downloads the artifact, verifies its size and SHA-256 hash, extracts it into app-private storage, and checks each declared file and the Hermes entrypoint.
4. The verified release is staged. On the next cold start, the client selects the staged bundle and marks the attempt.
5. `markUpdateSuccessful()` commits the release after the first usable React screen mounts. If the app does not confirm health before the next process launch, the client restores the previous confirmed bundle or the embedded bundle and reports the failed release.

## Debug behavior

Debug apps use Metro for the JavaScript bundle. OTA activation is disabled in debug builds. The host app passes its build type to the SDK. The SDK does not use its own library `BuildConfig.DEBUG`.

## Next steps

- [Installation](/guide/installation)
- [Android setup](/guide/android)
- [iOS setup](/guide/ios)
- [JavaScript API](/guide/javascript-api)
