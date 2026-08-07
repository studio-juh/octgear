import { useState } from "react";
import {
  StatusKeyAnimation,
  StatusLayerDisplayMode,
  type DeviceState,
} from "../../features/device/deviceCommands";
import { formatUsbId } from "../../features/device/usbIdentity";
import { useProductDefinition } from "../../products/ProductContext";
import { t } from "../../shared/i18n";

type HardwarePanelProps = {
  deviceState: DeviceState | null;
  encoderDirectionUpdating: boolean;
  statusLedDirectionUpdating: boolean;
  statusLedBrightness: number;
  statusLedBrightnessUpdating: boolean;
  statusKeyAnimationUpdating: boolean;
  statusKeyAnimationBrightness: number;
  statusKeyAnimationBrightnessUpdating: boolean;
  statusLayerDisplayModeUpdating: boolean;
  onEncoderReversedChange: (reversed: boolean) => void;
  onStatusLedReversedChange: (reversed: boolean) => void;
  onStatusLedBrightnessChange: (brightness: number) => void;
  onStatusLedBrightnessApply: () => void;
  onStatusKeyAnimationChange: (animation: StatusKeyAnimation) => void;
  onStatusKeyAnimationBrightnessChange: (brightness: number) => void;
  onStatusKeyAnimationBrightnessApply: () => void;
  onStatusLayerDisplayModeChange: (mode: StatusLayerDisplayMode) => void;
};

