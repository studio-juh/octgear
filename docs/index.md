# Documentation Index

OctGearの文書索引です。目的に合う文書から読み、値を変更するときは記載されたcanonical sourceを確認してください。

## Start By Task

| Task | Read first | Then |
| --- | --- | --- |
| 製品概要・導入 | [`../README.md`](../README.md) | [`operations.md`](operations.md) |
| ビルドガイド変更 | [`../apps/web/README.md`](../apps/web/README.md) | [`development.md`](development.md)、[`../hardware/octgear/README.md`](../hardware/octgear/README.md) |
| Web UI変更 | [`../apps/web/README.md`](../apps/web/README.md) | [`architecture.md`](architecture.md)、[`development.md`](development.md) |
| Firmware変更 | [`../firmware/octgear/README.md`](../firmware/octgear/README.md) | [`architecture.md`](architecture.md)、[`development.md`](development.md) |
| Hardware profile変更 | [`../hardware/octgear/README.md`](../hardware/octgear/README.md) | [`development.md`](development.md) |
| HID protocol変更 | [`hid-report.md`](hid-report.md) | [`architecture.md`](architecture.md) |
| Firmware更新・実機操作 | [`operations.md`](operations.md) | [`development.md`](development.md) |
| AIによるrepository作業 | [`../AGENTS.md`](../AGENTS.md) | [`ai-context.md`](ai-context.md) |

## Core Documents

| Document | Purpose | Update when |
| --- | --- | --- |
| [`../README.md`](../README.md) | 製品概要、features、quick start | 利用者向け機能、主要command、構成が変わる |
| [`architecture.md`](architecture.md) | システム境界、責務、runtime flow | module責務や領域間flowが変わる |
| [`development.md`](development.md) | Setup、build、生成、検証 | command、toolchain、workflowが変わる |
| [`operations.md`](operations.md) | Remapper、Firmware更新、Diagnostics、rescue | 利用手順や実機挙動が変わる |
| [`hid-report.md`](hid-report.md) | WebHID wire protocol | command、payload、compatibilityが変わる |
| [`cost-estimate.md`](cost-estimate.md) | 少量頒布時の暫定材料原価、梱包、未計上費用 | 部品、仕入価格、構成、梱包条件が変わる |
| [`ai-context.md`](ai-context.md) | AI向けproject mapと不変条件 | source ownershipや主要runtime behaviorが変わる |
| [`../AGENTS.md`](../AGENTS.md) | AI agentの作業・検証規約 | repository policyや必須検証が変わる |

## Component Documents

| Document | Scope |
| --- | --- |
| [`../apps/web/README.md`](../apps/web/README.md) | Web entry point、state、device session、layout、localization |
| [`../firmware/octgear/README.md`](../firmware/octgear/README.md) | Firmware features、LED、default keymap、storage、build |
| [`../firmware/octgear/octgear/README.md`](../firmware/octgear/octgear/README.md) | Sketch module、main loop、config constants |
| [`../hardware/octgear/README.md`](../hardware/octgear/README.md) | Hardware profile、生成物、electrical assumptions |
| [`../apps/web/src/shared/README.md`](../apps/web/src/shared/README.md) | Web shared moduleの境界 |

## Generated References

| Document | Generated from | Command |
| --- | --- | --- |
| [`../hardware/octgear/pinout.md`](../hardware/octgear/pinout.md) | `hardware/octgear/profile.json` | `pnpm hardware:generate` |

生成されたC++ / TypeScript設定とpinoutは直接編集しません。Firmware buildでもhardware generatorは実行されますが、profile変更時は3生成物を同じcommitへ含めます。

## Policy And Licensing

| Document | Scope |
| --- | --- |
| [`../LICENSE`](../LICENSE) | Softwareとsoftware documentation |
| [`../HARDWARE-LICENSE.md`](../HARDWARE-LICENSE.md) | `hardware/`以下のdesign materials |
| [`../TRADEMARKS.md`](../TRADEMARKS.md) | 名称、ロゴ、公式性の表示 |
