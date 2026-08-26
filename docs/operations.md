# Operations

通常のキーマップ設定、firmware更新、出荷検査、offline rescueの手順です。

## Remapper

RemapperはWebHIDでOctGearへ接続します。Web Serialは使いません。

PCとタブレットでは、画面上部の「表示倍率」でWorkspaceを`80%`、`90%`、`100%`へ切り替えられます。既定値は`90%`です。選択した倍率はbrowserへ保存され、次回も引き継がれます。表示が収まりきらない場合は`80%`、文字や操作部を大きくしたい場合は`100%`を選択してください。スマートフォン幅では操作部の大きさを保つため、自動的に`100%`表示になります。

### Open From Device

通常起動中にK1、K5、Encoder SWを同時に1秒間押し続けると、LEDが水色に200 ms点灯してOctGearが再起動します。再起動後の1回だけWebUSB landing pageが有効になり、対応するdesktop ChromiumではUSB deviceの接続通知から`https://studio-juh.github.io/octgear/octgear-remapper.html`を開けます。案内modeでも通常HIDとWebHIDは利用できます。Windowsが通常起動時のdescriptor不在を再利用しないよう、この起動だけUSB device revisionを`0x0101`へ変更し、通常起動では`0x0100`へ戻します。

これは毎回のUSB接続で表示される機能ではありません。案内modeの起動時だけ有効で、通知を自動的に操作したりbrowserを強制的に開いたりはしません。OSやbrowserが通知に対応していない場合はURLを直接開いてください。USBを抜き差しするか再起動すると、次回は通常のUSB構成へ戻ります。

### Connect And Edit

1. OctGearを通常起動でUSB接続します。
2. `/octgear-remapper.html`をChromium系browserで開きます。
3. Connectから`OctGear`を選択します。
4. 接続時に全layer / controlのkeymapが読み込まれます。
5. layerとcontrolを選び、割り当てを編集します。
6. Layer 1-7は各checkboxで有効／無効を選びます。初期状態ではLayer 0/1が有効です。
7. 選択LayerのLED色をswatchまたはR/G/Bで設定します。点灯checkboxを外すと消灯します。
8. Saveで、最後に読み込んだ内容との差分だけをdeviceへ書き込みます。

Readはdeviceから全keymapとlayer設定を再読込し、未保存の編集内容を置き換えます。Saveは全layer / controlを比較しますが、変更がない設定へのFlash writeは行いません。Layer 0は安全なbase layerとして常に有効です。

Hardware cardの「設定を開く」からHardware設定モーダルを開きます。モーダル上部にはBoard詳細、その下には変更可能な設定を表示します。「回転方向 / 反転」はEncoderのCCW/CWを入れ替え、変更時に実機へ即座に保存します。

Hardware設定モーダルの「PCBリビジョン」は、現行PCB v3のRow 1 = GPIO 2と旧PCB v2のRow 1 = GPIO 0を切り替えます。基板に記載されたrevisionへ合わせてください。変更は即座に保存・適用され、再起動は不要です。任意GPIOの指定はできません。

Hardware設定モーダルの「LEDテープ方向 / 反転」は、盤面左端のLED 1をphysical pixel 0へ対応させる標準順と、最後のphysical pixelへ対応させる反転順を切り替え、変更時に実機へ即座に保存します。位置依存の打鍵アニメーションとUSB未認識時の流れるアニメーションの向きに適用されます。

Hardware設定モーダルの「レイヤー表示」は、従来のLayer色による全灯と、4灯の点灯パターンを切り替えます。4灯パターンでは点灯pixelに現在Layerの色を使い、消灯pixelを含めてLayer切り替え時に200 msで遷移します。設定は変更時にFlashへ即座に保存されます。

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

Hardware設定モーダルの「アニメーション効果」は、打鍵表示を無効／波紋／フラッシュ／スパークから選ぶプルダウンです。変更時に実機へ即座に保存します。波紋は押下位置から左右へ広がり、フラッシュは4灯を同時点灯、スパークは押下位置とその周囲を短く光らせます。通常打鍵は現在Layer色、Layer変更を伴うcontrolは切り替え後のLayer色で発光します。EncoderのCCW / CW / SWは右端のLED 4をK4 / K8と共有します。

Hardware設定モーダルの「アニメーション輝度上限」は`0-128`で設定し、「適用」でFlashへ保存します。Layer側の「LED輝度上限」より高くすると、アニメーション対象pixelだけが明るくなりコントラストが強まります。既定値は`96`、`0`ではハイライトを消します。

Hardware設定モーダルの「LED輝度上限」は`0-128`で設定します。`0`は消灯です。Sliderまたは数値を変更し、「適用」で外付けWS2812Bと内蔵mirrorへ反映してFlashへ保存します。既定値は`32`です。

