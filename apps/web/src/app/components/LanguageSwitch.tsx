import { useI18n } from "../../shared/i18n";

type LanguageSwitchProps = {
  className?: string;
};

export function LanguageSwitch({ className }: LanguageSwitchProps) {
  const { locale, setLocale, t } = useI18n();
  const classes = ["ghost-button", "language-switch", className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      aria-label={t.app.switchLanguageLabel}
      title={t.app.switchLanguageLabel}
      onClick={() => setLocale(locale === "ja" ? "en" : "ja")}
    >
      <span className="language-switch-label">{t.app.language}</span>
      <span className="language-switch-options" aria-hidden="true">
        <strong className={locale === "ja" ? "active" : ""}>日本語</strong>
        <span>/</span>
        <strong className={locale === "en" ? "active" : ""}>English</strong>
      </span>
    </button>
  );
}
