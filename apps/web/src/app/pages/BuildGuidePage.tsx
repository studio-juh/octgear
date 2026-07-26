import { useEffect, useState } from "react";
import { StlViewer } from "../components/StlViewer";
import { buildGuideUrl, diagnosticsUrl, homeUrl, remapperUrl } from "../appUrls";
import { HARDWARE_CONFIG } from "../../features/hardware/hardwareConfig";
import { t } from "../../shared/i18n";

const HARDWARE_LICENSE_URL =
  "https://github.com/falxala/octgear/blob/main/HARDWARE-LICENSE.md";
const BUILD_GUIDE_ASSET_URL = `${import.meta.env.BASE_URL}build-guide/`;
const KEYCAP_SIZE_LABELS = [
  "1.25U",
  null,
  null,
  null,
  "1.5U",
  null,
  null,
  null,
] as const;

type ExpandedGuideImage = {
  src: string;
  title: string;
  alt: string;
  width: number;
  height: number;
};

export function BuildGuidePage() {
  const [expandedImage, setExpandedImage] = useState<ExpandedGuideImage | null>(
    null,
  );

  useEffect(() => {
    if (!expandedImage) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpandedImage(null);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [expandedImage]);

  return (
    <main className="app-shell guide-shell">
      <header className="guide-topbar">
        <a
          className="guide-brand"
          href={buildGuideUrl}
          aria-label={t.home.openBuildGuide}
        >
          <img
            className="brand-mark"
            src={`${import.meta.env.BASE_URL}brand/octgear-mark.png`}
            width="322"
            height="307"
            alt=""
          />
          <span>
            <small>{t.buildGuide.brandKicker}</small>
            <strong>OctGear</strong>
          </span>
        </a>
        <nav className="guide-nav" aria-label={t.buildGuide.navigationLabel}>
          <a className="ghost-button nav-button" href={homeUrl}>
            {t.home.backHome}
          </a>
          <a className="ghost-button nav-button" href={remapperUrl}>
            {t.home.openRemapper}
          </a>
          <a className="ghost-button nav-button" href={diagnosticsUrl}>
            {t.home.openDiagnostics}
          </a>
        </nav>
      </header>

      <article className="guide-content">
        <section className="guide-hero" aria-labelledby="guide-title">
          <div className="guide-hero-copy">
            <span className="eyebrow">{t.buildGuide.kicker}</span>
            <h1 id="guide-title">{t.buildGuide.title}</h1>
            <p>{t.buildGuide.description}</p>
            <div className="guide-hero-actions">
              <a className="product-action" href="#assembly">
                {t.buildGuide.start}
              </a>
              <a className="product-action secondary" href="#final-check">
                {t.buildGuide.jumpToCheck}
              </a>
            </div>
          </div>
          <dl className="guide-facts" aria-label={t.buildGuide.factsLabel}>
            {t.buildGuide.facts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="guide-body">
          <nav className="guide-jump-nav" aria-label={t.buildGuide.pageIndexLabel}>
            {t.buildGuide.pageIndex.map((item, index) => (
              <a href={item.href} key={item.href}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item.label}
              </a>
            ))}
          </nav>
          <div className="guide-main">

        <section className="guide-section" id="prepare" aria-labelledby="prepare-title">
          <GuideHeading
            kicker={t.buildGuide.prepareKicker}
            title={t.buildGuide.prepareTitle}
            description={t.buildGuide.prepareDescription}
            id="prepare-title"
          />
          <div className="guide-check-grid">
            <GuideChecklist
              title={t.buildGuide.packageTitle}
              items={t.buildGuide.packageItems}
            />
            <GuideChecklist
              title={t.buildGuide.toolsTitle}
              items={t.buildGuide.toolItems}
            />
            <GuideChecklist
              title={t.buildGuide.optionalToolsTitle}
              items={t.buildGuide.optionalToolItems}
            />
          </div>
          <div className="guide-notice warning">
            <strong>{t.buildGuide.safetyTitle}</strong>
            <p>{t.buildGuide.safetyDescription}</p>
          </div>
        </section>

        <section className="guide-section guide-layout-section" aria-labelledby="layout-title">
          <GuideHeading
            kicker={t.buildGuide.layoutKicker}
            title={t.buildGuide.layoutTitle}
            description={t.buildGuide.layoutDescription}
            id="layout-title"
          />
          <div className="guide-device" role="img" aria-label={t.buildGuide.layoutAriaLabel}>
            <div className="guide-device-board">
              <img
                className="guide-device-outline"
                src={`${BUILD_GUIDE_ASSET_URL}layout/octgear-control-layout.svg`}
                alt=""
                aria-hidden="true"
              />
              <div className="guide-device-keys">
                {Array.from(
                  { length: HARDWARE_CONFIG.physicalKeyCount },
                  (_, keyIndex) => (
                    <div className="guide-device-key" key={keyIndex}>
                      <span>{t.buildGuide.keyLabel(keyIndex + 1)}</span>
                      {KEYCAP_SIZE_LABELS[keyIndex] ? (
                        <small>
                          {t.buildGuide.optionalKeycapSize(
                            KEYCAP_SIZE_LABELS[keyIndex],
                          )}
                        </small>
                      ) : null}
                    </div>
                  ),
                )}
              </div>
              <div className="guide-device-encoder">
                <span>{t.buildGuide.encoderLabel}</span>
                <small>{t.buildGuide.encoderOperations}</small>
              </div>
            </div>
            <div className="guide-device-led-strip">
              <span>{t.buildGuide.ledStripLabel}</span>
              <div>
                {Array.from(
                  { length: HARDWARE_CONFIG.externalRgbLedCount },
                  (_, ledIndex) => (
                    <i key={ledIndex}>{ledIndex + 1}</i>
                  ),
                )}
              </div>
            </div>
          </div>
          <div className="guide-completed-reference">
            <div>
              <h3>{t.buildGuide.completedReferenceTitle}</h3>
              <p>{t.buildGuide.completedReferenceDescription}</p>
            </div>
            <div className="guide-completed-gallery">
              {t.buildGuide.completedImages.map((image) => {
                const src = `${BUILD_GUIDE_ASSET_URL}completed/${image.file}`;

                return (
                  <figure key={image.file}>
                    <button
                      type="button"
                      aria-label={t.buildGuide.enlargeGuideImage(image.title)}
                      onClick={() =>
                        setExpandedImage({
                          src,
                          title: image.title,
                          alt: image.alt,
                          width: 1024,
                          height: 768,
                        })
                      }
                    >
                      <img
                        src={src}
                        alt={image.alt}
                        loading="lazy"
                        width="1024"
                        height="768"
                      />
                    </button>
                    <figcaption>{image.title}</figcaption>
                  </figure>
                );
              })}
            </div>
          </div>
          <div className="guide-pcb-reference">
            <div>
              <h3>{t.buildGuide.pcbReferenceTitle}</h3>
              <p>{t.buildGuide.pcbReferenceDescription}</p>
            </div>
            <div className="guide-pcb-gallery">
              {t.buildGuide.pcbImages.map((image) => (
                <figure key={image.file}>
                  <button
                    type="button"
                    aria-label={t.buildGuide.enlargeGuideImage(image.title)}
                    onClick={() =>
                      setExpandedImage({
                        src: `${BUILD_GUIDE_ASSET_URL}pcb/${image.file}`,
                        title: image.title,
                        alt: image.alt,
                        width: 1366,
                        height: 604,
                      })
                    }
                  >
                    <img
                      src={`${BUILD_GUIDE_ASSET_URL}pcb/${image.file}`}
                      alt={image.alt}
                      loading="lazy"
                      width="1366"
                      height="604"
                    />
                  </button>
                  <figcaption>{image.title}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <section className="guide-section" id="assembly" aria-labelledby="assembly-title">
          <GuideHeading
            kicker={t.buildGuide.assemblyKicker}
            title={t.buildGuide.assemblyTitle}
            description={t.buildGuide.assemblyDescription}
            id="assembly-title"
          />
          <ol className="guide-steps">
            {t.buildGuide.steps.map((step, index) => (
              <li key={step.title}>
                <div className="guide-step-number">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="guide-step-copy">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <ul>
                    {step.checks.map((check) => (
                      <li key={check}>{check}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="guide-section" id="downloads" aria-labelledby="downloads-title">
          <GuideHeading
            kicker={t.buildGuide.downloadsKicker}
            title={t.buildGuide.downloadsTitle}
            description={t.buildGuide.downloadsDescription}
            id="downloads-title"
          />
          <StlViewer
            assetBaseUrl={`${BUILD_GUIDE_ASSET_URL}downloads/`}
            labels={{
              title: t.buildGuide.stlViewerTitle,
              description: t.buildGuide.stlViewerDescription,
              loading: t.buildGuide.stlViewerLoading,
              error: t.buildGuide.stlViewerError,
              reset: t.buildGuide.stlViewerReset,
              instructions: t.buildGuide.stlViewerInstructions,
            }}
            models={t.buildGuide.downloads.filter(
              (download) => download.format === "STL",
            )}
          />
          <div className="guide-notice warning guide-material-notice">
            <strong>{t.buildGuide.middleCaseMaterialTitle}</strong>
            <p>{t.buildGuide.middleCaseMaterialDescription}</p>
          </div>
          <div className="guide-download-grid">
            {t.buildGuide.downloads.map((download) => (
              <a
                className="guide-download-card"
                href={`${BUILD_GUIDE_ASSET_URL}downloads/${download.file}`}
                download
                key={download.file}
              >
                <span>{download.format}</span>
                <strong>{download.title}</strong>
                <small>{download.description}</small>
                <b>{t.buildGuide.downloadAction}</b>
              </a>
            ))}
          </div>
          <div className="guide-notice">
            <strong>{t.buildGuide.downloadNoticeTitle}</strong>
            <p>
              {t.buildGuide.downloadNoticeDescription}{" "}
              <a href={HARDWARE_LICENSE_URL} rel="noreferrer">
                {t.buildGuide.licenseLink}
              </a>
            </p>
          </div>
        </section>

        <section className="guide-section" id="firmware" aria-labelledby="firmware-title">
          <GuideHeading
            kicker={t.buildGuide.firmwareKicker}
            title={t.buildGuide.firmwareTitle}
            description={t.buildGuide.firmwareDescription}
            id="firmware-title"
          />
          <div className="guide-action-grid">
            <article className="guide-action-card">
              <span>01</span>
              <h3>{t.buildGuide.firmwareCardTitle}</h3>
              <p>{t.buildGuide.firmwareCardDescription}</p>
              <a className="product-action" href={remapperUrl}>
                {t.home.openRemapper}
              </a>
            </article>
            <article className="guide-action-card">
              <span>02</span>
              <h3>{t.buildGuide.remapCardTitle}</h3>
              <p>{t.buildGuide.remapCardDescription}</p>
              <a className="product-action secondary" href={remapperUrl}>
                {t.buildGuide.configureKeymap}
              </a>
            </article>
          </div>
          <div className="guide-notice">
            <strong>{t.buildGuide.recoveryTitle}</strong>
            <p>{t.buildGuide.recoveryDescription}</p>
          </div>
        </section>

        <section className="guide-section" id="final-check" aria-labelledby="check-title">
          <GuideHeading
            kicker={t.buildGuide.checkKicker}
            title={t.buildGuide.checkTitle}
            description={t.buildGuide.checkDescription}
            id="check-title"
          />
          <div className="guide-check-flow">
            {t.buildGuide.checks.map((check, index) => (
              <div key={check.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{check.title}</strong>
                  <p>{check.description}</p>
                </div>
              </div>
            ))}
          </div>
          <a className="product-action guide-diagnostics-action" href={diagnosticsUrl}>
            {t.buildGuide.openFinalCheck}
          </a>
        </section>

        <section className="guide-section" id="troubleshooting" aria-labelledby="trouble-title">
          <GuideHeading
            kicker={t.buildGuide.troubleKicker}
            title={t.buildGuide.troubleTitle}
            description={t.buildGuide.troubleDescription}
            id="trouble-title"
          />
          <div className="guide-troubleshooting">
            {t.buildGuide.troubleshooting.map((item) => (
              <details key={item.problem}>
                <summary>{item.problem}</summary>
                <p>{item.solution}</p>
              </details>
            ))}
          </div>
        </section>

        <footer className="guide-footer">
          <div>
            <strong>{t.buildGuide.completeTitle}</strong>
            <p>{t.buildGuide.completeDescription}</p>
          </div>
          <p className="guide-license-note">
            {t.buildGuide.licenseNote}{" "}
            <a href={HARDWARE_LICENSE_URL} rel="noreferrer">
              {t.buildGuide.licenseLink}
            </a>
          </p>
        </footer>
          </div>
        </div>
      </article>

      {expandedImage ? (
        <div
          className="guide-image-lightbox"
          role="presentation"
          onClick={() => setExpandedImage(null)}
        >
          <div
            className="guide-image-lightbox-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={expandedImage.title}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="guide-image-lightbox-close"
              aria-label={t.buildGuide.closeGuideImage}
              autoFocus
              onClick={() => setExpandedImage(null)}
            >
              ×
            </button>
            <img
              src={expandedImage.src}
              alt={expandedImage.alt}
              width={expandedImage.width}
              height={expandedImage.height}
            />
            <strong>{expandedImage.title}</strong>
          </div>
        </div>
      ) : null}
    </main>
  );
}

type GuideHeadingProps = {
  kicker: string;
  title: string;
  description: string;
  id: string;
};

function GuideHeading({ kicker, title, description, id }: GuideHeadingProps) {
  return (
    <div className="guide-heading">
      <span className="panel-kicker">{kicker}</span>
      <h2 id={id}>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

type GuideChecklistProps = {
  title: string;
  items: readonly string[];
};

function GuideChecklist({ title, items }: GuideChecklistProps) {
  return (
    <article className="guide-checklist">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  );
}
