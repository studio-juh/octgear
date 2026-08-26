# OctGear Hardware

The materials in this directory are provided under the [OctGear Hardware License 1.0](../../HARDWARE-LICENSE.md). Personal, non-commercial builds are permitted. Commercial manufacture or sale of the reference hardware without material hardware changes is prohibited.

現行2 x 4 key matrix + rotary encoder版のhardware metadataです。PCB v3を既定とし、同じFirmwareからPCB v2のRow 1配線へ切り替える互換情報も管理します。PCB designそのものではなく、firmwareとWeb UIが共有するlogical control、matrix pin mapping、layer count、default enabled layers、default layer colors、Layer / 打鍵アニメーション輝度既定値 / 上限、打鍵アニメーション既定値、外付けWS2812B GPIO / pixel count / 既定方向を管理します。

## Files

| File | Ownership |
| --- | --- |
| `profile.json` | 手動編集するsingle source of truth |
| `pinout.md` | profileから生成する人向けpin table |
| `../../apps/web/public/build-guide/pcb/` | Build Guide掲載用のPCB製造preview |
| `../../apps/web/public/build-guide/downloads/` | 頒布用Gerber ZIPとcase / knob STL |

同じprofileから次も生成します。

- `firmware/octgear/octgear/generated_hardware_config.h`
- `apps/web/src/products/octgear/generatedHardwareConfig.ts`

## Change Workflow

1. `profile.json`を編集します。
2. Repository rootで`pnpm hardware:generate`を実行します。
3. 3つの生成物のdiffを確認します。
4. Webとfirmwareをbuildします。

```sh
pnpm hardware:generate
pnpm build
pnpm firmware:build
```

Generated filesは直接編集しません。Generatorはindex順とencoder control IDを検証し、不整合時は失敗します。

PCB preview、Gerber、STLはgenerator対象ではありません。製造データを更新した場合はBuild Guideの表示とdownload linkを確認し、Gerber ZIP内のprefixも`octgear-`へ揃えます。

## Electrical Assumptions

- 2 Row x 4 Columnのmatrixで、ダイオードは使用しない
- Columnは`INPUT_PULLUP`、scan対象Rowだけを`OUTPUT LOW`にする
- PCB v3のRow 1はGPIO 2、PCB v2互換のRow 1はGPIO 0。Remapperからrevision単位で切り替え、任意GPIOは指定させない
- ダイオードがないため矩形同時押しは区別できず、Firmwareは曖昧な間のMatrix状態を保持する
- Encoder A/B/SWは`INPUT_PULLUP`、専用Common GPIOは常時`OUTPUT LOW`
- External WS2812Bのdata inputはGPIO 14へ接続し、4 pixels分のdataを送る
- 打鍵アニメーションはmatrixの各columnをLED 1〜4へ対応させ、EncoderのCCW / CW / SWは右端のLED 4をK4 / K8と共有する
- Layer表示は全灯と、4灯の点灯パターンによる8状態をRemapperから切り替えられる
- Status表示は外付けWS2812Bへ出力し、対応boardではonboard WS2812にもミラーする
- LED拡散部品は側面LEDの光を外周へ通す構造のため、透明または半透明の造形素材を推奨する
- OLEDは使用しない
- Key 4は通常inputとrescue boot triggerを兼用

現在のGPIOとfirmware indexは[`pinout.md`](pinout.md)を参照してください。Data flowと影響範囲は[`docs/architecture.md`](../../docs/architecture.md)にあります。
