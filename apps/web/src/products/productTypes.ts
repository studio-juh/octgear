import type { UsbIdentity } from "../features/device/usbIdentity";
import type { FirmwareArtifact } from "../features/firmware/firmwareUpdater";
import type { HardwareConfig } from "../features/hardware/hardwareConfig";

export type ProductId = "octgear";
export type ProductPage = "home" | "buildGuide" | "remapper" | "diagnostics";

export type ProductDefinition = {
  readonly id: ProductId;
  readonly name: string;
  readonly hardware: HardwareConfig;
  readonly usbIdentity: UsbIdentity;
  readonly firmware: FirmwareArtifact;
  readonly routes: Record<ProductPage, string>;
  readonly assets: {
    readonly mark: string;
    readonly homeImage: string;
    readonly buildGuideRoot: string;
  };
  readonly buildGuide: {
    readonly controlLayout: {
      readonly outline: string;
      readonly aspectRatio: string;
      readonly keys: readonly {
        readonly top: string;
        readonly left: string;
        readonly width?: string;
        readonly height?: string;
        readonly tone?: "default" | "light";
        readonly optionalKeycapSize?: string;
      }[];
      readonly encoder: {
        readonly right: string;
        readonly bottom: string;
        readonly width: string;
      };
    };
    readonly translucentStlFiles: readonly string[];
    readonly hardwareLicenseUrl: string;
  };
  readonly storageNamespace: string;
};
