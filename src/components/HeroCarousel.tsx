import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useT } from "../features/i18n/useT";
import { imageUrl } from "../shared/api/imageUrl";
import type { Product } from "../shared/api/storeApi";
import ShopNowCta from "./ShopNowCta";

interface HeroCarouselProps {
  products: Product[];
}

export default function HeroCarousel({ products }: HeroCarouselProps) {
  const t = useT();
  const slides = products.slice(0, 5);
  const total = slides.length;
  const [active, setActive] = useState(0);

  // Автопрокрутка каждые 4 секунды (только если слайдов больше одного)
  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % total);
    }, 4000);
    return () => clearInterval(timer);
  }, [total]);

  // данные ещё грузятся — показываем скелетон, чтобы не было пустого баннера
  if (total === 0) {
    return <div className="hero-banner hero-skeleton" aria-hidden="true" />;
  }

  // active мог остаться больше нового количества слайдов
  const current = active % total;

  return (
    <div className="hero-banner">
      <div className="hero-track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {slides.map((product) => (
          <Link to={`/products/${product.id}`} className="hero-slide hero-slide-product" key={product.id}>
            <div className="hero-slide-text">
              <span className="hero-kicker">{product.categoryName || "Featured"}</span>
              <h2>{product.productName}</h2>
              <ShopNowCta label={t("hero.shopNow")} />
            </div>
            <img src={imageUrl(product.image)} alt={product.productName} />
          </Link>
        ))}
      </div>

      {total > 1 ? (
        <div className="hero-dots">
          {slides.map((product, index) => (
            <button
              key={product.id}
              type="button"
              className={index === current ? "active" : ""}
              onClick={() => setActive(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
