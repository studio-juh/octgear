# AI Context

この文書はAI assistantや新しい開発者がOctGearの変更箇所と領域間契約を短時間で把握するための入口です。値の正本ではなく、現在の構成を案内する索引として使います。正確な値はリンク先のsourceを確認してください。

## Project Snapshot

OctGearはRP2040 Zero互換boardで動く、8キー + ロータリーエンコーダの小型キーボードです。

| Item | Current design |
| --- | --- |
| Physical input | ダイオードなし2 x 4 matrix、Encoder A / Common / B / SW |
| Logical controls | 8 keys + Encoder CCW / CW / SW = 11 |
| Layers | 8。Layer 0は常時有効、既定有効はLayer 0/1 |
| USB | Keyboard HID、Consumer HID、WebHID vendor report。一時起動時のみWebUSB landing page |
| Default identity | `0x2E8A:0x1133`、Manufacturer / Productは`OctGear` |
| Web | React 19 + TypeScript + Vite multi-page app |
| Firmware | RP2040 Arduino core + Adafruit TinyUSB |
| Persistence | External SPI Flashの3-slot journal + CRC。通常Layerは切り替え後10秒、PCBリビジョンやTap Dance判定時間などの設定は変更時に保存 |
| Status LED | GPIO 14のWS2812B 4 pixels、Encoderは右端LED、対応boardでは内蔵LEDへmirror |

## System Map

```text
hardware/octgear/profile.json
        │
        ├─ generate ─> Firmware constants
        ├─ generate ─> Web control metadata
        └─ generate ─> Human-readable pinout

Browser Build Guide / Remapper / Diagnostics
        │  WebHID report ID 3 / fixed 32 bytes
        ▼
RP2040 firmware
        ├─ Keyboard / Consumer HID ─> OS
        ├─ keymap / device settings ─> Flash journal
        └─ layer / animation state ─> WS2812B
```

通常入力はFirmwareだけで完結します。RemapperまたはDiagnosticsのheartbeatが有効な間は、設定中の入力がOSへ漏れないよう通常HID出力を抑止し、物理入力を`KeyEvent`としてWebへ送ります。

## Canonical Sources

| Information | Canonical source | Derived or related files |
| --- | --- | --- |
| Pin、control順、layer、LED profile | `hardware/octgear/profile.json` | generated C++ / TypeScript / pinout |
| Firmware timingと手動設定 | `firmware/octgear/octgear/config.h` | Firmware behavior |
| Default keymap | `firmware/octgear/octgear/keymap.cpp` | Firmware README |
| HID commandsとpayload | Firmware `hid_reports.h` + handler、Web protocol | `docs/hid-report.md` |
| Web product routes / assets / device identity / UF2 | `apps/web/src/products/octgear/product.ts` | Firmware build identity、README |
| Japanese / English UI copy | `apps/web/src/shared/i18n/ja.ts`, `en.ts` | React components |
| Rescue commands | `firmware/octgear/octgear/rescue.cmd` | generated header、UF2 bundle |

`generated_hardware_config.h`、`generatedHardwareConfig.ts`、`pinout.md`は生成物です。直接編集しません。

## Runtime Modes

### Normal

Scannerは保存済みPCBリビジョンに対応するmatrix pinを使用します。

Scannerがmatrixとencoderを読み、active layerのassignmentをKeyboard / Consumer reportへ変換します。Layer変更は有効なlayerだけを対象にします。通常のLayer変更は最後の切り替えから10秒後にFlashへ保存され、次回起動時に復元されます。Momentary Layerは一時状態のため保存しません。

### Remapper / Diagnostics

Webが300 ms間隔でheartbeatを送ります。Firmwareは最後のheartbeatから3000 ms以内を接続中とみなし、通常HID出力を抑止します。Web側はheartbeat送信失敗または700 ms timeoutでsessionを閉じます。

### WebUSB Landing Boot

