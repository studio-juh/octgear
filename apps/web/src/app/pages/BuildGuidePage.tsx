import { useEffect, useState, type CSSProperties } from "react";
import { LanguageSwitch } from "../components/LanguageSwitch";
import { StlViewer } from "../components/StlViewer";
import {
  productAssetUrl,
  productPageUrl,
} from "../appUrls";
import { useProductDefinition } from "../../products/ProductContext";
import { getProductMessages } from "../../products/productMessages";
import { useI18n } from "../../shared/i18n";

type ExpandedGuideImage = {
  src: string;
  title: string;
  alt: string;
  width: number;
  height: number;
};

type GuidePhoto = {
  file: string;
  title: string;
  alt: string;
};

type GuideLayoutStyle = CSSProperties &
  Record<`--guide-${string}`, string>;

export function BuildGuidePage() {
  const { t } = useI18n();
  const product = useProductDefinition();
  const guide = getProductMessages(product.id).buildGuide;
  const buildGuideAssetUrl = productAssetUrl(product.assets.buildGuideRoot);
  const buildGuideUrl = productPageUrl(product, "buildGuide");
  const homeUrl = productPageUrl(product, "home");
  const remapperUrl = productPageUrl(product, "remapper");
  const diagnosticsUrl = productPageUrl(product, "diagnostics");
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
    <main className="app-shell guide-shell" data-product={product.id}>
      <header className="guide-topbar">
        <a
          className="guide-brand"
          href={buildGuideUrl}
          aria-label={t.home.openBuildGuide}
        >
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
        <section className="guide-hero" aria-labelledby="guide-title">
          <div className="guide-hero-copy">
            <span className="eyebrow">{guide.kicker}</span>
            <h1 id="guide-title">{guide.title}</h1>
            <p>{guide.description}</p>
            <div className="guide-hero-actions">
              <a className="product-action" href="#assembly">
                {guide.start}
              </a>
              <a className="product-action secondary" href="#final-check">
                {guide.jumpToCheck}
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

        <section className="guide-section" id="prepare" aria-labelledby="prepare-title">
          <GuideHeading
            kicker={guide.prepareKicker}
            title={guide.prepareTitle}
            description={guide.prepareDescription}
            id="prepare-title"
          />
          <div className="guide-check-grid">
            <GuideChecklist
              title={guide.packageTitle}
              items={guide.packageItems}
            />
            <GuideChecklist
              title={guide.toolsTitle}
              items={guide.toolItems}
            />
            <GuideChecklist
              title={guide.optionalToolsTitle}
              items={guide.optionalToolItems}
            />
          </div>
          <div className="guide-notice warning">
            <strong>{guide.safetyTitle}</strong>
            <p>{guide.safetyDescription}</p>
          </div>
          <div className="guide-part-reference">
            <div className="guide-part-reference-heading">
              <h3>{guide.partsReferenceTitle}</h3>
              <p>{guide.partsReferenceDescription}</p>
            </div>
            <div className="guide-part-reference-grid">
              {guide.partReferences.map((part, index) => (
                <article className="guide-part-card" key={part.title}>
                  <GuidePhotoSlot
                    assetBaseUrl={`${buildGuideAssetUrl}assembly/`}
                    photo={part.photo}
                    placeholder={guide.photoPlaceholder(index + 1)}
                    pendingLabel={guide.photoPending}
                    enlargeLabel={guide.enlargeGuideImage(part.photo.title)}
                    onExpand={setExpandedImage}
                  />
                  <div className="guide-part-card-copy">
                    <span>{part.quantity}</span>
                    <h4>{part.title}</h4>
                    <p>{part.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="guide-section guide-layout-section" aria-labelledby="layout-title">
          <GuideHeading
            kicker={guide.layoutKicker}
            title={guide.layoutTitle}
            description={guide.layoutDescription}
            id="layout-title"
          />
          <div className="guide-device" role="img" aria-label={guide.layoutAriaLabel}>
            <div
              className="guide-device-board"
              style={{
                "--guide-board-aspect-ratio":
                  product.buildGuide.controlLayout.aspectRatio,
              } as GuideLayoutStyle}
            >
              <img
                className="guide-device-outline"
                src={`${buildGuideAssetUrl}${product.buildGuide.controlLayout.outline}`}
                alt=""
                aria-hidden="true"
              />
              <div className="guide-device-keys">
                {product.buildGuide.controlLayout.keys
                  .slice(0, product.hardware.physicalKeyCount)
                  .map((key, keyIndex) => (
                    <div
                      className="guide-device-key"
                      data-tone={key.tone ?? "default"}
                      key={keyIndex}
                      style={{
                        "--guide-key-top": key.top,
                        "--guide-key-left": key.left,
                        "--guide-key-width": key.width ?? "11.7%",
                        "--guide-key-height": key.height ?? "23.4%",
                      } as GuideLayoutStyle}
                    >
                      <span>{guide.keyLabel(keyIndex + 1)}</span>
                      {key.optionalKeycapSize ? (
                        <small>
                          {guide.optionalKeycapSize(key.optionalKeycapSize)}
                        </small>
                      ) : null}
                    </div>
                  ))}
              </div>
              <div
                className="guide-device-encoder"
                style={{
                  "--guide-encoder-right":
                    product.buildGuide.controlLayout.encoder.right,
                  "--guide-encoder-bottom":
                    product.buildGuide.controlLayout.encoder.bottom,
                  "--guide-encoder-width":
                    product.buildGuide.controlLayout.encoder.width,
                } as GuideLayoutStyle}
              >
                <span>{guide.encoderLabel}</span>
                <small>{guide.encoderOperations}</small>
              </div>
            </div>
            <div className="guide-device-led-strip">
              <span>{guide.ledStripLabel}</span>
              <div>
                {Array.from(
                  { length: product.hardware.externalRgbLedCount },
                  (_, ledIndex) => (
                    <i key={ledIndex}>{ledIndex + 1}</i>
                  ),
                )}
              </div>
            </div>
          </div>
          <div className="guide-completed-reference">
            <div>
              <h3>{guide.completedReferenceTitle}</h3>
              <p>{guide.completedReferenceDescription}</p>
            </div>
            <div className="guide-completed-gallery">
              {guide.completedImages.map((image) => {
                const src = `${buildGuideAssetUrl}completed/${image.file}`;

                return (
                  <figure key={image.file}>
                    <button
                      type="button"
                      aria-label={guide.enlargeGuideImage(image.title)}
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
              <h3>{guide.pcbReferenceTitle}</h3>
              <p>{guide.pcbReferenceDescription}</p>
            </div>
            <div className="guide-pcb-gallery">
              {guide.pcbImages.map((image) => (
                <figure key={image.file}>
                  <button
                    type="button"
                    aria-label={guide.enlargeGuideImage(image.title)}
                    onClick={() =>
                      setExpandedImage({
                        src: `${buildGuideAssetUrl}pcb/${image.file}`,
                        title: image.title,
                        alt: image.alt,
                        width: 1366,
                        height: 604,
                      })
                    }
                  >
                    <img
                      src={`${buildGuideAssetUrl}pcb/${image.file}`}
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
            kicker={guide.assemblyKicker}
            title={guide.assemblyTitle}
            description={guide.assemblyDescription}
            id="assembly-title"
          />
          <ol className="guide-steps">
            {guide.steps.map((step, index) => (
              <li key={step.title}>
                <div className="guide-step-number">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div className="guide-step-content">
                  <div className="guide-step-copy">
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                    <ul>
                      {step.checks.map((check) => (
                        <li key={check}>{check}</li>
                      ))}
                    </ul>
                  </div>
                  <GuidePhotoSlot
                    assetBaseUrl={`${buildGuideAssetUrl}assembly/`}
                    photo={step.photo}
                    placeholder={guide.photoPlaceholder(index + 1)}
                    pendingLabel={guide.photoPending}
                    enlargeLabel={guide.enlargeGuideImage(step.photo.title)}
                    onExpand={setExpandedImage}
                  />
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="guide-section" id="downloads" aria-labelledby="downloads-title">
          <GuideHeading
            kicker={guide.downloadsKicker}
            title={guide.downloadsTitle}
            description={guide.downloadsDescription}
            id="downloads-title"
          />
          <StlViewer
            assetBaseUrl={`${buildGuideAssetUrl}downloads/`}
            labels={{
              title: guide.stlViewerTitle,
              description: guide.stlViewerDescription,
              loading: guide.stlViewerLoading,
              error: guide.stlViewerError,
              reset: guide.stlViewerReset,
              instructions: guide.stlViewerInstructions,
            }}
            models={guide.downloads.filter(
              (download) => download.format === "STL",
            )}
            translucentModelFiles={product.buildGuide.translucentStlFiles}
          />
          <div className="guide-notice warning guide-material-notice">
            <strong>{guide.middleCaseMaterialTitle}</strong>
            <p>{guide.middleCaseMaterialDescription}</p>
          </div>
          <div className="guide-download-grid">
            {guide.downloads.map((download) => (
              <a
                className="guide-download-card"
                href={`${buildGuideAssetUrl}downloads/${download.file}`}
                download
                key={download.file}
              >
                <span>{download.format}</span>
                <strong>{download.title}</strong>
                <small>{download.description}</small>
                <b>{guide.downloadAction}</b>
              </a>
            ))}
          </div>
          <div className="guide-notice">
            <strong>{guide.downloadNoticeTitle}</strong>
            <p>
              {guide.downloadNoticeDescription}{" "}
              <a href={product.buildGuide.hardwareLicenseUrl} rel="noreferrer">
                {guide.licenseLink}
              </a>
            </p>
          </div>
        </section>

        <section className="guide-section" id="firmware" aria-labelledby="firmware-title">
          <GuideHeading
            kicker={guide.firmwareKicker}
            title={guide.firmwareTitle}
            description={guide.firmwareDescription}
            id="firmware-title"
          />
          <div className="guide-action-grid">
            <article className="guide-action-card">
              <span>01</span>
              <h3>{guide.firmwareCardTitle}</h3>
              <p>{guide.firmwareCardDescription}</p>
              <a className="product-action" href={remapperUrl}>
                {t.home.openRemapper}
              </a>
            </article>
            <article className="guide-action-card">
              <span>02</span>
              <h3>{guide.remapCardTitle}</h3>
              <p>{guide.remapCardDescription}</p>
              <a className="product-action secondary" href={remapperUrl}>
                {guide.configureKeymap}
              </a>
            </article>
          </div>
          <div className="guide-notice">
            <strong>{guide.recoveryTitle}</strong>
            <p>{guide.recoveryDescription}</p>
          </div>
        </section>

        <section className="guide-section" id="final-check" aria-labelledby="check-title">
          <GuideHeading
            kicker={guide.checkKicker}
            title={guide.checkTitle}
            description={guide.checkDescription}
            id="check-title"
          />
          <div className="guide-check-flow">
            {guide.checks.map((check, index) => (
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
            {guide.openFinalCheck}
          </a>
        </section>

        <section className="guide-section" id="troubleshooting" aria-labelledby="trouble-title">
          <GuideHeading
            kicker={guide.troubleKicker}
            title={guide.troubleTitle}
            description={guide.troubleDescription}
            id="trouble-title"
          />
          <div className="guide-troubleshooting">
            {guide.troubleshooting.map((item) => (
              <details key={item.problem}>
                <summary>{item.problem}</summary>
                <p>{item.solution}</p>
              </details>
            ))}
          </div>
        </section>

        <footer className="guide-footer">
          <div>
            <strong>{guide.completeTitle}</strong>
            <p>{guide.completeDescription}</p>
          </div>
          <div className="guide-footer-meta">
            <div className="guide-distribution">
              <strong>{guide.distributionTitle}</strong>
              <p>{guide.distributionDescription}</p>
              <a href={product.links.store} rel="noreferrer">
                {guide.distributionLink}
              </a>
            </div>
            <p className="guide-license-note">
              {guide.licenseNote}{" "}
              <a href={product.buildGuide.hardwareLicenseUrl} rel="noreferrer">
                {guide.licenseLink}
              </a>
            </p>
          </div>
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
              aria-label={guide.closeGuideImage}
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

type GuidePhotoSlotProps = {
  assetBaseUrl: string;
  photo: GuidePhoto;
  placeholder: string;
  pendingLabel: string;
  enlargeLabel: string;
  onExpand: (image: ExpandedGuideImage) => void;
};

function GuidePhotoSlot({
  assetBaseUrl,
  photo,
  placeholder,
  pendingLabel,
  enlargeLabel,
  onExpand,
}: GuidePhotoSlotProps) {
  if (!photo.file) {
    return (
      <div
        className="guide-photo-slot placeholder"
        role="img"
        aria-label={`${photo.title}: ${pendingLabel}`}
      >
        <span>{placeholder}</span>
        <strong>{photo.title}</strong>
        <small>{pendingLabel}</small>
      </div>
    );
  }

  const src = `${assetBaseUrl}${photo.file}`;

  return (
    <button
      type="button"
      className="guide-photo-slot available"
      aria-label={enlargeLabel}
      onClick={() =>
        onExpand({
          src,
          title: photo.title,
          alt: photo.alt,
          width: 1200,
          height: 900,
        })
      }
    >
      <img
        src={src}
        alt={photo.alt}
        loading="lazy"
        width="1200"
        height="900"
      />
    </button>
  );
}
