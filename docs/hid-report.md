# HID Report Protocol

WebHID版Remapper / Diagnosticsで使う固定長の設定用reportです。この文書はfirmwareの`hid_reports.h` / `hid_device.cpp`とWebの`hidProtocol.ts` / `deviceCommands.ts`の境界仕様です。

通常のキーボード/Consumer Control HID reportとは別に、vendor-defined reportを1つ持ちます。

## Report

| Field | Value |
| --- | --- |
| Report ID | `3` |
| Direction | Web -> device: Output report |
| Direction | Device -> Web: Input report |
| Size | `32 bytes` |

WebHIDの `sendReport(reportId, data)` では、`reportId` は引数で渡すため、`data[0]` はcommandです。

Multi-byte integerはlittle-endianです。未使用byteは送信側で`0`にします。Webは現行Firmwareが定義するpayload lengthを厳密に検証し、過去の短いresponseや未知のenum値は受け入れません。

## Request Layout

```text
byte 0      command
byte 1..31  command payload
```

## Response Layout

```text
byte 0      command
byte 1      status
byte 2      payload length
byte 3..31  response payload
```

## Status

| Value | Name | Meaning |
| ---: | --- | --- |
| `0x00` | `Ok` | Success |
| `0x01` | `InvalidLength` | Request payload is too short |
| `0x02` | `OutOfRange` | Layer or key index is invalid |
| `0x03` | `StorageError` | Device could not persist the updated assignment |
| `0x04` | `Unsupported` | Command is not supported on this MCU/firmware build |
| `0xff` | `UnknownCommand` | Command is not supported |

## Commands

| Value | Name | Request payload | Response payload |
| ---: | --- | --- | --- |
| `0x01` | `GetState` | none | `activeLayer, layerCount, keyCount, matrixRowCount, enabledLayerMask, encoderReversed, statusLedBrightness, statusLedReversed, statusKeyAnimation, statusKeyAnimationBrightness, statusLayerDisplayMode, layerTapDanceTermMs[2]` |
| `0x02` | `SetLayer` | `layer` | `layer` |
| `0x03` | `GetKey` | `layer, keyIndex` | key assignment payload |
| `0x04` | `SetKey` | key assignment payload | `layer, keyIndex` |
| `0x05` | `EnterBootloader` | none | none, then reboot to UF2 bootloader |
| `0x06` | `RemapperHeartbeat` | none | no response |
| `0x07` | `KeyEvent` | not supported | `layer, keyIndex, pressed` |
| `0x08` | `DiagnosticReport` | `0x43, 0x59, 0x42, 0x38` | `0x52, 0x50, 0x54, version, echoed request bytes[4]` |
| `0x09` | `DiagnosticStorage` | none | `ok, layerCount, keyCount` |
| `0x0a` | `SetLayerEnabled` | `layer, enabled` | `layer, enabled, activeLayer, enabledLayerMask` |
| `0x0b` | `GetLayerColor` | `layer` | `layer, red, green, blue` |
| `0x0c` | `SetLayerColor` | `layer, red, green, blue` | `layer, red, green, blue` |
| `0x0d` | `PreviewLayerColor` | `layer, red, green, blue` or none | previewed values or none |
| `0x0e` | `ResetConfiguration` | none | `activeLayer, enabledLayerMask` |
| `0x0f` | `SetEncoderReversed` | `reversed` | `reversed` |
| `0x10` | `SetStatusLedBrightness` | `brightness` | `brightness` |
| `0x11` | `SetStatusLedReversed` | `reversed` | `reversed` |
| `0x12` | `SetStatusKeyAnimation` | `animation` | `animation` |
| `0x13` | `SetStatusKeyAnimationBrightness` | `brightness` | `brightness` |
| `0x14` | `SetStatusLayerDisplayMode` | `mode` | `mode` |
| `0x15` | `SetLayerTapDanceTerm` | `termMs[2]` | `termMs[2]` |

通常の同期commandは、requestと同じcommandをbyte 0に持つresponseを1つ返します。`RemapperHeartbeat`と`EnterBootloader`は例外です。Heartbeatは応答を返さず、bootloader commandはdeviceが再起動するためresponseを待ちません。