通常起動中にK1、K5、Encoder SWを1秒間同時押しすると、watchdog scratchへ1回限りのboot flagを書いてwarm rebootします。次の起動はUSB device revisionを`0x0101`へ変更し、Adafruit TinyUSBのWebUSB landing descriptorでRemapper URLを公開してflagを即座に消去します。通常起動のrevisionは`0x0100`です。Windowsのdescriptor cacheを分離しつつ通常HIDとWebHIDは維持し、このbootではK4のRescue判定を抑止します。次回の再起動では通常のUSB構成へ戻ります。

### USB And LED States

LED状態の大きな優先関係は次のとおりです。

1. USBがmount済みかつsuspend中: 外付け・内蔵LEDを消灯
2. USB未mount: LEDテープ方向に従う流れるカラーホイール
3. Rescue boot: 弱い緑
4. Remapper接続直後1秒: カラーホイール
5. 通常: active layer色の全灯または4灯パターン + 選択された打鍵アニメーション

PCのresume後は現在Layerの表示へ戻ります。Layer表示は全灯または4灯で8 Layerを識別するパターンを選択でき、Layer色とpixelごとの点灯状態は200 ms以内で遷移します。打鍵アニメーションは無効／波紋／フラッシュ／スパークから選択します。通常打鍵のハイライトは白色、Layer変更を伴うcontrolは切り替え後のLayer色を使います。

### Rescue

Key 4を押しながらUSB接続すると、その起動だけread-onlyの`OCTGEAR` MSCと115200 baudのSerial rescueを有効にします。通常HIDは出力しません。Serial rescueは全キーマップとdevice設定の表示・変更、storage診断、compile済み既定値への初期化を提供します。

## Cross-System Invariants

- Control indexはK1-K8が`0-7`、Encoder CCW / CW / SWが`8-10`です。
- Layer 0は無効化できません。
- WebHID config reportはreport ID 3、input / outputとも固定32 bytesです。
- 同一transportで同期commandを並列送信しません。
- Layer color `0,0,0`は消灯です。
- Matrixにダイオードがないため、矩形同時押しの曖昧さが解消するまで直前の安定状態を保持します。
- PCBリビジョンはv3（Row 1 = GPIO 2）とv2互換（GPIO 0）だけを許可し、任意GPIOは受け付けません。
- Firmware更新だけでは保存済みkeymapや設定を上書きしません。
- 頒布前のStorageは現行versionだけを読みます。record変更ではversionを更新し、旧設定は初期化します。
- 配布Firmwareのsource変更はWeb同梱UF2と同期します。

## Where To Make Changes

| Goal | Start with | Also inspect |
| --- | --- | --- |
| Remapper UI | `apps/web/src/app/` | Web README、i18n、responsive styles |
| WebHID command | `apps/web/src/features/device/` | Firmware HID handler、protocol doc |
| Key assignment | Web keymap feature | Firmware assignment、storage、protocol |
| Key scan / Encoder | `key_scanner.*` | profile、pinout、実機timing |
| LED behavior | `status_led.*` | `keymap.*`、`config.h`、operations |
| Persistent setting | `keymap.*`, `keymap_storage.*` | Web command、storage migration |
| Hardware pin / count | `hardware/octgear/profile.json` | generatorの3出力 |
| Firmware updater artifact | Firmware source | `pnpm firmware:web`、Web build |
| Rescue command | `rescue.cmd` | generated asset、operations |

## Verification Boundaries

Repositoryには自動unit test suiteがありません。静的検査とcompileは次で行います。

```sh
pnpm typecheck
pnpm build
pnpm firmware:build
```

配布UF2を更新する場合:

```sh
pnpm firmware:web
pnpm build
```

物理matrix、Encoder方向、LED、USB suspend / remote wakeup、Flash persistence、BOOTSEL、MSCはtarget boardで確認します。

## Reading Order

1. [`../README.md`](../README.md): 製品とquick start
2. [`architecture.md`](architecture.md): モジュール境界とruntime flow
3. [`development.md`](development.md): 変更別workflowと検証
4. [`hid-report.md`](hid-report.md): Firmware / Web間protocol
5. [`operations.md`](operations.md): 利用・更新・復旧手順

すべての文書と更新条件は[`index.md`](index.md)にあります。AI agent向けの作業規約は[`../AGENTS.md`](../AGENTS.md)です。
