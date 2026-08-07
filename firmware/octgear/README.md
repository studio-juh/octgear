# OctGear Firmware

RP2040 Arduino coreとAdafruit TinyUSBを使う、現行8キー + rotary encoder版firmwareです。Sketch本体は[`octgear/`](octgear/)にあります。

## Responsibilities

- ダイオードなし2 x 4 key matrixとencoder A/B/SWのscan
- 8 layers x 11 controlsのkeymap解決
- Layer 1-7の有効状態を保存し、layer遷移から無効layerを除外。既定有効はLayer 0/1
- 通常のactive layerを最後の切り替えから10秒後に保存し、次回起動時に復元。Momentary Layerは保存対象外
- LayerごとのRGB LED色を保存。`0,0,0`で消灯
- LEDテープのphysical pixel順を標準／反転で保存
- Layer色の全灯表示と、4灯パターンによる8 Layer表示を切り替えて保存
- 打鍵アニメーションを無効／波紋／フラッシュ／スパークから選択して保存
- Layer表示と独立した打鍵アニメーション輝度上限を保存
- Keyboard / Consumer Control HID output
- Next Layerの単押しで次へ進み、同じcontrolのダブルタップで開始位置からPrevious Layerを実行するTap Dance。判定時間は50-1000 msで設定・保存可能（既定250 ms）
- WebHID vendor reportによる設定とDiagnostics
- K1 + K5 + Encoder SWの1秒長押しによる、次の1起動だけのWebUSB Remapper案内
- 3-sector Flash journalへのkeymap保存
- UF2 bootloaderへのreboot
- Key 4 boot時のread-only README drive / Serial rescue。全設定の表示、キーマップとdevice設定の変更、既定値への初期化に対応
- GPIO 14の外付けWS2812Bへ、USB未mount時は4 pixelsを流れるカラーホイール、PCのUSBサスペンド中は消灯、Remapper接続時は1秒間のカラーホイール、その後は4 pixels同色のlayer状態、rescue時は緑を表示。Layer色は200 msで滑らかに遷移し、通常打鍵は白色、Layer変更を伴うcontrolは切り替え後のLayer色で選択中のアニメーションを重ねる。対応boardでは内蔵WS2812にもlayer色をミラーする。Layer表示と打鍵アニメーションの輝度上限を個別に`0-128`で保存

通常時は低遅延scanを行い、Remapper / Diagnostics heartbeat中は通常HID出力を抑止します。Rescue boot中も通常HID出力は行いません。

Key matrixにはダイオードがありません。複数Row間で2列以上が同時に導通する曖昧な状態では、scannerは直前の安定したMatrix状態を維持し、phantom keyを出力しません。

### Layer Display Mapping

外付け4灯の通常Layer表示は、全灯と4灯パターンをRemapperから切り替えられます。4灯パターンの`1`は現在Layerの設定色、`0`は消灯です。LEDテープ方向を反転した場合も、表は論理上のLED 1（盤面左端）からLED 4（右端）の順を示します。内蔵LEDは1灯のため、どちらのモードでもLayer色を表示します。

| Firmware Layer | 操作上の順番 | LED 1 → LED 4 |
| ---: | ---: | --- |
| 0 | 1 | `1000` |
| 1 | 2 | `0100` |
| 2 | 3 | `0010` |
| 3 | 4 | `0001` |
| 4 | 5 | `0111` |
| 5 | 6 | `1011` |
| 6 | 7 | `1101` |
| 7 | 8 | `1110` |

### Key Animation Mapping

打鍵アニメーションは物理controlの横位置を4個の側面LEDへ投影します。上下段の同じ列は同じLEDを中心にし、Encoderの回転とswitchは右端のLED 4をK4 / K8と共有します。

| Controls | Animation center |
| --- | --- |
| K1 / K5 | LED 1（pixel 0） |
| K2 / K6 | LED 2（pixel 1） |
| K3 / K7 | LED 3（pixel 2） |
| K4 / K8 / Encoder CCW / CW / SW | LED 4（pixel 3、右端） |

選べる効果は次の4種類です。通常controlは白色、Next / Previous / Momentary Layerなど実際にLayer変更を起こしたcontrolは切り替え後のLayer色をハイライト色として使います。同時打鍵は最大8個まで色と強度を合成します。内蔵LEDは打鍵アニメーションを表示せずLayer色を維持します。

Layer色はLED輝度上限（既定`32`）、白色または切り替え後のLayer色のハイライトはアニメーション輝度上限（既定`96`）で個別にscaleしてから合成します。アニメーション上限を高くしても光っていないpixelはLayer側の明るさを維持します。