`KeyEvent` is an asynchronous device-to-Web input report. The firmware emits it when a physical key, encoder rotation, or encoder switch press is detected while the remapper heartbeat is active. Remapper uses `keyIndex` to select the matching control and ignores `layer`, keeping the layer currently shown in the UI.

`RemapperHeartbeat` is sent periodically by Remapper and Diagnostics. While the heartbeat is active, normal keyboard / consumer output is suppressed by firmware.

`DiagnosticReport` is a synchronous send/receive self-test for Diagnostics. The Web UI sends a fixed nonce and verifies that the firmware returns the `RPT` signature plus the same nonce.

`DiagnosticStorage` writes a test pattern through the same three-slot Flash journal used by normal remapping, reads it back, verifies it, and restores the original keymap. Run it only when needed because the test and restore each consume a journal write.

`enabledLayerMask`はbit indexをlayer indexとして使います。Bit 0は常に`1`です。`SetLayerEnabled`でLayer 0を無効にするrequestは`OutOfRange`になります。Active layerを無効にするとfirmwareはLayer 0へ戻ります。`SetLayer`とMomentary Layerは無効layerへ遷移せず、Layer Cycleは無効layerをskipします。

`SetLayer`、Layer Cycle、Previous Layer、Serial rescueで変更した通常のactive layerは、最後の切り替えから10秒後にFlashへ保存され、次回起動時に復元されます。Momentary Layerは保存対象外です。

Layer colorの各channelは`0-255`です。RGBがすべて`0`の場合、通常modeのLayer LEDを消灯します。

`PreviewLayerColor`はFlashやRAM上のlayer設定を変更せず、Remapper接続中のLED表示だけを一時的に上書きします。Payloadなしのrequest、`SetLayer`、または成功した`SetLayerColor`でpreviewを解除します。Heartbeatが途切れた場合も通常のactive layer表示へ戻ります。

`encoderReversed`と`reversed`は`0`がprofileの配線どおり、`1`がA/Bの回転eventを反転した状態です。`SetEncoderReversed`は変更をFlashへ即座に保存します。

`statusLedBrightness`と`SetStatusLedBrightness`の`brightness`は`0-128`です。`0`は消灯、既定値は`32`です。変更はFlashへ即座に保存し、通常のLayer表示、カラーホイール、rescue表示、内蔵mirrorへ適用します。

`statusLedReversed`と`SetStatusLedReversed`の`reversed`は、`0`がLED 1をphysical pixel 0へ対応させる標準順、`1`がLED 1を最後のphysical pixelへ対応させる反転順です。変更はFlashへ即座に保存し、USB未mount時の流れるカラーホイールと位置依存の打鍵アニメーションへ適用します。

`statusKeyAnimation`と`SetStatusKeyAnimation`の`animation`は、`0`が波紋、`1`が無効、`2`が全灯フラッシュ、`3`が押下位置中心のスパークです。変更はFlashへ即座に保存します。

`statusKeyAnimationBrightness`と`SetStatusKeyAnimationBrightness`の`brightness`は`0-128`です。既定値は`96`で、通常打鍵の白色ハイライトとLayer変更時の切り替え後Layer色ハイライトに適用します。Layer側の`statusLedBrightness`より高く設定すると、光っていないpixelの明るさを変えずにコントラストを強められます。`0`ではアニメーション効果を選択したままハイライトだけを消せます。変更はFlashへ即座に保存します。

`statusLayerDisplayMode`と`SetStatusLayerDisplayMode`の`mode`は、`0`が全灯、`1`が4灯パターンです。4灯パターンはFirmware Layer 0-7をLED 1から4の順に`1000`、`0100`、`0010`、`0001`、`0111`、`1011`、`1101`、`1110`で表示します。`1`のpixelには現在Layerの色を使います。変更はFlashへ即座に保存します。

`layerTapDanceTermMs`と`SetLayerTapDanceTerm`の`termMs`はlittle-endianの16-bit値です。設定範囲は`50-1000 ms`、既定値は`250 ms`です。Next Layerの単押し確定と同じcontrolのダブルタップ判定の両方に使い、変更はFlashへ即座に保存します。Storage version 6でfieldを追加しており、旧storage versionは移行せず既定設定へ初期化します。

