import type { KeyAssignment } from "../keymap/keymapTypes";
import {
  createBlankAssignment,
  createConsumerAssignment,
  createKeyboardAssignment,
  createLayerCycleAssignment,
  createLayerPreviousAssignment,
  createMomentaryLayerAssignment,
  normalizeAssignment,
} from "../keymap/keymapTypes";
import {
  assertConfigOk,
  ConfigCommand,
  createConfigReport,
  decodeConfigResponse,
  type ConfigResponse,
} from "./hidProtocol";
import type { WebHidTransport } from "./webHidTransport";
import { t } from "../../shared/i18n";

export type DeviceState = {
  activeLayer: number;
  layerCount: number;
  keyCount: number;
  matrixRowCount: number;
  encoderReversed: boolean;
  statusLedReversed: boolean;
  statusLedBrightness: number;
  statusKeyAnimation: StatusKeyAnimation;
  statusKeyAnimationBrightness: number;
  statusLayerDisplayMode: StatusLayerDisplayMode;
  layerTapDanceTermMs: number;
  pcbRevision: number;
  enabledLayers: boolean[];
};

export const MIN_LAYER_TAP_DANCE_TERM_MS = 50;
export const MAX_LAYER_TAP_DANCE_TERM_MS = 1000;
export const DEFAULT_LAYER_TAP_DANCE_TERM_MS = 250;

export enum StatusKeyAnimation {
  Ripple = 0,
  Disabled = 1,
  Flash = 2,
  Spark = 3,
}

export enum StatusLayerDisplayMode {
  Solid = 0,
  Pattern = 1,
}

export type LayerEnabledResult = {
  activeLayer: number;
  enabledLayers: boolean[];
};

export type LayerColor = {
  red: number;
  green: number;
  blue: number;
};

export type DeviceKeyEvent = {
  layer: number;
  keyIndex: number;
  pressed: boolean;
};

export type DiagnosticReportResult = {
  signature: string;
  version: number;
};

export type DiagnosticStorageResult = {
  layerCount: number;
  keyCount: number;
};

const DIAGNOSTIC_REPORT_NONCE = [0x43, 0x59, 0x42, 0x38] as const;
const DEVICE_STATE_PAYLOAD_SIZE = 14;

export async function getDeviceState(transport: WebHidTransport): Promise<DeviceState> {
  const response = await sendCommand(transport, ConfigCommand.GetState);
  assertConfigOk(response);
  assertPayloadLength(response, DEVICE_STATE_PAYLOAD_SIZE);

  const layerCount = response.payload[1];
  const enabledLayerMask = response.payload[4];

  return {
    activeLayer: response.payload[0],
    layerCount,
    keyCount: response.payload[2],
    matrixRowCount: response.payload[3],
    encoderReversed: response.payload[5] !== 0,
    statusLedBrightness: response.payload[6],
    statusLedReversed: response.payload[7] !== 0,
    statusKeyAnimation: decodeStatusKeyAnimation(response.payload[8]),
    statusKeyAnimationBrightness: response.payload[9],
    statusLayerDisplayMode: decodeStatusLayerDisplayMode(response.payload[10]),
    layerTapDanceTermMs: response.payload[11] | (response.payload[12] << 8),
    pcbRevision: response.payload[13],
    enabledLayers: decodeEnabledLayers(enabledLayerMask, layerCount),
  };
}

export async function setDeviceLayer(transport: WebHidTransport, layer: number) {
  const response = await sendCommand(transport, ConfigCommand.SetLayer, [layer]);
  assertConfigOk(response);
  assertPayloadLength(response, 1);
}

export async function setDeviceEncoderReversed(transport: WebHidTransport, reversed: boolean) {
  const response = await sendCommand(transport, ConfigCommand.SetEncoderReversed, [reversed ? 1 : 0]);
  assertConfigOk(response);
  assertPayloadLength(response, 1);
  return response.payload[0] !== 0;
}