PCがスリープしてUSBがサスペンド状態になると、外付けLEDと内蔵LEDは消灯します。PCの復帰後は現在Layerの色へ戻ります。USB未認識で電源だけが接続されている場合は、従来どおり流れるカラーホイールを表示します。

初期キーマップはLayer 0/1だけに割り当てがあり、Layer 2〜7は空です。Firmwareを更新しただけでは保存済み設定を上書きしません。初期値へ戻す場合はRemapperのRead左側にあるメニューから初期化します。

Next Layer、Previous Layer、Remapper、Serial rescueで通常Layerを切り替えると、最後の切り替えから10秒後に現在LayerをFlashへ自動保存します。10秒以内の連続切り替えは1回の保存へまとめられ、次回起動時は保存したLayerから始まります。Next Layerは最初の押下をTap Dance判定時間だけ保留し、単押しなら次へ進みます。同じ物理controlを期限内にもう一度押すとNextを実行せず、開始LayerからPrevious Layerとして一つ前へ進みます。判定時間はRemapperのHardwareから50-1000 msで設定でき、既定値は250 msです。Momentary Layerは押している間だけの一時状態なので保存しません。

物理キーやencoderを操作すると、対応するcontrol tileが選択されます。接続中はheartbeatにより通常のKeyboard / Consumer出力がfirmware側で抑止されるため、設定操作がPC入力として流れません。

### Assignment Types

| Type | Behavior |
| --- | --- |
| None | 出力しない |
| Keyboard | 押下中assignmentのmodifierと最大6種類のkeycodeを統合して送る |
| Consumer | 最後に押された押下中のvolume、media等の16-bit usageを送る |
| Next Layer | 単押しは設定した判定時間後に次へ、同じcontrolのダブルタップは開始位置から前へ切り替える |
| Previous Layer | 有効なlayerだけを前方向へ切り替える |
| Momentary Layer | target layerが有効な場合、押している間だけ切り替える |

## Firmware Update

Remapperのfirmware panelには、BOOTSEL移行、同梱UF2 download、browserからのUF2書込があります。

### Browser Write

1. OctGearへWebHID接続します。
2. BOOTSELへの切替を実行します。
3. OSに`RPI-RP2`またはUF2 bootloader driveが現れるのを待ちます。
4. Browserのfolder pickerでそのdriveを選びます。
5. 同梱`octgear.uf2`の書込完了を待ちます。

Folder pickerによる直接書込はFile System Access APIが必要です。未対応browserではUF2をdownloadし、OS上でbootloader driveへcopyしてください。

WebHIDからBOOTSELへ移行できない場合は、boardのBOOTSEL操作を使って手動でbootloader driveを表示します。

## Diagnostics

`/octgear-diagnostics.html`は出荷前・販売前の個体検査用です。

検査項目:

- BrowserのWebHID support
- OctGearへの接続
- 物理キー8個、Encoder CCW / CW / SWのevent
- Encoder CCW / CWの累積検出回数
- Vendor reportのrequest / response
- Firmware-reported layer / key count
- Keymap storageのwrite / read / restore

### Recommended Order

1. Connectして、firmwareが`keyCount = 11`を返すことを確認します。
2. 8キーとencoder 3操作をそれぞれ入力し、全controlが記録されることを確認します。
3. Reset後、Encoderを各方向へゆっくり20ノッチ回し、CCW / CW counterがそれぞれ20増えることを確認します。
4. Diagnostic report testを実行します。
5. 必要な個体だけStorage testを実行します。
6. Disconnectして通常HID入力へ戻ることを確認します。

Diagnostic report testは固定nonceを送り、`RPT` signature、protocol version、echoを検証します。

> Storage testは実際のFlash-backed keymap保存領域へtest patternを書きます。検証後に元のkeymapを復元しますが、書込回数を伴うため、必要な検査時だけ実行してください。電源断やUSB切断をtest中に行わないでください。

## Rescue Boot

WebHIDを利用できない場合、Key 4 bootでoffline rescueを起動できます。

1. OctGearをUSBから外します。
2. Key 4を押したままUSB接続します。
3. LEDが弱い緑になり、read-onlyの`OCTGEAR` driveが現れるまで待ちます。
4. Windowsでは`RESCUE.CMD`を実行します。
5. `help`でcommand一覧を確認します。
6. 終了後はUSBを抜き、キーを押さずに再接続します。

Driveには`README.TXT`、`READMEEN.TXT`、Remapperへ直接開く`REMAPPER.URL`、`RESCUE.CMD`が含まれます。Serialは115200 baud、8-N-1、LF終端です。`RESCUE.CMD`は現行USB identityの`0x2E8A:0x1133`または`OCTGEAR ACK`を返すportを自動検出し、見つからない場合は手動選択へ移ります。

## Serial Rescue Commands

Layerは`0-7`、key番号は`1-11`です。数値はdecimalまたは`0x`付きhexを受け付けます。