export function HardwarePanel({
  deviceState,
  encoderDirectionUpdating,
  statusLedDirectionUpdating,
  statusLedBrightness,
  statusLedBrightnessUpdating,
  statusKeyAnimationUpdating,
  statusKeyAnimationBrightness,
  statusKeyAnimationBrightnessUpdating,
  statusLayerDisplayModeUpdating,
  onEncoderReversedChange,
  onStatusLedReversedChange,
  onStatusLedBrightnessChange,
  onStatusLedBrightnessApply,
  onStatusKeyAnimationChange,
  onStatusKeyAnimationBrightnessChange,
  onStatusKeyAnimationBrightnessApply,
  onStatusLayerDisplayModeChange,
}: HardwarePanelProps) {
  const { hardware, usbIdentity } = useProductDefinition();
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const brightnessSupported = deviceState?.statusLedBrightnessSupported ?? false;
  const brightnessChanged =
    brightnessSupported && statusLedBrightness !== deviceState?.statusLedBrightness;
  const animationBrightnessSupported =
    deviceState?.statusKeyAnimationBrightnessSupported ?? false;
  const animationBrightnessChanged =
    animationBrightnessSupported &&
    statusKeyAnimationBrightness !== deviceState?.statusKeyAnimationBrightness;

  return (
    <aside className="panel hardware-panel">
      <div className="hardware-panel-heading">
        <div className="panel-meta">
          <span className="panel-kicker">{t.hardware.kicker}</span>
          <h2>{t.hardware.title}</h2>
        </div>
        <button
          type="button"
          className="hardware-details-toggle"
          aria-expanded={detailsExpanded}
          aria-controls="hardware-profile-details"
          onClick={() => setDetailsExpanded((expanded) => !expanded)}
        >
          {detailsExpanded ? t.hardware.collapseDetails : t.hardware.expandDetails}
        </button>
      </div>
      <dl className="hardware-controls">
        <div className="hardware-direction-row">
          <dt>{t.hardware.encoderDirection}</dt>
          <dd>
            <label className="hardware-toggle">
              <input
                type="checkbox"
                checked={deviceState?.encoderReversed ?? hardware.encoder.reversed}
                disabled={!deviceState || encoderDirectionUpdating}
                onChange={(event) => onEncoderReversedChange(event.target.checked)}
              />
              <span>{t.hardware.encoderReversed}</span>
            </label>
          </dd>
        </div>
        <div className="hardware-direction-row">
          <dt>{t.hardware.statusLedDirection}</dt>
          <dd>
            <label className="hardware-toggle">
              <input
                type="checkbox"
                checked={
                  deviceState?.statusLedReversedSupported
                    ? deviceState.statusLedReversed
                    : hardware.externalRgbLedReversed
                }
                disabled={
                  !deviceState?.statusLedReversedSupported ||
                  statusLedDirectionUpdating
                }
                onChange={(event) => onStatusLedReversedChange(event.target.checked)}
              />
              <span>{t.hardware.statusLedReversed}</span>
            </label>
          </dd>
        </div>
        <div className="hardware-animation-row">
          <dt>{t.hardware.statusLayerDisplayMode}</dt>
          <dd>
            <select
              value={
                deviceState?.statusLayerDisplayModeSupported
                  ? deviceState.statusLayerDisplayMode
                  : hardware.statusLedLayerDisplayMode
              }
              aria-label={t.hardware.statusLayerDisplayMode}
              disabled={
                !deviceState?.statusLayerDisplayModeSupported ||
                statusLayerDisplayModeUpdating
              }
              onChange={(event) =>
                onStatusLayerDisplayModeChange(
                  Number(event.target.value) as StatusLayerDisplayMode,
                )}
            >
              <option value={StatusLayerDisplayMode.Solid}>
                {t.hardware.statusLayerDisplaySolid}
              </option>
              <option value={StatusLayerDisplayMode.Pattern}>
                {t.hardware.statusLayerDisplayPattern}
              </option>
            </select>
            <small>
              {deviceState?.statusLayerDisplayModeSupported
                ? t.hardware.statusLayerDisplayPatternHint
                : t.hardware.statusLayerDisplayModeUnsupported}
            </small>
          </dd>
        </div>
        <div className="hardware-animation-row">
          <dt>{t.hardware.statusKeyAnimation}</dt>
          <dd>
            <select
              value={
                deviceState?.statusKeyAnimationSupported
                  ? deviceState.statusKeyAnimation
                  : hardware.statusLedKeyAnimation
              }
              aria-label={t.hardware.statusKeyAnimation}
              disabled={
                !deviceState?.statusKeyAnimationSupported ||
                statusKeyAnimationUpdating
              }
              onChange={(event) =>
                onStatusKeyAnimationChange(
                  Number(event.target.value) as StatusKeyAnimation,
                )}
            >
              <option value={StatusKeyAnimation.Disabled}>
                {t.hardware.statusKeyAnimationDisabled}
              </option>
              <option value={StatusKeyAnimation.Ripple}>
                {t.hardware.statusKeyAnimationRipple}
              </option>
              <option value={StatusKeyAnimation.Flash}>
                {t.hardware.statusKeyAnimationFlash}
              </option>
              <option value={StatusKeyAnimation.Spark}>
                {t.hardware.statusKeyAnimationSpark}
              </option>
            </select>
            {!deviceState?.statusKeyAnimationSupported && (
              <small>{t.hardware.statusKeyAnimationUnsupported}</small>
            )}
          </dd>
        </div>
        <div className="hardware-brightness-row">
          <dt>{t.hardware.statusKeyAnimationBrightness}</dt>
          <dd>
            <div className="hardware-brightness-control">
              <input
                type="range"
                min={0}
                max={hardware.statusKeyAnimationBrightness.max}
                value={statusKeyAnimationBrightness}
                aria-label={t.hardware.statusKeyAnimationBrightness}
                disabled={
                  !animationBrightnessSupported ||
                  statusKeyAnimationBrightnessUpdating
                }
                onChange={(event) =>
                  onStatusKeyAnimationBrightnessChange(Number(event.target.value))}
              />
              <input
                type="number"
                min={0}
                max={hardware.statusKeyAnimationBrightness.max}
                value={statusKeyAnimationBrightness}
                aria-label={t.hardware.statusKeyAnimationBrightnessValue}
                disabled={
                  !animationBrightnessSupported ||
                  statusKeyAnimationBrightnessUpdating
                }
                onChange={(event) =>
                  onStatusKeyAnimationBrightnessChange(Number(event.target.value))}
              />
              <button
                type="button"
                disabled={
                  !animationBrightnessChanged ||
                  statusKeyAnimationBrightnessUpdating
                }
                onClick={onStatusKeyAnimationBrightnessApply}
              >
                {statusKeyAnimationBrightnessUpdating
                  ? t.hardware.applying
                  : t.hardware.apply}
              </button>
            </div>
            <small>
              {animationBrightnessSupported
                ? t.hardware.statusKeyAnimationBrightnessRange(
                    hardware.statusKeyAnimationBrightness.max,
                  )
                : t.hardware.statusKeyAnimationBrightnessUnsupported}
            </small>
          </dd>
        </div>
        <div className="hardware-brightness-row">
          <dt>{t.hardware.statusLedBrightness}</dt>
          <dd>
            <div className="hardware-brightness-control">
              <input
                type="range"
                min={0}
                max={hardware.statusLedBrightness.max}
                value={statusLedBrightness}
                aria-label={t.hardware.statusLedBrightness}
                disabled={!brightnessSupported || statusLedBrightnessUpdating}
                onChange={(event) => onStatusLedBrightnessChange(Number(event.target.value))}
              />
              <input
                type="number"
                min={0}
                max={hardware.statusLedBrightness.max}
                value={statusLedBrightness}
                aria-label={t.hardware.statusLedBrightnessValue}
                disabled={!brightnessSupported || statusLedBrightnessUpdating}
                onChange={(event) => onStatusLedBrightnessChange(Number(event.target.value))}
              />
              <button
                type="button"
                disabled={!brightnessChanged || statusLedBrightnessUpdating}
                onClick={onStatusLedBrightnessApply}
              >
                {statusLedBrightnessUpdating ? t.hardware.applying : t.hardware.apply}
              </button>
            </div>
            <small>
              {brightnessSupported
                ? t.hardware.statusLedBrightnessRange(hardware.statusLedBrightness.max)
                : t.hardware.statusLedBrightnessUnsupported}
            </small>
          </dd>
        </div>
      </dl>
      <dl id="hardware-profile-details" hidden={!detailsExpanded}>
        <div>
          <dt>{t.hardware.keys}</dt>
          <dd>{hardware.physicalKeyCount}</dd>
        </div>
        <div>
          <dt>{t.hardware.encoder}</dt>
          <dd>{t.hardware.encoderValue(hardware.encoder.pinCount)}</dd>
        </div>
        <div>
          <dt>{t.hardware.matrix}</dt>
          <dd>{t.hardware.matrixValue(
            deviceState?.matrixRowCount ?? hardware.matrix.rowCount,
            hardware.matrix.columnCount,
            hardware.matrix.diodeDirection,
          )}</dd>
        </div>
        <div>
          <dt>{t.hardware.deviceLayer}</dt>
          <dd>{deviceState?.activeLayer ?? "-"}</dd>
        </div>
        <div>
          <dt>{t.hardware.reportKeys}</dt>
          <dd>{deviceState?.keyCount ?? "-"}</dd>
        </div>
        <div>
          <dt>{t.hardware.usbId}</dt>
          <dd>
            {formatUsbId(usbIdentity.vendorId)}:{formatUsbId(usbIdentity.productId)}
          </dd>
        </div>
        <div>
          <dt>{t.hardware.externalRgb}</dt>
          <dd>
            {hardware.externalRgbLed
              ? t.hardware.externalRgbValue(hardware.externalRgbLedCount)
              : t.hardware.none}
          </dd>
        </div>
        <div>
          <dt>{t.hardware.oled}</dt>
          <dd>{t.hardware.none}</dd>
        </div>
      </dl>
    </aside>
  );
}
