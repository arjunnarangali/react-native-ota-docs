# OTA server

`react-native-ota-server` is a self-hosted FastAPI service for signed Android and iOS OTA releases. It stores release artifacts and selects compatible releases by platform, app ID, runtime version, and channel. It applies rollout policy and supports operator rollback.

The service distributes signed JavaScript and bundled assets only. It does not update native code. The installed app verifies the signed manifest and artifact before activation.

The API contract is available at `/openapi.json` and `/docs`.

The service source is maintained in the [`react-native-ota-server` repository](https://github.com/arjunnarangali/react-native-ota-server).

## Service topology

The publisher signs releases outside the API host. The server receives the signed package and public verification key, then serves compatible releases to installed apps.

<img class="ota-diagram" src="/server-topology.svg" alt="Publisher tools send signed releases to the FastAPI server. The React Native app checks and downloads releases from the server, then verifies them with its embedded public key." />

## What it provides

- A check endpoint for app ID, runtime version, channel, current version, installation ID, and failed release ID.
- Signed release manifests with platform, app, runtime, version, artifact hash, size, and creation time, plus update responses with channel, rollout, action, and download URL.
- Immutable artifact storage and download URLs.
- Release uploads, channels, rollout percentages, disable, and rollback.
- Platform isolation between Android and iOS releases.
- Health endpoints for liveness and database readiness.

## Requirements

- Python 3.12 or newer.
- Docker Compose for PostgreSQL and production deployment.
- The public verification key for the release environment.
- A host React Native app with the OTA client installed.

Never place a publisher private key in the server repository, the API host, or the docs.

## Start here

- [Local setup](/server/local-setup)
- [Configuration](/server/configuration)
- [Release workflow](/server/releases)
- [Tools reference](/server/tools)
- [Operations](/server/operations)
- [Production deployment](/server/deployment)
- [API reference](/server/api)
- [Troubleshooting](/server/troubleshooting)

## Client integration

Install and integrate the client from the separate [`react-native-ota-client`](https://github.com/arjunnarangali/react-native-ota-client) repository.

The client sends platform, app ID, runtime version, channel, current OTA version, stable installation ID, and optional failed release ID to the update check endpoint. The server returns a signed manifest, signature, channel, rollout percentage, action (`update` or `rollback`), and bundle URL. The client verifies the signature and artifact hashes before activation.

Android packages use `index.android.bundle`. iOS packages use `main.jsbundle`. The server isolates releases by platform, app ID, runtime version, and channel.

See the [API reference](/server/api) for the request and response contract.
