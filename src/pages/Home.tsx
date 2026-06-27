import { Link } from "react-router-dom";
import Countdown from "../components/Countdown";
import DealBanner from "../components/DealBanner";
import Footer from "../components/Footer";
import Header from "../components/Header";
import HeroCarousel from "../components/HeroCarousel";
import NewArrival from "../components/NewArrival";
import ProductCard from "../components/ProductCard";
import SectionTitle from "../components/SectionTitle";
import Services from "../components/Services";
import { useT } from "../features/i18n/useT";
import { imageUrl } from "../shared/api/imageUrl";
import { useGetCategoriesQuery, useGetProductsQuery } from "../shared/api/storeApi";

export default function Home() {
  const t = useT();
  const { data: productsResponse, isLoading } = useGetProductsQuery({ PageNumber: 1, PageSize: 12 });
  const { data: categoriesResponse } = useGetCategoriesQuery();

  const products = productsResponse?.data?.products ?? [];
  const categoryList = categoriesResponse?.data ?? [];
  const dealProduct = products.find((product) => product.hasDiscount) || products[0];

  return (
    <>
      <Header />

      <main>
        <section className="container hero-layout">
          <aside className="hero-sidebar">
            {categoryList.map((category) => (
              <Link to={`/products?category=${category.id}`} key={category.id}>
                {category.categoryName}
                <span>›</span>
              </Link>
            ))}
          </aside>

          <HeroCarousel products={products} />
        </section>

        <section className="container home-section">
          <div className="flash-head">
            <SectionTitle kicker={t("section.todays")} title={t("section.flashSales")} />
            <Countdown />
          </div>

          {isLoading ? (
            <div className="product-row">
              {Array.from({ length: 4 }).map((_, index) => (
                <div className="skeleton-card" key={index} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="state-text">No products yet.</p>
          ) : (
            <div className="product-row" data-aos="fade-up">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          <div className="center-actions">
            <Link to="/products" className="primary-btn">
              {t("btn.viewAll")}
            </Link>
          </div>
        </section>

        {categoryList.length > 0 ? (
          <section className="container home-section bordered-section">
            <SectionTitle kicker={t("section.categories")} title={t("section.browseCategory")} />
            <div className="category-grid" data-aos="fade-up">
              {categoryList.map((category) => (
                <Link to={`/products?category=${category.id}`} className="category-card" key={category.id}>
                  <img className="category-img" src={imageUrl(category.categoryImage)} alt="" />
                  {category.categoryName}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <DealBanner product={dealProduct} />

        {products.length > 0 ? (
          <section className="container home-section">
            <SectionTitle kicker={t("section.ourProducts")} title={t("section.exploreProducts")} />
            <div className="product-grid four-col" data-aos="fade-up">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="center-actions">
              <Link to="/products" className="primary-btn">
                View All Products
              </Link>
            </div>
          </section>
        ) : null}

        <NewArrival products={products} />

        <Services />
      </main>

      <Footer />
    </>
  );
}