| Command | Purpose | Persists |
| --- | --- | --- |
| `probe` | OctGear rescue identityとcountを返す | No |
| `help` / `?` | command一覧 | No |
| `state` | Layer状態、全device設定、全Layer色を表示 | No |
| `dump` | `state`の内容と全assignmentを表示 | No |
| `layer <layer>` | active layerを変更 | 10秒後 |
| `get <layer> <key>` | assignmentを表示 | No |
| `none <layer> <key>` | assignmentを消去 | Yes |
| `key <layer> <key> <modifier> <keycode...>` | Keyboard assignmentを設定 | Yes |
| `consumer <layer> <key> <usage>` | Consumer assignmentを設定 | Yes |
| `cycle <layer> <key>` | Layer Cycleを設定 | Yes |
| `back <layer> <key>` | Previous Layerを設定 | Yes |
| `hold <layer> <key> <target>` | Momentary Layerを設定 | Yes |
| `color <layer> <red> <green> <blue>` | Layer LED色を設定。`0 0 0`で消灯 | Yes |
| `enabled <layer> <0\|1>` | Layerを無効／有効にする。Layer 0は無効化不可 | Yes |
| `encoder-reversed <0\|1>` | Encoder回転方向を標準／反転にする | Yes |
| `pcb-revision <2\|3>` | Matrix Row 1を旧PCBのGPIO 0／現行PCBのGPIO 2へ切り替える | Yes |
| `led-reversed <0\|1>` | 外付けLEDのphysical pixel順を標準／反転にする | Yes |
| `led-brightness <0-128>` | Layer表示の輝度上限を設定 | Yes |
| `animation <0-3>` | 打鍵効果を波紋／無効／フラッシュ／スパークに設定 | Yes |
| `animation-brightness <0-128>` | 打鍵アニメーションの輝度上限を設定 | Yes |
| `layer-display <0\|1>` | Layer表示を全灯／4灯パターンに設定 | Yes |
| `tap-dance <50-1000>` | Layer Tap Dance判定時間をmsで設定 | Yes |
| `reset confirm` | 全キーマップとdevice設定をcompile済み既定値へ戻す | Yes |
| `diag` | Storage self-testを実行 | Test writes |
| `bootloader` | UF2 bootloaderへ再起動 | No |

Examples:

```text
state
get 0 1
key 1 1 0x00 0x04
key 1 2 0x01 0x06
consumer 0 1 0x00e2
cycle 0 8
back 0 7
hold 0 5 2
color 0 32 160 255
color 7 0 0 0
enabled 2 1
encoder-reversed 1
pcb-revision 3
led-reversed 0
led-brightness 32
animation 0
animation-brightness 96
layer-display 1
tap-dance 250
```

`animation`は`0`が波紋、`1`が無効、`2`がフラッシュ、`3`がスパークです。`layer-display`は`0`が全灯、`1`が4灯パターンです。`pcb-revision`は`2`または`3`だけを受け付けます。boolean設定は`0`が標準／無効、`1`が反転／有効です。

Keyboard modifier bitmap:

| Bit | Modifier |
| ---: | --- |
| `0x01` | Left Ctrl |
| `0x02` | Left Shift |
| `0x04` | Left Alt |
| `0x08` | Left GUI |
| `0x10` | Right Ctrl |
| `0x20` | Right Shift |
| `0x40` | Right Alt |
| `0x80` | Right GUI |

設定変更commandは成功時に設定全体を即座にFlashへ保存します。`reset`は誤操作を避けるため、必ず`reset confirm`と入力します。保存に失敗した場合はRAM上の値も変更前へ戻します。`diag`はWeb DiagnosticsのStorage testと同じ保存領域を検査します。

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Device pickerにOctGearがない | 対応browser、HTTPS / localhost、USB cable、VID/PIDを確認 |
| 接続直後に切断表示になる | heartbeat timeout、device再起動、別tabの接続を確認 |
| Remapper接続中に通常キーが出ない | 設計どおり。Disconnectすると通常出力へ戻る |
| Encoder方向が違う | Remapperの「回転方向 / 反転」を切り替える |
| K1-K4だけ反応しない | 基板revisionを確認し、Remapperの「PCBリビジョン」をv2またはv3へ合わせる |
| 打鍵アニメーションの左右が逆 | Remapperの「LEDテープ方向 / 反転」を切り替える |
| Encoderのdetent数が違う | profileの`stepsPerDetent`を確認して再build |
| UF2 driveへ直接書けない | UF2をdownloadしてOSからcopy |
| `OCTGEAR` driveが出ない | USB接続前からKey 4を保持しているか確認 |
| WebUSBの接続通知が出ない | desktop Chromiumの通知対応を確認し、出ない場合はRemapper URLを直接開く |
| Rescue portを自動検出できない | OSのserial port権限とmanual selectionを確認 |
