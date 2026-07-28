# Web App

React 19 + TypeScript + Viteで構成する、OctGearのWeb toolsです。Home、Build Guide、Remapper、Diagnosticsをmulti-page buildで出力します。

システム全体の関係は[`docs/architecture.md`](../../docs/architecture.md)、利用手順は[`docs/operations.md`](../../docs/operations.md)を参照してください。

## Entry Points

| Page | HTML | React entry | Page component |
| --- | --- | --- | --- |
| Home | `index.html` | `src/main.tsx` | `src/app/pages/HomePage.tsx` |
| Build Guide | `octgear.html` | `src/pages/build-guide.tsx` | `src/app/pages/BuildGuidePage.tsx` |
| Remapper | `octgear-remapper.html` | `src/pages/remapper.tsx` | `src/app/pages/RemapperApp.tsx` |
| Diagnostics | `octgear-diagnostics.html` | `src/pages/diagnostics.tsx` | `src/app/pages/DiagnosticsApp.tsx` |

GitHub Pages modeではVite baseが`/octgear/`、通常のdevelopment / buildでは`/`です。内部linkとfirmware asset URLはbaseを考慮して組み立てます。

## Source Layout

```text
src/
├── app/
│   ├── components/       pageを構成するUI
│   ├── hooks/            device session lifecycle
│   ├── pages/            page-level stateとworkflow
│   └── remapper/         editor固有の変換
├── features/
│   ├── device/           WebHID transportとcommand codec
│   ├── firmware/         UF2 download / install
│   ├── hardware/         製品共通hardware metadata型
│   └── keymap/           assignment modelとpicker data
├── pages/                multi-page entry points
├── products/             製品定義、製品一覧、製品別generated metadata
└── shared/               i18n等の小さい共通module
```

Dependency directionはpageからfeatureへ向けます。TransportはUI stateを持たず、protocol moduleはDOMを参照しません。特定featureだけで使う処理は`shared`へ移さず、そのfeature内に置きます。

## Product Definitions

`src/products/<product-id>/product.ts`がWeb側の製品単位の正本です。製品名、page route、公式頒布・問い合わせ先、markとBuild Guide asset、USB VID/PID、配布UF2、生成Hardware metadataを1つの`ProductDefinition`へまとめます。Homeは`src/products/catalog.ts`を`ProductCard`で描画し、Remapper、Diagnostics、Build Guideは各entry pointから`ProductProvider`で対象製品を受け取ります。共通のWebHID transportとFirmware updaterは製品固有値を保持しません。

対応製品を追加する場合:

1. `hardware/<product-id>/profile.json`と対応Firmware directoryを用意し、`node scripts/generate-hardware-config.mjs <product-id>`を実行します。
2. `src/products/<product-id>/product.ts`へroute、asset、USB identity、UF2を定義し、`catalog.ts`へ追加します。
3. `ja.ts`と`en.ts`へ製品文言を追加し、`productMessages.ts`で製品IDへ対応づけます。
4. 製品別HTMLと`src/pages/` entryを追加し、`ProductProvider`へ製品定義を渡してVite inputへ登録します。
5. Build Guide assetと配布UF2を製品定義のpublic pathへ配置します。

RemapperとDiagnosticsの共通利用には現在の32-byte WebHID protocolとの互換性が必要です。protocolが異なる製品はtransport / command adapterも製品定義から切り替えられる境界を追加してください。

HomeのOctGear product cardは`public/build-guide/completed/`の正面写真を製品visualとして使用します。Build Guideの完成配置図は`public/build-guide/layout/`のSVG外形へHTML / CSSの8キー、Encoder、側面5灯を重ね、同directoryの完成写真と`public/build-guide/pcb/`のPCB製造previewを併記します。写真とpreviewはページ内で拡大表示できます。部品識別と組み立て工程の写真は`public/build-guide/assembly/`へ配置し、`ja.ts`と`en.ts`の各`photo.file`へfile名を設定するとプレースホルダーから写真表示へ切り替わります。Three.jsのSTL Viewerではcase 3層とencoder knobをbrowser内で読み込み、回転・zoom・表示resetを提供します。組み立て、製造データdownload、Firmware導入、Diagnosticsによる完成検査を1ページで案内し、印刷時はnavigationとWeb操作buttonを省略します。

配布用GerberとSTLは`public/build-guide/downloads/`で管理します。公開名には製品名と部品用途を含め、Gerber ZIP内のfile prefixも`octgear-`へ統一します。

## Device Session

接続時は次の順で処理します。

