import {
  productAssetUrl,
  productPageUrl,
} from "../appUrls";
import type { ProductDefinition } from "../../products/productTypes";
import { getProductMessages } from "../../products/productMessages";
import { t } from "../../shared/i18n";

type ProductCardProps = {
  product: ProductDefinition;
};

export function ProductCard({ product }: ProductCardProps) {
  const copy = getProductMessages(product.id).home;

  return (
    <article className="product-card">
      <div className="product-card-copy">
        <div className="product-title-row">
          <img
            className="product-mark"
            src={productAssetUrl(product.assets.mark)}
            width="322"
            height="307"
            alt=""
          />
          <div>
            <span className="eyebrow">{copy.status}</span>
            <h2>{copy.name}</h2>
          </div>
        </div>
        <p>{copy.description}</p>
      </div>
      <figure className="product-device-visual">
        <img
          src={productAssetUrl(product.assets.homeImage)}
          width="1024"
          height="768"
          alt={copy.deviceImageAlt}
        />
      </figure>
      <dl className="product-specs">
        <div>
          <dt>{t.home.keys}</dt>
          <dd>{product.hardware.physicalKeyCount}</dd>
        </div>
        <div>
          <dt>{t.home.encoder}</dt>
          <dd>{copy.encoderValue}</dd>
        </div>
        <div>
          <dt>{t.home.layers}</dt>
          <dd>{product.hardware.layerCount}</dd>
        </div>
        <div>
          <dt>{t.home.connection}</dt>
          <dd>{copy.connectionValue}</dd>
        </div>
      </dl>
      <div className="product-actions">
        <a
          className="product-action"
          href={productPageUrl(product, "remapper")}
        >
          {t.home.openRemapper}
        </a>
        <div className="product-secondary-actions">
          <a
            className="product-action secondary"
            href={productPageUrl(product, "buildGuide")}
          >
            {t.home.openBuildGuide}
          </a>
          <a
            className="product-action secondary"
            href={productPageUrl(product, "diagnostics")}
          >
            {t.home.openDiagnostics}
          </a>
        </div>
      </div>
    </article>
  );
}
