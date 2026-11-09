# JavaScript API

Import the OTA client from the package root.

```tsx
import { OTAUpdates, type OtaUpdateStatus } from 'react-native-ota-client';

const status: OtaUpdateStatus = await OTAUpdates.getStatus();
const result = await OTAUpdates.checkForUpdate();
await OTAUpdates.markUpdateSuccessful();
await OTAUpdates.closeAppToApplyUpdate();
```

## Methods

| Method | Returns | Behavior |
| --- | --- | --- |
| `getStatus()` | `Promise<OtaUpdateStatus>` | Returns the current activation state without contacting the server. |
| `checkForUpdate()` | `Promise<OtaUpdateStatus>` | Contacts the OTA server, verifies a release when one is available, and stages it. |
| `markUpdateSuccessful()` | `Promise<OtaUpdateStatus>` | Commits a pending release after the first React screen mounts. |
| `closeAppToApplyUpdate()` | `Promise<boolean>` | Returns whether a verified update is staged and waiting for a restart. On Android, the app closes. On iOS, the app cannot terminate itself. |

## Status shape

| Field | Type | Meaning |
| --- | --- | --- |
| `enabled` | `boolean` | Whether OTA activation is enabled. Debug builds report `false`. |
| `status` | `string` | Current state reported by the native implementation. Values include `ready`, `restart_required`, `debug_build`, and `not_initialized`. |
| `message` | `string` | Human-readable state message. |
| `runtimeVersion` | `string` | Runtime version configured by the host app. |
| `channel` | `string` | Channel configured by the host app. |
| `currentVersion` | `number` | Active release version. |
| `pendingVersion` | `number \| null` | Staged release version, or `null` when no update is staged. |
| `pendingRestart` | `boolean` | Whether a staged release needs an app restart. |
| `updateAvailable` | `boolean` | Whether the last check found an update. |
| `action` | `string \| null` | Action reported by the server for the last check, such as `update` or `rollback`. |

## Call order

Call `markUpdateSuccessful()` after the first React screen has mounted. The call commits the pending release and clears the rollback state.

`closeAppToApplyUpdate()` only succeeds when a verified update is staged and waiting for a restart. Debug applications report OTA activation as disabled because Metro supplies the JavaScript bundle.

On iOS, apps cannot terminate themselves. When `closeAppToApplyUpdate()` returns `true`, ask the user to leave and reopen the app to load the staged bundle.

## Sample module

The package also keeps the generated-template `multiply()` example. It is not part of the OTA API.
