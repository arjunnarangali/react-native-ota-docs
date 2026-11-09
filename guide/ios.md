# iOS setup

Configure the SDK in the host app before creating the React Native factory or runtime. `beginProcess()` must run before startup bundle selection.

In `RCTDefaultReactNativeFactoryDelegate.bundleURL()`, keep Metro in Debug and use the OTA URL before the embedded bundle in Release.

```swift
import OtaSdk

// In AppDelegate, before the SceneDelegate starts React Native:
OtaSdkUpdates.initialize(
  serverUrl: serverURL,
  runtimeVersion: runtimeVersion,
  channel: channel,
  baseVersion: NSNumber(value: baseVersion),
  publicKeyPem: publicKeyPEM,
  isDebugBuild: isDebugBuild,
  appId: appId,
  allowLocalHttp: allowLocalHTTP
)
OtaSdkUpdates.beginProcess()

// In the React Native factory delegate:
override func bundleURL() -> URL? {
  #if DEBUG
  RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
  #else
  OtaSdkUpdates.bundleURL() ?? Bundle.main.url(forResource: "main", withExtension: "jsbundle")
  #endif
}
```

Provide the configuration from host-owned build settings and bundle only the public verification key. Use HTTPS for release builds.

`allowLocalHttp` is for explicit local development only and is restricted to `localhost`, `127.0.0.1`, or `::1`. OTA downloads must match the configured server origin.

## Activation behavior

`closeAppToApplyUpdate()` reports whether an update is staged. iOS apps cannot terminate themselves, so the app must ask the user to leave and reopen it to load the staged bundle.

Call `markUpdateSuccessful()` after the first usable React screen mounts. The call commits the pending release and clears the rollback state.

## Next steps

- [Native startup API](/guide/native-startup)
- [Troubleshooting](/guide/troubleshooting)
