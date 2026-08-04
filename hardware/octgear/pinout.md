# Pinout

現行8キー + ロータリーエンコーダ版のファームウェアとPCB設計を合わせるためのピン割り当てです。

この表は `hardware/octgear/profile.json` から生成します。

## Key Matrix

8 keys form a 2 x 4 matrix without diodes. Columns use `INPUT_PULLUP`; firmware drives only the selected row `OUTPUT LOW` and leaves the other row high impedance.

| Logical key | Firmware index | Matrix position | Notes |
| --- | ---: | --- | --- |
| Key 1 | 0 | Row 1 / Column 1 | Matrix Row 1 / Column 1 |
| Key 2 | 1 | Row 1 / Column 2 | Matrix Row 1 / Column 2 |
| Key 3 | 2 | Row 1 / Column 3 | Matrix Row 1 / Column 3 |
| Key 4 | 3 | Row 1 / Column 4 | Matrix Row 1 / Column 4 |
| Key 5 | 4 | Row 2 / Column 1 | Matrix Row 2 / Column 1 / README drive trigger |
| Key 6 | 5 | Row 2 / Column 2 | Matrix Row 2 / Column 2 |
| Key 7 | 6 | Row 2 / Column 3 | Matrix Row 2 / Column 3 |
| Key 8 | 7 | Row 2 / Column 4 | Matrix Row 2 / Column 4 |

| Row | Index | GPIO | Mode |
| --- | ---: | ---: | --- |
| Row 1 | 0 | 0 | Scan output; selected row is OUTPUT LOW |
| Row 2 | 1 | 9 | Scan output; selected row is OUTPUT LOW |

| Column | Index | GPIO | Mode |
| --- | ---: | ---: | --- |
| Column 1 | 0 | 5 | INPUT_PULLUP |
| Column 2 | 1 | 6 | INPUT_PULLUP |
| Column 3 | 2 | 7 | INPUT_PULLUP |
| Column 4 | 3 | 8 | INPUT_PULLUP |

Because the matrix has no diodes, rectangular multi-key combinations are electrically ambiguous. Firmware holds the previous stable matrix state while an ambiguous combination is present, preventing phantom key output.

## Rotary Encoder

Encoder A/B and SW are independent from the key matrix. A/B/SW use `INPUT_PULLUP`; Common is a dedicated `OUTPUT LOW` on GPIO 12.

The compiled default direction is standard. Remapper can change and persist the direction without rebuilding firmware.

| Signal | GPIO | Firmware control index |
| --- | ---: | ---: |
| A | 11 | CCW/CW: 8/9 |
| Common | 12 | - |
| B | 13 | CCW/CW: 8/9 |
| SW | 10 | 10 |

## Status LED

外付けWS2812Bのdata inputをGPIO 14へ接続します。Firmwareは4 pixels分のdataを送り、layer、打鍵アニメーション、Remapper、rescue状態を表示します。論理上はLED 1を盤面左端として扱い、物理pixel順の既定値は標準です。物理キーの打鍵アニメーションはmatrix columnに対応し、EncoderのCCW / CW / SWは論理上の右端LEDへ割り当てます。Remapperから向きと打鍵アニメーション効果を変更して保存できます。Boardに内蔵WS2812がある場合はlayer色をミラーします。Layer表示の輝度上限は0-128で既定値32、打鍵アニメーションの輝度上限は0-128で既定値96です。

| Signal | GPIO | Pixels | Mode |
| --- | ---: | ---: | --- |
| WS2812B DIN | 14 | 4 | 800 kHz GRB data |

## Removed Parts

- OLED

OLEDは使用しません。
