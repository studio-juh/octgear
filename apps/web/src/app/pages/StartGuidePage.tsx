import { LanguageSwitch } from "../components/LanguageSwitch";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { productAssetUrl, productPageUrl } from "../appUrls";
import { useProductDefinition } from "../../products/ProductContext";
import { useI18n } from "../../shared/i18n";

type ExpandedStartGuideImage = {
  src: string;
  caption: string;
  alt: string;
  width: number;
  height: number;
  crop?: "settings";
  markers?: "bootReset";
};

export function StartGuidePage() {
  const { t } = useI18n();
  const product = useProductDefinition();
  const guide = t.octgearStartGuide;
  const startGuideAssetUrl = productAssetUrl(product.assets.startGuideRoot);
  const homeUrl = productPageUrl(product, "home");
  const startGuideUrl = productPageUrl(product, "startGuide");
  const buildGuideUrl = productPageUrl(product, "buildGuide");
  const remapperUrl = productPageUrl(product, "remapper");
  const diagnosticsUrl = productPageUrl(product, "diagnostics");
  const [expandedImage, setExpandedImage] = useState<ExpandedStartGuideImage | null>(null);

  useEffect(() => {
    if (!expandedImage) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpandedImage(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [expandedImage]);

  return (
    <main className="app-shell guide-shell start-guide-shell" data-product={product.id}>
      <header className="guide-topbar">
        <a className="guide-brand" href={startGuideUrl} aria-label={guide.title}>
          <img
            className="brand-mark"
            src={productAssetUrl(product.assets.mark)}
            width="322"
            height="307"
            alt=""
          />
          <span>
            <small>{guide.brandKicker}</small>
            <strong>{product.name}</strong>
          </span>
        </a>
        <nav className="guide-nav" aria-label={guide.navigationLabel}>
          <a className="ghost-button nav-button" href={homeUrl}>
            {t.home.backHome}
          </a>
          <a className="ghost-button nav-button" href={remapperUrl}>
            {t.home.openRemapper}
          </a>
          <a className="ghost-button nav-button" href={diagnosticsUrl}>
            {t.home.openDiagnostics}
          </a>
          <LanguageSwitch />
        </nav>
      </header>

      <article className="guide-content">
        <section className="guide-hero" aria-labelledby="start-guide-title">
          <div className="guide-hero-copy">
            <span className="eyebrow">{guide.kicker}</span>
            <h1 id="start-guide-title">{guide.title}</h1>
            <p>{guide.description}</p>
            <div className="guide-hero-actions">
              <a className="product-action" href="#first-use">
                {guide.start}
              </a>
              <a className="product-action secondary" href={remapperUrl}>
                {t.home.openRemapper}
              </a>
            </div>
          </div>
          <dl className="guide-facts" aria-label={guide.factsLabel}>
            {guide.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="guide-body">
          <nav className="guide-jump-nav" aria-label={guide.pageIndexLabel}>
            {guide.pageIndex.map((item, index) => (
              <a href={item.href} key={item.href}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="guide-main">
            <GuideSection
              id="first-use"
              kicker={guide.firstUseKicker}
              title={guide.firstUseTitle}
              description={guide.firstUseDescription}
            >
              <div className="guide-check-flow">
                {guide.firstUseSteps.map((step, index) => (
                  <div key={step.title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <strong>{step.title}</strong>
                      <p>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="guide-notice">
                <strong>{guide.browserNoteTitle}</strong>
                <p>{guide.browserNoteDescription}</p>
              </div>
              <GuideScreenshot
                src={`${startGuideAssetUrl}octgear-device-picker.jpg`}
                width={924}
                height={968}
                caption={guide.devicePickerScreenshot.caption}
                alt={guide.devicePickerScreenshot.alt}
                portrait
                enlargeLabel={guide.enlargeImage}
                onExpand={setExpandedImage}
              />
            </GuideSection>

            <GuideSection
              id="controls"
              kicker={guide.controlsKicker}
              title={guide.controlsTitle}
              description={guide.controlsDescription}
            >
              <div className="start-guide-control-grid">
                {guide.controls.map((control) => (
                  <article className="guide-action-card" key={control.title}>
                    <span>{control.label}</span>
                    <h3>{control.title}</h3>
                    <p>{control.description}</p>
                  </article>
                ))}
              </div>
              <div className="guide-notice">
                <strong>{guide.savedSettingsTitle}</strong>
                <p>{guide.savedSettingsDescription}</p>
              </div>
            </GuideSection>

            <GuideSection
              id="remap"
              kicker={guide.remapKicker}
              title={guide.remapTitle}
              description={guide.remapDescription}
            >
              <ol className="start-guide-simple-steps">
                {guide.remapSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <div className="start-guide-screenshot-grid">
                <GuideScreenshot
                  src={`${startGuideAssetUrl}octgear-remapper-overview.jpg`}
                  width={2048}
                  height={1441}
                  caption={guide.remapperScreenshot.caption}
                  alt={guide.remapperScreenshot.alt}
                  enlargeLabel={guide.enlargeImage}
                  onExpand={setExpandedImage}
                />
                <GuideScreenshot
                  src={`${startGuideAssetUrl}octgear-hardware-settings.jpg`}
                  width={2048}
                  height={1078}
                  caption={guide.hardwareScreenshot.caption}
                  alt={guide.hardwareScreenshot.alt}
                  crop="settings"
                  enlargeLabel={guide.enlargeImage}
                  onExpand={setExpandedImage}
                />
              </div>
              <section
                className="start-guide-terms"
                aria-labelledby="hardware-terms-title"
              >
                <div className="start-guide-terms-heading">
                  <span className="eyebrow">Glossary</span>
                  <h3 id="hardware-terms-title">{guide.hardwareTermsTitle}</h3>
                  <p>{guide.hardwareTermsDescription}</p>
                </div>
                <dl className="start-guide-term-grid">
                  {guide.hardwareTerms.map((term) => (
                    <div key={term.term}>
                      <dt>{term.term}</dt>
                      <dd>{term.description}</dd>
                    </div>
                  ))}
                </dl>
              </section>
              <a className="product-action guide-diagnostics-action" href={remapperUrl}>
                {guide.openRemapper}
              </a>
            </GuideSection>

            <GuideSection
              id="firmware"
              kicker={guide.firmwareKicker}
              title={guide.firmwareTitle}
              description={guide.firmwareDescription}
            >
              <div className="guide-action-grid">
                {guide.firmwareCards.map((card) => (
                  <article className="guide-action-card" key={card.title}>
                    <span>{card.label}</span>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    {card.action === "remapper" ? (
                      <a className="product-action secondary" href={remapperUrl}>
                        {guide.openUpdater}
                      </a>
                    ) : null}
                  </article>
                ))}
              </div>
              <article className="start-guide-manual-boot">
                <div className="start-guide-manual-boot-copy">
                  <span className="eyebrow">Manual BOOTSEL</span>
                  <h3>{guide.manualBootTitle}</h3>
                  <p>{guide.manualBootDescription}</p>
                  <ol className="start-guide-simple-steps">
                    {guide.manualBootSteps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                  <div className="guide-notice warning">
                    <strong>{guide.manualBootWarningTitle}</strong>
                    <p>{guide.manualBootWarningDescription}</p>
                  </div>
                </div>
                <figure className="start-guide-button-photo">
                  <button
                    type="button"
                    className="start-guide-button-photo-frame start-guide-image-trigger"
                    aria-label={`${guide.enlargeImage}: ${guide.manualBootPhotoCaption}`}
                    onClick={() =>
                      setExpandedImage({
                        src: `${startGuideAssetUrl}octgear-boot-reset-holes.jpg`,
                        width: 1365,
                        height: 1024,
                        caption: guide.manualBootPhotoCaption,
                        alt: guide.manualBootPhotoAlt,
                        markers: "bootReset",
                      })
                    }
                  >
                    <img
                      src={`${startGuideAssetUrl}octgear-boot-reset-holes.jpg`}
                      width="1365"
                      height="1024"
                      loading="lazy"
                      alt={guide.manualBootPhotoAlt}
                    />
                    <span className="start-guide-button-marker boot" aria-hidden="true">
                      <b>BOOT</b>
                    </span>
                    <span className="start-guide-button-marker reset" aria-hidden="true">
                      <b>RESET</b>
                    </span>
                  </button>
                  <figcaption>{guide.manualBootPhotoCaption}</figcaption>
                </figure>
              </article>
              <GuideScreenshot
                src={`${startGuideAssetUrl}octgear-firmware-updater.jpg`}
                width={2048}
                height={1078}
                caption={guide.firmwareScreenshot.caption}
                alt={guide.firmwareScreenshot.alt}
                enlargeLabel={guide.enlargeImage}
                onExpand={setExpandedImage}
              />
            </GuideSection>

            <GuideSection
              id="help"
              kicker={guide.helpKicker}
              title={guide.helpTitle}
              description={guide.helpDescription}
            >
              <div className="guide-troubleshooting">
                {guide.troubleshooting.map((item) => (
                  <details key={item.title}>
                    <summary>{item.title}</summary>
                    <p>{item.description}</p>
                  </details>
                ))}
              </div>
              <div className="guide-action-grid start-guide-help-actions">
                <article className="guide-action-card">
                  <span>CHECK</span>
                  <h3>{guide.diagnosticsTitle}</h3>
                  <p>{guide.diagnosticsDescription}</p>
                  <a className="product-action" href={diagnosticsUrl}>
                    {t.home.openDiagnostics}
                  </a>
                </article>
                <article className="guide-action-card">
                  <span>SUPPORT</span>
                  <h3>{guide.supportTitle}</h3>
                  <p>{guide.supportDescription}</p>
                  <a className="product-action secondary" href={product.links.store} rel="noreferrer">
                    {t.home.openStore}
                  </a>
                </article>
              </div>
            </GuideSection>
          </div>
        </div>

        <footer className="guide-footer">
          <div>
            <strong>{guide.footerTitle}</strong>
            <p>{guide.footerDescription}</p>
          </div>
          <div className="guide-footer-meta">
            <a className="product-action secondary" href={buildGuideUrl}>
              {guide.openBuildGuide}
            </a>
          </div>
        </footer>
      </article>

      {expandedImage ? (
        <div
          className="guide-image-lightbox"
          role="presentation"
          onClick={() => setExpandedImage(null)}
        >
          <div
            className="guide-image-lightbox-dialog start-guide-image-lightbox-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={expandedImage.caption}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="guide-image-lightbox-close"
              aria-label={guide.closeImage}
              autoFocus
              onClick={() => setExpandedImage(null)}
            >
              ×
            </button>
            <div
              className="start-guide-image-lightbox-media"
              data-crop={expandedImage.crop}
              data-markers={expandedImage.markers}
              style={
                {
                  "--start-guide-image-ratio": expandedImage.crop
                    ? "3.25"
                    : String(expandedImage.width / expandedImage.height),
                } as CSSProperties
              }
            >
              <img
                src={expandedImage.src}
                alt={expandedImage.alt}
                width={expandedImage.width}
                height={expandedImage.height}
              />
              {expandedImage.markers === "bootReset" ? (
                <>
                  <span className="start-guide-button-marker boot" aria-hidden="true">
                    <b>BOOT</b>
                  </span>
                  <span className="start-guide-button-marker reset" aria-hidden="true">
                    <b>RESET</b>
                  </span>
                </>
              ) : null}
            </div>
            <strong>{expandedImage.caption}</strong>
          </div>
        </div>
      ) : null}
    </main>
  );
}

type GuideSectionProps = {
  id: string;
  kicker: string;
  title: string;
  description: string;
  children: ReactNode;
};

function GuideSection({ id, kicker, title, description, children }: GuideSectionProps) {
  const titleId = `${id}-title`;

  return (
    <section className="guide-section" id={id} aria-labelledby={titleId}>
      <div className="guide-heading">
        <span className="eyebrow">{kicker}</span>
        <h2 id={titleId}>{title}</h2>
        <p>{description}</p>
      </div>
      {children}
    </section>
  );
}

type GuideScreenshotProps = {
  src: string;
  width: number;
  height: number;
  caption: string;
  alt: string;
  portrait?: boolean;
  crop?: "settings";
  enlargeLabel: string;
  onExpand: (image: ExpandedStartGuideImage) => void;
};

function GuideScreenshot({
  src,
  width,
  height,
  caption,
  alt,
  portrait = false,
  crop,
  enlargeLabel,
  onExpand,
}: GuideScreenshotProps) {
  return (
    <figure
      className="start-guide-screenshot"
      data-portrait={portrait || undefined}
      data-crop={crop}
    >
      <button
        type="button"
        className="start-guide-screenshot-frame start-guide-image-trigger"
        aria-label={`${enlargeLabel}: ${caption}`}
        onClick={() => onExpand({ src, width, height, caption, alt, crop })}
      >
        <img src={src} width={width} height={height} loading="lazy" alt={alt} />
      </button>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
