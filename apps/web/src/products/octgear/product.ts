import { HARDWARE_CONFIG } from "./generatedHardwareConfig";
import type { ProductDefinition } from "../productTypes";

export const octgearProduct = {
  id: "octgear",
  name: "OctGear",
  hardware: HARDWARE_CONFIG,
  usbIdentity: {
    vendorId: 0x2e8a,
    productId: 0x1133,
    manufacturerName: "OctGear",
    productName: "OctGear",
  },
  firmware: {
    fileName: "octgear.uf2",
    publicPath: "firmware/octgear.uf2",
  },
  routes: {
    home: "",
    buildGuide: "octgear.html",
    remapper: "octgear-remapper.html",
    diagnostics: "octgear-diagnostics.html",
  },
  links: {
    store: "https://hanairo-m.booth.pm/",
  },
  assets: {
    mark: "brand/octgear-mark.png",
    homeImage: "build-guide/completed/octgear-completed-front.jpg",
    buildGuideRoot: "build-guide/",
  },
  buildGuide: {
    controlLayout: {
      outline: "layout/octgear-control-layout.svg",
      aspectRatio: "2 / 1",
      keys: [
        {
          top: "17%",
          left: "7.85%",
          width: "14.625%",
          tone: "light",
          optionalKeycapSize: "1.25U",
        },
        { top: "17%", left: "27.2%" },
        { top: "17%", left: "42.9%" },
        { top: "17%", left: "58.6%" },
        {
          top: "48.5%",
          left: "8.475%",
          width: "17.55%",
          tone: "light",
          optionalKeycapSize: "1.5U",
        },
        { top: "48.5%", left: "31.4%" },
        { top: "48.5%", left: "47.1%" },
        { top: "48.5%", left: "62.8%" },
      ],
      encoder: {
        right: "0",
        bottom: "0",
        width: "21%",
      },
    },
    translucentStlFiles: ["octgear-case-middle.stl"],
    hardwareLicenseUrl:
      "https://github.com/studio-juh/octgear/blob/main/HARDWARE-LICENSE.md",
  },
  storageNamespace: "octgear",
} as const satisfies ProductDefinition;
