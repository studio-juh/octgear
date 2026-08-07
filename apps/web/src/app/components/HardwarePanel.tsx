import { useState } from "react";
import {
  MAX_LAYER_TAP_DANCE_TERM_MS,
  MIN_LAYER_TAP_DANCE_TERM_MS,
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
  layerTapDanceTermMs: number;
  layerTapDanceTermUpdating: boolean;
  onEncoderReversedChange: (reversed: boolean) => void;
  onStatusLedReversedChange: (reversed: boolean) => void;
  onStatusLedBrightnessChange: (brightness: number) => void;
  onStatusLedBrightnessApply: () => void;
  onStatusKeyAnimationChange: (animation: StatusKeyAnimation) => void;
  onStatusKeyAnimationBrightnessChange: (brightness: number) => void;
  onStatusKeyAnimationBrightnessApply: () => void;
  onStatusLayerDisplayModeChange: (mode: StatusLayerDisplayMode) => void;
  onLayerTapDanceTermChange: (termMs: number) => void;
  onLayerTapDanceTermApply: () => void;
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
  layerTapDanceTermMs,
  layerTapDanceTermUpdating,
  onEncoderReversedChange,
  onStatusLedReversedChange,
  onStatusLedBrightnessChange,
  onStatusLedBrightnessApply,
  onStatusKeyAnimationChange,
  onStatusKeyAnimationBrightnessChange,
  onStatusKeyAnimationBrightnessApply,
  onStatusLayerDisplayModeChange,
  onLayerTapDanceTermChange,
  onLayerTapDanceTermApply,
}: HardwarePanelProps) {
  const { hardware, usbIdentity } = useProductDefinition();
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  const brightnessChanged =
    !!deviceState && statusLedBrightness !== deviceState.statusLedBrightness;
  const animationBrightnessChanged =
    !!deviceState &&
    statusKeyAnimationBrightness !== deviceState.statusKeyAnimationBrightness;
  const layerTapDanceTermChanged =
    !!deviceState && layerTapDanceTermMs !== deviceState.layerTapDanceTermMs;

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
                  deviceState?.statusLedReversed ?? hardware.externalRgbLedReversed
                }
                disabled={!deviceState || statusLedDirectionUpdating}
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
                deviceState?.statusLayerDisplayMode ??
                hardware.statusLedLayerDisplayMode
              }
              aria-label={t.hardware.statusLayerDisplayMode}
              disabled={!deviceState || statusLayerDisplayModeUpdating}
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
              {t.hardware.statusLayerDisplayPatternHint}
            </small>
          </dd>
        </div>
        <div className="hardware-brightness-row hardware-timing-row">
          <dt>{t.hardware.layerTapDanceTerm}</dt>
          <dd>
            <div className="hardware-brightness-control">
              <input
                type="range"
                min={MIN_LAYER_TAP_DANCE_TERM_MS}
                max={MAX_LAYER_TAP_DANCE_TERM_MS}
                step={10}
                value={layerTapDanceTermMs}
                aria-label={t.hardware.layerTapDanceTerm}
                disabled={!deviceState || layerTapDanceTermUpdating}
                onChange={(event) =>
                  onLayerTapDanceTermChange(Number(event.target.value))}
              />
              <input
                type="number"
                min={MIN_LAYER_TAP_DANCE_TERM_MS}
                max={MAX_LAYER_TAP_DANCE_TERM_MS}
                step={10}
                value={layerTapDanceTermMs}
                aria-label={t.hardware.layerTapDanceTermValue}
                disabled={!deviceState || layerTapDanceTermUpdating}
                onChange={(event) =>
                  onLayerTapDanceTermChange(Number(event.target.value))}
              />
              <button
                type="button"
                disabled={!layerTapDanceTermChanged || layerTapDanceTermUpdating}
                onClick={onLayerTapDanceTermApply}
              >
                {layerTapDanceTermUpdating ? t.hardware.applying : t.hardware.apply}
              </button>
            </div>
            <small>
              {t.hardware.layerTapDanceTermRange(
                MIN_LAYER_TAP_DANCE_TERM_MS,
                MAX_LAYER_TAP_DANCE_TERM_MS,
              )}
            </small>
          </dd>
        </div>
        <div className="hardware-animation-row">
          <dt>{t.hardware.statusKeyAnimation}</dt>
          <dd>
            <select
              value={
                deviceState?.statusKeyAnimation ?? hardware.statusLedKeyAnimation
              }
              aria-label={t.hardware.statusKeyAnimation}
              disabled={!deviceState || statusKeyAnimationUpdating}
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
                  !deviceState ||
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
                  !deviceState ||
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
              {t.hardware.statusKeyAnimationBrightnessRange(
                hardware.statusKeyAnimationBrightness.max,
              )}
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
                disabled={!deviceState || statusLedBrightnessUpdating}
                onChange={(event) => onStatusLedBrightnessChange(Number(event.target.value))}
              />
              <input
                type="number"
                min={0}
                max={hardware.statusLedBrightness.max}
                value={statusLedBrightness}
                aria-label={t.hardware.statusLedBrightnessValue}
                disabled={!deviceState || statusLedBrightnessUpdating}
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
              {t.hardware.statusLedBrightnessRange(hardware.statusLedBrightness.max)}
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
