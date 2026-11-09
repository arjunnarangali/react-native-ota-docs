# Android setup

Configure the SDK once in the host application's `Application` class. Initialize it in `onCreate()` before calling `loadReactNative()`, and give React Native's host configuration the selected bundle path.

The SDK's own `BuildConfig.DEBUG` is not the consumer app's build type. Pass the host app's debug state through `OtaSdkConfig`.

## Application configuration

```kotlin
import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.otasdk.OtaSdkConfig
import com.otasdk.OtaSdkUpdates

class MainApplication : Application(), ReactApplication {
  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList = PackageList(this).packages,
      jsBundleFilePath = OtaSdkUpdates.bundlePathForReactHost(),
    )
  }

  override fun onCreate() {
    super.onCreate()
    val publicKeyPem = resources.openRawResource(R.raw.ota_publisher_public).use { it.readBytes() }
    OtaSdkUpdates.initialize(
      this,
      OtaSdkConfig(
        serverUrl = BuildConfig.OTA_SERVER_URL,
        runtimeVersion = BuildConfig.OTA_RUNTIME_VERSION,
        channel = BuildConfig.OTA_CHANNEL,
        baseVersion = BuildConfig.OTA_BASE_VERSION,
        publicKeyPem = publicKeyPem,
        allowInsecureHttp = BuildConfig.OTA_ALLOW_INSECURE_HTTP,
        isDebugBuild = BuildConfig.DEBUG,
        appId = BuildConfig.APPLICATION_ID,
      ),
    )
    OtaSdkUpdates.beginProcess()
    loadReactNative(this)
  }
}
```

Call `beginProcess()` before `loadReactNative()` so the selected bundle is ready when the JavaScript runtime starts. `bundlePathForReactHost()` returns `null` when the app should use the APK bundle.

## Public verification key

The `ota_publisher_public` Android raw resource contains only the verification key. Put it in `src/main/res/raw/` when all variants share one key. Put it in a flavor-specific source set such as `src/development/res/raw/` when variants use different keys.

Never package the publisher's signing private key in the app or the SDK.

## Flavor-specific configuration

Define each environment as an Android `productFlavor` and provide the SDK values as flavor-specific `BuildConfig` fields. The flavor controls the app ID, runtime version, channel, server URL, base version, public verification key, and build-type debug state.

Use distinct runtime versions and channels when environments must receive separate updates.

```groovy
android {
    flavorDimensions "environment"
    productFlavors {
        development {
            dimension "environment"
            applicationIdSuffix ".dev"
            buildConfigField "String", "OTA_SERVER_URL", '"https://dev.example.com"'
            buildConfigField "String", "OTA_RUNTIME_VERSION", '"rn-0.88-android-dev"'
            buildConfigField "String", "OTA_CHANNEL", '"development"'
            buildConfigField "int", "OTA_BASE_VERSION", "0"
            buildConfigField "boolean", "OTA_ALLOW_INSECURE_HTTP", "false"
        }
        staging {
            dimension "environment"
            applicationIdSuffix ".staging"
            buildConfigField "String", "OTA_SERVER_URL", '"https://staging.example.com"'
            buildConfigField "String", "OTA_RUNTIME_VERSION", '"rn-0.88-android-staging"'
            buildConfigField "String", "OTA_CHANNEL", '"staging"'
            buildConfigField "int", "OTA_BASE_VERSION", "0"
            buildConfigField "boolean", "OTA_ALLOW_INSECURE_HTTP", "false"
        }
    }
}
```

The `OTA_*` field names and types must match those read in `MainApplication.kt`.

Set `react.debuggableVariants` for every flavor's debug variants, such as `developmentDebug` and `stagingDebug`, so React Native uses Metro for those builds. `BuildConfig.DEBUG` comes from the selected build type. `BuildConfig.APPLICATION_ID` includes any flavor suffix.

## Transport security

Use HTTPS for staging and production, with `allowInsecureHttp = false`.

Local development may opt in to HTTP only when the URL host is a local development host supported by the SDK: `localhost`, `127.0.0.1`, `::1`, or the Android emulator host `10.0.2.2`. The setting is not a general HTTP override.

OTA download URLs must also match the configured server origin.

## Autolinking

The SDK autolinks a single `OtaSdkPackage` that registers the `OTAUpdates` TurboModule. Do not add another manual package registration in the host app.

For the native startup API, see [Native startup API](/guide/native-startup).