export async function setDeviceStatusLedBrightness(transport: WebHidTransport, brightness: number) {
  const response = await sendCommand(transport, ConfigCommand.SetStatusLedBrightness, [brightness]);
  assertConfigOk(response);
  assertPayloadLength(response, 1);
  return response.payload[0];
}

export async function setDeviceStatusLedReversed(transport: WebHidTransport, reversed: boolean) {
  const response = await sendCommand(transport, ConfigCommand.SetStatusLedReversed, [reversed ? 1 : 0]);
  assertConfigOk(response);
  assertPayloadLength(response, 1);
  return response.payload[0] !== 0;
}

export async function setDeviceStatusKeyAnimation(
  transport: WebHidTransport,
  animation: StatusKeyAnimation,
) {
  const response = await sendCommand(transport, ConfigCommand.SetStatusKeyAnimation, [animation]);
  assertConfigOk(response);
  assertPayloadLength(response, 1);
  return decodeStatusKeyAnimation(response.payload[0]);
}

export async function setDeviceStatusKeyAnimationBrightness(
  transport: WebHidTransport,
  brightness: number,
) {
  const response = await sendCommand(
    transport,
    ConfigCommand.SetStatusKeyAnimationBrightness,
    [brightness],
  );
  assertConfigOk(response);
  assertPayloadLength(response, 1);
  return response.payload[0];
}

export async function setDeviceStatusLayerDisplayMode(
  transport: WebHidTransport,
  mode: StatusLayerDisplayMode,
) {
  const response = await sendCommand(
    transport,
    ConfigCommand.SetStatusLayerDisplayMode,
    [mode],
  );
  assertConfigOk(response);
  assertPayloadLength(response, 1);
  return decodeStatusLayerDisplayMode(response.payload[0]);
}

export async function setDeviceLayerTapDanceTerm(
  transport: WebHidTransport,
  termMs: number,
) {
  const normalized = Math.trunc(termMs);
  const response = await sendCommand(
    transport,
    ConfigCommand.SetLayerTapDanceTerm,
    [normalized & 0xff, (normalized >> 8) & 0xff],
  );
  assertConfigOk(response);
  assertPayloadLength(response, 2);
  return response.payload[0] | (response.payload[1] << 8);
}

export async function setDevicePcbRevision(
  transport: WebHidTransport,
  revision: number,
) {
  const response = await sendCommand(
    transport,
    ConfigCommand.SetPcbRevision,
    [revision],
  );
  assertConfigOk(response);
  assertPayloadLength(response, 1);
  return response.payload[0];
}

export async function setDeviceLayerEnabled(
  transport: WebHidTransport,
  layer: number,
  enabled: boolean,
  layerCount: number,
): Promise<LayerEnabledResult> {
  const response = await sendCommand(transport, ConfigCommand.SetLayerEnabled, [layer, enabled ? 1 : 0]);
  assertConfigOk(response);
  assertPayloadLength(response, 4);

  return {
    activeLayer: response.payload[2],
    enabledLayers: decodeEnabledLayers(response.payload[3], layerCount),
  };
}

export async function readDeviceLayerColors(
  transport: WebHidTransport,
  layerCount: number,
): Promise<LayerColor[]> {
  const colors: LayerColor[] = [];

  for (let layer = 0; layer < layerCount; layer++) {
    const response = await sendCommand(transport, ConfigCommand.GetLayerColor, [layer]);
    assertConfigOk(response);
    assertPayloadLength(response, 4);
    colors.push({
      red: response.payload[1],
      green: response.payload[2],
      blue: response.payload[3],
    });
  }

  return colors;
}

export async function setDeviceLayerColor(
  transport: WebHidTransport,
  layer: number,
  color: LayerColor,
) {
  const response = await sendCommand(transport, ConfigCommand.SetLayerColor, [
    layer,
    clampColorChannel(color.red),
    clampColorChannel(color.green),
    clampColorChannel(color.blue),
  ]);
  assertConfigOk(response);
  assertPayloadLength(response, 4);
}

