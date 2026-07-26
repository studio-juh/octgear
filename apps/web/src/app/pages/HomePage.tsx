import { buildGuideUrl, diagnosticsUrl, remapperUrl } from "../appUrls";
import { HARDWARE_CONFIG } from "../../features/hardware/hardwareConfig";
import { t } from "../../shared/i18n";

export function HomePage() {
  return (
    <main className="app-shell home-shell">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="brand home-brand">
          <div className="brand-copy">
            <span className="eyebrow">{t.home.eyebrow}</span>
            <h1 id="home-title">{t.home.title}</h1>
            <p>{t.home.description}</p>
          </div>
        </div>
      </section>

      <section className="product-grid" aria-label={t.home.productListLabel}>
        {t.home.products.map((product) => (
          <article className="product-card" key={product.name}>
            <div className="product-card-copy">
              <div className="product-title-row">
                <img
                  className="product-mark"
                  src={`${import.meta.env.BASE_URL}brand/octgear-mark.png`}
                  width="322"
                  height="307"
                  alt=""
                />
                <div>
                  <span className="eyebrow">{product.status}</span>
                  <h2>{product.name}</h2>
                </div>
              </div>
              <p>{product.description}</p>
            </div>
            <figure className="product-device-visual">
              <img
                src={`${import.meta.env.BASE_URL}build-guide/completed/octgear-completed-front.jpg`}
                width="1024"
                height="768"
                alt={t.home.deviceImageAlt}
              />
            </figure>
            <dl className="product-specs">
              <div>
                <dt>{t.home.keys}</dt>
                <dd>{HARDWARE_CONFIG.physicalKeyCount}</dd>
              </div>
              <div>
                <dt>{t.home.encoder}</dt>
                <dd>{t.home.encoderValue}</dd>
              </div>
              <div>
                <dt>{t.home.layers}</dt>
                <dd>{HARDWARE_CONFIG.layerCount}</dd>
              </div>
              <div>
                <dt>{t.home.connection}</dt>
                <dd>{t.home.connectionValue}</dd>
              </div>
            </dl>
            <div className="product-actions">
              <a className="product-action" href={remapperUrl}>
                {t.home.openRemapper}
              </a>
              <div className="product-secondary-actions">
                <a className="product-action secondary" href={buildGuideUrl}>
                  {t.home.openBuildGuide}
                </a>
                <a className="product-action secondary" href={diagnosticsUrl}>
                  {t.home.openDiagnostics}
                </a>
              </div>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
