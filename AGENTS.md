# OctGear Agent Guide

このファイルはrepository全体に適用するAI agent向け作業規約です。詳細な背景は[`docs/ai-context.md`](docs/ai-context.md)、文書の選び方は[`docs/index.md`](docs/index.md)を参照してください。

## Start Here

作業前に次を確認します。

1. [`README.md`](README.md)で製品とrepository全体を把握する
2. [`docs/ai-context.md`](docs/ai-context.md)でsource of truthと領域間契約を確認する
3. 変更領域に対応する文書を[`docs/index.md`](docs/index.md)から選ぶ
4. `git status --short`で既存の未コミット変更を確認する

既存の未コミット変更は利用者の作業として扱い、無関係な差分を変更、削除、整形しません。

## Source Of Truth

- GPIO、matrix、control順、layer数、既定色などは`hardware/octgear/profile.json`を編集します。
- 次の生成物は直接編集しません。
  - `firmware/octgear/octgear/generated_hardware_config.h`
  - `apps/web/src/features/hardware/generatedHardwareConfig.ts`
  - `hardware/octgear/pinout.md`
- Hardware profile変更後は`pnpm hardware:generate`を実行し、3生成物を同じ変更へ含めます。
- HID wire formatはFirmwareとWebの共有契約です。一方だけを変更しません。
- 日本語UI文言を追加・変更する場合は`apps/web/src/shared/i18n/ja.ts`と`en.ts`を同期します。
- 配布対象のFirmware変更では`pnpm firmware:web`を実行し、`apps/web/public/firmware/octgear.uf2`も更新します。

## Repository Boundaries

| Area | Primary path | Details |
| --- | --- | --- |
| Web UI | `apps/web/` | [`apps/web/README.md`](apps/web/README.md) |
| Firmware | `firmware/octgear/` | [`firmware/octgear/README.md`](firmware/octgear/README.md) |
| Hardware metadata | `hardware/octgear/` | [`hardware/octgear/README.md`](hardware/octgear/README.md) |
| Cross-system protocol | `docs/hid-report.md` | FirmwareとWebを同時に確認 |
| Build and release | `scripts/`, `docs/development.md` | repository rootから実行 |

WebはReact + TypeScript + Vite、FirmwareはRP2040 Arduino core + Adafruit TinyUSBです。WebHIDはChromium系browserのsecure contextまたはlocalhostを前提とします。

## Required Verification

変更内容に応じて、repository rootで次を実行します。

| Change | Minimum verification |
| --- | --- |
| Markdown only | link、command、source-of-truth表記を確認 |
| Web UI / state | `pnpm typecheck`, `pnpm build` |
| Hardware profile | `pnpm hardware:generate`, `pnpm build`, `pnpm firmware:build` |
| Firmware logic | `pnpm firmware:build` |
| 配布Firmware | `pnpm firmware:web`, `pnpm build` |
| HID protocol | Web build、Firmware build、両実装と`docs/hid-report.md`のdiff確認 |
| Storage / rescue | Firmware build、可能なら実機でrestore / reboot確認 |

自動unit test suiteはありません。USB lifecycle、物理入力、LED、Flash永続化、BOOTSEL、MSCの最終確認には実機が必要です。実機未確認の場合は完了報告で明記します。

## Change Rules

- 変更は依頼された範囲に限定します。
- 生成物、配布artifact、仕様文書をsource変更と同期します。
- Firmware storage formatを変更する場合はversionと旧version移行を検討します。
- VID/PIDを変更する場合はFirmware build identity、WebHID filter、READMEを同期します。
- `rescue.cmd`変更後は`pnpm rescue-cmd:assets`、配布まで更新する場合は`pnpm firmware:web`を使います。
- `apps/web/dist/`、`.arduino/`、`.tools/`などlocal build / tool directoryをcommitしません。
- Commitやpushは利用者から明示された場合だけ実行します。
- Hardware design materialsには`HARDWARE-LICENSE.md`、名称とロゴには`TRADEMARKS.md`が適用されます。

## Completion Checklist

- 正しいsource of truthを編集した
- 影響する生成物と配布artifactを更新した
- Web / Firmware / documentation間の契約が一致している
- 対応する検証commandが成功した
- `git diff --check`が成功した
- 実機でしか確認できない項目を報告した

