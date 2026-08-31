export const ja = {
  app: {
    title: "Remapper",
    workspaceLabel: "リマッパー作業領域",
    workspaceScale: "表示倍率",
    workspaceScaleValue: (scale: number) => `${scale}%`,
    language: "Language",
    switchLanguageLabel: "表示言語を英語に切り替え",
  },
  home: {
    eyebrow: "Studio Juh",
    title: "Device Hub",
    description: "スタートガイド、ビルドガイド、Remapperから必要な案内とツールを開きます。",
    productListLabel: "製品一覧",
    products: {
      octgear: {
        status: "Available",
        name: "OctGear",
        description: "2 × 4キーマトリクスとA/C/B/SWロータリーエンコーダを持つRP2040ボードです。",
        deviceImageAlt: "側面LEDが発光している完成したOctGearの正面写真",
        encoderValue: "A/C/B/SW",
        connectionValue: "WebHID",
        remapperDescription:
          "8キー + ロータリーエンコーダ RP2040 ボード用 WebHID キーマップエディタ",
      },
    },
    keys: "Keys",
    encoder: "Encoder",
    layers: "Layers",
    connection: "Connection",
    openStartGuide: "Start Guide",
    openBuildGuide: "Build Guide",
    openRemapper: "Open Remapper",
    openDiagnostics: "Open Diagnostics",
    openStore: "頒布・問い合わせ",
    backHome: "Home",
  },
  octgearStartGuide: {
    brandKicker: "Start Guide",
    navigationLabel: "スタートガイドのナビゲーション",
    kicker: "Ready to Use",
    title: "OctGear スタートガイド",
    description:
      "組み立てが完了したOctGearと完成品を購入した方へ、最初の接続から設定、日常の使い方、困ったときの確認方法までを案内します。",
    start: "使い始める",
    factsLabel: "利用環境",
    facts: [
      { label: "CONNECTION", value: "USB Type-C" },
      { label: "SETUP", value: "Web Remapper" },
      { label: "BROWSER", value: "Chromium" },
      { label: "DRIVER", value: "不要" },
    ],
    pageIndexLabel: "ページ内目次",
    pageIndex: [
      { href: "#first-use", label: "最初の接続" },
      { href: "#controls", label: "基本操作" },
      { href: "#remap", label: "キー設定" },
      { href: "#firmware", label: "Firmware更新" },
      { href: "#help", label: "困ったとき" },
    ],
    firstUseKicker: "First Connection",
    firstUseTitle: "最初に動作を確認する",
    firstUseDescription:
      "Firmware導入済みの完成品はすぐにUSBキーボードとして使用できます。データ通信対応ケーブルで接続し、次の順に確認してください。",
    firstUseSteps: [
      {
        title: "USBで接続",
        description:
          "OctGearとPCをUSB Type-Cケーブルで接続します。充電専用ではなく、データ通信対応のケーブルを使用します。",
      },
      {
        title: "LEDを確認",
        description:
          "USB認識前は側面LEDが流れるように光り、認識後は現在のLayer表示へ切り替わります。",
      },
      {
        title: "入力を確認",
        description:
          "キーとEncoderを操作します。初期割り当ては次の「基本操作」で確認できます。",
      },
      {
        title: "Remapperへ接続",
        description:
          "対応browserでRemapperを開き、ConnectからOctGearを選ぶと、現在の設定を読み込めます。",
      },
    ],
    browserNoteTitle: "RemapperはChromium系browserで使用します",
    browserNoteDescription:
      "WebHIDを利用するため、最新のChromeやEdgeなどでHTTPS配信ページを開いてください。通常のキーボード入力にはbrowserや専用driverは不要です。",
    devicePickerScreenshot: {
      caption: "Connectを押した後、browserの一覧から「OctGear」を選択します。",
      alt: "ChromeのHIDデバイス接続画面にOctGearが表示されているスクリーンショット",
    },
    controlsKicker: "Basic Controls",
    controlsTitle: "初期状態の基本操作",
    controlsDescription:
      "初期設定ではLayer 0が音量・メディア操作、Layer 1がQ/W/E/A/S/D入力です。Layer 2〜7は未割り当てです。",
    controls: [
      {
        label: "LAYER 0",
        title: "音量とメディア",
        description:
          "K2〜K4でMute・音量−・音量＋、K6〜K8で前の曲・再生／一時停止・次の曲を操作します。Encoder回転でも音量を変更できます。",
      },
      {
        label: "LAYER 1",
        title: "6キー入力",
        description:
          "上段K2〜K4がQ・W・E、下段K6〜K8がA・S・Dです。用途に合わせてRemapperから自由に変更できます。",
      },
      {
        label: "CHANGE",
        title: "Layerを切り替える",
        description:
          "K1の単押しで次の有効Layerへ進み、ダブルタップで前へ戻ります。K5を押している間はLayer 1へ切り替わります。",
      },
    ],
    savedSettingsTitle: "設定は本体へ保存されます",
    savedSettingsDescription:
      "キーマップやLED設定はOctGear本体へ保存されるため、別のPCへ接続しても引き継がれます。通常Layerは切り替え後10秒で保存されます。",
    remapKicker: "Customize",
    remapTitle: "Remapperで自分用に設定する",
    remapDescription:
      "アプリのインストールは不要です。Webページからキー割り当て、Layer、LED、Encoderなどを設定できます。",
    remapSteps: [
      "ChromeまたはEdgeでRemapperを開きます。",
      "Connectを押し、一覧からOctGearを選択します。",
      "編集するLayerとキー／Encoder操作を選び、割り当てを変更します。",
      "Saveを押し、変更内容をOctGear本体へ保存します。",
      "Disconnect後、設定した入力が通常のアプリで動作することを確認します。",
    ],
    remapperScreenshot: {
      caption: "RemapperではLayer、8キー、Encoder、割り当て候補を1画面で確認できます。",
      alt: "OctGear RemapperのLayer、キー、Encoder、キーボード選択画面",
    },
    hardwareScreenshot: {
      caption: "Hardware設定では回転方向、LED表示、Tap Dance判定時間、アニメーション、輝度を調整できます。",
      alt: "OctGear RemapperのHardware設定にある変更可能な設定項目",
    },
    openRemapper: "Remapperを開く",
    firmwareKicker: "Keep Updated",
    firmwareTitle: "Firmwareを更新する",
    firmwareDescription:
      "通常利用では毎回更新する必要はありません。新機能や修正が必要なときに、RemapperのFirmware欄から更新します。",
    firmwareCards: [
      {
        label: "BEFORE UPDATE",
        title: "保存済み設定は維持されます",
        description:
          "通常のFirmware更新だけでは、保存済みキーマップやLED設定を上書きしません。重要な設定は事前に内容を確認してください。",
        action: "none",
      },
      {
        label: "UPDATE",
        title: "UF2を書き込む",
        description:
          "RemapperからBOOTSELへ切り替え、表示されたUF2ドライブへ同梱Firmwareを書き込みます。対応browserではページから直接書き込めます。",
        action: "remapper",
      },
    ],
    firmwareScreenshot: {
      caption: "RemapperのUpdaterからBOOTSELへの切り替え、直接書き込み、UF2のdownloadを選べます。",
      alt: "OctGear RemapperのFirmware updater画面",
    },
    openUpdater: "Firmware欄を開く",
    helpKicker: "Support",
    helpTitle: "困ったときに確認する",
    helpDescription:
      "まず接続と設定を確認し、解決しない場合はDiagnosticsで物理入力と本体通信を切り分けます。",
    troubleshooting: [
      {
        title: "PCがOctGearを認識しない",
        description:
          "USBケーブルを抜き差しし、別のUSB portとデータ通信対応ケーブルを試します。USB hubを使っている場合はPCへ直接接続します。",
      },
      {
        title: "Remapperの一覧にOctGearが出ない",
        description:
          "ChromeやEdgeなどの対応browserでHTTPSページを開いているか確認します。別tabで接続中の場合は、その接続を解除してから再度Connectします。",
      },
      {
        title: "Remapper接続中にキー入力できない",
        description:
          "設定中の誤入力を防ぐための正常な動作です。Disconnectすると通常のキーボード入力へ戻ります。",
      },
      {
        title: "キー、Encoder、LEDの動作がおかしい",
        description:
          "Diagnosticsで各入力を確認します。Encoder方向、PCBリビジョン、LEDテープ方向はRemapperのHardware設定から変更できます。",
      },
      {
        title: "WebHIDを使えず設定を戻せない",
        description:
          "Key 4を押したままUSB接続すると、その起動だけOCTGEAR rescue driveとSerial rescueを利用できます。通常利用へ戻るときはUSBを抜き、キーを押さずに再接続します。",
      },
    ],
    diagnosticsTitle: "入力を診断する",
    diagnosticsDescription:
      "8キー、Encoder 3操作、本体とのreport通信を順番に確認できます。Storage testはFlashへ書き込むため、必要な場合だけ実行してください。",
    supportTitle: "頒布元へ問い合わせる",
    supportDescription:
      "解決しない場合は、購入時期、使用OSとbrowser、LEDの状態、Diagnosticsの結果を添えてお問い合わせください。",
    footerTitle: "組み立て情報をお探しですか？",
    footerDescription:
      "PCBから製作する場合や、組み立て後の最終検査を行う場合は、別ページのBuild Guideを参照してください。",
    openBuildGuide: "Build Guideを見る",
  },
  octgearBuildGuide: {
    brandKicker: "Build Guide",
    navigationLabel: "ビルドガイドのナビゲーション",
    kicker: "Assembly & Setup",
    title: "OctGear ビルドガイド",
    description:
      "頒布キットの確認から組み立て、Firmware導入、全入力の動作確認までを順番に案内します。構成が異なる場合は、頒布元から同梱された案内を優先してください。",
    start: "組み立てを始める",
    jumpToCheck: "最終確認を見る",
    factsLabel: "ビルド概要",
    facts: [
      { label: "INPUT", value: "8 Keys + Rotary" },
      { label: "LAYOUT", value: "2 × 4 Matrix" },
      { label: "STATUS LED", value: "Side 4 Pixels" },
      { label: "FINAL CHECK", value: "Web Diagnostics" },
    ],
    pageIndexLabel: "ページ内目次",
    pageIndex: [
      { href: "#prepare", label: "準備" },
      { href: "#assembly", label: "組み立て" },
      { href: "#downloads", label: "配布データ" },
      { href: "#firmware", label: "Firmware" },
      { href: "#final-check", label: "動作確認" },
    ],
    prepareKicker: "Before You Start",
    prepareTitle: "部品と工具を確認",
    prepareDescription:
      "最初に頒布物の同梱一覧と照合します。外観や部品数に問題がある場合は、通電やはんだ付けを始める前に頒布元へ確認してください。",
    packageTitle: "主な構成品",
    packageItems: [
      "OctGear メインPCB（Gerberを使用してJLCPCB等で発注）",
      "Waveshare RP2040-Zero、または互換品（RP2350-Zeroは互換候補。専用Firmwareが必要／実機未検証）",
      "キースイッチ8個とキーキャップ8個（すべて1Uで使用可能）",
      "キーホットスワップソケット8個",
      "EC11ロータリーエンコーダー（高さ15mm）とノブ",
      "WS2812B LEDテープ（DC5V、1m／60 LEDs、使用数4灯）",
      "M2 × 8mmねじ、または対応するセルフタッピングねじ",
      "ケース部品（ケース上面・底面、LED拡散部品。セルフ3Dプリント、またはJLC3DP等で発注）",
      "スペーサーは原則不要（必要な場合はクッションテープ等で調整）",
      "クッションゴム4個（ケース底面の滑り止め足として使用）",
    ],
    toolsTitle: "用意するもの",
    toolItems: [
      "データ通信に対応したUSBケーブル",
      "ケースに合う小型ドライバー",
      "曲がった端子の確認に使うピンセット",
      "はんだごて",
      "はんだ",
      "配線材（AWG24等）",
      "換気設備",
    ],
    optionalToolsTitle: "あると良いもの",
    optionalToolItems: [
      "キースイッチプラー",
      "ペンチ（ロータリーエンコーダーのナット締めに使用）",
    ],
    photoPlaceholder: (index: number) =>
      `PHOTO ${String(index).padStart(2, "0")}`,
    photoPending: "撮影写真を追加予定",
    partsReferenceTitle: "部品を見分ける",
    partsReferenceDescription:
      "俯瞰写真の代わりに部品を1種類ずつ掲載しています。組み立て前に、写真と照らし合わせて形状、数量、表裏を確認します。",
    partReferences: [
      {
        title: "OctGear メインPCB",
        quantity: "1",
        description:
          "キー番号が見える裏面、RP2040とEncoderを取り付ける右側、USB端子側を確認します。",
        photo: {
          file: "octgear-main-pcb-back.jpg",
          title: "PCB裏面とキー番号",
          alt: "Key 1からKey 8の番号とソケット取付位置が見えるOctGearメインPCB裏面の写真",
        },
      },
      {
        title: "RP2040-Zero",
        quantity: "1",
        description:
          "Waveshare RP2040-Zeroまたはpin互換品です。USB端子とpin表記を実装前に確認します。",
        photo: {
          file: "octgear-rp2040-zero-solder-side.jpg",
          title: "実装したRP2040-Zeroの裏面",
          alt: "OctGear PCBへ取り付けたRP2040-Zeroの裏面とUSB端子方向を示す写真",
        },
      },
      {
        title: "ホットスワップソケット",
        quantity: "8",
        description:
          "PCB裏面のKey 1〜8へ取り付けます。端子と2つのはんだpadの形状を確認します。",
        photo: {
          file: "octgear-hot-swap-sockets.jpg",
          title: "ソケットの正しい向きと端子",
          alt: "キーホットスワップソケットの正しい向きと端子を示す写真",
        },
      },
      {
        title: "EC11 Encoderと固定金具",
        quantity: "1 set",
        description:
          "高さ15mmのEC11です。A/C/B/SW端子、固定脚、ナット、ワッシャーを確認します。",
        photo: {
          file: "octgear-ec11-encoder-hardware.jpg",
          title: "EC11本体・ナット・ワッシャー",
          alt: "EC11ロータリーエンコーダーの端子、固定脚、ナット、ワッシャーを示す写真",
        },
      },
      {
        title: "WS2812B LEDテープ",
        quantity: "4 pixels",
        description:
          "切断位置、5V、GND、DIN、data方向の矢印を確認し、4灯分を使用します。",
        photo: {
          file: "octgear-ws2812b-four-pixel-strip.jpg",
          title: "4灯へ切り出したLEDとdata方向",
          alt: "4灯へ切り出したWS2812B LEDテープとdata方向を示す写真",
        },
      },
      {
        title: "ケース上面",
        quantity: "1",
        description:
          "8個のキースイッチ用開口とEncoder軸の穴がある上面部品です。造形面と開口部を確認します。",
        photo: {
          file: "octgear-case-top.jpg",
          title: "ケース上面",
          alt: "8個のキースイッチ用開口とEncoder軸穴があるOctGearのケース上面の写真",
        },
      },
      {
        title: "Case Bottom",
        quantity: "1",
        description:
          "PCB、配線、固定ナットを収める底面部品です。ねじ穴と内側の溝を確認します。",
        photo: {
          file: "octgear-case-bottom.jpg",
          title: "Case Bottom内側",
          alt: "ねじ穴、配線溝、固定ナット位置が見えるOctGear Case Bottom内側の写真",
        },
      },
      {
        title: "LED拡散部品",
        quantity: "1",
        description:
          "側面4灯の光を外周へ導く透明／半透明部品です。Case Bottomの溝へ収めます。",
        photo: {
          file: "octgear-led-diffuser.jpg",
          title: "透明なLED拡散部品",
          alt: "OctGearの側面LED光を拡散する透明な棒状部品の写真",
        },
      },
      {
        title: "1/4 inch mount nut",
        quantity: "1",
        description:
          "Case Bottom中央へ固定するmount用ナットです。ねじ規格を実物で確認します。",
        photo: {
          file: "octgear-quarter-inch-mount-nut.jpg",
          title: "mount固定ナット",
          alt: "OctGearのCase Bottomへ取り付ける六角形のmount固定ナットの写真",
        },
      },
      {
        title: "ケース固定ねじ",
        quantity: "5",
        description:
          "Case Bottomから上面部品を固定するM2 × 8mm相当のねじです。",
        photo: {
          file: "octgear-case-screws.jpg",
          title: "ケース固定ねじ",
          alt: "OctGearケースの固定に使用する5本のねじの写真",
        },
      },
      {
        title: "Encoderノブ",
        quantity: "1",
        description:
          "EC11のD軸へ取り付けます。軸形状とノブ内側の向きを合わせます。",
        photo: {
          file: "octgear-encoder-knob.jpg",
          title: "D軸用Encoderノブ",
          alt: "OctGearのEC11ロータリーエンコーダーへ取り付ける白いノブの写真",
        },
      },
      {
        title: "キースイッチ",
        quantity: "8",
        description:
          "MX互換キースイッチを使用します。ソケットへ差し込む前に2本の端子が真っすぐか確認します。",
        photo: {
          file: "octgear-key-switches.jpg",
          title: "MX互換キースイッチの端子",
          alt: "OctGearで使用する8個のMX互換キースイッチと端子を示す写真",
        },
      },
      {
        title: "Keycap",
        quantity: "8",
        description:
          "すべて1Uで使用できます。隙間を詰める場合のみKey 1と5へ幅広capを選べます。",
        photo: {
          file: "octgear-keycaps.jpg",
          title: "1U Keycap",
          alt: "OctGearで使用する8個の1Uキーキャップの写真",
        },
      },
    ],
    safetyTitle: "作業前にUSBを外してください",
    safetyDescription:
      "部品の取り付け、ねじ締め、はんだ付けは必ず電源を外した状態で行います。端子を無理に押し込まず、向きが合わない場合はいったん取り外して確認してください。",
    layoutKicker: "Control Layout",
    layoutTitle: "完成時の操作配置",
    layoutDescription:
      "盤面は上段Key 1〜4、右へずれた下段Key 5〜8、右下に張り出すロータリーエンコーダの配置です。すべて1Uのキーキャップで使用できます。隙間を詰めたい場合のみ、Key 1に1.25U、Key 5に1.5Uを選べます。側面LEDは左からLED 1〜4として扱い、EncoderのCCW／CW／SWは右端のLED 4をK4／K8と共有します。",
    layoutAriaLabel:
      "オプションの1.25U Key 1を含む上段Key 1から4、オプションの1.5U Key 5を含む右へずれた下段Key 5から8、右下のロータリーエンコーダ、下に分けて示した側面4灯LEDの完成配置図。全キー1Uでも使用可能",
    keyLabel: (index: number) => `Key ${index}`,
    optionalKeycapSize: (size: string) => `${size} 任意`,
    encoderLabel: "Rotary",
    encoderOperations: "CCW / CW / SW",
    ledStripLabel: "Side LEDs",
    completedReferenceTitle: "完成例",
    completedReferenceDescription:
      "組み立て後の外観と、透明／半透明のLED拡散部品から側面LEDの光が見える状態を確認できます。画像を選択すると拡大表示します。",
    completedImages: [
      {
        file: "octgear-completed-top.jpg",
        title: "上面ビュー",
        alt: "完成したOctGearを上面から見た写真",
      },
      {
        file: "octgear-completed-front.jpg",
        title: "正面ビュー",
        alt: "側面LEDが発光している完成したOctGearの正面写真",
      },
    ],
    pcbReferenceTitle: "PCB製造プレビュー",
    pcbReferenceDescription:
      "Top、配線レイヤー、Bottomを拡大して、キースイッチ位置、外形、端子列を確認できます。画像を選択すると原寸で開きます。",
    pcbImages: [
      {
        file: "octgear-pcb-top.png",
        title: "PCB Top",
        alt: "OctGear PCBのTop面製造プレビュー",
      },
      {
        file: "octgear-pcb-layers.png",
        title: "PCB Layers",
        alt: "OctGear PCBの配線レイヤープレビュー",
      },
      {
        file: "octgear-pcb-bottom.png",
        title: "PCB Bottom",
        alt: "OctGear PCBのBottom面製造プレビュー",
      },
    ],
    enlargeGuideImage: (title: string) => `${title}を拡大表示`,
    closeGuideImage: "拡大画像を閉じる",
    assemblyKicker: "Assembly",
    assemblyTitle: "組み立て手順",
    assemblyDescription:
      "頒布形態によって実装済み部品は異なります。該当する工程だけを行い、はんだ付け後はケースを閉じる前にFirmwareとDiagnosticsで確認します。",
    steps: [
      {
        title: "作業面を整え、部品を仮合わせする",
        description:
          "耐熱マット上に構成品を並べ、PCB、ケース上面、ケース底面を固定せずに重ねます。USB端子、Key 1、Encoder側、ねじ穴が一致することを確認します。",
        checks: [
          "PCBに割れ、深い傷、曲がった端子がない",
          "上段Key 1〜4、下段Key 5〜8、右側Rotaryの向きになっている",
          "USBケーブルを外し、換気できる場所で作業している",
        ],
        photo: {
          file: "octgear-case-pcb-test-fit.jpg",
          title: "ケース内へのPCB仮合わせ",
          alt: "OctGearのケースへメインPCBとRP2040-Zeroを正しい向きで仮合わせした写真",
        },
      },
      {
        title: "RP2040-Zeroを取り付ける",
        description:
          "USB Type-C端子がケースの開口側になるようRP2040-Zeroを合わせます。互換boardはpin配置を照合し、全pinの向きと高さを確認してからはんだ付けします。",
        warning:
          "注意: はんだ付け前にケース側面から見て、USB Type-C端子が水平を維持していることを確認してください。傾いたまま固定するとケースが閉まりません。",
        checks: [
          "USB端子とPCBの向きを逆にしていない",
          "ケース側面から見てUSB Type-C端子が水平になっている",
          "RP2040-ZeroがPCBと平行で、端子間をブリッジしていない",
          "互換boardのGPIO配置がOctGear pinoutと一致している",
        ],
        photo: {
          file: "octgear-rp2040-zero-installed.jpg",
          title: "RP2040-Zeroの正しい向きと実装高さ",
          alt: "OctGear PCBへ正しい向きと高さで取り付けたRP2040-Zeroの写真",
        },
      },
      {
        title: "ホットスワップソケットをはんだ付けする",
        description:
          "PCB裏面のKey 1〜8へソケットを密着させ、片側を仮止めして浮きと向きを直してから反対側をはんだ付けします。",
        checks: [
          "8個すべてがPCBの外形線とpadへ合っている",
          "ソケット本体が浮かず、はんだが端子とpadの両方へ流れている",
          "隣接padへはんだブリッジしていない",
        ],
        photo: {
          file: "octgear-hot-swap-sockets-soldered.jpg",
          title: "ソケットの向きと正常なはんだ接合",
          alt: "OctGear PCB裏面へ正しい向きではんだ付けしたホットスワップソケットの写真",
        },
      },
      {
        title: "EC11 Encoderを取り付ける",
        description:
          "加工前・加工後の写真を見比べ、Encoder外周の固定脚を写真と同じ状態へ折り曲げます。PCBへ垂直に差し込み、固定脚とA/C/B/SW端子をはんだ付けします。RP2040に近い側から数えて2番目のPCB端子を、Encoder中央端子とSWのGND側へ配線します。ナットはケースとノブの高さを確認できる状態まで仮締めにします。",
        note:
          "作業のコツ: ケース上面へキースイッチを1〜2個だけ先に取り付け、そのキースイッチをソケットへ差し込んでPCBを仮固定すると、Encoderの位置合わせとはんだ付けがしやすくなります。キースイッチ端子が曲がらないよう、抵抗がある場合は無理に押し込まないでください。",
        warning:
          "注意: RP2040に近い側から2番目の端子は、RP2040の出力へ直結された仮想GNDです。Encoder中央端子とSWのGNDとして使用できますが、LEDのGNDには使用できません。LEDを接続するとRP2040出力の電流容量を超えます。",
        checks: [
          "外周の固定脚だけを加工し、A/C/B/SW端子を曲げていない",
          "RP2040に近い側から2番目の端子をEncoder中央端子とSWのGND側へ配線している",
          "LEDのGNDを仮想GNDへ接続していない",
          "Encoder本体がPCBへ密着し、軸が傾いていない",
          "固定脚を含む全端子が確実に接合されている",
          "回転と押し込みに引っ掛かりがない",
        ],
        photos: [
          {
            file: "octgear-ec11-mounting-tabs-before-bending.jpg",
            title: "1. 固定脚を曲げる前",
            alt: "外周の固定脚を折り曲げる前のEC11ロータリーエンコーダーの写真",
          },
          {
            file: "octgear-ec11-mounting-tabs-after-bending.jpg",
            title: "2. 固定脚を曲げた後",
            alt: "OctGear PCBへ取り付けるため外周の固定脚を折り曲げたEC11ロータリーエンコーダーの写真",
          },
          {
            file: "octgear-ec11-encoder-installed.jpg",
            title: "3. PCBへ取り付けた状態",
            alt: "OctGear PCBへ垂直に取り付けたEC11 Encoderと端子およびナットの写真",
          },
          {
            file: "octgear-ec11-encoder-soldering.jpg",
            title: "4. Encoderをはんだ付けする",
            alt: "OctGear PCBへ取り付けたEC11 Encoderの端子と配線をはんだ付けした写真",
          },
        ],
      },
      {
        title: "LEDテープを4灯へ加工して配線する",
        description:
          "WS2812Bを切断markで4灯分にし、GPIO 14側を最初のpixelのDINへ接続します。5V、GND、data方向を確認し、露出部を絶縁します。",
        note:
          "補足: 写真の配置がFirmwareの既定方向です。既存個体でLEDの動きが左右逆になる場合は、Remapperの「LEDテープ方向／反転」で変更できます。",
        checks: [
          "LEDの矢印が最初のpixelから4灯目へ流れる向きになっている",
          "5VとGNDを逆接続していない",
          "配線がケース外周へ届き、可動部やねじ穴を横切らない",
        ],
        photo: {
          file: "octgear-led-encoder-wiring.jpg",
          title: "LED・Encoderの配線",
          alt: "OctGear PCBへ4灯のWS2812B LEDテープとEC11 Encoderを配線した写真",
        },
      },
      {
        title: "はんだ付けを全体検査する",
        description:
          "通電前にPCB表裏を明るい場所で確認します。金属片、はんだ球、端子の浮き、bridge、被覆が溶けた配線を取り除きます。",
        checks: [
          "隣接端子が意図せず接触していない",
          "USB 5VとGNDの短絡が疑われる箇所がない",
          "すべての配線を軽く動かしても接合部が外れない",
        ],
        photo: {
          file: "octgear-rp2040-zero-solder-side.jpg",
          title: "RP2040-Zeroのはんだ接合部",
          alt: "OctGear PCBへ取り付けたRP2040-Zero裏面のはんだ接合部を示す写真",
        },
      },
      {
        title: "ケースを閉じる前に通電確認する",
        description:
          "耐熱・非導電面に置いてUSBを接続し、異臭や異常発熱がないことを確認します。Firmwareを書き込み、Diagnosticsで8キー、Encoder 3操作、LEDを確認します。",
        checks: [
          "異常に熱い部品がある場合は直ちにUSBを外す",
          "OctGearとして認識され、Diagnosticsへ接続できる",
          "不具合をケース内へ残さず、この段階で修正する",
        ],
        photo: {
          file: "octgear-powered-led-test.jpg",
          title: "USB接続時のLED点灯確認",
          alt: "ケースを閉じる前のOctGear PCBをUSB接続し4灯のLEDを点灯確認している写真",
        },
      },
      {
        title: "PCBとLEDをケースへ収める",
        description:
          "ケース底面へLED拡散部品とPCBを収め、ケース上面の向きを確認します。LEDテープは本体から少し離した側面位置へ配置し、配線を外周、ねじ穴、キースイッチで挟まないよう収めます。",
        checks: [
          "LED拡散部品に透明または半透明の素材を使用している",
          "LED 1〜4が想定する左から右の順に並んでいる",
          "PCBや配線をケースで挟んでいない",
        ],
        photo: {
          file: "octgear-led-strip-case-placement.jpg",
          title: "ケース内のLEDテープ配置",
          alt: "OctGearのケース内でメインPCBに沿って4灯のLEDテープを配置した写真",
        },
      },
      {
        title: "ケース上面とキースイッチを取り付ける",
        description:
          "ケース上面へ四隅のキースイッチから固定し、端子を真っすぐにしてソケットへ差し込みます。抵抗が強い場合は押し込まず、端子の曲がりを確認します。",
        checks: [
          "キースイッチ端子が折れたり、下へ潜り込んだりしていない",
          "ケース上面とキースイッチが浮かず、全キーを軽く押せる",
          "一度大きく曲がった端子は無理に再使用していない",
        ],
        photo: {
          file: "octgear-switches-in-case-top.jpg",
          title: "ケース上面へ取り付けたキースイッチ",
          alt: "OctGearのケース上面へ8個のキースイッチを取り付けた写真",
        },
      },
      {
        title: "1/4インチねじ用ナットをはめる",
        description:
          "ケース固定ねじを締める前に、ケース底面中央の六角穴へ1/4インチねじ用ナットをまっすぐにはめます。ナットが浮かず、ケース底面へ収まっていることを確認します。",
        checks: [
          "ナットが六角穴の奥まで水平に収まっている",
          "ねじ穴がケース底面の開口中央に合っている",
          "押し込みによってケース底面が割れたり変形したりしていない",
        ],
        photo: {
          file: "octgear-quarter-inch-mount-nut-installed.jpg",
          title: "ケース底面へはめた1/4インチねじ用ナット",
          alt: "OctGearのケース底面中央の六角穴へ1/4インチねじ用ナットをはめた状態の写真",
        },
      },
      {
        title: "ねじ、ゴム足、Keycap、ノブを仕上げる",
        description:
          "ねじを対角順に少しずつ締め、がたつきがある場合だけクッションテープ等で調整します。ゴム足、Keycap、ノブを取り付けて操作感を確認します。",
        checks: [
          "ねじを締めすぎてケースやPCBを変形させていない",
          "ノブとケースの間に回転・押し込みできる隙間がある",
          "机上でがたつかず、全キーを軽く押せる",
        ],
        photo: {
          file: "octgear-completed-keycaps-knob.jpg",
          title: "KeycapとEncoderノブの完成状態",
          alt: "8個のKeycapとEncoderノブを取り付けた完成状態のOctGearの写真",
        },
      },
    ],
    downloadsKicker: "Manufacturing Files",
    downloadsTitle: "製造・3Dプリントデータ",
    downloadsDescription:
      "PCB発注用Gerberと、ケース上面・底面、LED拡散部品、エンコーダノブ、ゴム足固定ジグのSTLをダウンロードできます。ファイル名はOctGearの部品名へ統一しています。",
    stlViewerTitle: "ケース部品、ノブ、ジグを3Dで確認",
    stlViewerDescription:
      "モデルを切り替え、ドラッグで回転しながら形状と穴位置を確認できます。STLはブラウザ内だけで処理します。",
    stlViewerLoading: "STLを読み込み中",
    stlViewerError: "3D表示を読み込めませんでした。STLを直接ダウンロードしてください。",
    stlViewerReset: "表示をリセット",
    stlViewerInstructions: "ドラッグ: 回転 / ホイール・ピンチ: ズーム",
    middleCaseMaterialTitle: "LED拡散部品は透明／半透明素材を推奨",
    middleCaseMaterialDescription:
      "LED拡散部品は側面LEDの光を外周へ通すライトガイドとして機能します。透明または乳白色などの半透明フィラメント／レジンを使用すると、側面からLayer色とアニメーションが見える構造です。",
    downloads: [
      {
        format: "ZIP",
        title: "PCB Gerber v3",
        description: "銅箔、Mask、Silkscreen、外形、Drill",
        file: "octgear-pcb-gerbers-v3.zip",
      },
      {
        format: "STL",
        title: "ケース上面",
        description: "キースイッチを固定するケース上面",
        file: "octgear-case-top.stl",
      },
      {
        format: "STL",
        title: "ケース底面",
        description: "PCB、配線、固定ナットを収めるケース底面",
        file: "octgear-case-bottom.stl",
      },
      {
        format: "STL",
        title: "LED拡散部品",
        description: "側面LED光を通す部品／透明・半透明推奨",
        file: "octgear-led-diffuser.stl",
      },
      {
        format: "STL",
        title: "Encoder Knob",
        description: "D軸ロータリーエンコーダ用ノブ",
        file: "octgear-encoder-knob.stl",
      },
      {
        format: "STL",
        title: "ゴム足固定ジグ",
        description: "ゴム足の位置決め用。完成品には組み込まない",
        file: "octgear-rubber-foot-fixing-jig.stl",
      },
    ],
    downloadAction: "Download",
    downloadNoticeTitle: "製造前に内容を確認してください",
    downloadNoticeDescription:
      "GerberとSTLは現行構成向けです。発注・造形前に寸法、穴位置、使用部品との適合を確認してください。利用・再頒布には",
    firmwareKicker: "Firmware & Keymap",
    firmwareTitle: "Firmwareを導入して初期設定",
    firmwareDescription:
      "組み立て後はデータ対応USBケーブルでPCへ接続します。Firmware書き込み済みの頒布物でも、最新版への更新を推奨します。",
    firmwareCardTitle: "最新版Firmwareを書き込む",
    firmwareCardDescription:
      "RemapperのUpdaterからBOOTSELへ切り替え、同梱UF2をRPI-RP2ドライブへ書き込みます。",
    remapCardTitle: "キーとLEDを設定する",
    remapCardDescription:
      "接続後にキーマップ、Layer色、エンコーダ方向、LEDテープ方向とアニメーションを設定します。",
    configureKeymap: "キーマップを設定",
    recoveryTitle: "Remapperで認識できない場合",
    recoveryDescription:
      "本体のBOOTを押したままRESETを押して離し、最後にBOOTを離します。PCに現れたRPI-RP2ドライブへUF2を書き込んでください。",
    checkKicker: "Final Check",
    checkTitle: "全11操作を確認",
    checkDescription:
      "Diagnosticsへ接続し、8キーとエンコーダの左回転・右回転・押し込みを一つずつ確認します。頒布前検査にも同じ手順を利用できます。",
    checks: [
      {
        title: "USB接続",
        description: "OctGearとして認識され、DiagnosticsへConnectできる。",
      },
      {
        title: "Key 1〜8",
        description: "各キーを一度ずつ押し、すべてOKになる。",
      },
      {
        title: "Rotary",
        description: "CCW、CW、SWの3操作が個別に記録される。",
      },
      {
        title: "LEDと保存",
        description: "Layer色が点灯し、設定後の再接続でも内容が保持される。",
      },
    ],
    openFinalCheck: "Diagnosticsを開く",
    troubleKicker: "Troubleshooting",
    troubleTitle: "うまく動かないとき",
    troubleDescription:
      "再通電を繰り返す前にUSBを外し、該当箇所の端子、向き、接触を確認してください。",
    troubleshooting: [
      {
        problem: "PCがOctGearを認識しない",
        solution:
          "充電専用ではないUSBケーブルへ交換し、別のUSBポートを試します。改善しない場合はBOOT／RESET操作でRPI-RP2を表示し、Firmwareを書き直します。",
      },
      {
        problem: "特定のキーだけ反応しない",
        solution:
          "USBを外し、キースイッチ端子の曲がり、差し込み不足、はんだ接合を確認します。ダイオードなしMatrixのため、矩形になる複数キー同時押しは制限があります。",
      },
      {
        problem: "同じ行または列のキーがまとめて反応しない",
        solution:
          "USBを外し、該当するMatrix Row／ColumnとRP2040-Zeroの端子を確認します。個別キースイッチより共通信号の接合不良やbridgeを優先して調べます。",
      },
      {
        problem: "エンコーダの回転方向が逆",
        solution:
          "RemapperのHardwareにある「回転方向 / 反転」を切り替えます。再はんだ付けは不要です。",
      },
      {
        problem: "LEDアニメーションの左右が逆",
        solution:
          "RemapperのHardwareにある「LEDテープ方向 / 反転」を切り替えます。",
      },
      {
        problem: "側面LEDが点灯しない",
        solution:
          "USBを外し、5V、GND、最初のpixelのDIN、data方向を確認します。RemapperのLED輝度上限が0でないことも確認してください。",
      },
      {
        problem: "RP2040や配線が異常に熱い・異臭がする",
        solution:
          "直ちにUSBを外し、再接続しないでください。5VとGNDの短絡、LEDの逆接続、はんだbridgeを解消してから再検査します。",
      },
      {
        problem: "PCのスリープ中にLEDが消える",
        solution:
          "正常な動作です。USBサスペンド中は消灯し、PCが復帰すると現在Layerの色へ戻ります。",
      },
    ],
    completeTitle: "Build complete",
    completeDescription:
      "Diagnosticsですべての操作を確認できたら組み立て完了です。Remapperで用途に合わせたLayerを設定してください。",
    distributionTitle: "問い合わせ・主要頒布先",
    distributionDescription:
      "OctGearの頒布情報と問い合わせはBOOTHショップをご確認ください。",
    distributionLink: "BOOTHショップを開く",
    licenseNote:
      "このページは組み立て手順であり、第三者による製造・販売の許諾を示すものではありません。Hardware materialsの利用・再頒布条件は",
    licenseLink: "Hardware License",
  },
  diagnostics: {
    nav: "Diagnostics",
    kicker: "Production Check",
    title: "Diagnostics",
    description: "出荷前のキー押下と基本機能を確認します。",
    keyCheckKicker: "Key Check",
    keyCheckTitle: "全キー / エンコーダを入力",
    functionCheckKicker: "Function Check",
    functionCheckTitle: "Device status",
    reset: "Reset",
    waiting: "チェック待ち",
    pass: "PASS",
    progress: (count: number, total: number) => `${count} / ${total} keys checked`,
    noLastKey: "Last key: -",
    lastKey: (index: number) => `Last key: Key ${index}`,
    encoderCounterTitle: "エンコーダー回転カウンター",
    encoderCounterHelp: "Reset後、各方向へゆっくり20ノッチ回し、表示が20ずつ増えることを確認します。",
    encoderCounterclockwise: "反時計回り (CCW)",
    encoderClockwise: "時計回り (CW)",
    checked: "OK",
    unchecked: "WAIT",
    webHid: "WebHID",
    deviceConnection: "Device connection",
    keyEvent: "Key event",
    reportSend: "Report send",
    reportDetail: "Report detail",
    storageWriteRead: "Storage write/read",
    storageDetail: "Storage detail",
    reportKeys: "Report keys",
    runReportTest: "Report test",
    runStorageTest: "Storage test",
    reportTesting: "Testing report send",
    reportTestPassed: (signature: string, version: number) => `${signature} v${version}`,
    reportTestFailed: "Report send failed",
    storageTesting: "Testing storage",
    storageTestPassed: (layers: number, keys: number) => `${layers} layers x ${keys} keys restored`,
    storageTestFailed: "Storage test failed",
    storageWriteWarning: "Storage test は実際のFlash保存領域へ書き込みます。出荷検査など必要な時だけ実行してください。",
    ok: "OK",
    ng: "NG",
  },
  connection: {
    idle: "Idle",
    connected: "Connected",
    connect: "Connect",
    disconnect: "Disconnect",
    updater: "Updater",
    connectFailed: "接続に失敗しました",
    deviceNotConnected: "HIDデバイスが接続されていません",
    layerChangeFailed: "レイヤー変更に失敗しました",
  },
  hardware: {
    kicker: "Board Profile",
    title: "Hardware",
    settingsTitle: "Hardware設定",
    openSettings: "設定を開く",
    closeSettings: "閉じる",
    summary: (revision: number, keyCount: number) =>
      `PCB v${revision} / ${keyCount} controls`,
    profileDetails: "Board詳細",
    deviceSettings: "変更可能な設定",
    keys: "Keys",
    encoder: "Encoder",
    encoderValue: (pinCount: number) => `${pinCount}pin A/C/B/SW`,
    encoderDirection: "回転方向",
    encoderReversed: "反転",
    encoderDirectionUpdated: (reversed: boolean) => `Encoder方向: ${reversed ? "反転" : "標準"}`,
    encoderDirectionFailed: "Encoder方向の変更に失敗しました",
    pcbRevision: "PCBリビジョン",
    pcbRevisionDefault: (revision: number) => `PCB v${revision}（現行）`,
    pcbRevisionLegacy: (revision: number) => `PCB v${revision}（旧基板）`,
    pcbRevisionHint: "基板に合わせてRow 1をGPIO 2 / GPIO 0へ切り替えます。",
    pcbRevisionUpdated: (revision: number) => `PCBリビジョン: v${revision}`,
    pcbRevisionFailed: "PCBリビジョンの変更に失敗しました",
    statusLedDirection: "LEDテープ方向",
    statusLedReversed: "反転",
    statusLedDirectionUpdated: (reversed: boolean) => `LEDテープ方向: ${reversed ? "反転" : "標準"}`,
    statusLedDirectionFailed: "LEDテープ方向の変更に失敗しました",
    statusLayerDisplayMode: "レイヤー表示",
    statusLayerDisplaySolid: "全灯（レイヤー色）",
    statusLayerDisplayPattern: "4灯パターン",
    statusLayerDisplayRainbowCycle: "虹色サイクル",
    statusLayerDisplayPatternHint:
      "Layer 0–7: 1000 / 0100 / 0010 / 0001 / 0111 / 1011 / 1101 / 1110",
    statusLayerDisplayRainbowCycleHint:
      "4灯の虹色が流れ続けます。レイヤー色は表示しません。",
    statusLayerDisplayModeUpdated: (mode: number) =>
      `レイヤー表示: ${["全灯", "4灯パターン", "虹色サイクル"][mode] ?? mode}`,
    statusLayerDisplayModeFailed: "レイヤー表示の変更に失敗しました",
    layerTapDanceTerm: "タップダンス判定時間",
    layerTapDanceTermValue: "タップダンス判定時間の数値",
    layerTapDanceTermRange: (min: number, max: number) =>
      `${min}-${max} ms / 短いほど単押しの反応が速くなります`,
    layerTapDanceTermUpdated: (termMs: number) =>
      `タップダンス判定時間: ${termMs} ms`,
    layerTapDanceTermFailed: "タップダンス判定時間の変更に失敗しました",
    statusKeyAnimation: "アニメーション効果",
    statusKeyAnimationDisabled: "無効",
    statusKeyAnimationRipple: "波紋",
    statusKeyAnimationFlash: "フラッシュ",
    statusKeyAnimationSpark: "スパーク",
    statusKeyAnimationRainbow: "打鍵虹色",
    statusKeyAnimationUpdated: (animation: number) =>
      `アニメーション効果: ${["波紋", "無効", "フラッシュ", "スパーク", "打鍵虹色"][animation] ?? animation}`,
    statusKeyAnimationFailed: "アニメーション効果の変更に失敗しました",
    statusKeyAnimationBrightness: "アニメーション輝度上限",
    statusKeyAnimationBrightnessValue: "アニメーション輝度上限の数値",
    statusKeyAnimationBrightnessRange: (max: number) =>
      `0-${max} / Layer色をLED輝度上限より明るく強調`,
    statusKeyAnimationBrightnessUpdated: (brightness: number) =>
      `アニメーション輝度上限: ${brightness}`,
    statusKeyAnimationBrightnessFailed: "アニメーション輝度上限の変更に失敗しました",
    statusLedBrightness: "LED輝度上限",
    statusLedBrightnessValue: "LED輝度上限の数値",
    statusLedBrightnessRange: (max: number) => `0-${max} / 0は消灯`,
    statusLedBrightnessUpdated: (brightness: number) => `LED輝度上限: ${brightness}`,
    statusLedBrightnessFailed: "LED輝度上限の変更に失敗しました",
    apply: "適用",
    applying: "保存中",
    matrix: "Matrix",
    matrixValue: (rows: number, columns: number, diodeDirection: string) =>
      `${rows} × ${columns} / ${diodeDirection === "none" ? "ダイオードなし" : diodeDirection}`,
    deviceLayer: "Device layer",
    reportKeys: "Report keys",
    usbId: "USB ID",
    externalRgb: "External RGB",
    externalRgbValue: (count: number) => `GPIO 14 / ${count} pixels`,
    oled: "OLED",
    none: "None",
  },
  keymap: {
    kicker: "Keymap",
    title: "Layers",
    layer: "Layer",
    enabled: "有効",
    disabled: "無効",
    layerEnabledLabel: (layer: number) => `Layer ${layer} を有効にする`,
    baseLayerRequired: "Layer 0は常に有効です",
    layerColor: "LED Color",
    ledOn: "点灯",
    keys: "Keys",
    encoder: "Encoder",
    key: (index: number) => `Key ${index}`,
    moreActions: "その他の操作",
    reset: "初期化",
    resetTitle: "キーマップを初期化しますか？",
    resetDescription: "全キーの割り当て、レイヤーの有効状態、LED色、各輝度上限、Encoder方向、LEDテープ方向、レイヤー表示、アニメーション効果を既定値へ戻します。この操作は実機へすぐ保存されます。",
    resetCancel: "キャンセル",
    resetConfirm: "初期化する",
    resetting: "キーマップを初期化中",
    resetComplete: "キーマップを初期化しました",
    resetFailed: "初期化に失敗しました",
    read: "Read",
    save: "Save",
    noAssignment: "なし",
    unassigned: "未割り当て",
    reading: "キーマップ読み込み中",
    readComplete: "キーマップを読み込みました",
    readFailed: "読み込みに失敗しました",
    savingAll: "全Layer / 全Key のキーマップを保存中",
    saveFailed: "保存に失敗しました",
    saveSkippedAll: "全Layer / 全Key に変更がないため書き込みをスキップしました",
    savedAll: (count: number, layers: number, keys: number) =>
      `全Layer / 全Key の保存が完了しました (${layers} x ${keys}確認, ${count}件更新)`,
  },
  assignment: {
    kicker: "Assignment",
    type: "Type",
    none: "なし",
    keyboard: "キーボード",
    consumer: "メディア",
    layerCycle: "次レイヤー",
    layerPrevious: "前レイヤー",
    momentaryLayer: "一時レイヤー",
    usage: "Usage",
    targetLayer: "Target layer",
    modifier: "Modifier",
    label: "Label",
    usageHex: "Usage hex",
    layerCycleLabel: "次レイヤー",
    layerPreviousLabel: "前レイヤー",
    momentaryLayerLabel: (layer: number) => `押下中 L${layer}`,
  },
  palette: {
    kicker: "Palette",
    title: "Keyboard",
    layoutLabel: "キーボード配列選択",
  },
  firmware: {
    updater: "Updater",
    title: "Firmware",
    initialStatus: "UF2 ready",
    builtAt: (value: string) => `UF2更新: ${value}`,
    close: "Close",
    closeLabel: "ファームウェア更新を閉じる",
    bootsel: "BOOTSEL",
    installUf2: "Install UF2",
    downloadUf2: "Download UF2",
    normalUpdate: "通常の更新",
    normalSteps: [
      "デバイスを接続した状態で BOOTSEL を押します。",
      "Install UF2 を押します。",
      "フォルダ選択では、PCに現れた RPI-RP2 または UF2ブートローダ のドライブを選びます。",
    ],
    recovery: "接続できない時の修復",
    recoverySteps: [
      "本体の BOOT を押したままにします。",
      "RESET を押して離します。",
      "最後に BOOT を離します。",
      "PCに出た RPI-RP2 / UF2 ドライブを選んで書き込みます。",
    ],
    bootDriveReady: "BOOTSEL drive ready",
    bootMode: "BOOTSEL mode",
    enteringBootloader: "BOOTSELへ切替中",
    enterBootloaderFailed: "BOOTSEL切替に失敗しました",
    writing: "UF2書き込み中",
    writeFailed: "UF2書き込みに失敗しました",
    written: (fileName: string, sizeKb: number) => `${fileName} written (${sizeKb} KB)`,
    downloading: "UF2ダウンロード中",
    downloaded: "UF2 downloaded",
    downloadFailed: "UF2ダウンロードに失敗しました",
    browserUnsupported: "このブラウザはUF2の直接書き込みに対応していません",
    fetchFailed: (status: number) => `UF2ファイルを取得できませんでした: ${status}`,
    selectBootDrive: "UF2ブートローダのドライブを選択してください",
  },
  device: {
    fallbackName: "HID device",
    notFound: (productName: string) =>
      `${productName} が見つかりません。接続後にもう一度試すか、ファームウェアを書き込み直してください`,
    missingDevice: "接続するHIDデバイスがありません",
    timeout: "HIDデバイスからの応答がタイムアウトしました",
    unsupportedWebHid: "このブラウザはWebHIDに対応していません",
    disconnected: "HIDデバイスが接続されていません",
    invalidDiagnosticReport: "診断レポートの内容が一致しません",
    invalidPayloadLength: (actual: number, expected: number) =>
      `HID応答の長さが不正です: ${actual} bytes（期待値 ${expected}）`,
    invalidAssignmentKind: (kind: number) => `未定義の割り当て種別です: ${kind}`,
    invalidStatusKeyAnimation: (animation: number) =>
      `未定義のLEDアニメーションです: ${animation}`,
    invalidStatusLayerDisplayMode: (mode: number) =>
      `未定義のレイヤー表示モードです: ${mode}`,
    unexpectedResponse: (actual: number, expected: number) =>
      `Unexpected HID response command ${actual}; expected ${expected}`,
  },
};
