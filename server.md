# Server contract

The client needs an OTA server that issues signed release manifests and serves release artifacts. The companion server is the [`react-native-ota-server` repository](https://github.com/arjunnarangali/react-native-ota-server).

## What the server provides

- A check endpoint that accepts the app ID, runtime version, channel, current version, installation ID, and failed release ID.
- Signed release manifests that name the platform, app, runtime, channel, version, action, artifact URL, artifact size, artifact hash, and packaged files.
- Release artifacts that match the signed manifest.
- Release management for uploads, channels, rollout state, and rollback.

## What the client verifies

- The manifest signature with the configured public verification key.
- The platform, app, runtime, channel, version, and action rules.
- The download origin and transport.
- The artifact size and SHA-256 hash.
- The archive structure, declared files, file sizes, file hashes, and the Hermes entrypoint.

The client stages a release only after every check passes.

## Keys

The server signs release manifests with the publisher private key. The app ships only the public verification key.

Never put the publisher private key in the app, the SDK, or this documentation.

## Server documentation

Use the server repository for installation, deployment, storage, and API details:

- [Server repository](https://github.com/arjunnarangali/react-native-ota-server)
- [Server README](https://github.com/arjunnarangali/react-native-ota-server#readme)
