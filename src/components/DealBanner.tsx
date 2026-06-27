import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useT } from "../features/i18n/useT";
import { imageUrl } from "../shared/api/imageUrl";
import type { Product } from "../shared/api/storeApi";
import { getDiscountPercent } from "../shared/productMetrics";

interface DealBannerProps {
  product?: Product;
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export default function DealBanner({ product }: DealBannerProps) {
  const t = useT();
  // фиксируем цель отсчёта при монтировании
  const [target] = useState(
    () => Date.now() + 5 * 86_400_000 + 23 * 3_600_000 + 59 * 60_000 + 35 * 1_000,
  );
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!product) return null;

  const ms = Math.max(0, target - now);
  const units = [
    { label: t("cd.hours"), value: Math.floor((ms % 86_400_000) / 3_600_000) },
    { label: t("cd.days"), value: Math.floor(ms / 86_400_000) },
    { label: t("cd.minutes"), value: Math.floor((ms % 3_600_000) / 60_000) },
    { label: t("cd.seconds"), value: Math.floor((ms % 60_000) / 1_000) },
  ];
  const discount = getDiscountPercent(product);

  return (
    <section className="container deal-banner">
      <div className="deal-copy">
        <p className="deal-kicker">{t("section.categories")}</p>
        <h2>Enhance Your Music Experience</h2>

        <div className="deal-timer">
          {units.map((unit) => (
            <div className="deal-time" key={unit.label}>
              <b>{pad(unit.value)}</b>
              <small>{unit.label}</small>
            </div>
          ))}
        </div>

        <Link to={`/products/${product.id}`} className="deal-buy">
          {t("btn.buyNow")}
        </Link>
      </div>

      <Link to={`/products/${product.id}`} className="deal-media" aria-label={product.productName}>
        {discount > 0 ? <span className="deal-badge">-{discount}%</span> : null}
        <img src={imageUrl(product.image)} alt={product.productName} />
      </Link>
    </section>
  );
}