1. 対象entry pointへ渡された製品定義のVID/PID filterでdeviceを選択
2. HID deviceをopen
3. heartbeatを送信
4. `GetState`でdevice dimensions、layer状態、Encoder方向、LEDテープ方向、打鍵アニメーションと輝度上限を取得
5. `GetKey`で全keymapを読込
6. 300 ms間隔のheartbeatとphysical disconnect listenerを開始

Heartbeat sendが失敗するか700 msでtimeoutするとsessionを閉じます。Firmware側のheartbeat有効期限は3000 msです。

WebHID commandは固定32-byte reportです。同期requestは同じcommand byteのresponseを1つ待つ設計なので、同じtransport上でcommandを並列送信しないでください。詳細は[`docs/hid-report.md`](../../docs/hid-report.md)にあります。

## Remapper State

Remapperは2つのkeymapを保持します。

- `readKeymap`: 最後にdeviceから正常に読んだ内容
- `writeKeymap`: UIで編集中の内容

Layerの有効状態とRGB LED色も読込済みと編集中で分けて保持します。Layer 0は常時有効で、Layer 1-7はcheckboxから変更できます。初期状態ではLayer 0と1だけが有効です。RGB `0,0,0`は消灯として扱います。

Save時はdeviceが返したlayer / key countへnormalizeし、assignment、layer有効状態、RGB色の差分だけを逐次保存します。Readは全keymapとlayer設定を再取得し、編集中内容を置き換えます。Physical `KeyEvent`のpressは現在の表示layerを維持したまま、対応するcontrolだけを選択します。

Read左のoverflow menuから初期化を選ぶと、確認dialogを経て全assignment、layer有効状態、RGB色、Encoder方向、LEDテープ方向、打鍵アニメーション、各輝度上限をfirmwareの既定値へ戻し、実機へ保存してからUIを再読込します。

Hardware panelのEncoder方向checkboxは変更時に即座に実機へ保存します。既定値はhardware profileの`encoder.reversed`です。LED輝度上限は`0-128`で編集し、「適用」で実機へ保存します。`0`は消灯、既定値は`32`です。

LEDテープ方向checkboxも変更時に即座に実機へ保存します。標準順は盤面左端のLED 1をphysical pixel 0へ対応させ、反転時は最後のphysical pixelへ対応させます。既定値はhardware profileの`externalRgbLedReversed`です。

アニメーション効果のプルダウンは、打鍵時の表示を無効／波紋／フラッシュ／スパークから選び、変更時に即座に実機へ保存します。既定値はhardware profileの`statusLedKeyAnimation`です。

アニメーション輝度上限は`0-128`で編集し、「適用」で実機へ保存します。Layer表示のLED輝度上限とは独立しており、より高い値にすると光っているpixelだけを明るくしてコントラストを強めます。既定値は`96`です。

## Remapper Layout

PCとタブレットでは、topbarの「表示倍率」からWorkspaceを`80%`、`90%`、`100%`へ切り替えられます。既定値は`90%`で、選択値はbrowserのlocal storageへ保存します。倍率はHardware、Remap、Editor、keyboard pickerへ適用し、接続操作は読みやすい通常サイズを保ちます。

段組みは従来の安定したbreakpointを維持し、`1060px`を超える画面では3列、`901-1060px`では2列、`900px`以下では1列で表示します。`640px`以下ではtouch targetを小さくしないため倍率選択を隠し、Workspaceを`100%`で表示します。

## Firmware Updater

`src/features/firmware/firmwareUpdater.ts`は、製品定義からUF2のpublic pathとfile名を受け取り、次を担当します。

- 製品定義の`${BASE_URL}<firmware-public-path>`からのdownload
- File System Access API support判定
- Userが選択したUF2 driveへの製品別UF2 file書込

BOOTSEL移行command自体はdevice featureにあり、page componentがsession closeとUI stateを調停します。

## Localization

`src/shared/i18n/ja.ts`をshapeの基準にし、`en.ts`はその型を満たします。各ページの`Language`ボタンから日本語と英語を即時に切り替えられ、選択値は`studio-juh.locale`としてbrowserのlocal storageへ保存されます。保存値がない場合のdefault localeは`ja`です。表示文言を追加する場合は両方を更新します。

## Development

Repository rootから実行します。

```sh
pnpm dev
pnpm typecheck
pnpm build
```

Firmware bundleを更新する場合は`pnpm firmware:web`を使います。より詳しい変更別手順は[`docs/development.md`](../../docs/development.md)を参照してください。
