import { LanguageSwitch } from "../components/LanguageSwitch";
import { ProductCard } from "../components/ProductCard";
import { PRODUCT_CATALOG } from "../../products/catalog";
import { useI18n } from "../../shared/i18n";

export function HomePage() {
  const { t } = useI18n();

  return (
    <main className="app-shell home-shell">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-toolbar">
          <LanguageSwitch />
        </div>
        <div className="brand home-brand">
          <div className="brand-copy">
            <span className="eyebrow">{t.home.eyebrow}</span>
            <h1 id="home-title">{t.home.title}</h1>
            <p>{t.home.description}</p>
          </div>
        </div>
      </section>

      <section className="product-grid" aria-label={t.home.productListLabel}>
        {PRODUCT_CATALOG.map((product) => (
          <ProductCard product={product} key={product.id} />
        ))}
      </section>
    </main>
  );
}
