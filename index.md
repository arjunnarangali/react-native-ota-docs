---
layout: home

hero:
  name: React Native OTA
  text: Signed over-the-air updates for React Native
  tagline: Update JavaScript and bundled assets on Android and iOS without shipping a new binary. The client verifies each release before it runs, and the self-hosted server controls rollout and rollback.
  actions:
    - theme: brand
      text: Get started
      link: /guide/introduction
    - theme: alt
      text: Server guide
      link: /server/
    - theme: alt
      text: npm package
      link: https://www.npmjs.com/package/react-native-ota-client
    - theme: alt
      text: GitHub
      link: https://github.com/arjunnarangali/react-native-ota-client

features:
  - title: Signed releases
    details: The client checks the release manifest signature, the artifact hash, and the hash of each extracted file before it stages an update.
  - title: Safe activation
    details: A staged release stays provisional until the app confirms it is healthy. If it does not, the client restores the previous bundle or the embedded bundle.
  - title: Android and iOS
    details: One JavaScript API and one native startup contract for both platforms, built for React Native 0.88 with the New Architecture and Hermes.
  - title: Runtime aware
    details: Bundles are tied to the app, runtime version, and channel. A native runtime change invalidates bundles built for the old runtime.
  - title: HTTPS by default
    details: Release downloads must use HTTPS and match the configured server origin. Local HTTP is limited to loopback development hosts.
  - title: Public key only
    details: The app ships a public verification key. The publisher private key never enters the app or the SDK.
  - title: Self-hosted server
    details: Run the companion FastAPI service with PostgreSQL, signed release storage, rollout control, and rollback.
---

## What OTA can update

OTA updates JavaScript and bundled assets. Native code, permissions and entitlements, React Native and Hermes versions, and Codegen contract changes require a new APK or IPA.

## How it works

1. The app checks the OTA server with its app ID, runtime version, channel, current version, installation ID, and last failed release ID when one exists.
2. The client verifies the signed release manifest, the artifact size and hash, the archive contents, and the Hermes entrypoint.
3. A verified release is staged under app-private storage.
4. On the next cold start, the client selects the staged bundle. The release stays provisional until `markUpdateSuccessful()` confirms it is healthy. An unconfirmed release rolls back to the previous bundle or the embedded bundle.

## Requirements

- Android and iOS.
- React Native 0.88.x, the New Architecture, and Hermes.
- Android min SDK 24.
- iOS New Architecture and Hermes. Use the deployment target supported by the host app's React Native version.
- A host app with release signing and a public verification key.

## Install

```sh
npm install react-native-ota-client
```

React Native autolinking finds the native package on Android and iOS. Rebuild the native app after installation. Metro alone cannot add native code.

## Server

The companion server issues signed manifests and serves release artifacts. See the [server guide](/server/) for local setup, release publishing, production deployment, and the [API reference](/server/api).

Next: [installation guide](/guide/installation), platform setup for [Android](/guide/android) and [iOS](/guide/ios), and the [server guide](/server/).
