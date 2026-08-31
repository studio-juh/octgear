# OctGear

RP2040 Zero / compatible boardで動く、8キー + ロータリーエンコーダの小型キーボードです。通常のKeyboard / Consumer Control HIDに加え、WebHIDベースのRemapper、製造検査、ブラウザからのファームウェア更新を提供します。

## Features

- ダイオードなし2 x 4 key matrixと、独立GPIOのロータリーエンコーダCCW / CW / SW
- 8 layers x 11 controlsのキーマップ
- Layer 1-7の個別有効化。Layer 0は常時有効、既定有効はLayer 0/1
- 通常のLayer切り替えは10秒間変化がなければFlashへ保存し、次回起動時に復元
- LayerごとのRGB LED色設定。`0,0,0`で消灯
- Layer色の全灯表示、4灯の点灯パターン、虹色サイクルを切り替えてFlash保存
- 外付けWS2812Bと内蔵mirrorの輝度上限を`0-128`で設定、Flash保存
- 外付けWS2812Bのphysical pixel順を標準／反転で設定、Flash保存
- PCのUSBサスペンド中は外付け・内蔵LEDを消灯
- 打鍵アニメーションを無効／波紋／フラッシュ／スパーク／打鍵虹色から選択、Flash保存
- 通常打鍵は現在Layer色、Layer変更を伴うcontrolは切り替え後のLayer色でアニメーション表示
- Layer表示と独立した打鍵アニメーション輝度上限でコントラストを調整
- Encoder回転方向の反転設定とFlash保存
- PCB v3（Row 1 = GPIO 2）／PCB v2互換（GPIO 0）の切り替えとFlash保存
- Keyboard、Consumer Control、次／前レイヤー、Momentary Layer割り当て
- Next Layerの単押しで次へ進み、同じcontrolのダブルタップで開始位置からPrevious Layerを実行するTap Dance。判定時間は50-1000 msで設定・保存可能（既定250 ms）
- WebHID Remapperによる読込、編集、差分保存
- 物理入力、設定report、Flash保存領域のDiagnostics
- 頒布キット向けの組み立て・Firmware導入・動作確認ガイドと製造データ配布
- WebHIDからのBOOTSEL移行と、同梱UF2の更新
- K1 + K5 + Encoder SWの1秒長押しによる、一時的なWebUSB Remapper案内
- Key 4起動によるREADME drive / Serial rescue。キーマップとdevice設定の確認・変更・初期化に対応

## Web Pages

| Page | Path | Role |
| --- | --- | --- |
| Home | `/` | 製品情報と各ツールへの入口 |
| Start Guide | `/octgear-start.html` | 完成後・完成品購入者向けの導入、設定、サポート案内 |
| Build Guide | `/octgear.html` | 組み立て、Firmware導入、完成検査 |
| Remapper | `/octgear-remapper.html` | キーマップ設定とファームウェア更新 |
| Diagnostics | `/octgear-diagnostics.html` | 出荷前・販売前の個体検査 |

RemapperとDiagnosticsは独立したHTMLとして直接開けます。WebHIDを使うため、対応ブラウザかつsecure contextで実行してください。通常はChromium系ブラウザのHTTPS配信またはlocalhostを想定しています。

## Quick Start

開発環境を初期化します。Arduino CLI、RP2040 core、Arduino librariesはリポジトリ内の`.tools/`と`.arduino/`へ導入されます。

```sh
scripts/setup-dev-env.sh
pnpm dev
```

主な検証・生成コマンド:

```sh
pnpm typecheck          # Web TypeScript
pnpm build              # Web production build
pnpm firmware:build     # Firmware compile
pnpm firmware:web       # Firmware compile + 配信用UF2/RESCUE.CMD/生成日時更新
pnpm hardware:generate  # Hardware profileから3つの生成物を更新
```

初回セットアップと全ビルドをまとめて確認する場合は`scripts/setup-dev-env.sh --verify`を使います。

## Architecture

```text
hardware/octgear/profile.json
        │
        ├─> firmware/.../generated_hardware_config.h
        ├─> apps/web/.../generatedHardwareConfig.ts
        └─> hardware/octgear/pinout.md

Browser ── WebHID config report ──> RP2040 firmware ──> 3-slot Flash journal
   │                                      │
   └─ Remapper / Diagnostics              └─ Keyboard / Consumer HID
```