export async function previewDeviceLayerColor(
  transport: WebHidTransport,
  layer: number,
  color: LayerColor,
) {
  const response = await sendCommand(transport, ConfigCommand.PreviewLayerColor, [
    layer,
    clampColorChannel(color.red),
    clampColorChannel(color.green),
    clampColorChannel(color.blue),
  ]);
  assertConfigOk(response);
  assertPayloadLength(response, 4);
}

export async function clearDeviceLayerColorPreview(transport: WebHidTransport) {
  const response = await sendCommand(
    transport,
    ConfigCommand.PreviewLayerColor,
    [0xff],
  );
  assertConfigOk(response);
  assertPayloadLength(response, 0);
}

export async function resetDeviceConfiguration(transport: WebHidTransport) {
  const response = await sendCommand(transport, ConfigCommand.ResetConfiguration);
  assertConfigOk(response);
  assertPayloadLength(response, 2);
}

export async function getDeviceKey(transport: WebHidTransport, layer: number, keyIndex: number) {
  const response = await sendCommand(transport, ConfigCommand.GetKey, [layer, keyIndex]);
  assertConfigOk(response);
  return decodeAssignmentPayload(response.payload);
}

export async function readDeviceKeymap(
  transport: WebHidTransport,
  layerCount: number,
  keyCount: number,
) {
  const keymap: KeyAssignment[][] = [];

  for (let layer = 0; layer < layerCount; layer++) {
    const layerAssignments: KeyAssignment[] = [];

    for (let keyIndex = 0; keyIndex < keyCount; keyIndex++) {
      layerAssignments.push(await getDeviceKey(transport, layer, keyIndex));
    }

    keymap.push(layerAssignments);
  }

  return keymap;
}

export async function setDeviceKey(
  transport: WebHidTransport,
  layer: number,
  keyIndex: number,
  assignment: KeyAssignment,
) {
  const normalized = normalizeAssignment(assignment);
  const payload = new Uint8Array(13);
  payload[0] = layer;
  payload[1] = keyIndex;
  payload[2] = encodeAssignmentKind(normalized.kind);
  payload[3] = normalized.modifier;

  if (normalized.kind === "keyboard") {
    for (let i = 0; i < 6; i++) {
      payload[4 + i] = normalized.keycodes[i] ?? 0;
    }
  }

  if (normalized.kind === "consumer") {
    payload[10] = normalized.usage & 0xff;
    payload[11] = (normalized.usage >> 8) & 0xff;
  }

  if (normalized.kind === "momentaryLayer") {
    payload[12] = normalized.targetLayer & 0xff;
  }

  const response = await sendCommand(transport, ConfigCommand.SetKey, payload);
  assertConfigOk(response);
  assertPayloadLength(response, 2);
}

export async function enterDeviceBootloader(transport: WebHidTransport) {
  await transport.sendConfigReport(createConfigReport(ConfigCommand.EnterBootloader));
}

export async function sendRemapperHeartbeat(transport: WebHidTransport) {
  await transport.sendConfigReport(createConfigReport(ConfigCommand.RemapperHeartbeat));
}

export async function runDiagnosticReportTest(transport: WebHidTransport): Promise<DiagnosticReportResult> {
  const response = await sendCommand(transport, ConfigCommand.DiagnosticReport, DIAGNOSTIC_REPORT_NONCE);
  assertConfigOk(response);
  assertPayloadLength(response, 8);

  const expected = [0x52, 0x50, 0x54, 0x01, ...DIAGNOSTIC_REPORT_NONCE];
  for (let i = 0; i < expected.length; i++) {
    if (response.payload[i] !== expected[i]) {
      throw new Error(t.device.invalidDiagnosticReport);
    }
  }

  return {
    signature: "RPT",
    version: response.payload[3],
  };
}

