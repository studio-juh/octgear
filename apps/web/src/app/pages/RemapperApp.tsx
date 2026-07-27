import { useEffect, useMemo, useRef, useState } from "react";
import { EditorPanel } from "../components/EditorPanel";
import { FirmwarePanel } from "../components/FirmwarePanel";
import { HardwarePanel } from "../components/HardwarePanel";
import { KeyboardPickerPanel } from "../components/KeyboardPickerPanel";
import { RemapPanel } from "../components/RemapPanel";
import { SiteFooter } from "../components/SiteFooter";
import { productAssetUrl, productPageUrl } from "../appUrls";
import { useDeviceSession } from "../hooks/useDeviceSession";
import {
  createModifierMaskFromSlots,
  createModifierSlotsFromMask,
} from "../remapper/modifierSlots";
import {
  applyLayerNavigationOverrides,
  collectChangedAssignments,
  createBlankKeymap,
  expandKeymap,
  normalizeKeymapForDevice,
  updateKeymap,
  updateKeymapKeyAcrossLayers,
} from "../updateKeymap";
import {
  clearDeviceLayerColorPreview,
  enterDeviceBootloader,
  getDeviceState,
  previewDeviceLayerColor,
  readDeviceKeymap,
  readDeviceLayerColors,
  resetDeviceConfiguration,
  sendRemapperHeartbeat,
  setDeviceLayer,
  setDeviceEncoderReversed,
  setDeviceStatusLedBrightness,
  setDeviceStatusLedReversed,
  setDeviceStatusKeyAnimation,
  setDeviceStatusKeyAnimationBrightness,
  setDeviceLayerEnabled,
  setDeviceLayerColor,
  setDeviceKey,
  subscribeDeviceKeyEvents,
  type DeviceState,
  type LayerColor,
  type StatusKeyAnimation,
} from "../../features/device/deviceCommands";
import { WebHidTransport } from "../../features/device/webHidTransport";
import {
  canInstallUf2FromBrowser,
  downloadFirmwareUf2,
  installFirmwareUf2,
} from "../../features/firmware/firmwareUpdater";
import type { HardwareConfig } from "../../features/hardware/hardwareConfig";
import {
  type ConsumerKeyOption,
  type KeyboardLayoutMode,
  type KeyPickerOption,
} from "../../features/keymap/keyPickerOptions";
import {
  createBlankAssignment,
  createConsumerAssignment,
  createKeyboardAssignment,
  createLayerCycleAssignment,
  createLayerPreviousAssignment,
  createMomentaryLayerAssignment,
  normalizeAssignment,
  type DeviceKeymap,
  type KeyAssignment,
  type KeyAssignmentKind,
} from "../../features/keymap/keymapTypes";
import { useProductDefinition } from "../../products/ProductContext";
import { getProductMessages } from "../../products/productMessages";
import { useI18n } from "../../shared/i18n";

const LAYER_COLOR_PREVIEW_DEBOUNCE_MS = 60;
const WORKSPACE_SCALE_OPTIONS = [80, 90, 100] as const;

type WorkspaceScale = typeof WORKSPACE_SCALE_OPTIONS[number];

type RemapperAppProps = {
  homeHref?: string;
};