| Effect | Behavior |
| --- | --- |
| 無効 | 打鍵時もLayer色を維持 |
| 波紋 | ハイライト色の波頭が中心から45 msずつ左右へ進み、各LEDで160 msかけてLayer色へ戻る |
| フラッシュ | 4灯すべてが同時にハイライト色で光り、180 msでLayer色へ戻る |
| スパーク | 押した位置を最も強く、周囲を弱くハイライト色で光らせ、240 msでLayer色へ戻る |

## Build

Repository rootから実行します。

```sh
pnpm firmware:build
pnpm firmware:web
```

既定FQBNは`rp2040:rp2040:waveshare_rp2040_zero`、board optionsは`usbstack=tinyusb,freq=125`です。`pnpm firmware:web`は配信用の次のassetsも更新します。

```text
apps/web/public/firmware/octgear.uf2
apps/web/public/firmware/RESCUE.CMD
apps/web/src/products/octgear/generatedFirmwareMetadata.ts
```

Build scriptsはhardware configとrescue command assetをcompile前に再生成します。環境構築、identity override、検証手順は[`docs/development.md`](../../docs/development.md)を参照してください。

## Configuration

| Configuration | Source |
| --- | --- |
| Matrix GPIO、control / layer count、encoder tuning、default layer colors、Layer表示モード既定値、Layer / 打鍵アニメーション輝度既定値 / 上限、打鍵アニメーション既定値、外付けWS2812B GPIO / pixel count / 既定方向 | `hardware/octgear/profile.json` |
| debounce、scan sleep、Tap Dance判定時間の既定値 / 範囲、LED brightness、heartbeat、WebUSB案内shortcut / device revision、rescue toggle | `octgear/config.h` |
| USB identity defaults | `scripts/compile-firmware.sh`, `scripts/build-web-firmware.sh` |
| HID command IDs / status | `octgear/hid_reports.h` |

Generated headerは直接編集しません。Hardware profile変更後は`pnpm hardware:generate`を実行します。

## Default Keymap

未初期化の保存領域と`ResetConfiguration`では、次のcompile済み既定値を使用します。

| Control | Layer 0 | Layer 1 |
| --- | --- | --- |
| K1 | 次レイヤー | 次レイヤー |
| K2 | Mute | Q |
| K3 | Volume Down | W |
| K4 | Volume Up | E |
| K5 | Momentary Layer 1 | None |
| K6 | Previous Track | A |
| K7 | Play / Pause | S |
| K8 | Next Track | D |
| Encoder CCW | Volume Down | None |
| Encoder CW | Volume Up | None |
| Encoder SW | None | None |

Layer 2〜7は全controlが`None`です。既定で有効なのはLayer 0/1だけで、Layer 0は無効化できません。Encoder方向の既定値はhardware profileの`encoder.reversed`、LEDテープ方向の既定値は`externalRgbLedReversed`で、現行構成はいずれも標準です。Layer表示の既定値は`statusLedLayerDisplayMode`の全灯、打鍵アニメーションの既定値は`statusLedKeyAnimation`の波紋、アニメーション輝度上限は`statusKeyAnimationBrightness.default`の`96`、Tap Dance判定時間は`250 ms`です。Version 6で保存した設定はFirmware更新だけでは変更されず、初期化したときにこれらの既定値が適用されます。

## Storage

Keymap、通常のactive layer、layer enable mask、layer RGB colors、各LED輝度上限、Encoder方向、LEDテープ方向、Layer表示モード、打鍵アニメーション、Tap Dance判定時間はexternal SPI Flash上の独立した3つの4KB sectorへ循環保存します。各slotはgenerationとCRCを持ち、起動時はCRCが正常な最新generationを読み込みます。保存中に電源が切れて新slotが不完全になっても、直前の正常slotへfallbackします。

現行storage versionは`6`です。Tap Dance判定時間を16-bit値として追加しています。旧versionのslotは移行せず、Version 6 Firmwareでの初回起動時にcompile済み既定値へ初期化します。

標準buildはArduino coreがfilesystem用として扱う64KBをFirmware領域から分離して予約します。Filesystemはmountせず、その先頭12KBをjournalに直接使用します。設定変更時はRAM上の設定全体を次slotへ書き、1回の保存で消去するsectorを1つに限定します。通常Layerの切り替えは10秒間変化がなければ保存し、連続操作を1回の書き込みへまとめます。この間に別の設定を保存した場合は、その書き込みへ現在Layerも含めます。保存形式が無効または未初期化ならcompile済みdefaultで初期化します。

Diagnostics / Serial rescueのstorage self-testはtest patternのwrite、readback、元keymapのrestoreを行います。Test patternのslotは通常journalと異なるmagicを持ち、復元前に電源が切れても通常起動では読み込みません。実Flashへ書くため、必要な検査時だけ実行します。

## Further Reading

- [Firmware module map](octgear/README.md)
- [Architecture](../../docs/architecture.md)
- [HID report protocol](../../docs/hid-report.md)
- [Update, diagnostics, and rescue](../../docs/operations.md)
