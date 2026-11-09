# Native startup API

The host app uses the native startup API to configure the SDK, select a bundle before React Native starts, and report the selected bundle to React Native.

## Android

`OtaSdkUpdates` exposes the Android startup and host integration API.

| Method | Purpose |
| --- | --- |
| `initialize(context, config)` | Configures the manager once before use. |
| `beginProcess()` | Selects or rolls back the startup bundle before React Native starts. |
| `bundlePathForReactHost()` | Returns the selected bundle path, or `null` for the APK bundle. |
| `status()` | Returns the current activation state. |
| `checkForUpdate()` | Checks the server and stages a verified release. |
| `markHealthy()` | Commits a pending release. |
| `closeAppForUpdate(activity)` | Closes the app when a staged release is ready. |

## iOS

`OtaSdkUpdates` exposes the iOS startup and host integration API.

| Method | Purpose |
| --- | --- |
| `initialize(serverUrl:runtimeVersion:channel:baseVersion:publicKeyPem:isDebugBuild:appId:allowLocalHttp:)` | Configures the SDK before React Native starts. |
| `beginProcess()` | Selects or rolls back the startup bundle. |
| `bundleURL()` | Returns the selected bundle URL, or `nil` for the embedded bundle. |
| `status()` | Returns the current activation state. |
| `checkForUpdate(completion:)` | Checks the server and stages a verified release. |
| `markUpdateSuccessful(completion:)` | Commits a pending release. |
| `hasPendingUpdate()` | Reports whether a staged release is waiting for a restart. |

## Autolinking

The SDK autolinks one `OtaSdkPackage` that contains the sample `OtaSdk` TurboModule and the OTA `OTAUpdates` TurboModule. Do not register another package manually.

The JavaScript API calls the same native implementation. See [JavaScript API](/guide/javascript-api).
