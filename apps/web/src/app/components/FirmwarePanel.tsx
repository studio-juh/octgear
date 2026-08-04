import { useI18n, type Locale } from "../../shared/i18n";

type FirmwarePanelProps = {
  connected: boolean;
  firmwareInstallSupported: boolean;
  firmwareStatus: string;
  firmwareBuiltAt: string;
  onEnterBootloader: () => void;
  onInstallFirmware: () => void;
  onDownloadFirmware: () => void;
};

export function FirmwarePanel({
  connected,
  firmwareInstallSupported,
  firmwareStatus,
  firmwareBuiltAt,
  onEnterBootloader,
  onInstallFirmware,
  onDownloadFirmware,
}: FirmwarePanelProps) {
  const { locale, t } = useI18n();
  const formattedBuiltAt = formatFirmwareBuiltAt(firmwareBuiltAt, locale);

  return (
    <div className="firmware-panel">
      <div className="firmware-summary">
        <h2>{t.firmware.title}</h2>
        <span>{firmwareStatus}</span>
        <time className="firmware-built-at" dateTime={firmwareBuiltAt}>
          {t.firmware.builtAt(formattedBuiltAt)}
        </time>
      </div>
      <div className="firmware-help">
        <section>
          <h3>{t.firmware.normalUpdate}</h3>
          <ol>
            {t.firmware.normalSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
        <section>
          <h3>{t.firmware.recovery}</h3>
          <ol>
            {t.firmware.recoverySteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>
      </div>
      <div className="firmware-actions">
        <button type="button" className="primary-action" onClick={onEnterBootloader} disabled={!connected}>
          {t.firmware.bootsel}
        </button>
        <button type="button" onClick={onInstallFirmware} disabled={!firmwareInstallSupported}>
          {t.firmware.installUf2}
        </button>
        <button type="button" onClick={onDownloadFirmware}>
          {t.firmware.downloadUf2}
        </button>
      </div>
    </div>
  );
}

function formatFirmwareBuiltAt(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  }).format(new Date(value));
}