`hardware/octgear/profile.json`がピン割り当て、コントロール順、レイヤー数の単一ソースです。生成ファイルは直接編集せず、profile変更後に`pnpm hardware:generate`を実行します。Firmware buildでも生成処理は自動実行されます。

詳しいモジュール境界とデータフローは[Architecture](docs/architecture.md)を参照してください。

## Repository Layout

```text
apps/web/                  React + TypeScript + Vite multi-page app
docs/                      横断仕様、開発、運用手順
firmware/octgear/          RP2040 Arduino firmware
hardware/octgear/          Hardware profileと生成pinout
scripts/                   環境構築、生成、firmware build
```

## Hardware Summary

PCB v3を既定とし、RemapperからPCB v2のRow 1配線へ切り替えられます。

現行構成はRow 2本、Column 4本のダイオードなしkey matrixと、A/Common/B/SWを独立GPIOへ接続するロータリーエンコーダです。ダイオードがないため、一部の矩形同時押しは電気的に区別できません。Firmwareは曖昧な間のMatrix状態を更新せず、phantom keyの出力を防ぎます。正確なGPIOは生成された[pinout](hardware/octgear/pinout.md)を参照してください。

通常起動中にK1、K5、Encoder SWを同時に1秒間押すと、LEDが水色に光って再起動し、その起動だけWebUSBのRemapper案内を有効にします。対応するdesktop Chromiumでは接続通知からRemapperを開けます。次回の再起動では通常のUSB構成へ戻ります。

Key 4を押しながらUSB接続すると、その起動だけread-onlyの`OCTGEAR`ドライブとSerial rescueが有効になります。通常起動では表示されません。詳しい操作と復旧手順は[Operations](docs/operations.md)にあります。

## USB Identity

| Field | Default |
| --- | --- |
| Vendor ID | `0x2E8A` |
| Product ID | `0x1133` |
| Manufacturer | `OctGear` |
| Product | `OctGear` |

`0x2E8A:0x1133`は[Raspberry Pi USB PID program](https://github.com/raspberrypi/usb-pid)からOctGear向けに割り当てられたidentityです。Firmware build defaultsとWeb側の接続filterで同じ値を使用します。Forkや別製品ではこの組み合わせを流用せず、各製品で使用許可を得たUSB identityへ置き換えてください。

## Documentation

| Document | 内容 |
| --- | --- |
| [Documentation Index](docs/index.md) | 目的別の文書案内と更新条件 |
| [Architecture](docs/architecture.md) | システム構成、責務、実行時データフロー |
| [Development](docs/development.md) | 環境構築、コマンド、変更別ワークフロー |
| [Operations](docs/operations.md) | Remapper、更新、Diagnostics、Serial rescue |
| [HID Report Protocol](docs/hid-report.md) | WebHID vendor reportのwire format |
| [Cost Estimate](docs/cost-estimate.md) | 少量頒布時の暫定材料原価と梱包条件 |
| [AI Context](docs/ai-context.md) | AI向けのproject map、正本、領域間契約 |
| [Agent Guide](AGENTS.md) | AI agentの作業規約と検証checklist |
| [Web App](apps/web/README.md) | Webアプリ内部の構成 |
| [Firmware](firmware/octgear/README.md) | Firmwareの構成とbuild |
| [Hardware](hardware/octgear/README.md) | Hardware profileと生成物 |

## Distribution And Contact

OctGearの主要頒布先と問い合わせ窓口は[BOOTHショップ](https://hanairo-m.booth.pm/)です。

## Project Policy

OctGearは個人プロジェクトとして管理しています。IssueやPull Requestは送信できますが、確認、返信、レビュー、マージ、対応時期は保証しません。対応まで長期間かかる場合や、対応しない場合があります。必要に応じてForkし、各Forkで管理してください。

## License

Copyright 2026 falxala

Software and software documentation are licensed under the [Apache License 2.0](LICENSE).

`hardware/`以下のhardware design materialsは[OctGear Hardware License 1.0](HARDWARE-LICENSE.md)の対象です。個人による非商用の自作は許可されますが、基準となるハードウェア構成を実質的に変更せず製造・販売することは禁止されています。このため、リポジトリ全体をOSI準拠のオープンソースとして提供するものではありません。

名称、ロゴ、公式性の表示については[Trademark Policy](TRADEMARKS.md)を参照してください。
