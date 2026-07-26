export type HardwareControl = {
  readonly id: string;
  readonly label: string;
  readonly bit: number;
  readonly kind: "key" | "encoder" | "encoderSwitch";
};

export type HardwareConfig = {
  readonly productName: string;
  readonly physicalKeyCount: number;
  readonly keyCount: number;
  readonly layerCount: number;
  readonly defaultEnabledLayers: readonly number[];
  readonly defaultLayerColors: readonly (readonly [number, number, number])[];
  readonly statusLedBrightness: {
    readonly default: number;
    readonly max: number;
  };
  readonly statusKeyAnimationBrightness: {
    readonly default: number;
    readonly max: number;
  };
  readonly statusLedKeyAnimation: number;
  readonly matrix: {
    readonly rowCount: number;
    readonly columnCount: number;
    readonly diodeDirection: string;
  };
  readonly externalRgbLed: boolean;
  readonly externalRgbLedCount: number;
  readonly externalRgbLedReversed: boolean;
  readonly oled: boolean;
  readonly encoder: {
    readonly enabled: boolean;
    readonly pinCount: number;
    readonly reversed: boolean;
    readonly controls: readonly HardwareControl[];
  };
  readonly keyPins: readonly HardwareControl[];
  readonly controls: readonly HardwareControl[];
};
