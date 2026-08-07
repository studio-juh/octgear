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
    description: "ビルドガイド、Remapper、Firmware updaterから必要なツールを開きます。",
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
    openBuildGuide: "Build Guide",
    openRemapper: "Open Remapper",
    openDiagnostics: "Open Diagnostics",
    openStore: "頒布・問い合わせ",
    backHome: "Home",
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
      "ケース、プレート（セルフ3Dプリント、またはJLC3DP等で発注）",
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
      "スイッチプラー",
      "ペンチ（ロータリーエンコーダーのナット締めに使用）",
    ],
    photoPlaceholder: (index: number) =>
      `PHOTO ${String(index).padStart(2, "0")}`,
    photoPending: "撮影写真を追加予定",
    partsReferenceTitle: "部品を見分ける",
    partsReferenceDescription:
      "組み立て前に形状、数量、表裏を確認します。各枠は実物写真へ差し替えるためのプレースホルダーです。",
    partReferences: [
      {
        title: "構成品一式",
        quantity: "1 set",
        description:
          "PCB、電子部品、ケース、ねじ、キー部品をすべて並べ、不足がないか確認します。",
        photo: {
          file: "",
          title: "全構成品を並べた俯瞰写真",
          alt: "OctGearの全構成品を種類ごとに並べた写真",
        },
      },
      {
        title: "OctGear メインPCB",
        quantity: "1",
        description:
          "キー番号が見える裏面、RP2040とEncoderを取り付ける右側、USB端子側を確認します。",
        photo: {
          file: "",
          title: "PCBの表面・裏面と基準方向",
          alt: "OctGearメインPCBの表面と裏面および取り付け方向を示す写真",
        },
      },
      {
        title: "RP2040-Zero",
        quantity: "1",
        description:
          "Waveshare RP2040-Zeroまたはpin互換品です。USB端子とpin表記を実装前に確認します。",
        photo: {
          file: "",
          title: "RP2040-Zeroの表裏とUSB端子方向",
          alt: "RP2040-Zeroの表裏とOctGear PCBへの取り付け方向を示す写真",
        },
      },
      {
        title: "ホットスワップソケット",
        quantity: "8",
        description:
          "PCB裏面のKey 1〜8へ取り付けます。端子と2つのはんだpadの形状を確認します。",
        photo: {
          file: "",
          title: "ソケットの正しい向きと端子",
          alt: "キーホットスワップソケットの正しい向きと端子を示す写真",
        },
      },
      {
        title: "EC11 Encoderとノブ",
        quantity: "各1",
        description:
          "高さ15mmのEC11です。A/C/B/SW端子、固定脚、D軸ノブの向きを確認します。",
        photo: {
          file: "",
          title: "EC11の端子・固定脚・ノブ",
          alt: "EC11ロータリーエンコーダーの端子と固定脚およびノブを示す写真",
        },
      },
      {
        title: "WS2812B LEDテープ",
        quantity: "4 pixels",
        description:
          "切断位置、5V、GND、DIN、data方向の矢印を確認し、4灯分を使用します。",
        photo: {
          file: "",
          title: "4灯へ切り出したLEDとdata方向",
          alt: "4灯へ切り出したWS2812B LEDテープとdata方向を示す写真",
        },
      },
      {
        title: "Case・Plate・固定部品",
        quantity: "1 set",
        description:
          "Top、透明／半透明Middle、Bottom、Plate、ねじ、クッションゴムを区別します。",
        photo: {
          file: "",
          title: "ケース各層と固定部品",
          alt: "OctGearのケース各層、プレート、ねじ、クッションゴムを示す写真",
        },
      },
      {
        title: "Switch・Keycap",
        quantity: "各8",
        description:
          "MX互換SwitchとKeycapを用意します。すべて1Uで使用でき、Key 1と5だけ幅広capも任意です。",
        photo: {
          file: "",
          title: "Switch端子とKeycapサイズ比較",
          alt: "キースイッチの端子と1U、1.25U、1.5Uキーキャップを比較する写真",
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
      "組み立て後の外観と、透明／半透明のCase Middleから側面LEDの光が見える状態を確認できます。画像を選択すると拡大表示します。",
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
      "Top、配線レイヤー、Bottomを拡大して、スイッチ位置、外形、端子列を確認できます。画像を選択すると原寸で開きます。",
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
          "耐熱マット上に構成品を並べ、PCB、Plate、ケースを固定せずに重ねます。USB端子、Key 1、Encoder側、ねじ穴が一致することを確認します。",
        checks: [
          "PCBに割れ、深い傷、曲がった端子がない",
          "上段Key 1〜4、下段Key 5〜8、右側Rotaryの向きになっている",
          "USBケーブルを外し、換気できる場所で作業している",
        ],
        photo: {
          file: "",
          title: "全パーツの表裏と仮合わせ方向",
          alt: "OctGearの全パーツを正しい表裏と向きで仮合わせした写真",
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
          file: "",
          title: "ソケットの向きと正常なはんだ接合",
          alt: "OctGear PCB裏面へ正しい向きではんだ付けしたホットスワップソケットの写真",
        },
      },
      {
        title: "RP2040-Zeroを取り付ける",
        description:
          "USB端子がケースの開口側になるようRP2040-Zeroを合わせます。互換boardはpin配置を照合し、全pinの向きと高さを確認してからはんだ付けします。",
        checks: [
          "USB端子とPCBの向きを逆にしていない",
          "RP2040-ZeroがPCBと平行で、端子間をブリッジしていない",
          "互換boardのGPIO配置がOctGear pinoutと一致している",
        ],
        photo: {
          file: "",
          title: "RP2040-Zeroの正しい向きと実装高さ",
          alt: "OctGear PCBへ正しい向きと高さで取り付けたRP2040-Zeroの写真",
        },
      },
      {
        title: "EC11 Encoderを取り付ける",
        description:
          "EncoderをPCBへ垂直に差し込み、固定脚とA/C/B/SW端子をはんだ付けします。ナットはケースとノブの高さを確認できる状態まで仮締めにします。",
        checks: [
          "Encoder本体がPCBへ密着し、軸が傾いていない",
          "固定脚を含む全端子が確実に接合されている",
          "回転と押し込みに引っ掛かりがない",
        ],
        photo: {
          file: "",
          title: "Encoderの向き・端子・仮締め状態",
          alt: "OctGear PCBへ垂直に取り付けたEC11 Encoderと端子およびナットの写真",
        },
      },
      {
        title: "LEDテープを4灯へ加工して配線する",
        description:
          "WS2812Bを切断markで4灯分にし、GPIO 14側を最初のpixelのDINへ接続します。5V、GND、data方向を確認し、露出部を絶縁します。",
        checks: [
          "LEDの矢印が最初のpixelから4灯目へ流れる向きになっている",
          "5VとGNDを逆接続していない",
          "配線がケース外周へ届き、可動部やねじ穴を横切らない",
        ],
        photo: {
          file: "",
          title: "LEDの切断位置・DIN・3本の配線",
          alt: "4灯へ切り出したWS2812B LEDテープの切断位置とDIN、5V、GND配線を示す写真",
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
          file: "",
          title: "正常な接合とはんだbridgeの比較",
          alt: "正常なはんだ接合と修正が必要なはんだbridgeを比較する写真",
        },
      },
      {
        title: "PlateとSwitchを取り付ける",
        description:
          "Plateへ四隅のSwitchから固定し、端子を真っすぐにしてソケットへ差し込みます。抵抗が強い場合は押し込まず、端子の曲がりを確認します。",
        checks: [
          "Switch端子が折れたり、下へ潜り込んだりしていない",
          "PlateとSwitchが浮かず、全キーを軽く押せる",
          "一度大きく曲がった端子は無理に再使用していない",
        ],
        photo: {
          file: "",
          title: "Switch端子とPlateへの差し込み順",
          alt: "Switch端子の正常な状態とOctGear Plateへ四隅から取り付ける手順の写真",
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
          file: "",
          title: "ケース外でのFirmware・Diagnostics確認",
          alt: "ケースを閉じる前のOctGear PCBをUSB接続してDiagnostics確認している写真",
        },
      },
      {
        title: "PCBとLEDをケースへ収める",
        description:
          "Bottom、光を通すMiddle、Topの順を確認します。LEDテープは本体から少し離した側面位置へ配置し、配線を外周、ねじ穴、Switchで挟まないよう収めます。",
        checks: [
          "Case Middleに透明または半透明の素材を使用している",
          "LED 1〜4が想定する左から右の順に並んでいる",
          "PCBや配線をケースで挟んでいない",
        ],
        photo: {
          file: "",
          title: "ケース積層順・LED位置・配線経路",
          alt: "OctGearのBottom、Middle、Topの積層順とLEDテープ位置および配線経路を示す写真",
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
          file: "",
          title: "ねじ締め順と完成時の隙間",
          alt: "OctGearのねじ締め順、ゴム足、Keycap、Encoderノブの完成状態を示す写真",
        },
      },
    ],
    downloadsKicker: "Manufacturing Files",
    downloadsTitle: "製造・3Dプリントデータ",
    downloadsDescription:
      "PCB発注用Gerberと、ケース3層・エンコーダノブのSTLをダウンロードできます。ファイル名はOctGearの部品名へ統一しています。",
    stlViewerTitle: "ケースとノブを3Dで確認",
    stlViewerDescription:
      "モデルを切り替え、ドラッグで回転しながら形状と穴位置を確認できます。STLはブラウザ内だけで処理します。",
    stlViewerLoading: "STLを読み込み中",
    stlViewerError: "3D表示を読み込めませんでした。STLを直接ダウンロードしてください。",
    stlViewerReset: "表示をリセット",
    stlViewerInstructions: "ドラッグ: 回転 / ホイール・ピンチ: ズーム",
    middleCaseMaterialTitle: "Case Middleは透明／半透明素材を推奨",
    middleCaseMaterialDescription:
      "Middle層は側面LEDの光を外周へ通すライトガイドとして機能します。透明または乳白色などの半透明フィラメント／レジンを使用すると、側面からLayer色とアニメーションが見える構造です。",
    downloads: [
      {
        format: "ZIP",
        title: "PCB Gerber v2",
        description: "銅箔、Mask、Silkscreen、外形、Drill",
        file: "octgear-pcb-gerbers-v2.zip",
      },
      {
        format: "STL",
        title: "Case Top",
        description: "ケース上層",
        file: "octgear-case-top.stl",
      },
      {
        format: "STL",
        title: "Case Middle",
        description: "LED光を通す中間層／透明・半透明推奨",
        file: "octgear-case-middle.stl",
      },
      {
        format: "STL",
        title: "Case Bottom",
        description: "ケース下層",
        file: "octgear-case-bottom.stl",
      },
      {
        format: "STL",
        title: "Encoder Knob",
        description: "D軸ロータリーエンコーダ用ノブ",
        file: "octgear-encoder-knob.stl",
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
          "USBを外し、スイッチ端子の曲がり、差し込み不足、はんだ接合を確認します。ダイオードなしMatrixのため、矩形になる複数キー同時押しは制限があります。",
      },
      {
        problem: "同じ行または列のキーがまとめて反応しない",
        solution:
          "USBを外し、該当するMatrix Row／ColumnとRP2040-Zeroの端子を確認します。個別Switchより共通信号の接合不良やbridgeを優先して調べます。",
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
    expandDetails: "詳細を表示",
    collapseDetails: "詳細を閉じる",
    keys: "Keys",
    encoder: "Encoder",
    encoderValue: (pinCount: number) => `${pinCount}pin A/C/B/SW`,
    encoderDirection: "回転方向",
    encoderReversed: "反転",
    encoderDirectionUpdated: (reversed: boolean) => `Encoder方向: ${reversed ? "反転" : "標準"}`,
    encoderDirectionFailed: "Encoder方向の変更に失敗しました",
    statusLedDirection: "LEDテープ方向",
    statusLedReversed: "反転",
    statusLedDirectionUpdated: (reversed: boolean) => `LEDテープ方向: ${reversed ? "反転" : "標準"}`,
    statusLedDirectionFailed: "LEDテープ方向の変更に失敗しました",
    statusKeyAnimation: "アニメーション効果",
    statusKeyAnimationDisabled: "無効",
    statusKeyAnimationRipple: "波紋",
    statusKeyAnimationFlash: "フラッシュ",
    statusKeyAnimationSpark: "スパーク",
    statusKeyAnimationUpdated: (animation: number) =>
      `アニメーション効果: ${["波紋", "無効", "フラッシュ", "スパーク"][animation] ?? animation}`,
    statusKeyAnimationFailed: "アニメーション効果の変更に失敗しました",
    statusKeyAnimationUnsupported: "最新Firmwareが必要です",
    statusKeyAnimationBrightness: "アニメーション輝度上限",
    statusKeyAnimationBrightnessValue: "アニメーション輝度上限の数値",
    statusKeyAnimationBrightnessRange: (max: number) =>
      `0-${max} / LED輝度上限より高くすると強調`,
    statusKeyAnimationBrightnessUpdated: (brightness: number) =>
      `アニメーション輝度上限: ${brightness}`,
    statusKeyAnimationBrightnessFailed: "アニメーション輝度上限の変更に失敗しました",
    statusKeyAnimationBrightnessUnsupported: "最新Firmwareが必要です",
    statusLedBrightness: "LED輝度上限",
    statusLedBrightnessValue: "LED輝度上限の数値",
    statusLedBrightnessRange: (max: number) => `0-${max} / 0は消灯`,
    statusLedBrightnessUpdated: (brightness: number) => `LED輝度上限: ${brightness}`,
    statusLedBrightnessFailed: "LED輝度上限の変更に失敗しました",
    statusLedBrightnessUnsupported: "最新Firmwareが必要です",
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
    resetDescription: "全キーの割り当て、レイヤーの有効状態、LED色、LED輝度上限、Encoder方向、LEDテープ方向を既定値へ戻します。この操作は実機へすぐ保存されます。",
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
    diagnosticReportUnsupported: "診断レポート未対応のファームウェアです。最新UF2を書き込んでください",
    diagnosticStorageUnsupported: "ストレージ診断未対応のファームウェアです。最新UF2を書き込んでください",
    layerEnabledUnsupported: "レイヤー有効設定に未対応のファームウェアです。最新UF2を書き込んでください",
    layerColorUnsupported: "レイヤー色設定に未対応のファームウェアです。最新UF2を書き込んでください",
    encoderReverseUnsupported: "Encoder方向設定に未対応のファームウェアです。最新UF2を書き込んでください",
    statusLedReverseUnsupported: "LEDテープ方向設定に未対応のファームウェアです。最新UF2を書き込んでください",
    statusLedBrightnessUnsupported: "LED輝度設定に未対応のファームウェアです。最新UF2を書き込んでください",
    statusKeyAnimationUnsupported: "アニメーション効果設定に未対応のファームウェアです。最新UF2を書き込んでください",
    statusKeyAnimationBrightnessUnsupported: "アニメーション輝度設定に未対応のファームウェアです。最新UF2を書き込んでください",
    invalidDiagnosticReport: "診断レポートの内容が一致しません",
    unexpectedResponse: (actual: number, expected: number) =>
      `Unexpected HID response command ${actual}; expected ${expected}`,
  },
};
