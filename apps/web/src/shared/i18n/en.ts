import type { ja } from "./ja";

export const en: typeof ja = {
  app: {
    title: "Remapper",
    workspaceLabel: "Remapper workspace",
    workspaceScale: "Display scale",
    workspaceScaleValue: (scale) => `${scale}%`,
    language: "Language",
    switchLanguageLabel: "Switch display language to Japanese",
  },
  home: {
    eyebrow: "Studio Juh",
    title: "Device Hub",
    description: "Open the build guide, remapper, or firmware updater for your device.",
    productListLabel: "Product list",
    products: {
      octgear: {
        status: "Available",
        name: "OctGear",
        description: "RP2040 board with a 2 × 4 key matrix and an A/C/B/SW rotary encoder.",
        deviceImageAlt: "Front view of a completed OctGear with illuminated side LEDs",
        encoderValue: "A/C/B/SW",
        connectionValue: "WebHID",
        remapperDescription:
          "WebHID keymap editor for the 8-key + rotary encoder RP2040 board",
      },
    },
    keys: "Keys",
    encoder: "Encoder",
    layers: "Layers",
    connection: "Connection",
    openBuildGuide: "Build Guide",
    openRemapper: "Open Remapper",
    openDiagnostics: "Open Diagnostics",
    openStore: "Store / Contact",
    backHome: "Home",
  },
  octgearBuildGuide: {
    brandKicker: "Build Guide",
    navigationLabel: "Build guide navigation",
    kicker: "Assembly & Setup",
    title: "OctGear Build Guide",
    description:
      "Follow the distributed kit from inspection and assembly through firmware setup and a complete input check. If your package differs, follow the instructions supplied by its distributor.",
    start: "Start assembly",
    jumpToCheck: "View final check",
    factsLabel: "Build overview",
    facts: [
      { label: "INPUT", value: "8 Keys + Rotary" },
      { label: "LAYOUT", value: "2 × 4 Matrix" },
      { label: "STATUS LED", value: "Side 4 Pixels" },
      { label: "FINAL CHECK", value: "Web Diagnostics" },
    ],
    pageIndexLabel: "Page index",
    pageIndex: [
      { href: "#prepare", label: "Preparation" },
      { href: "#assembly", label: "Assembly" },
      { href: "#downloads", label: "Downloads" },
      { href: "#firmware", label: "Firmware" },
      { href: "#final-check", label: "Final check" },
    ],
    prepareKicker: "Before You Start",
    prepareTitle: "Check the parts and tools",
    prepareDescription:
      "Compare everything against the package list first. If a part is missing or damaged, contact the distributor before applying power or soldering.",
    packageTitle: "Main parts",
    packageItems: [
      "OctGear main PCB (order from JLCPCB or another PCB manufacturer using the Gerber files)",
      "Waveshare RP2040-Zero or a compatible board (RP2350-Zero is a compatibility candidate; it needs a separate firmware build and is not hardware-tested)",
      "Eight key switches and eight keycaps (all positions support 1U)",
      "Eight key hot-swap sockets",
      "EC11 rotary encoder (15 mm height) and knob",
      "WS2812B LED strip (DC 5 V, 1 m / 60 LEDs; four LEDs used)",
      "M2 × 8 mm screws or compatible self-tapping screws",
      "Case and plate (self-print in 3D or order from JLC3DP or a similar service)",
      "Spacers are normally unnecessary; use cushioning tape or similar material only if adjustment is needed",
      "Four rubber bumpers (used as non-slip feet on the case bottom)",
    ],
    toolsTitle: "What you need",
    toolItems: [
      "A USB cable that supports data",
      "A small screwdriver that fits the case hardware",
      "Tweezers for inspecting bent terminals",
      "Soldering iron",
      "Solder",
      "Hookup wire such as AWG 24",
      "Ventilation equipment",
    ],
    optionalToolsTitle: "Helpful extras",
    optionalToolItems: [
      "Switch puller",
      "Pliers for tightening the rotary encoder nut",
    ],
    photoPlaceholder: (index) =>
      `PHOTO ${String(index).padStart(2, "0")}`,
    photoPending: "Assembly photo to be added",
    partsReferenceTitle: "Identify the parts",
    partsReferenceDescription:
      "Check the shape, quantity, and orientation of every part before assembly. Each frame is a placeholder for a real build photo.",
    partReferences: [
      {
        title: "Complete parts set",
        quantity: "1 set",
        description:
          "Lay out the PCB, electronics, case, fasteners, switches, and keycaps and check for missing parts.",
        photo: {
          file: "",
          title: "Overhead view of every included part",
          alt: "All OctGear parts arranged by type",
        },
      },
      {
        title: "OctGear main PCB",
        quantity: "1",
        description:
          "Identify the back with Key 1–8 labels, the RP2040 and encoder side, and the USB connector side.",
        photo: {
          file: "",
          title: "PCB front, back, and reference orientation",
          alt: "Front and back of the OctGear main PCB with its assembly orientation",
        },
      },
      {
        title: "RP2040-Zero",
        quantity: "1",
        description:
          "Use a Waveshare RP2040-Zero or pin-compatible board. Check the USB connector and pin labels before assembly.",
        photo: {
          file: "",
          title: "RP2040-Zero sides and USB orientation",
          alt: "Both sides of an RP2040-Zero and its orientation on the OctGear PCB",
        },
      },
      {
        title: "Hot-swap sockets",
        quantity: "8",
        description:
          "These mount to Key 1–8 on the PCB back. Identify the switch contact and two solder pads.",
        photo: {
          file: "",
          title: "Correct socket orientation and contacts",
          alt: "Correct orientation and contacts of a key hot-swap socket",
        },
      },
      {
        title: "EC11 encoder and knob",
        quantity: "1 each",
        description:
          "Use a 15 mm EC11. Identify its A/C/B/SW pins, mounting tabs, and D-shaft knob orientation.",
        photo: {
          file: "",
          title: "EC11 pins, mounting tabs, and knob",
          alt: "Pins and mounting tabs of an EC11 rotary encoder with its knob",
        },
      },
      {
        title: "WS2812B LED strip",
        quantity: "4 pixels",
        description:
          "Identify the cut marks, 5 V, GND, DIN, and data arrows, then prepare a four-pixel segment.",
        photo: {
          file: "",
          title: "Four-pixel strip and data direction",
          alt: "Four-pixel WS2812B LED strip showing the cut marks and data direction",
        },
      },
      {
        title: "Case, plate, and fasteners",
        quantity: "1 set",
        description:
          "Separate the Top, clear or translucent Middle, Bottom, plate, screws, and rubber bumpers.",
        photo: {
          file: "",
          title: "Case layers and fastening parts",
          alt: "OctGear case layers, plate, screws, and rubber bumpers",
        },
      },
      {
        title: "Switches and keycaps",
        quantity: "8 each",
        description:
          "Prepare MX-compatible switches and keycaps. All positions accept 1U; only Key 1 and Key 5 optionally use wider caps.",
        photo: {
          file: "",
          title: "Switch pins and keycap size comparison",
          alt: "Switch pins beside 1U, 1.25U, and 1.5U keycaps",
        },
      },
    ],
    safetyTitle: "Disconnect USB before working",
    safetyDescription:
      "Install parts, tighten screws, and solder only while power is disconnected. Never force a terminal; remove the part and check its orientation if it does not seat easily.",
    layoutKicker: "Control Layout",
    layoutTitle: "Finished control layout",
    layoutDescription:
      "The finished layout has Key 1–4 on top, a right-shifted Key 5–8 row below, and the rotary encoder extending from the lower right. Every position works with a 1U keycap. To close the visual gaps, Key 1 can optionally use 1.25U and Key 5 can use 1.5U. Side LEDs are numbered 1–4 from left to right; encoder CCW, CW, and SW share the right-end LED 4 with K4 and K8.",
    layoutAriaLabel:
      "Finished layout with optional 1.25U Key 1 in the top Key 1 through 4 row, optional 1.5U Key 5 in the right-shifted Key 5 through 8 row, the rotary encoder at lower right, and four side LEDs shown separately below; every key also supports 1U",
    keyLabel: (index) => `Key ${index}`,
    optionalKeycapSize: (size) => `${size} opt.`,
    encoderLabel: "Rotary",
    encoderOperations: "CCW / CW / SW",
    ledStripLabel: "Side LEDs",
    completedReferenceTitle: "Completed build",
    completedReferenceDescription:
      "See the assembled device and the side LED glow through the transparent or translucent Case Middle. Select an image to enlarge it.",
    completedImages: [
      {
        file: "octgear-completed-top.jpg",
        title: "Top view",
        alt: "Top view of a completed OctGear",
      },
      {
        file: "octgear-completed-front.jpg",
        title: "Front view",
        alt: "Front view of a completed OctGear with illuminated side LEDs",
      },
    ],
    pcbReferenceTitle: "PCB manufacturing previews",
    pcbReferenceDescription:
      "Open the Top, routing layers, or Bottom preview at full size to inspect switch positions, board outline, and terminal rows.",
    pcbImages: [
      {
        file: "octgear-pcb-top.png",
        title: "PCB Top",
        alt: "Manufacturing preview of the OctGear PCB top side",
      },
      {
        file: "octgear-pcb-layers.png",
        title: "PCB Layers",
        alt: "Routing layer preview of the OctGear PCB",
      },
      {
        file: "octgear-pcb-bottom.png",
        title: "PCB Bottom",
        alt: "Manufacturing preview of the OctGear PCB bottom side",
      },
    ],
    enlargeGuideImage: (title) => `Enlarge ${title}`,
    closeGuideImage: "Close enlarged image",
    assemblyKicker: "Assembly",
    assemblyTitle: "Assembly steps",
    assemblyDescription:
      "The set of pre-installed parts depends on the distributed package. Complete only the relevant steps, then install firmware and run Diagnostics before closing the case.",
    steps: [
      {
        title: "Prepare the work area and test-fit the parts",
        description:
          "Lay out the parts on a heat-resistant mat and stack the PCB, plate, and case without fastening them. Confirm the USB connector, Key 1, encoder side, and screw holes align.",
        checks: [
          "The PCB has no cracks, deep scratches, or bent terminals",
          "Key 1–4 are on top, Key 5–8 below, and the rotary is on the right",
          "USB is disconnected and the work area has ventilation",
        ],
        photo: {
          file: "",
          title: "Part sides and test-fit orientation",
          alt: "All OctGear parts test-fitted with the correct side and orientation",
        },
      },
      {
        title: "Solder the hot-swap sockets",
        description:
          "Seat each socket against Key 1–8 on the PCB back. Tack one side, correct any lift or rotation, and then solder the other side.",
        checks: [
          "All eight sockets follow the footprint outline and pads",
          "Each socket sits flat and solder wets both its contact and PCB pad",
          "No solder bridge reaches an adjacent pad",
        ],
        photo: {
          file: "",
          title: "Socket orientation and a sound solder joint",
          alt: "Hot-swap sockets soldered flat in the correct orientation on the OctGear PCB back",
        },
      },
      {
        title: "Install the RP2040-Zero",
        description:
          "Orient the RP2040-Zero so its USB connector faces the case opening. For a compatible board, compare the pinout first, then confirm every pin and the mounting height before soldering.",
        checks: [
          "The USB connector and PCB are not reversed",
          "The RP2040-Zero is parallel to the PCB with no bridged pins",
          "A compatible board matches the OctGear GPIO pinout",
        ],
        photo: {
          file: "",
          title: "Correct RP2040-Zero orientation and height",
          alt: "RP2040-Zero mounted on the OctGear PCB with the correct orientation and height",
        },
      },
      {
        title: "Install the EC11 encoder",
        description:
          "Insert the encoder vertically and solder its mounting tabs and A/C/B/SW pins. Leave the nut lightly tightened until the case and knob height can be checked.",
        checks: [
          "The encoder body sits against the PCB and its shaft is vertical",
          "Every pin and mounting tab has a sound solder joint",
          "Rotation and the push switch move without binding",
        ],
        photo: {
          file: "",
          title: "Encoder orientation, pins, and temporary nut position",
          alt: "EC11 encoder mounted vertically on the OctGear PCB with its pins and nut visible",
        },
      },
      {
        title: "Prepare and wire a four-pixel LED strip",
        description:
          "Cut the WS2812B strip at a cut mark after four pixels and connect GPIO 14 to DIN on the first pixel. Verify 5 V, GND, and data direction, then insulate exposed joints.",
        checks: [
          "The arrows run from the first pixel toward the fourth",
          "5 V and GND are not reversed",
          "Wires reach the case edge without crossing moving parts or screw holes",
        ],
        photo: {
          file: "",
          title: "LED cut mark, DIN, and three wires",
          alt: "Four-pixel WS2812B strip showing its cut mark and DIN, 5 V, and GND wires",
        },
      },
      {
        title: "Inspect all soldering",
        description:
          "Inspect both PCB sides under bright light before applying power. Remove metal debris and solder balls, and repair lifted contacts, bridges, or damaged wire insulation.",
        checks: [
          "No adjacent terminals touch unintentionally",
          "Nothing suggests a short between USB 5 V and GND",
          "A gentle movement of each wire does not loosen its joint",
        ],
        photo: {
          file: "",
          title: "Good joint and solder bridge comparison",
          alt: "Comparison between a sound solder joint and a solder bridge that needs repair",
        },
      },
      {
        title: "Install the plate and switches",
        description:
          "Secure switches in the plate starting at its corners, straighten each pin, and insert it into the socket. If resistance is high, stop and inspect the pins instead of forcing it.",
        checks: [
          "No switch pin is folded or trapped underneath",
          "The plate and switches sit flat and every key moves freely",
          "A severely bent pin is not forced back into service",
        ],
        photo: {
          file: "",
          title: "Switch pins and plate insertion order",
          alt: "Straight switch pins and the corner-first installation order for the OctGear plate",
        },
      },
      {
        title: "Power-test before closing the case",
        description:
          "Place the assembly on a heat-resistant, nonconductive surface and connect USB. Check for odor or abnormal heat, install firmware, and use Diagnostics to test eight keys, three encoder actions, and the LEDs.",
        checks: [
          "Disconnect USB immediately if any part becomes unusually hot",
          "The device appears as OctGear and connects to Diagnostics",
          "Correct faults now instead of enclosing them in the case",
        ],
        photo: {
          file: "",
          title: "Firmware and Diagnostics test outside the case",
          alt: "OctGear PCB connected to USB and tested in Diagnostics before closing the case",
        },
      },
      {
        title: "Place the PCB and LEDs in the case",
        description:
          "Confirm the Bottom, light-transmitting Middle, and Top order. Position the LED strip slightly away from the body along the side, and keep wires clear of the edge, screw holes, and switches.",
        checks: [
          "Case Middle uses a transparent or translucent material",
          "LED 1–4 follow the intended left-to-right order",
          "The case does not pinch the PCB or wiring",
        ],
        photo: {
          file: "",
          title: "Case stack, LED position, and wire routing",
          alt: "OctGear Bottom, Middle, and Top stack with the LED strip position and wire routing",
        },
      },
      {
        title: "Finish the screws, feet, keycaps, and knob",
        description:
          "Tighten screws a little at a time in a diagonal pattern and use cushioning tape only if play needs adjustment. Install the rubber feet, keycaps, and knob, then check the feel of every control.",
        checks: [
          "Screws do not distort the case or PCB",
          "The knob clears the case during rotation and pressing",
          "The unit sits steadily and every key moves freely",
        ],
        photo: {
          file: "",
          title: "Screw order and finished clearances",
          alt: "Finished OctGear showing the screw order, rubber feet, keycaps, and encoder knob clearance",
        },
      },
    ],
    downloadsKicker: "Manufacturing Files",
    downloadsTitle: "Manufacturing and 3D print files",
    downloadsDescription:
      "Download the PCB fabrication Gerbers plus STL files for the three case layers and encoder knob. File names use consistent OctGear part names.",
    stlViewerTitle: "Inspect the case and knob in 3D",
    stlViewerDescription:
      "Switch models and drag to inspect the shape and hole positions. STL data is processed only in your browser.",
    stlViewerLoading: "Loading STL",
    stlViewerError: "The 3D view could not load. Download the STL directly instead.",
    stlViewerReset: "Reset view",
    stlViewerInstructions: "Drag: rotate / Wheel or pinch: zoom",
    middleCaseMaterialTitle: "Use transparent or translucent material for Case Middle",
    middleCaseMaterialDescription:
      "The Middle layer acts as a light guide that carries the side LED light to the outer edge. Clear, frosted, or other translucent filament or resin lets layer colors and animations glow through the side.",
    downloads: [
      {
        format: "ZIP",
        title: "PCB Gerber v2",
        description: "Copper, mask, silkscreen, outline, and drill files",
        file: "octgear-pcb-gerbers-v2.zip",
      },
      {
        format: "STL",
        title: "Case Top",
        description: "Top case layer",
        file: "octgear-case-top.stl",
      },
      {
        format: "STL",
        title: "Case Middle",
        description: "Light-transmitting middle layer; clear or translucent recommended",
        file: "octgear-case-middle.stl",
      },
      {
        format: "STL",
        title: "Case Bottom",
        description: "Bottom case layer",
        file: "octgear-case-bottom.stl",
      },
      {
        format: "STL",
        title: "Encoder Knob",
        description: "Knob for a D-shaft rotary encoder",
        file: "octgear-encoder-knob.stl",
      },
    ],
    downloadAction: "Download",
    downloadNoticeTitle: "Inspect the files before manufacturing",
    downloadNoticeDescription:
      "These Gerber and STL files target the current hardware. Verify dimensions, hole positions, and component fit before ordering or printing. Use and redistribution are governed by the",
    firmwareKicker: "Firmware & Keymap",
    firmwareTitle: "Install firmware and configure",
    firmwareDescription:
      "Connect the assembled device with a data-capable USB cable. Updating to the latest firmware is recommended even if your unit was supplied pre-flashed.",
    firmwareCardTitle: "Install the latest firmware",
    firmwareCardDescription:
      "Use Updater in Remapper to enter BOOTSEL and write the bundled UF2 to the RPI-RP2 drive.",
    remapCardTitle: "Configure keys and LEDs",
    remapCardDescription:
      "Set key assignments, layer colors, encoder direction, LED strip direction, and animations after connecting.",
    configureKeymap: "Configure keymap",
    recoveryTitle: "If Remapper cannot find the device",
    recoveryDescription:
      "Hold BOOT, press and release RESET, then release BOOT. Write the UF2 file to the RPI-RP2 drive that appears on the PC.",
    checkKicker: "Final Check",
    checkTitle: "Check all 11 controls",
    checkDescription:
      "Connect to Diagnostics and test all eight keys plus encoder counterclockwise, clockwise, and press. The same flow can be used before distribution.",
    checks: [
      {
        title: "USB connection",
        description: "The device is recognized as OctGear and connects to Diagnostics.",
      },
      {
        title: "Key 1–8",
        description: "Press each key once and confirm every key becomes OK.",
      },
      {
        title: "Rotary",
        description: "CCW, CW, and SW are recorded as three separate controls.",
      },
      {
        title: "LED and storage",
        description: "The layer color appears and saved settings persist after reconnecting.",
      },
    ],
    openFinalCheck: "Open Diagnostics",
    troubleKicker: "Troubleshooting",
    troubleTitle: "When something does not work",
    troubleDescription:
      "Disconnect USB before checking the affected terminal, orientation, or contact instead of repeatedly cycling power.",
    troubleshooting: [
      {
        problem: "The PC does not recognize OctGear",
        solution:
          "Use a USB data cable and try another port. If it still fails, enter RPI-RP2 with the BOOT / RESET sequence and reinstall firmware.",
      },
      {
        problem: "Only one key does not respond",
        solution:
          "Disconnect USB and inspect the switch terminal, seating, and solder joint. Because the matrix has no diodes, rectangular multi-key combinations are limited.",
      },
      {
        problem: "A complete row or column of keys does not respond",
        solution:
          "Disconnect USB and inspect the corresponding matrix Row / Column and RP2040-Zero pin. Check the shared signal joint or a solder bridge before individual switches.",
      },
      {
        problem: "Encoder direction is reversed",
        solution:
          "Toggle Direction / Reverse under Hardware in Remapper. Resoldering is not required.",
      },
      {
        problem: "The LED animation runs in the wrong direction",
        solution:
          "Toggle LED strip direction / Reverse under Hardware in Remapper.",
      },
      {
        problem: "The side LEDs do not light",
        solution:
          "Disconnect USB and check 5 V, GND, DIN on the first pixel, and data direction. Also confirm that the LED brightness limit in Remapper is not zero.",
      },
      {
        problem: "The RP2040 or wiring becomes unusually hot or smells",
        solution:
          "Disconnect USB immediately and do not reconnect it. Resolve any 5 V to GND short, reversed LED connection, or solder bridge before inspecting again.",
      },
      {
        problem: "LEDs turn off while the PC sleeps",
        solution:
          "This is expected. LEDs turn off during USB suspend and return to the current layer color after resume.",
      },
    ],
    completeTitle: "Build complete",
    completeDescription:
      "The build is complete when every control passes Diagnostics. Use Remapper to configure layers for your workflow.",
    distributionTitle: "Contact & primary distribution",
    distributionDescription:
      "See the BOOTH shop for OctGear availability and inquiries.",
    distributionLink: "Open BOOTH shop",
    licenseNote:
      "This page provides assembly instructions and does not grant permission for third-party manufacture or sale. Terms for using and redistributing the hardware materials are in the",
    licenseLink: "Hardware License",
  },
  diagnostics: {
    nav: "Diagnostics",
    kicker: "Production Check",
    title: "Diagnostics",
    description: "Check key and encoder input plus basic device functions before shipping.",
    keyCheckKicker: "Key Check",
    keyCheckTitle: "Press every control",
    functionCheckKicker: "Function Check",
    functionCheckTitle: "Device status",
    reset: "Reset",
    waiting: "Waiting for checks",
    pass: "PASS",
    progress: (count, total) => `${count} / ${total} keys checked`,
    noLastKey: "Last key: -",
    lastKey: (index) => `Last key: Key ${index}`,
    encoderCounterTitle: "Encoder rotation counter",
    encoderCounterHelp: "After Reset, slowly turn 20 detents each way and confirm that each count reaches 20.",
    encoderCounterclockwise: "Counterclockwise (CCW)",
    encoderClockwise: "Clockwise (CW)",
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
    reportTestPassed: (signature, version) => `${signature} v${version}`,
    reportTestFailed: "Report send failed",
    storageTesting: "Testing storage",
    storageTestPassed: (layers, keys) => `${layers} layers x ${keys} keys restored`,
    storageTestFailed: "Storage test failed",
    storageWriteWarning: "Storage test writes to the actual flash-backed keymap area. Run it only when needed, such as production inspection.",
    ok: "OK",
    ng: "NG",
  },
  connection: {
    idle: "Idle",
    connected: "Connected",
    connect: "Connect",
    disconnect: "Disconnect",
    updater: "Updater",
    connectFailed: "Connection failed",
    deviceNotConnected: "No HID device is connected",
    layerChangeFailed: "Failed to change layer",
  },
  hardware: {
    kicker: "Board Profile",
    title: "Hardware",
    expandDetails: "Show details",
    collapseDetails: "Hide details",
    keys: "Keys",
    encoder: "Encoder",
    encoderValue: (pinCount) => `${pinCount}-pin A/C/B/SW`,
    encoderDirection: "Direction",
    encoderReversed: "Reverse",
    encoderDirectionUpdated: (reversed) => `Encoder direction: ${reversed ? "reversed" : "standard"}`,
    encoderDirectionFailed: "Failed to change encoder direction",
    statusLedDirection: "LED strip direction",
    statusLedReversed: "Reverse",
    statusLedDirectionUpdated: (reversed) => `LED strip direction: ${reversed ? "reversed" : "standard"}`,
    statusLedDirectionFailed: "Failed to change LED strip direction",
    statusKeyAnimation: "Animation effect",
    statusKeyAnimationDisabled: "Off",
    statusKeyAnimationRipple: "Ripple",
    statusKeyAnimationFlash: "Flash",
    statusKeyAnimationSpark: "Spark",
    statusKeyAnimationUpdated: (animation) =>
      `Animation effect: ${["Ripple", "Off", "Flash", "Spark"][animation] ?? animation}`,
    statusKeyAnimationFailed: "Failed to change animation effect",
    statusKeyAnimationUnsupported: "Latest firmware required",
    statusKeyAnimationBrightness: "Animation brightness limit",
    statusKeyAnimationBrightnessValue: "Animation brightness limit value",
    statusKeyAnimationBrightnessRange: (max) =>
      `0-${max} / set above LED brightness for contrast`,
    statusKeyAnimationBrightnessUpdated: (brightness) =>
      `Animation brightness limit: ${brightness}`,
    statusKeyAnimationBrightnessFailed: "Failed to change animation brightness limit",
    statusKeyAnimationBrightnessUnsupported: "Latest firmware required",
    statusLedBrightness: "LED brightness limit",
    statusLedBrightnessValue: "LED brightness limit value",
    statusLedBrightnessRange: (max) => `0-${max} / 0 turns LEDs off`,
    statusLedBrightnessUpdated: (brightness) => `LED brightness limit: ${brightness}`,
    statusLedBrightnessFailed: "Failed to change LED brightness limit",
    statusLedBrightnessUnsupported: "Latest firmware required",
    apply: "Apply",
    applying: "Saving",
    matrix: "Matrix",
    matrixValue: (rows, columns, diodeDirection) =>
      `${rows} × ${columns} / ${diodeDirection === "none" ? "no diodes" : diodeDirection}`,
    deviceLayer: "Device layer",
    reportKeys: "Report keys",
    usbId: "USB ID",
    externalRgb: "External RGB",
    externalRgbValue: (count) => `GPIO 14 / ${count} pixels`,
    oled: "OLED",
    none: "None",
  },
  keymap: {
    kicker: "Keymap",
    title: "Layers",
    layer: "Layer",
    enabled: "Enabled",
    disabled: "Disabled",
    layerEnabledLabel: (layer) => `Enable Layer ${layer}`,
    baseLayerRequired: "Layer 0 is always enabled",
    layerColor: "LED Color",
    ledOn: "On",
    keys: "Keys",
    encoder: "Encoder",
    key: (index) => `Key ${index}`,
    moreActions: "More actions",
    reset: "Initialize",
    resetTitle: "Initialize the keymap?",
    resetDescription: "This restores all key assignments, enabled layers, LED colors, LED brightness limit, encoder direction, and LED strip direction to their defaults and saves them to the device immediately.",
    resetCancel: "Cancel",
    resetConfirm: "Initialize",
    resetting: "Initializing keymap",
    resetComplete: "Keymap initialized",
    resetFailed: "Initialization failed",
    read: "Read",
    save: "Save",
    noAssignment: "None",
    unassigned: "Unassigned",
    reading: "Reading keymap",
    readComplete: "Keymap loaded",
    readFailed: "Read failed",
    savingAll: "Saving all layers / all keys",
    saveFailed: "Save failed",
    saveSkippedAll: "All layers / all keys are unchanged; write skipped",
    savedAll: (count, layers, keys) =>
      `Saved all layers / all keys (${layers} x ${keys} checked, ${count} writes)`,
  },
  assignment: {
    kicker: "Assignment",
    type: "Type",
    none: "None",
    keyboard: "Keyboard",
    consumer: "Consumer",
    layerCycle: "Next Layer",
    layerPrevious: "Previous Layer",
    momentaryLayer: "Momentary Layer",
    usage: "Usage",
    targetLayer: "Target layer",
    modifier: "Modifier",
    label: "Label",
    usageHex: "Usage hex",
    layerCycleLabel: "Next Layer",
    layerPreviousLabel: "Previous Layer",
    momentaryLayerLabel: (layer) => `Hold Layer ${layer}`,
  },
  palette: {
    kicker: "Palette",
    title: "Keyboard",
    layoutLabel: "Keyboard layout selector",
  },
  firmware: {
    updater: "Updater",
    title: "Firmware",
    initialStatus: "UF2 ready",
    builtAt: (value) => `UF2 built: ${value}`,
    close: "Close",
    closeLabel: "Close firmware updater",
    bootsel: "BOOTSEL",
    installUf2: "Install UF2",
    downloadUf2: "Download UF2",
    normalUpdate: "Normal update",
    normalSteps: [
      "Connect the device, then press BOOTSEL.",
      "Press Install UF2.",
      "In the folder picker, choose the RPI-RP2 or UF2 bootloader drive that appears on your PC.",
    ],
    recovery: "Recovery when connection fails",
    recoverySteps: [
      "Hold the BOOT button on the device.",
      "Press and release RESET.",
      "Release BOOT last.",
      "Choose the RPI-RP2 / UF2 drive shown on your PC and write the firmware.",
    ],
    bootDriveReady: "BOOTSEL drive ready",
    bootMode: "BOOTSEL mode",
    enteringBootloader: "Entering BOOTSEL",
    enterBootloaderFailed: "Failed to enter BOOTSEL",
    writing: "Writing UF2",
    writeFailed: "UF2 write failed",
    written: (fileName, sizeKb) => `${fileName} written (${sizeKb} KB)`,
    downloading: "Downloading UF2",
    downloaded: "UF2 downloaded",
    downloadFailed: "UF2 download failed",
    browserUnsupported: "This browser does not support direct UF2 writing",
    fetchFailed: (status) => `Could not fetch UF2 file: ${status}`,
    selectBootDrive: "Select the UF2 bootloader drive",
  },
  device: {
    fallbackName: "HID device",
    notFound: (productName) =>
      `${productName} was not found. Connect it and try again, or reflash the firmware.`,
    missingDevice: "No HID device is available to connect",
    timeout: "Timed out waiting for a HID response",
    unsupportedWebHid: "This browser does not support WebHID",
    disconnected: "No HID device is connected",
    diagnosticReportUnsupported: "This firmware does not support the diagnostic report. Flash the latest UF2.",
    diagnosticStorageUnsupported: "This firmware does not support storage diagnostics. Flash the latest UF2.",
    layerEnabledUnsupported: "This firmware does not support layer settings. Flash the latest UF2.",
    layerColorUnsupported: "This firmware does not support layer colors. Flash the latest UF2.",
    encoderReverseUnsupported: "This firmware does not support encoder direction. Flash the latest UF2.",
    statusLedReverseUnsupported: "This firmware does not support LED strip direction. Flash the latest UF2.",
    statusLedBrightnessUnsupported: "This firmware does not support LED brightness. Flash the latest UF2.",
    statusKeyAnimationUnsupported: "This firmware does not support animation effects. Flash the latest UF2.",
    statusKeyAnimationBrightnessUnsupported: "This firmware does not support animation brightness. Flash the latest UF2.",
    invalidDiagnosticReport: "Diagnostic report payload did not match",
    unexpectedResponse: (actual, expected) => `Unexpected HID response command ${actual}; expected ${expected}`,
  },
};
