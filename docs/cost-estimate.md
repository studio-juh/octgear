# OctGear 原価見積

OctGearを少量頒布する場合の、1台あたりの暫定材料原価です。価格は2026年7月28日時点の購入候補を基にしており、販売価格や将来の仕入価格を保証するものではありません。

## 計算条件

- 1台あたりの使用量で按分する
- ドル建て部品は暫定で`1 USD = 150 JPY`として換算する
- PCBは5枚単位、送料込み`3 USD`で発注する
- ケースとノブはFDMで自家印刷し、塗装しない
- 基本商品はSwitchとKeycapを含まないbareboneとし、両部品は別売にする
- USB Type-Cケーブルは同梱しない
- 表示価格に含まれると明記されていない送料、輸入時の税、決済手数料は含めない
- 作業工賃、工具、3Dプリンターの償却、販売手数料、購入者への送料は含めない

## 1台あたりの材料原価

| 部品 | 購入条件 | 1台の使用量 | 1台あたり |
| --- | ---: | ---: | ---: |
| RP2040-Zero互換board | 1個 `300円` | 1個 | `300.00円` |
| Kailh hot-swap socket | 110個 `1,485円` | 8個 | `108.00円` |
| WS2812B strip、1m / 60 pixels / IP30 | 1本 `606円` | 4 pixels | `40.40円` |
| OctGear PCB | 5枚、送料込み `3 USD` | 1枚 | `0.60 USD` / 約`90.00円` |
| M2 x 8mm screw | 200本 `945円` | 5本 | `23.63円` |
| EC11 rotary encoder、軸高15mm | 5個 `217円` | 1個 | `43.40円` |
| FDM case + knob | Filament 1kg `2,000円` | 約37g + 印刷ロス | 約`90.00円` |
| 1/4 inch mount nut | 20個 `318円` | 1個 | `15.90円` |
| 3M CS-101 cushion rubber | 88粒 `730円` | 4粒 | `33.18円` |
| AWG24相当の配線材 | 使用量按分 | 1台分 | 約`1.00円` |
| Solder | 使用量按分 | 1台分 | 約`1.00円` |
| Packaging case `MJ-SBOX08-S` | 100枚 `4,471円` | 1枚 | `44.71円` |
| **Barebone暫定合計** |  |  | **約`791円`** |

端数を含むbareboneの計算値は約`791.21円`です。印刷ロスを含めないFDM材料費を使う場合は約`775円`ですが、見積では少量のsupport、skirt、purge、失敗分を含めて`90円`としています。

## Product Configurations

頒布時は、SwitchとKeycapを含まないBarebone版と、両部品を含むFull Set版の両方を扱えるようにします。

| Configuration | Included switch / keycap | 材料原価 | 不良・予備5-10%込み |
| --- | --- | ---: | ---: |
| Barebone | なし | 約`791円` | 約`831-870円` |
| Full Set | Outemu Tactile Brown 8個、Keycap 8個 | 約`1,212円` | 約`1,273-1,333円` |

どちらにもOctGear本体、Case、Knob、クッションゴム、mount nut、梱包箱を含みます。USB Type-C cableは含みません。

## Optional Switch And Keycap Set

SwitchとKeycapはbareboneに含めず、利用者が用意するか、別売setとして追加できる構成にします。

| 部品 | 購入条件 | 1setの使用量 | 1setあたり |
| --- | ---: | ---: | ---: |
| Outemu Tactile Brown switch | 110個 `1,469円` | 8個 | `106.84円` |
| Keycap | 20個 `785円` | 8個 | `314.00円` |
| **別売set材料原価** |  |  | **約`421円`** |

Bareboneへこのsetを加えた場合の材料原価は約`1,212円 / 台`です。別売価格には、set用の袋、label、在庫ロス、販売手数料を別途加算します。

## FDM Case

見積に使用したSTL体積は次のとおりです。

| Part | Volume |
| --- | ---: |
| `Dknob.stl` | `2.49 cm³` |
| `t.stl` | `12.56 cm³` |
| `b.stl` | `9.96 cm³` |
| `m.stl` | `4.83 cm³` |
| **Total** | **`29.84 cm³`** |

PLAの密度を`1.24 g/cm³`とすると、100%充填相当で約`37g`、材料費は約`74円`です。実際の使用量はwall、infill、support、skirtなどのslicer設定で変わるため、量産条件を決めた後はslicer表示の重量へ置き換えます。

MiddleはLEDの光を拡散させるため、NaturalまたはTranslucentのPLA / PETGを使用します。Top、Bottom、Knobと異なるfilamentを使う場合、1台あたりの消費原価とは別に複数spoolの初期購入費が必要です。

## Packaging

完成時の実測寸法はおよそ`120 x 60.5 x 28 mm`です。

`MJ-SBOX08-S`の内寸は`157 x 117 x 41 mm`、外寸は`160 x 125 x 45 mm`です。完成品は収納できますが、外寸の厚さが45mmあるため、厚さ30mm以下の配送方法には使用できません。

半組み立てキットではKeycap、Knob、Switch、Caseを分けて平置きし、外寸30mm以下の梱包を検討します。箱材と緩衝分を考慮し、内容物の最大高さは`24-26mm`を目安にします。3cm梱包箱と薄型緩衝材の価格は未計上です。

## Reserve And Excluded Costs

材料原価へ5-10%の不良・予備分を加えると、Bareboneは約`831-870円 / 台`、Full Setは約`1,273-1,333円 / 台`です。販売価格を決めるときは、さらに次を別枠で加算します。

- 仕入先ごとの未計上送料、輸入時の税、為替・決済手数料
- FDM印刷の電気代、失敗、printer maintenance
- 組み立て、Firmware書き込み、動作検査、梱包の作業工賃
- 説明card、薄型緩衝材、label
- BOOTH等の販売手数料
- 購入者への送料
- 初期不良交換と問い合わせ対応のreserve

## Items To Confirm

- 原価計算は外付けWS2812Bを4 pixels実装する前提。Hardware profileとFirmwareは5 pixels分を送信し、4 pixels chainでは余分なdataが無視される。公開Build Guideの使用数は現在5灯のため、頒布仕様を確定して表記を揃える
- `Y809-0114`は`1/4 x 20山`表記だが、camera / tripod mountで使う`1/4-20 UNC`との規格一致を実物で確認する
- 半組み立て用3cm梱包箱の品番、単価、梱包後の実測厚を確定する
- 各購入価格が送料・税を含むか、実際のcard請求額で更新する
- 量産用slicer profileを決め、Case + Knobの実使用重量と印刷時間を測定する
