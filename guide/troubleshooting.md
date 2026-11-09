# Troubleshooting

## OTA reports disabled

`getStatus()` returns `enabled: false` and `status: "debug_build"` in debug builds. Debug builds use Metro for the JavaScript bundle, so OTA activation is disabled.

Build a release variant with the host app's debug state set to `false` and test again.

## No update is found

Check these values in the app and on the server:

- The app ID matches the release app ID.
- The runtime version matches the release runtime version.
- The channel matches the release channel.
- The platform is correct.
- The release version is greater than the current version for an update, or lower for a rollback.
- The installation has not already failed this release.

If the app reported a failed release, the server excludes that release ID from the next check.

## An update is staged but not active

A staged release becomes active on the next cold start. On Android, `closeAppToApplyUpdate()` closes the app when a verified update is staged. On iOS, the app cannot terminate itself. Ask the user to leave and reopen the app.

Call `markUpdateSuccessful()` after the first usable React screen mounts. Without that call, the next process launch treats the release as unconfirmed and rolls it back.

## The app rolled back after an update

The app did not call `markUpdateSuccessful()` before the next process launch, or the staged bundle failed validation at startup. The client restores the previous confirmed bundle or the embedded bundle.

Check that the app calls `markUpdateSuccessful()` after the first screen mounts. Check that the staged files are present and valid. Check the failed release ID reported by the next update check.

## Runtime version mismatch

Bundles are tied to the runtime version. A native build with a different runtime version invalidates stored bundles built for the old runtime. This is expected. Build and publish a release for the new runtime version.

## HTTPS or origin errors

Release downloads must use HTTPS and match the configured server origin. Check the server URL, the download URL returned by the server, and the `allowInsecureHttp` or `allowLocalHttp` setting.

Local HTTP is limited to `localhost`, `127.0.0.1`, `::1`, or the Android emulator host `10.0.2.2`. Do not use the local HTTP setting for staging or production.

## Android debug variants use Metro

Set `react.debuggableVariants` for every flavor's debug variants, such as `developmentDebug` and `stagingDebug`. Without those entries, React Native may not use Metro for the debug build.

## Autolinking fails

Rebuild the native app after installing the package. Run `pod install` in the iOS project. Do not register another `OtaSdkPackage` manually. The SDK autolinks one package that contains both TurboModules.

## Get help

Open an issue in the [client repository](https://github.com/arjunnarangali/react-native-ota-client/issues). Include the platform, React Native version, runtime version, channel, and the status object from `getStatus()`.