export async function runDiagnosticStorageTest(transport: WebHidTransport): Promise<DiagnosticStorageResult> {
  const response = await sendCommand(transport, ConfigCommand.DiagnosticStorage);
  assertConfigOk(response);
  assertPayloadLength(response, 3);

  return {
    layerCount: response.payload[1],
    keyCount: response.payload[2],
  };
}

export function subscribeDeviceKeyEvents(
  transport: WebHidTransport,
  handler: (event: DeviceKeyEvent) => void,
) {
  return transport.addConfigReportListener((raw) => {
    const response = decodeConfigResponse(raw);
    if (response.command !== ConfigCommand.KeyEvent) {
      return;
    }

    assertConfigOk(response);
    assertPayloadLength(response, 3);
    handler({
      layer: response.payload[0],
      keyIndex: response.payload[1],
      pressed: response.payload[2] !== 0,
    });
  });
}

async function sendCommand(
  transport: WebHidTransport,
  command: ConfigCommand,
  payload: ArrayLike<number> = [],
): Promise<ConfigResponse> {
  const raw = await transport.requestConfigReport(createConfigReport(command, payload));
  const response = decodeConfigResponse(raw);

  if (response.command !== command) {
    throw new Error(t.device.unexpectedResponse(response.command, command));
  }

  return response;
}

function encodeAssignmentKind(kind: KeyAssignment["kind"]) {
  switch (kind) {
    case "keyboard":
      return 1;
    case "consumer":
      return 2;
    case "layerCycle":
      return 3;
    case "layerPrevious":
      return 5;
    case "momentaryLayer":
      return 4;
    case "none":
    default:
      return 0;
  }
}

function decodeAssignmentPayload(payload: Uint8Array): KeyAssignment {
  if (payload.length !== 13) {
    throw new Error(t.device.invalidPayloadLength(payload.length, 13));
  }

  const kind = payload[2];
  const modifier = payload[3];
  const keycodes = Array.from(payload.slice(4, 10));
  const consumerUsage = payload[10] | (payload[11] << 8);
  const targetLayer = payload[12];

  switch (kind) {
    case 0:
      return createBlankAssignment();
    case 1:
      return createKeyboardAssignment(keycodes[0] ?? 0, modifier, keycodes);
    case 2:
      return createConsumerAssignment(consumerUsage);
    case 3:
      return createLayerCycleAssignment();
    case 4:
      return createMomentaryLayerAssignment(targetLayer);
    case 5:
      return createLayerPreviousAssignment();
    default:
      throw new Error(t.device.invalidAssignmentKind(kind));
  }
}

function decodeEnabledLayers(mask: number, layerCount: number) {
  return Array.from({ length: layerCount }, (_, layer) => (mask & (1 << layer)) !== 0);
}

function clampColorChannel(value: number) {
  return Math.max(0, Math.min(255, Math.trunc(value)));
}

function decodeStatusKeyAnimation(value: number): StatusKeyAnimation {
  switch (value) {
    case StatusKeyAnimation.Ripple:
    case StatusKeyAnimation.Disabled:
    case StatusKeyAnimation.Flash:
    case StatusKeyAnimation.Spark:
      return value;
    default:
      throw new Error(t.device.invalidStatusKeyAnimation(value));
  }
}

function decodeStatusLayerDisplayMode(value: number): StatusLayerDisplayMode {
  if (
    value !== StatusLayerDisplayMode.Solid &&
    value !== StatusLayerDisplayMode.Pattern
  ) {
    throw new Error(t.device.invalidStatusLayerDisplayMode(value));
  }

  return value;
}

function assertPayloadLength(response: ConfigResponse, expected: number) {
  if (response.payload.length !== expected) {
    throw new Error(t.device.invalidPayloadLength(response.payload.length, expected));
  }
}
