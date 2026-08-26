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
      "Case parts (Case Top, Case Bottom, and LED diffuser; self-print in 3D or order from JLC3DP or a similar service)",
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
      "Key-switch puller",
      "Pliers for tightening the rotary encoder nut",
    ],
    photoPlaceholder: (index) =>
      `PHOTO ${String(index).padStart(2, "0")}`,
    photoPending: "Assembly photo to be added",
    partsReferenceTitle: "Identify the parts",
    partsReferenceDescription:
      "Each part type is shown separately because there is no single overview photo. Before assembly, compare each part with the photos and check its shape, quantity, and orientation.",
    partReferences: [
      {
        title: "OctGear main PCB",
        quantity: "1",
        description:
          "Identify the back with Key 1–8 labels, the RP2040 and encoder side, and the USB connector side.",
        photo: {
          file: "octgear-main-pcb-back.jpg",
          title: "PCB back and key numbers",
          alt: "Back of the OctGear main PCB showing Key 1 through Key 8 and the socket positions",
        },
      },
      {
        title: "RP2040-Zero",
        quantity: "1",
        description:
          "Use a Waveshare RP2040-Zero or pin-compatible board. Check the USB connector and pin labels before assembly.",
        photo: {
          file: "octgear-rp2040-zero-solder-side.jpg",
          title: "Installed RP2040-Zero solder side",
          alt: "Solder side and USB orientation of an RP2040-Zero installed on the OctGear PCB",
        },
      },
      {
        title: "Hot-swap sockets",
        quantity: "8",
        description:
          "These mount to Key 1–8 on the PCB back. Identify the key-switch contact and two solder pads.",
        photo: {
          file: "octgear-hot-swap-sockets.jpg",
          title: "Correct socket orientation and contacts",
          alt: "Correct orientation and contacts of a key hot-swap socket",
        },
      },
      {
        title: "EC11 encoder and hardware",
        quantity: "1 set",
        description:
          "Use a 15 mm EC11. Identify its A/C/B/SW pins, mounting tabs, nut, and washer.",
        photo: {
          file: "octgear-ec11-encoder-hardware.jpg",
          title: "EC11 body, nut, and washer",
          alt: "Pins and mounting tabs of an EC11 rotary encoder with its nut and washer",
        },
      },
      {
        title: "WS2812B LED strip",
        quantity: "4 pixels",
        description:
          "Identify the cut marks, 5 V, GND, DIN, and data arrows, then prepare a four-pixel segment.",
        photo: {
          file: "octgear-ws2812b-four-pixel-strip.jpg",
          title: "Four-pixel strip and data direction",
          alt: "Four-pixel WS2812B LED strip showing the cut marks and data direction",
        },
      },
      {
        title: "Case Top",
        quantity: "1",
        description:
          "This top part has eight key-switch openings and the encoder shaft hole. Inspect the printed surface and openings.",
        photo: {
          file: "octgear-case-top.jpg",
          title: "Case Top",
          alt: "OctGear Case Top with eight key-switch openings and the encoder shaft hole",
        },
      },
      {
        title: "Case Bottom",
        quantity: "1",
        description:
          "This bottom part holds the PCB, wiring, and mounting nut. Check the screw holes and internal channels.",
        photo: {
          file: "octgear-case-bottom.jpg",
          title: "Inside the Case Bottom",
          alt: "Inside of the OctGear Case Bottom showing screw holes, wiring channels, and the mounting nut position",
        },
      },
      {
        title: "LED diffuser",
        quantity: "1",
        description:
          "This clear or translucent part carries light from the four side LEDs to the outer edge. It fits into the Case Bottom channel.",
        photo: {
          file: "octgear-led-diffuser.jpg",
          title: "Clear LED diffuser",
          alt: "Clear bar-shaped diffuser for the OctGear side LEDs",
        },
      },
      {
        title: "1/4-inch mounting nut",
        quantity: "1",
        description:
          "This mounting nut is fixed at the center of the Case Bottom. Verify the thread specification on the actual part.",
        photo: {
          file: "octgear-quarter-inch-mount-nut.jpg",
          title: "Mounting nut",
          alt: "Hexagonal mounting nut installed in the OctGear Case Bottom",
        },
      },
      {
        title: "Case screws",
        quantity: "5",
        description:
          "These M2 × 8 mm or equivalent screws secure the top parts from the Case Bottom.",
        photo: {
          file: "octgear-case-screws.jpg",
          title: "Case screws",
          alt: "Five screws used to fasten the OctGear case",
        },
      },
      {
        title: "Encoder knob",
        quantity: "1",
        description:
          "Fit this knob to the EC11 D-shaft, matching the shaft profile to the inside of the knob.",
        photo: {
          file: "octgear-encoder-knob.jpg",
          title: "D-shaft encoder knob",
          alt: "White knob for the OctGear EC11 rotary encoder",
        },
      },
      {
        title: "Key switches",
        quantity: "8",
        description:
          "Use MX-compatible key switches. Check that both pins are straight before inserting each key switch into its socket.",
        photo: {
          file: "octgear-key-switches.jpg",
          title: "MX-compatible key-switch pins",
          alt: "Eight MX-compatible key switches and their pins for OctGear",
        },
      },
      {
        title: "Keycaps",
        quantity: "8",
        description:
          "All positions accept 1U keycaps. Wider caps are optional only for Key 1 and Key 5 to close the visual gaps.",
        photo: {
          file: "octgear-keycaps.jpg",
          title: "1U keycaps",
          alt: "Eight 1U keycaps for OctGear",
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
      "See the assembled device and the side LED glow through the transparent or translucent LED diffuser. Select an image to enlarge it.",
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
      "Open the Top, routing layers, or Bottom preview at full size to inspect key-switch positions, board outline, and terminal rows.",
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
          "Lay out the parts on a heat-resistant mat and stack the PCB, Case Top, and Case Bottom without fastening them. Confirm the USB connector, Key 1, encoder side, and screw holes align.",
        checks: [
          "The PCB has no cracks, deep scratches, or bent terminals",
          "Key 1–4 are on top, Key 5–8 below, and the rotary is on the right",
          "USB is disconnected and the work area has ventilation",
        ],
        photo: {
          file: "octgear-case-pcb-test-fit.jpg",
          title: "PCB test-fit in the case",
          alt: "OctGear main PCB and RP2040-Zero test-fitted in the case in the correct orientation",
        },
      },
      {
        title: "Install the RP2040-Zero",
        description:
          "Orient the RP2040-Zero so its USB Type-C connector faces the case opening. For a compatible board, compare the pinout first, then confirm every pin and the mounting height before soldering.",
        warning:
          "Caution: Before soldering, view the assembly from the side and confirm that the USB Type-C connector remains level. The case will not close if the board is fixed at an angle.",
        checks: [
          "The USB connector and PCB are not reversed",
          "The USB Type-C connector is level when viewed from the side of the case",
          "The RP2040-Zero is parallel to the PCB with no bridged pins",
          "A compatible board matches the OctGear GPIO pinout",
        ],
        photo: {
          file: "octgear-rp2040-zero-installed.jpg",
          title: "Correct RP2040-Zero orientation and height",
          alt: "RP2040-Zero mounted on the OctGear PCB with the correct orientation and height",
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
          file: "octgear-hot-swap-sockets-soldered.jpg",
          title: "Socket orientation and a sound solder joint",
          alt: "Hot-swap sockets soldered flat in the correct orientation on the OctGear PCB back",
        },
      },
      {
        title: "Install the EC11 encoder",
        description:
          "Compare the before and after photos and bend the encoder's outer mounting tabs to match. Insert the encoder vertically, then solder the mounting tabs and A/C/B/SW pins. Connect the second PCB terminal counted from the RP2040 side to the encoder center terminal and the ground side of SW. Leave the nut lightly tightened until the case and knob height can be checked.",
        note:
          "Tip: Install only one or two key switches in the Case Top first, then insert them into their sockets to hold the PCB temporarily. This makes encoder alignment and soldering easier. Do not force a key switch if there is resistance, as its pins may bend.",
        warning:
          "Caution: The second terminal from the RP2040 side is a virtual ground connected directly to an RP2040 output. It may be used for the encoder center terminal and SW ground, but it must not be used as LED ground. Connecting LEDs would exceed the RP2040 output current capacity.",
        checks: [
          "Only the outer mounting tabs were formed; the A/C/B/SW pins were not bent",
          "The second terminal from the RP2040 side is wired to the encoder center terminal and the ground side of SW",
          "LED ground is not connected to the virtual ground terminal",
          "The encoder body sits against the PCB and its shaft is vertical",
          "Every pin and mounting tab has a sound solder joint",
          "Rotation and the push switch move without binding",
        ],
        photos: [
          {
            file: "octgear-ec11-mounting-tabs-before-bending.jpg",
            title: "1. Before bending the mounting tabs",
            alt: "EC11 rotary encoder before its outer mounting tabs are bent",
          },
          {
            file: "octgear-ec11-mounting-tabs-after-bending.jpg",
            title: "2. After bending the mounting tabs",
            alt: "EC11 rotary encoder with its outer mounting tabs bent for installation on the OctGear PCB",
          },
          {
            file: "octgear-ec11-encoder-installed.jpg",
            title: "3. Installed on the PCB",
            alt: "EC11 encoder mounted vertically on the OctGear PCB with its pins and nut visible",
          },
          {
            file: "octgear-ec11-encoder-soldering.jpg",
            title: "4. Solder the encoder",
            alt: "Soldered EC11 encoder pins and wiring on the OctGear PCB",
          },
        ],
      },
      {
        title: "Prepare and wire a four-pixel LED strip",
        description:
          "Cut the WS2812B strip at a cut mark after four pixels and connect GPIO 14 to DIN on the first pixel. Verify 5 V, GND, and data direction, then insulate exposed joints.",
        note:
          "Note: The position shown is the firmware default. If LED movement is reversed on an existing device, change it later with LED strip direction / Reverse in Remapper.",
        checks: [
          "The arrows run from the first pixel toward the fourth",
          "5 V and GND are not reversed",
          "Wires reach the case edge without crossing moving parts or screw holes",
        ],
        photo: {
          file: "octgear-led-encoder-wiring.jpg",
          title: "LED and encoder wiring",
          alt: "Four-pixel WS2812B strip and EC11 encoder wired to the OctGear PCB",
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
          file: "octgear-rp2040-zero-solder-side.jpg",
          title: "RP2040-Zero solder joints",
          alt: "Solder joints on the back of the RP2040-Zero installed on the OctGear PCB",
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
          file: "octgear-powered-led-test.jpg",
          title: "LED power test over USB",
          alt: "OctGear PCB connected over USB with all four LEDs lit before the case is closed",
        },
      },
      {
        title: "Place the PCB and LEDs in the case",
        description:
          "Place the LED diffuser and PCB in the Case Bottom, then confirm the Case Top orientation. Position the LED strip slightly away from the body along the side, and keep wires clear of the edge, screw holes, and key switches.",
        checks: [
          "The LED diffuser uses a transparent or translucent material",
          "LED 1–4 follow the intended left-to-right order",
          "The case does not pinch the PCB or wiring",
        ],
        photo: {
          file: "octgear-led-strip-case-placement.jpg",
          title: "LED strip placement in the case",
          alt: "Four-pixel LED strip placed along the OctGear main PCB inside the case",
        },
      },
      {
        title: "Install the Case Top and key switches",
        description:
          "Secure key switches in the Case Top starting at its corners, straighten each pin, and insert it into the socket. If resistance is high, stop and inspect the pins instead of forcing it.",
        checks: [
          "No key-switch pin is folded or trapped underneath",
          "The Case Top and key switches sit flat and every key moves freely",
          "A severely bent pin is not forced back into service",
        ],
        photo: {
          file: "octgear-switches-in-case-top.jpg",
          title: "Key switches installed in the Case Top",
          alt: "Eight key switches installed in the OctGear Case Top",
        },
      },
      {
        title: "Fit the 1/4-inch mounting nut",
        description:
          "Before tightening the case screws, press the 1/4-inch mounting nut straight into the hexagonal recess at the center of the Case Bottom. Confirm that it sits fully and does not protrude from the recess.",
        checks: [
          "The nut sits level at the bottom of the hexagonal recess",
          "The threaded hole is centered in the Case Bottom opening",
          "Pressing in the nut has not cracked or distorted the Case Bottom",
        ],
        photo: {
          file: "octgear-quarter-inch-mount-nut-installed.jpg",
          title: "1/4-inch mounting nut fitted in the Case Bottom",
          alt: "A 1/4-inch mounting nut fitted into the central hexagonal recess in the OctGear Case Bottom",
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
          file: "octgear-completed-keycaps-knob.jpg",
          title: "Finished keycaps and encoder knob",
          alt: "Finished OctGear with eight keycaps and the encoder knob installed",
        },
      },
    ],
    downloadsKicker: "Manufacturing Files",
    downloadsTitle: "Manufacturing and 3D print files",
    downloadsDescription:
      "Download the PCB fabrication Gerbers plus STL files for the Case Top, Case Bottom, LED diffuser, encoder knob, and rubber-foot fixing jig. File names use consistent OctGear part names.",
    stlViewerTitle: "Inspect the case parts, knob, and jig in 3D",
    stlViewerDescription:
      "Switch models and drag to inspect the shape and hole positions. STL data is processed only in your browser.",
    stlViewerLoading: "Loading STL",
    stlViewerError: "The 3D view could not load. Download the STL directly instead.",
    stlViewerReset: "Reset view",
    stlViewerInstructions: "Drag: rotate / Wheel or pinch: zoom",
    middleCaseMaterialTitle: "Use transparent or translucent material for the LED diffuser",
    middleCaseMaterialDescription:
      "The LED diffuser acts as a light guide that carries the side LED light to the outer edge. Clear, frosted, or other translucent filament or resin lets layer colors and animations glow through the side.",
    downloads: [
      {
        format: "ZIP",
        title: "PCB Gerber v3",
        description: "Copper, mask, silkscreen, outline, and drill files",
        file: "octgear-pcb-gerbers-v3.zip",
      },
      {
        format: "STL",
        title: "Case Top",
        description: "Case Top that holds the key switches",
        file: "octgear-case-top.stl",
      },
      {
        format: "STL",
        title: "Case Bottom",
        description: "Case Bottom that holds the PCB, wiring, and mounting nut",
        file: "octgear-case-bottom.stl",
      },
      {
        format: "STL",
        title: "LED Diffuser",
        description: "Side LED light guide; clear or translucent material recommended",
        file: "octgear-led-diffuser.stl",
      },
      {
        format: "STL",
        title: "Encoder Knob",
        description: "Knob for a D-shaft rotary encoder",
        file: "octgear-encoder-knob.stl",
      },
      {
        format: "STL",
        title: "Rubber-foot Fixing Jig",
        description: "Positions the rubber feet; not installed in the finished device",
        file: "octgear-rubber-foot-fixing-jig.stl",
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
          "Disconnect USB and inspect the key-switch terminal, seating, and solder joint. Because the matrix has no diodes, rectangular multi-key combinations are limited.",
      },
      {
        problem: "A complete row or column of keys does not respond",
        solution:
          "Disconnect USB and inspect the corresponding matrix Row / Column and RP2040-Zero pin. Check the shared signal joint or a solder bridge before individual key switches.",
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
    pcbRevision: "PCB revision",
    pcbRevisionDefault: (revision) => `PCB v${revision} (current)`,
    pcbRevisionLegacy: (revision) => `PCB v${revision} (legacy)`,
    pcbRevisionHint: "Selects GPIO 2 or GPIO 0 for Row 1 to match the PCB.",
    pcbRevisionUpdated: (revision) => `PCB revision: v${revision}`,
    pcbRevisionFailed: "Failed to change PCB revision",
    statusLedDirection: "LED strip direction",
    statusLedReversed: "Reverse",
    statusLedDirectionUpdated: (reversed) => `LED strip direction: ${reversed ? "reversed" : "standard"}`,
    statusLedDirectionFailed: "Failed to change LED strip direction",
    statusLayerDisplayMode: "Layer display",
    statusLayerDisplaySolid: "Solid layer color",
    statusLayerDisplayPattern: "4-LED pattern",
    statusLayerDisplayPatternHint:
      "Layers 0–7: 1000 / 0100 / 0010 / 0001 / 0111 / 1011 / 1101 / 1110",
    statusLayerDisplayModeUpdated: (mode) =>
      `Layer display: ${mode === 1 ? "4-LED pattern" : "solid"}`,
    statusLayerDisplayModeFailed: "Failed to change layer display",
    layerTapDanceTerm: "Tap Dance term",
    layerTapDanceTermValue: "Tap Dance term value",
    layerTapDanceTermRange: (min, max) =>
      `${min}-${max} ms / shorter values make single taps respond faster`,
    layerTapDanceTermUpdated: (termMs) => `Tap Dance term: ${termMs} ms`,
    layerTapDanceTermFailed: "Failed to change Tap Dance term",
    statusKeyAnimation: "Animation effect",
    statusKeyAnimationDisabled: "Off",
    statusKeyAnimationRipple: "Ripple",
    statusKeyAnimationFlash: "Flash",
    statusKeyAnimationSpark: "Spark",
    statusKeyAnimationUpdated: (animation) =>
      `Animation effect: ${["Ripple", "Off", "Flash", "Spark"][animation] ?? animation}`,
    statusKeyAnimationFailed: "Failed to change animation effect",
    statusKeyAnimationBrightness: "Animation brightness limit",
    statusKeyAnimationBrightnessValue: "Animation brightness limit value",
    statusKeyAnimationBrightnessRange: (max) =>
      `0-${max} / set above LED brightness for contrast`,
    statusKeyAnimationBrightnessUpdated: (brightness) =>
      `Animation brightness limit: ${brightness}`,
    statusKeyAnimationBrightnessFailed: "Failed to change animation brightness limit",
    statusLedBrightness: "LED brightness limit",
    statusLedBrightnessValue: "LED brightness limit value",
    statusLedBrightnessRange: (max) => `0-${max} / 0 turns LEDs off`,
    statusLedBrightnessUpdated: (brightness) => `LED brightness limit: ${brightness}`,
    statusLedBrightnessFailed: "Failed to change LED brightness limit",
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
    resetDescription: "This restores all key assignments, enabled layers, LED colors, brightness limits, encoder direction, LED strip direction, layer display, and animation effect to their defaults and saves them to the device immediately.",
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
    invalidDiagnosticReport: "Diagnostic report payload did not match",
    invalidPayloadLength: (actual, expected) =>
      `Invalid HID response length: ${actual} bytes (expected ${expected})`,
    invalidAssignmentKind: (kind) => `Unknown assignment kind: ${kind}`,
    invalidStatusKeyAnimation: (animation) =>
      `Unknown LED animation: ${animation}`,
    invalidStatusLayerDisplayMode: (mode) =>
      `Unknown layer display mode: ${mode}`,
    unexpectedResponse: (actual, expected) => `Unexpected HID response command ${actual}; expected ${expected}`,
  },
};
