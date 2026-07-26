# OctGear Firmware

RP2040 Arduino coreとAdafruit TinyUSBを使う、現行8キー + rotary encoder版firmwareです。Sketch本体は[`octgear/`](octgear/)にあります。

## Responsibilities

- ダイオードなし2 x 4 key matrixとencoder A/B/SWのscan
- 8 layers x 11 controlsのkeymap解決
- Layer 1-7の有効状態を保存し、layer遷移から無効layerを除外。既定有効はLayer 0/1
- 通常のactive layerを最後の切り替えから10秒後に保存し、次回起動時に復元。Momentary Layerは保存対象外
- LayerごとのRGB LED色を保存。`0,0,0`で消灯
- LEDテープのphysical pixel順を標準／反転で保存
- 打鍵アニメーションを無効／波紋／フラッシュ／スパークから選択して保存
- Layer表示と独立した打鍵アニメーション輝度上限を保存
- Keyboard / Consumer Control HID output
- WebHID vendor reportによる設定とDiagnostics
- 3-sector Flash journalへのkeymap保存
- UF2 bootloaderへのreboot
- Key 5 boot時のread-only README drive / Serial rescue
- GPIO 14の外付けWS2812Bへ、USB未mount時は5 pixelsを流れるカラーホイール、PCのUSBサスペンド中は消灯、Remapper接続時は1秒間のカラーホイール、その後は5 pixels同色のlayer状態、rescue時は緑を表示。Layer色は200 msで滑らかに遷移し、打鍵時は選択した白色アニメーションをLayer色へ重ねる。対応boardでは内蔵WS2812にもlayer色をミラーする。Layer表示と打鍵アニメーションの輝度上限を個別に`0-128`で保存

通常時は低遅延scanを行い、Remapper / Diagnostics heartbeat中は通常HID出力を抑止します。Rescue boot中も通常HID出力は行いません。

Key matrixにはダイオードがありません。複数Row間で2列以上が同時に導通する曖昧な状態では、scannerは直前の安定したMatrix状態を維持し、phantom keyを出力しません。

### Key Animation Mapping

打鍵アニメーションは物理controlの横位置を5個の側面LEDへ投影します。上下段の同じ列は同じLEDを中心にし、Encoderの回転とswitchは右端を中心にします。

| Controls | Animation center |
| --- | --- |
| K1 / K5 | LED 1（pixel 0） |
| K2 / K6 | LED 2（pixel 1） |
| K3 / K7 | LED 3（pixel 2） |
| K4 / K8 | LED 4（pixel 3） |
| Encoder CCW / CW / SW | LED 5（pixel 4） |

選べる効果は次の4種類です。白色を現在のLayer色へ合成し、同時打鍵は最大8個まで重ねます。内蔵LEDは打鍵アニメーションを表示せずLayer色を維持します。

Layer色はLED輝度上限（既定`32`）、白色ハイライトはアニメーション輝度上限（既定`96`）で個別にscaleしてから合成します。アニメーション上限を高くしても光っていないpixelはLayer側の明るさを維持します。

| Effect | Behavior |
| --- | --- |
| 無効 | 打鍵時もLayer色を維持 |
| 波紋 | 白い波頭が中心から45 msずつ左右へ進み、各LEDで160 msかけてLayer色へ戻る |
| フラッシュ | 5灯すべてが同時に白く光り、180 msでLayer色へ戻る |
| スパーク | 押した位置を最も強く、周囲を弱く白く光らせ、240 msでLayer色へ戻る |

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
```

Build scriptsはhardware configとrescue command assetをcompile前に再生成します。環境構築、identity override、検証手順は[`docs/development.md`](../../docs/development.md)を参照してください。

## Configuration

| Configuration | Source |
| --- | --- |
| Matrix GPIO、control / layer count、encoder tuning、default layer colors、Layer / 打鍵アニメーション輝度既定値 / 上限、打鍵アニメーション既定値、外付けWS2812B GPIO / pixel count / 既定方向 | `hardware/octgear/profile.json` |
| debounce、scan sleep、LED brightness、heartbeat、rescue toggle | `octgear/config.h` |
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

Layer 2〜7は全controlが`None`です。既定で有効なのはLayer 0/1だけで、Layer 0は無効化できません。Encoder方向の既定値はhardware profileの`encoder.reversed`、LEDテープ方向の既定値は`externalRgbLedReversed`で、現行構成はいずれも標準です。打鍵アニメーションの既定値は`statusLedKeyAnimation`の波紋、アニメーション輝度上限は`statusKeyAnimationBrightness.default`の`96`です。既に保存済みの設定はFirmware更新だけでは変更されず、初期化したときにこの既定値が適用されます。

## Storage

Keymap、通常のactive layer、layer enable mask、layer RGB colors、各LED輝度上限、Encoder方向、LEDテープ方向、打鍵アニメーションはexternal SPI Flash上の独立した3つの4KB sectorへ循環保存します。各slotはgenerationとCRCを持ち、起動時はCRCが正常な最新generationを読み込みます。保存中に電源が切れて新slotが不完全になっても、直前の正常slotへfallbackします。

現行storage versionは`5`です。Version 4の保存設定は内容を保持したまま自動移行し、保存LayerだけLayer 0で初期化します。Version 3はさらにアニメーション輝度上限をhardware profileの既定値`96`で補い、Version 2はLEDテープ方向と打鍵アニメーションも既定値で補います。Version 1以前の保存設定は移行せず、Firmware更新後の初回起動でcompile済み既定値へ初期化します。

標準buildはArduino coreがfilesystem用として扱う64KBをFirmware領域から分離して予約します。Filesystemはmountせず、その先頭12KBをjournalに直接使用します。設定変更時はRAM上の設定全体を次slotへ書き、1回の保存で消去するsectorを1つに限定します。通常Layerの切り替えは10秒間変化がなければ保存し、連続操作を1回の書き込みへまとめます。この間に別の設定を保存した場合は、その書き込みへ現在Layerも含めます。保存形式が無効または未初期化ならcompile済みdefaultで初期化します。

Diagnostics / Serial rescueのstorage self-testはtest patternのwrite、readback、元keymapのrestoreを行います。Test patternのslotは通常journalと異なるmagicを持ち、復元前に電源が切れても通常起動では読み込みません。実Flashへ書くため、必要な検査時だけ実行します。

## Further Reading

- [Firmware module map](octgear/README.md)
- [Architecture](../../docs/architecture.md)
- [HID report protocol](../../docs/hid-report.md)
- [Update, diagnostics, and rescue](../../docs/operations.md)
