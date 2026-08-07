# Firmware Sketch

Arduino IDE / Arduino CLIで開くOctGear firmware sketchです。利用者向けの更新・救済手順は[`docs/operations.md`](../../../docs/operations.md)、system全体のflowは[`docs/architecture.md`](../../../docs/architecture.md)を参照してください。

## Files

| File | Role |
| --- | --- |
| `octgear.ino` | `setup()` / `loop()`とmode調停 |
| `config.h` | timing、LED、heartbeat、WebUSB案内、rescue設定 |
| `generated_hardware_config.h` | profileから生成したpin / count定数 |
| `key_scanner.*` | 2 x 4 matrix scan、debounce、encoder decode |
| `keymap.*` | default keymap、RAM assignment、active layer |
| `keymap_storage.*` | 3-sector Flash journalのload / save / CRC / self-test |
| `key_assignment.*` | assignment typeとconstructor |
| `hid_device.*` | USB HID、config command、layer action |
| `hid_output_queue.*` | Keyboard押下状態の6KRO集約、Consumer優先制御、report retry queue |
| `hid_report_descriptor.*` | TinyUSB HID report descriptor |
| `hid_reports.h` | report ID、command、status enum |
| `readme_drive.*` | Rescue boot用read-only FAT12 drive |
| `serial_rescue.*` | Rescue boot用command parser |
| `status_led.*` | Device state表示 |
| `webusb_landing.*` | 1回限りのWebUSB landing bootと物理shortcut |
| `rescue.cmd` | Windows offline rescue client source |
| `rescue_cmd_asset.h` | `rescue.cmd`から生成するembedded asset |

## Setup And Loop

`setup()`はLED、keymap、scannerを初期化し、watchdog scratchのWebUSB landing flag、Key 4のRescue boot状態の順に判定してからUSB deviceを開始します。Landing flagがある起動ではRescue判定を抑止します。

`loop()`はscanner、通常HID送信、config report、Serial rescue、status LEDを順に更新します。Remapperまたはrescueがactiveな間は通常HID出力を止め、長いscan sleepへ切り替えます。PCがUSBをサスペンドしている間は外付け・内蔵status LEDを消灯し、resume後は現在Layerの表示へ戻します。

## Timing

`config.h`の主なtuning値:

| Setting | Default | Purpose |
| --- | ---: | --- |
| `DEBOUNCE_US` | `5000` | Matrix key / encoder SW debounce |
| `IDLE_SCAN_SLEEP_US` | `100` | 通常modeのscan間sleep |
| `REMAPPER_SCAN_SLEEP_US` | `1000` | Config / rescue modeのscan間sleep |
| `REMAPPER_HEARTBEAT_TIMEOUT_MS` | `3000` | 通常出力抑止を解除する期限 |
| `DEFAULT_LAYER_TAP_DANCE_TERM_MS` | `250` | Next Layerの単押し確定とダブルタップ判定の既定時間。Remapperから50-1000 msで設定・保存可能 |
| `ACTIVE_LAYER_SAVE_DELAY_MS` | `10000` | 通常Layer切り替え後の遅延保存時間 |
| `WEBUSB_LANDING_HOLD_MS` | `1000` | K1 + K5 + Encoder SWで案内modeへ入る長押し時間 |
| `WEBUSB_LANDING_ACK_MS` | `200` | 再起動前の水色LED acknowledgement時間 |
| `STATUS_LAYER_TRANSITION_MS` | `200` | Layer色を切り替えるフェード時間 |
| `STATUS_LED_FRAME_MS` | `20` | Layer色フェードの更新間隔 |
| `STATUS_KEY_RIPPLE_STEP_MS` | `45` | 打鍵波紋が隣のLEDへ進む間隔 |
| `STATUS_KEY_RIPPLE_PULSE_MS` | `160` | 各LEDの打鍵波紋が減衰する時間 |
| `STATUS_KEY_FLASH_MS` | `180` | 全灯フラッシュが減衰する時間 |
| `STATUS_KEY_SPARK_MS` | `240` | 局所スパークが減衰する時間 |
| `STATUS_REMAPPER_ANIMATION_MS` | `1000` | Remapper接続時のカラーホイール表示時間 |
| `CONFIG_RESPONSE_READY_RETRIES` | `20` | Config input reportのHID ready retry |
| `CONFIG_RESPONSE_RETRY_DELAY_US` | `100` | Retry間隔 |

Input latencyを調整する場合はdebounceとidle sleepの両方を考慮します。Encoder detentは`config.h`ではなくhardware profileの`stepsPerDetent`で調整します。Encoder A/Bで両bitが同時に変わる不正遷移やdetentへ戻った不完全なcycleは破棄し、次のdetentを新しい起点として再同期します。

## Build Invariants

- `usbstack=tinyusb`が必要です。Vendor reportとcomposite USB deviceが依存します。
- CPU frequencyは125 MHzに固定します。
- 2MB Flashの末尾に64KBの保存領域を予約します。標準scriptの`flash=2097152_65536`を外さないでください。
- `generated_hardware_config.h`と`rescue_cmd_asset.h`はsourceを変更後に再生成します。
- HID protocolを変更する場合はWeb implementationと[`docs/hid-report.md`](../../../docs/hid-report.md)を同時に更新します。
- Storage layoutを変える場合は既存deviceのmigrationまたは明示的な初期化方針が必要です。

Storageは3つの4KB sectorを循環し、各slotへheader、generation、全layerのassignment records、1-byteのlayer有効mask、3 bytes x layerのRGB色、Encoder方向・LEDテープ方向・Layer表示モード・打鍵アニメーションを持つ1-byteのdevice flags、Layer / アニメーション輝度上限、通常のactive layer、16-bitのTap Dance判定時間、CRC32を固定順で保存します。Layer 0は常時有効です。現行Version 6は旧versionを移行せず、起動時にVersion 6としてCRCが正常な最新generationを選びます。有効なslotがない場合はhardware profileとcompile済みkeymapの既定値から最初のslotを作成します。

Repository rootからの標準buildは`pnpm firmware:build`です。直接Arduino CLIを呼ぶ場合も、先に必要な生成処理を実行してください。
