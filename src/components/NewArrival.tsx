import { Link } from "react-router-dom";
import { useT } from "../features/i18n/useT";
import { imageUrl } from "../shared/api/imageUrl";
import type { Product } from "../shared/api/storeApi";
import SectionTitle from "./SectionTitle";

interface NewArrivalProps {
  products: Product[];
}

export default function NewArrival({ products }: NewArrivalProps) {
  const t = useT();
  // 4 самых новых товара раскладываем в бенто-сетку (1 большой слева + 3 справа)
  const arrivals = [...products].sort((a, b) => b.id - a.id).slice(0, 4);

  if (arrivals.length === 0) return null;

  return (
    <section className="container home-section">
      <SectionTitle kicker={t("section.featured")} title={t("section.newArrival")} />

      <div className="arrival-grid">
        {arrivals.map((product, index) => (
          <Link
            to={`/products/${product.id}`}
            className={index === 0 ? "arrival-card arrival-main" : "arrival-card"}
            key={product.id}
          >
            <img src={imageUrl(product.image)} alt={product.productName} />
            <div className="arrival-info">
              <h3>{product.productName}</h3>
              <p>{product.categoryName || "New collection"}</p>
              <span className="arrival-shop">{t("btn.shopNow")}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