export function RemapperApp({ homeHref }: RemapperAppProps) {
  const { locale, t } = useI18n();
  const product = useProductDefinition();
  const hardware = product.hardware;
  const productMessages = getProductMessages(product.id);
  const resolvedHomeHref = homeHref ?? productPageUrl(product, "home");
  const workspaceScaleStorageKey =
    `${product.storageNamespace}.remapper.workspaceScale`;
  const transport = useMemo(
    () => new WebHidTransport(product.usbIdentity),
    [product.usbIdentity],
  );
  const [activeLayer, setActiveLayer] = useState(0);
  const [selectedKey, setSelectedKey] = useState(0);
  const [firmwareModalOpen, setFirmwareModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [encoderDirectionUpdating, setEncoderDirectionUpdating] = useState(false);
  const [statusLedDirectionUpdating, setStatusLedDirectionUpdating] = useState(false);
  const [statusLedBrightness, setStatusLedBrightness] = useState<number>(
    hardware.statusLedBrightness.default,
  );
  const [statusLedBrightnessUpdating, setStatusLedBrightnessUpdating] = useState(false);
  const [statusKeyAnimationUpdating, setStatusKeyAnimationUpdating] = useState(false);
  const [statusKeyAnimationBrightness, setStatusKeyAnimationBrightness] =
    useState<number>(hardware.statusKeyAnimationBrightness.default);
  const [
    statusKeyAnimationBrightnessUpdating,
    setStatusKeyAnimationBrightnessUpdating,
  ] = useState(false);
  const [workspaceScale, setWorkspaceScale] =
    useState<WorkspaceScale>(() =>
      loadWorkspaceScale(workspaceScaleStorageKey),
    );
  const [status, setStatus] = useState<string>(t.connection.initialStatus);
  const [firmwareStatus, setFirmwareStatus] = useState<string>(t.firmware.initialStatus);
  const [deviceState, setDeviceState] = useState<DeviceState | null>(null);
  const [readKeymap, setReadKeymap] = useState(() =>
    createInitialKeymap(hardware),
  );
  const [writeKeymap, setWriteKeymap] = useState(() =>
    createInitialKeymap(hardware),
  );
  const [readEnabledLayers, setReadEnabledLayers] = useState(() =>
    createInitialEnabledLayers(hardware),
  );
  const [writeEnabledLayers, setWriteEnabledLayers] = useState(() =>
    createInitialEnabledLayers(hardware),
  );
  const [readLayerColors, setReadLayerColors] = useState(() =>
    createInitialLayerColors(hardware),
  );
  const [writeLayerColors, setWriteLayerColors] = useState(() =>
    createInitialLayerColors(hardware),
  );
  const colorPreviewTimerRef = useRef<number | null>(null);
  const colorPreviewQueueRef = useRef<Promise<void>>(Promise.resolve());
  const [keyboardLayout, setKeyboardLayout] = useState<KeyboardLayoutMode>("jis");
  const selectedAssignment = writeKeymap[activeLayer]?.[selectedKey] ?? normalizeAssignment({ kind: "none" });
  const [draftAssignment, setDraftAssignment] = useState<KeyAssignment>(selectedAssignment);
  const [modifierSlots, setModifierSlots] = useState<number[]>(createModifierSlotsFromMask(0));
  const connected = deviceState !== null && transport.connected;
  const deviceLayerCount = deviceState?.layerCount ?? 0;
  const deviceKeyCount = deviceState?.keyCount ?? 0;
  const firmwareInstallSupported = canInstallUf2FromBrowser();
  const disconnectDevice = useDeviceSession(transport, connected, () => {
    setDeviceState(null);
    setStatus(t.connection.initialStatus);
  });

  useEffect(() => {
    setReadKeymap(localizeKeymap);
    setWriteKeymap(localizeKeymap);
    setDraftAssignment((current) => normalizeAssignment(current));

    if (!connected) {
      setStatus(t.connection.initialStatus);
    }

    if (!firmwareModalOpen) {
      setFirmwareStatus(t.firmware.initialStatus);
    }
  }, [locale]);

  useEffect(() => {
    setDraftAssignment(selectedAssignment);
    setModifierSlots(
      createModifierSlotsFromMask(selectedAssignment.kind === "keyboard" ? selectedAssignment.modifier : 0),
    );
  }, [selectedAssignment]);

  useEffect(() => () => cancelScheduledColorPreview(), []);

  useEffect(() => {
    if (!resetModalOpen || resetting) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setResetModalOpen(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [resetModalOpen, resetting]);

  useEffect(() => {
    if (!connected || deviceKeyCount === 0) {
      return;
    }

    return subscribeDeviceKeyEvents(transport, (event) => {
      if (!event.pressed) {
        return;
      }

      if (event.keyIndex >= deviceKeyCount) {
        return;
      }

      setSelectedKey(event.keyIndex);
    });
  }, [connected, deviceKeyCount, transport]);

  async function connectDevice() {
    try {
      const device = await transport.requestDevice();
      await transport.open();
      await sendRemapperHeartbeat(transport);
      const state = await getDeviceState(transport);
      const loadedKeymap = await readDeviceKeymap(transport, state.layerCount, state.keyCount);
      const loadedLayerColors = await readDeviceLayerColors(
        transport,
        state.layerCount,
        hardware.defaultLayerColors,
      );
      console.info("[hid] connected", {
        productName: device.productName,
        vendorId: `0x${device.vendorId.toString(16).padStart(4, "0").toUpperCase()}`,
        productId: `0x${device.productId.toString(16).padStart(4, "0").toUpperCase()}`,
      });
      const uiKeymap = expandKeymap(loadedKeymap, state.layerCount, hardware.keyCount);
      setDeviceState(state);
      setStatusLedBrightness(
        state.statusLedBrightnessSupported
          ? state.statusLedBrightness
          : hardware.statusLedBrightness.default,
      );
      setStatusKeyAnimationBrightness(
        state.statusKeyAnimationBrightnessSupported
          ? state.statusKeyAnimationBrightness
          : hardware.statusKeyAnimationBrightness.default,
      );
      setReadKeymap(uiKeymap);
      setWriteKeymap(applyLayerNavigationOverrides(uiKeymap));
      setReadEnabledLayers(state.enabledLayers);
      setWriteEnabledLayers(state.enabledLayers);
      setReadLayerColors(loadedLayerColors);
      setWriteLayerColors(loadedLayerColors);
      setActiveLayer(state.activeLayer);
      setSelectedKey((current) => (current < state.keyCount ? current : 0));
      setStatus(t.connection.connectedTo(device.productName || t.device.fallbackName));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : t.connection.connectFailed);
    }
  }

  async function selectLayer(layerIndex: number) {
    setActiveLayer(layerIndex);
    cancelScheduledColorPreview();

    if (!transport.connected) {
      return;
    }

    try {
      await clearLayerColorPreview();
      if (!writeEnabledLayers[layerIndex]) {
        return;
      }
      await setDeviceLayer(transport, layerIndex);
      setDeviceState((current) =>
        current ? { ...current, activeLayer: layerIndex } : current,
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : t.connection.layerChangeFailed);
    }
  }

  async function updateEncoderReversed(reversed: boolean) {
    if (!connected || !deviceState) {
      setStatus(t.connection.deviceNotConnected);
      return;
    }

    try {
      setEncoderDirectionUpdating(true);
      const saved = await setDeviceEncoderReversed(transport, reversed);
      setDeviceState((current) => current ? { ...current, encoderReversed: saved } : current);
      setStatus(t.hardware.encoderDirectionUpdated(saved));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : t.hardware.encoderDirectionFailed);
    } finally {
      setEncoderDirectionUpdating(false);
    }
  }

  async function updateStatusLedReversed(reversed: boolean) {
    if (!connected || !deviceState) {
      setStatus(t.connection.deviceNotConnected);
      return;
    }

    if (!deviceState.statusLedReversedSupported) {
      setStatus(t.device.statusLedReverseUnsupported);
      return;
    }

    try {
      setStatusLedDirectionUpdating(true);
      const saved = await setDeviceStatusLedReversed(transport, reversed);
      setDeviceState((current) =>
        current ? { ...current, statusLedReversed: saved } : current,
      );
      setStatus(t.hardware.statusLedDirectionUpdated(saved));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : t.hardware.statusLedDirectionFailed);
    } finally {
      setStatusLedDirectionUpdating(false);
    }
  }

  async function updateStatusKeyAnimation(animation: StatusKeyAnimation) {
    if (!connected || !deviceState) {
      setStatus(t.connection.deviceNotConnected);
      return;
    }

    if (!deviceState.statusKeyAnimationSupported) {
      setStatus(t.device.statusKeyAnimationUnsupported);
      return;
    }

    try {
      setStatusKeyAnimationUpdating(true);
      const saved = await setDeviceStatusKeyAnimation(transport, animation);
      setDeviceState((current) =>
        current ? { ...current, statusKeyAnimation: saved } : current,
      );
      setStatus(t.hardware.statusKeyAnimationUpdated(saved));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : t.hardware.statusKeyAnimationFailed);
    } finally {
      setStatusKeyAnimationUpdating(false);
    }
  }

  function updateStatusKeyAnimationBrightnessDraft(brightness: number) {
    setStatusKeyAnimationBrightness(Math.max(
      0,
      Math.min(
        hardware.statusKeyAnimationBrightness.max,
        Math.trunc(brightness),
      ),
    ));
  }

  async function applyStatusKeyAnimationBrightness() {
    if (!connected || !deviceState) {
      setStatus(t.connection.deviceNotConnected);
      return;
    }

    if (!deviceState.statusKeyAnimationBrightnessSupported) {
      setStatus(t.device.statusKeyAnimationBrightnessUnsupported);
      return;
    }

    try {
      setStatusKeyAnimationBrightnessUpdating(true);
      const saved = await setDeviceStatusKeyAnimationBrightness(
        transport,
        statusKeyAnimationBrightness,
      );
      setStatusKeyAnimationBrightness(saved);
      setDeviceState((current) =>
        current ? { ...current, statusKeyAnimationBrightness: saved } : current,
      );
      setStatus(t.hardware.statusKeyAnimationBrightnessUpdated(saved));
    } catch (error) {
      setStatusKeyAnimationBrightness(
        deviceState.statusKeyAnimationBrightness,
      );
      setStatus(
        error instanceof Error
          ? error.message
          : t.hardware.statusKeyAnimationBrightnessFailed,
      );
    } finally {
      setStatusKeyAnimationBrightnessUpdating(false);
    }
  }

  function updateStatusLedBrightnessDraft(brightness: number) {
    setStatusLedBrightness(Math.max(
      0,
      Math.min(hardware.statusLedBrightness.max, Math.trunc(brightness)),
    ));
  }

  async function applyStatusLedBrightness() {
    if (!connected || !deviceState) {
      setStatus(t.connection.deviceNotConnected);
      return;
    }

    if (!deviceState.statusLedBrightnessSupported) {
      setStatus(t.device.statusLedBrightnessUnsupported);
      return;
    }

    try {
      setStatusLedBrightnessUpdating(true);
      const saved = await setDeviceStatusLedBrightness(transport, statusLedBrightness);
      setStatusLedBrightness(saved);
      setDeviceState((current) =>
        current ? { ...current, statusLedBrightness: saved } : current,
      );
      setStatus(t.hardware.statusLedBrightnessUpdated(saved));
    } catch (error) {
      setStatusLedBrightness(deviceState.statusLedBrightness);
      setStatus(error instanceof Error ? error.message : t.hardware.statusLedBrightnessFailed);
    } finally {
      setStatusLedBrightnessUpdating(false);
    }
  }

  async function readAllAssignments() {
    if (!connected || !deviceState) {
      setStatus(t.connection.deviceNotConnected);
      return;
    }

    try {
      setStatus(t.keymap.reading);
      await clearLayerColorPreview();
      const state = await getDeviceState(transport);
      const loadedKeymap = await readDeviceKeymap(transport, state.layerCount, state.keyCount);
      const loadedLayerColors = await readDeviceLayerColors(
        transport,
        state.layerCount,
        hardware.defaultLayerColors,
      );
      const uiKeymap = expandKeymap(loadedKeymap, state.layerCount, hardware.keyCount);
      setDeviceState(state);
      setStatusLedBrightness(
        state.statusLedBrightnessSupported
          ? state.statusLedBrightness
          : hardware.statusLedBrightness.default,
      );
      setStatusKeyAnimationBrightness(
        state.statusKeyAnimationBrightnessSupported
          ? state.statusKeyAnimationBrightness
          : hardware.statusKeyAnimationBrightness.default,
      );
      setReadKeymap(uiKeymap);
      setWriteKeymap(applyLayerNavigationOverrides(uiKeymap));
      setReadEnabledLayers(state.enabledLayers);
      setWriteEnabledLayers(state.enabledLayers);
      setReadLayerColors(loadedLayerColors);
      setWriteLayerColors(loadedLayerColors);
      setStatus(t.keymap.readComplete);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : t.keymap.readFailed);
    }
  }

  async function saveAllAssignments() {
    if (!connected || !deviceState) {
      setStatus(t.connection.deviceNotConnected);
      return;
    }

    const keymapToSave = normalizeKeymapForDevice(
      writeKeymap,
      deviceState.layerCount,
      deviceState.keyCount,
    );
    const saveTargets = collectChangedAssignments(readKeymap, keymapToSave);
    const layerTargets = writeEnabledLayers
      .map((enabled, layer) => ({ layer, enabled }))
      .filter(({ layer, enabled }) => layer > 0 && readEnabledLayers[layer] !== enabled);
    const colorTargets = writeLayerColors
      .slice(0, deviceState.layerCount)
      .map((color, layer) => ({ layer, color }))
      .filter(({ layer, color }) => !sameLayerColor(readLayerColors[layer], color));
    try {
      await clearLayerColorPreview();
      if (saveTargets.length === 0 && layerTargets.length === 0 && colorTargets.length === 0) {
        setStatus(t.keymap.saveSkippedAll);
        return;
      }

      setStatus(t.keymap.savingAll);
      let latestDeviceState = deviceState;
      for (const { layer, enabled } of layerTargets) {
        const result = await setDeviceLayerEnabled(
          transport,
          layer,
          enabled,
          deviceState.layerCount,
        );
        latestDeviceState = {
          ...latestDeviceState,
          activeLayer: result.activeLayer,
          enabledLayers: result.enabledLayers,
        };
      }

      for (const { layer, color } of colorTargets) {
        await setDeviceLayerColor(transport, layer, color);
      }

      for (const { layer, keyIndex, assignment } of saveTargets) {
        await setDeviceKey(transport, layer, keyIndex, assignment);
      }

      setDeviceState(latestDeviceState);
      setReadKeymap(keymapToSave);
      setWriteKeymap(keymapToSave);
      setReadEnabledLayers(writeEnabledLayers);
      setReadLayerColors(writeLayerColors);
      setStatus(t.keymap.savedAll(
        saveTargets.length + layerTargets.length + colorTargets.length,
        deviceState.layerCount,
        deviceState.keyCount,
      ));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : t.keymap.saveFailed);
    }
  }

  async function resetConfiguration() {
    if (!connected || !deviceState) {
      setStatus(t.connection.deviceNotConnected);
      return;
    }

    setResetting(true);
    setStatus(t.keymap.resetting);
    try {
      await clearLayerColorPreview();
      await resetDeviceConfiguration(transport);

      const state = await getDeviceState(transport);
      const loadedKeymap = await readDeviceKeymap(transport, state.layerCount, state.keyCount);
      const loadedLayerColors = await readDeviceLayerColors(
        transport,
        state.layerCount,
        hardware.defaultLayerColors,
      );
      const uiKeymap = expandKeymap(loadedKeymap, state.layerCount, hardware.keyCount);

      setDeviceState(state);
      setStatusLedBrightness(
        state.statusLedBrightnessSupported
          ? state.statusLedBrightness
          : hardware.statusLedBrightness.default,
      );
      setStatusKeyAnimationBrightness(
        state.statusKeyAnimationBrightnessSupported
          ? state.statusKeyAnimationBrightness
          : hardware.statusKeyAnimationBrightness.default,
      );
      setReadKeymap(uiKeymap);
      setWriteKeymap(applyLayerNavigationOverrides(uiKeymap));
      setReadEnabledLayers(state.enabledLayers);
      setWriteEnabledLayers(state.enabledLayers);
      setReadLayerColors(loadedLayerColors);
      setWriteLayerColors(loadedLayerColors);
      setActiveLayer(state.activeLayer);
      setSelectedKey((current) => (current < state.keyCount ? current : 0));
      setResetModalOpen(false);
      setStatus(t.keymap.resetComplete);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : t.keymap.resetFailed);
    } finally {
      setResetting(false);
    }
  }

  async function enterBootloaderMode() {
    if (!connected) {
      setFirmwareStatus(t.connection.deviceNotConnected);
      return;
    }

    try {
      setFirmwareStatus(t.firmware.enteringBootloader);
      await enterDeviceBootloader(transport);
      await transport.close().catch(() => undefined);
      setDeviceState(null);
      setStatus(t.firmware.bootMode);
      setFirmwareStatus(t.firmware.bootDriveReady);
    } catch (error) {
      setFirmwareStatus(error instanceof Error ? error.message : t.firmware.enterBootloaderFailed);
    }
  }

  async function installBundledFirmware() {
    try {
      setFirmwareStatus(t.firmware.writing);
      const result = await installFirmwareUf2(product.firmware);
      setFirmwareStatus(t.firmware.written(result.fileName, Math.ceil(result.size / 1024)));
    } catch (error) {
      setFirmwareStatus(error instanceof Error ? error.message : t.firmware.writeFailed);
    }
  }

  async function downloadBundledFirmware() {
    try {
      setFirmwareStatus(t.firmware.downloading);
      await downloadFirmwareUf2(product.firmware);
      setFirmwareStatus(t.firmware.downloaded);
    } catch (error) {
      setFirmwareStatus(error instanceof Error ? error.message : t.firmware.downloadFailed);
    }
  }

  function updateDraftKind(kind: KeyAssignmentKind) {
    updateSelectedAssignment((current) => normalizeAssignment({ ...current, kind }));
    setModifierSlots((current) => (kind === "keyboard" ? current : createModifierSlotsFromMask(0)));
  }

  function updateDraftUsage(usage: number) {
    updateSelectedAssignment((current) =>
      normalizeAssignment({
        ...current,
        usage,
        targetLayer:
          current.kind === "momentaryLayer" ? usage : current.targetLayer,
        keycodes: current.kind === "keyboard" ? [usage, 0, 0, 0, 0, 0] : current.keycodes,
      }),
    );
  }

  function updateDraftModifier(modifier: number) {
    updateSelectedAssignment((current) => {
      const usage = current.kind === "keyboard" ? current.usage : 0;
      const keycodes = current.kind === "keyboard" ? current.keycodes : [0, 0, 0, 0, 0, 0];
      return createKeyboardAssignment(usage, modifier, keycodes);
    });
  }

  function updateDraftModifierSlot(index: number, modifier: number) {
    setModifierSlots((current) => {
      const next = current.map((value, currentIndex) => (currentIndex === index ? modifier : value));
      updateDraftModifier(createModifierMaskFromSlots(next));
      return next;
    });
  }

  function applyPickerOption(option: KeyPickerOption) {
    if (option.kind === "spacer" || option.kind === "decoration") {
      return;
    }

    if (option.kind === "blank") {
      updateSelectedAssignment(() => createBlankAssignment());
      setModifierSlots(createModifierSlotsFromMask(0));
      return;
    }

    if (option.kind === "modifier") {
      updateSelectedAssignment((current) => {
        const modifier = current.kind === "keyboard" ? current.modifier : 0;
        const usage = current.kind === "keyboard" ? current.usage : 0;
        const keycodes = current.kind === "keyboard" ? current.keycodes : [0, 0, 0, 0, 0, 0];
        const nextModifier = modifier ^ option.modifier;
        setModifierSlots(createModifierSlotsFromMask(nextModifier));
        return createKeyboardAssignment(usage, nextModifier, keycodes);
      });
      return;
    }

    updateSelectedAssignment((current) => {
      const modifier = current.kind === "keyboard" ? current.modifier : 0;
      return createKeyboardAssignment(option.code, modifier);
    });
  }

  function applyConsumerOption(option: ConsumerKeyOption) {
    updateSelectedAssignment(() => createConsumerAssignment(option.usage));
  }

  function applyLayerCycleOption() {
    updateSelectedAssignment(() => createLayerCycleAssignment());
  }

  function applyLayerPreviousOption() {
    updateSelectedAssignment(() => createLayerPreviousAssignment());
  }

  function applyMomentaryLayerOption(layer: number) {
    updateSelectedAssignment(() => createMomentaryLayerAssignment(layer));
  }

  function updateSelectedAssignment(updater: (current: KeyAssignment) => KeyAssignment) {
    setDraftAssignment((current) => {
      const next = normalizeAssignment(updater(current));
      const updateAcrossLayers =
        current.kind === "layerCycle" ||
        current.kind === "layerPrevious" ||
        next.kind === "layerCycle" ||
        next.kind === "layerPrevious";
      setWriteKeymap((currentKeymap) =>
        updateAcrossLayers
          ? updateKeymapKeyAcrossLayers(currentKeymap, selectedKey, next)
          : updateKeymap(currentKeymap, activeLayer, selectedKey, next),
      );
      return next;
    });
  }

  function updateLayerEnabled(layer: number, enabled: boolean) {
    if (layer === 0) {
      return;
    }

    setWriteEnabledLayers((current) =>
      current.map((value, index) => (index === layer ? enabled : value)),
    );
  }

  function updateLayerColor(layer: number, color: LayerColor) {
    const normalizedColor = normalizeLayerColor(color);
    setWriteLayerColors((current) =>
      current.map((value, index) => (index === layer ? normalizedColor : value)),
    );

    if (!connected || layer >= deviceLayerCount) {
      return;
    }

    cancelScheduledColorPreview();
    colorPreviewTimerRef.current = window.setTimeout(() => {
      colorPreviewTimerRef.current = null;
      colorPreviewQueueRef.current = colorPreviewQueueRef.current
        .catch(() => undefined)
        .then(() => previewDeviceLayerColor(transport, layer, normalizedColor))
        .catch((error) => {
          setStatus(error instanceof Error ? error.message : t.connection.layerChangeFailed);
        });
    }, LAYER_COLOR_PREVIEW_DEBOUNCE_MS);
  }

  function cancelScheduledColorPreview() {
    if (colorPreviewTimerRef.current !== null) {
      window.clearTimeout(colorPreviewTimerRef.current);
      colorPreviewTimerRef.current = null;
    }
  }

  async function clearLayerColorPreview() {
    cancelScheduledColorPreview();
    const request = colorPreviewQueueRef.current
      .catch(() => undefined)
      .then(() => clearDeviceLayerColorPreview(transport));
    colorPreviewQueueRef.current = request;
    await request;
  }

  async function disconnectRemapperDevice() {
    if (transport.connected) {
      await clearLayerColorPreview().catch(() => undefined);
    }
    await disconnectDevice();
  }

  function updateWorkspaceScale(scale: WorkspaceScale) {
    setWorkspaceScale(scale);
    try {
      window.localStorage.setItem(workspaceScaleStorageKey, String(scale));
    } catch {
      // Keep the scale for this session when browser storage is unavailable.
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar remapper-topbar">
        <a
          className="brand brand-link"
          href={resolvedHomeHref}
          aria-label={t.home.backHome}
        >
          <img
            className="brand-mark"
            src={productAssetUrl(product.assets.mark)}
            width="322"
            height="307"
            alt=""
          />
          <div className="brand-copy">
            <span className="eyebrow">{product.name}</span>
            <h1>{t.app.title}</h1>
            <p>{productMessages.home.remapperDescription}</p>
          </div>
        </a>
        <div className="connection">
          <div className="connection-meta">
            <span className={connected ? "status-badge online" : "status-badge offline"}>
              {connected ? t.connection.connected : t.connection.idle}
            </span>
            <span className="connection-text">{status}</span>
          </div>
          <div className="connection-actions">
            <label className="workspace-scale-control">
              <span>{t.app.workspaceScale}</span>
              <select
                value={workspaceScale}
                aria-label={t.app.workspaceScale}
                onChange={(event) =>
                  updateWorkspaceScale(Number(event.target.value) as WorkspaceScale)}
              >
                {WORKSPACE_SCALE_OPTIONS.map((scale) => (
                  <option key={scale} value={scale}>
                    {t.app.workspaceScaleValue(scale)}
                  </option>
                ))}
              </select>
            </label>
            <button type="button" className="ghost-button" onClick={() => setFirmwareModalOpen(true)}>
              {t.connection.updater}
            </button>
            <button type="button" onClick={connected ? disconnectRemapperDevice : connectDevice}>
              {connected ? t.connection.disconnect : t.connection.connect}
            </button>
          </div>
        </div>
      </header>

      <div className="workspace-viewport" data-workspace-scale={workspaceScale}>
        <section className="workspace" aria-label={t.app.workspaceLabel}>
          <HardwarePanel
            deviceState={deviceState}
            encoderDirectionUpdating={encoderDirectionUpdating}
            statusLedDirectionUpdating={statusLedDirectionUpdating}
            statusLedBrightness={statusLedBrightness}
            statusLedBrightnessUpdating={statusLedBrightnessUpdating}
            statusKeyAnimationUpdating={statusKeyAnimationUpdating}
            statusKeyAnimationBrightness={statusKeyAnimationBrightness}
            statusKeyAnimationBrightnessUpdating={statusKeyAnimationBrightnessUpdating}
            onEncoderReversedChange={(reversed) => void updateEncoderReversed(reversed)}
            onStatusLedReversedChange={(reversed) => void updateStatusLedReversed(reversed)}
            onStatusLedBrightnessChange={updateStatusLedBrightnessDraft}
            onStatusLedBrightnessApply={() => void applyStatusLedBrightness()}
            onStatusKeyAnimationChange={(animation) =>
              void updateStatusKeyAnimation(animation)}
            onStatusKeyAnimationBrightnessChange={updateStatusKeyAnimationBrightnessDraft}
            onStatusKeyAnimationBrightnessApply={() =>
              void applyStatusKeyAnimationBrightness()}
          />
          <RemapPanel
            activeLayer={activeLayer}
            selectedKey={selectedKey}
            connected={connected}
            supportedKeyCount={
              connected
                ? deviceKeyCount
                : writeKeymap[activeLayer]?.length ?? 0
            }
            layerCount={writeKeymap.length}
            enabledLayers={writeEnabledLayers}
            layerColors={writeLayerColors}
            layerAssignments={writeKeymap[activeLayer]}
            onRead={() => void readAllAssignments()}
            onReset={() => setResetModalOpen(true)}
            onSave={() => void saveAllAssignments()}
            onSelectLayer={(layerIndex) => void selectLayer(layerIndex)}
            onLayerEnabledChange={updateLayerEnabled}
            onLayerColorChange={updateLayerColor}
            onSelectKey={setSelectedKey}
          />
          <EditorPanel
            selectedKey={selectedKey}
            draftAssignment={draftAssignment}
            onUpdateKind={updateDraftKind}
            onUpdateUsage={updateDraftUsage}
            modifierSlots={modifierSlots}
            onUpdateModifierSlot={updateDraftModifierSlot}
          />
          <KeyboardPickerPanel
            draftAssignment={draftAssignment}
            keyboardLayout={keyboardLayout}
            onKeyboardLayoutChange={setKeyboardLayout}
            onPickerOption={applyPickerOption}
            onConsumerOption={applyConsumerOption}
            onLayerCycleOption={applyLayerCycleOption}
            onLayerPreviousOption={applyLayerPreviousOption}
            onMomentaryLayerOption={applyMomentaryLayerOption}
          />
        </section>
      </div>

      <SiteFooter />

      {firmwareModalOpen ? (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setFirmwareModalOpen(false)}
        >
          <div
            className="modal-shell"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="firmware-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <div className="panel-meta">
                <span className="panel-kicker">{t.firmware.updater}</span>
                <h2 id="firmware-modal-title">{t.firmware.title}</h2>
              </div>
              <button
                type="button"
                className="ghost-button"
                onClick={() => setFirmwareModalOpen(false)}
                aria-label={t.firmware.closeLabel}
              >
                {t.firmware.close}
              </button>
            </div>
            <FirmwarePanel
              connected={connected}
              firmwareInstallSupported={firmwareInstallSupported}
              firmwareStatus={firmwareStatus}
              onEnterBootloader={() => void enterBootloaderMode()}
              onInstallFirmware={() => void installBundledFirmware()}
              onDownloadFirmware={() => void downloadBundledFirmware()}
            />
          </div>
        </div>
      ) : null}

      {resetModalOpen ? (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => {
            if (!resetting) {
              setResetModalOpen(false);
            }
          }}
        >
          <div
            className="modal-shell reset-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-modal-title"
            aria-describedby="reset-modal-description"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="panel-meta">
              <span className="panel-kicker">{t.keymap.kicker}</span>
              <h2 id="reset-modal-title">{t.keymap.resetTitle}</h2>
            </div>
            <p id="reset-modal-description">{t.keymap.resetDescription}</p>
            <div className="reset-modal-actions">
              <button
                type="button"
                className="ghost-button"
                autoFocus
                disabled={resetting}
                onClick={() => setResetModalOpen(false)}
              >
                {t.keymap.resetCancel}
              </button>
              <button
                type="button"
                className="danger-action"
                disabled={resetting}
                onClick={() => void resetConfiguration()}
              >
                {resetting ? t.keymap.resetting : t.keymap.resetConfirm}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

function loadWorkspaceScale(storageKey: string): WorkspaceScale {
  try {
    const stored = Number(window.localStorage.getItem(storageKey));
    if (WORKSPACE_SCALE_OPTIONS.some((scale) => scale === stored)) {
      return stored as WorkspaceScale;
    }
  } catch {
    // Use the compact default when browser storage is unavailable.
  }

  return 90;
}

function createInitialKeymap(hardware: HardwareConfig) {
  return createBlankKeymap(hardware.layerCount, hardware.keyCount);
}

function localizeKeymap(keymap: DeviceKeymap): DeviceKeymap {
  return keymap.map((layer) =>
    layer.map((assignment) => normalizeAssignment(assignment)),
  );
}

function createInitialEnabledLayers(hardware: HardwareConfig) {
  return Array.from(
    { length: hardware.layerCount },
    (_, layer) => hardware.defaultEnabledLayers.includes(layer),
  );
}

function createInitialLayerColors(hardware: HardwareConfig): LayerColor[] {
  return hardware.defaultLayerColors.map(([red, green, blue]) => ({ red, green, blue }));
}

function normalizeLayerColor(color: LayerColor): LayerColor {
  return {
    red: clampColorChannel(color.red),
    green: clampColorChannel(color.green),
    blue: clampColorChannel(color.blue),
  };
}

function sameLayerColor(first: LayerColor | undefined, second: LayerColor) {
  return first?.red === second.red && first.green === second.green && first.blue === second.blue;
}

function clampColorChannel(value: number) {
  return Math.max(0, Math.min(255, Math.trunc(value)));
}
