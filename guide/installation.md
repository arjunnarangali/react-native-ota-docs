# Installation

## Install the package

```sh
npm install react-native-ota-client
```

React Native autolinking discovers the native package on Android and iOS. Rebuild the native app after installation. Metro alone cannot add native code.

For local development, the example workspace in the SDK repository consumes the SDK source directly. In a host app, install the package from npm.

## Verify the install

1. Rebuild the Android app and confirm that autolinking registers `com.otasdk.OtaSdkPackage`.
2. Run `pod install` in the iOS project and confirm that the `OtaSdk` pod is installed.
3. Import the JavaScript API and call `OTAUpdates.getStatus()` from a release build.

## Next steps

- [Android setup](/guide/android)
- [iOS setup](/guide/ios)
- [JavaScript API](/guide/javascript-api)