`ResetConfiguration`は全assignment、layer有効mask、layer RGB色、LED輝度上限、Encoder方向、LEDテープ方向、Layer表示モード、打鍵アニメーション、アニメーション輝度上限、Tap Dance判定時間をcompile済みの既定値へ戻し、保存領域全体へ書き込みます。Active layerと次回起動LayerはLayer 0へ戻ります。

## Session Lifecycle

Webは接続直後に`RemapperHeartbeat`を送り、`GetState`、全`GetKey`の順にdevice stateを読みます。その後は300 ms間隔でheartbeatを送ります。Firmwareは最後のheartbeatから3000 ms以内をremapper activeとみなし、その間は通常のKeyboard / Consumer outputを抑止して`KeyEvent`を有効にします。

Web transportは同期requestごとに同じcommand byteのresponseを待ち、既定1000 msでtimeoutします。同じcommandを含む複数requestを並列化するとresponseを識別できないため、commandは逐次送信します。現在のprotocolにtransaction IDはありません。

Physical disconnectまたはheartbeat failure時、WebはHID deviceをcloseして未接続状態へ戻ります。Heartbeatが止まったfirmwareはtimeout後に通常HID outputへ戻ります。

## Key Indexes

Current firmware reports `keyCount = 11`.

| Index | Control |
| ---: | --- |
| `0..7` | Physical keys 1-8 |
| `8` | Encoder CCW rotation |
| `9` | Encoder CW rotation |
| `10` | Encoder SW |

## Key Assignment Payload

`GetKey` response and `SetKey` request use the same assignment shape.

```text
byte 0      layer
byte 1      keyIndex
byte 2      kind
byte 3      modifier
byte 4..9   keyboard keycodes[6]
byte 10     consumer usage low byte
byte 11     consumer usage high byte
byte 12     target layer
```

`target layer` is used when `kind` is `MomentaryLayer`; otherwise it is `0`.

Keyboard assignmentはmodifier bitmapと6-key rollover slotsを使用します。Consumer usageとtarget layerはkindに応じてnormalizeされ、使用しないfieldは`0`です。

`kind` values:

| Value | Name |
| ---: | --- |
| `0` | None |
| `1` | Keyboard |
| `2` | Consumer |
| `3` | LayerCycle |
| `4` | MomentaryLayer |
| `5` | LayerPrevious |

`LayerCycle`は有効layerを次方向へ、`LayerPrevious`は前方向へ循環します。どちらもLayer 0からwrapします。`LayerCycle`の最初の押下は設定されたTap Dance判定時間だけ保留され、単押しなら次方向へ進みます。同じ物理controlを期限内に再度押すと保留した遷移を破棄し、開始位置から`LayerPrevious`相当として処理します。assignment kindとwire formatは変わりません。

## Current Contract

- Webは13-byteの`GetState` responseと、この文書にある全commandを実装した現行Firmwareだけを対象にします。
- Webは`GetState`が返す`layerCount`、`keyCount`、`enabledLayerMask`をdeviceの書込可能範囲とlayer状態として使います。
- 未知のassignment kind、LED mode、payload lengthはprotocol errorとして扱います。FirmwareとWebのencode / decode / validationは常に同時に更新します。
- Report sizeまたはReport IDを変更する場合はTinyUSB descriptor、firmware buffer、Web codecを同時に変更します。
- Storage formatはwire protocolとは別契約ですが、頒布前は現行versionだけを読み、旧version migrationは提供しません。

## Implementation References

| Side | Files |
| --- | --- |
| Firmware enums / descriptor | `firmware/octgear/octgear/hid_reports.h`, `hid_report_descriptor.cpp` |
| Firmware command handling | `firmware/octgear/octgear/hid_device.cpp` |
| Web report codec | `apps/web/src/features/device/hidProtocol.ts` |
| Web command API | `apps/web/src/features/device/deviceCommands.ts` |
| Web transport / timeout | `apps/web/src/features/device/webHidTransport.ts` |
