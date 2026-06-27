import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import SectionTitle from "../components/SectionTitle";
import { useWishlistStore } from "../store/wishlistStore";
import { useAddToCartMutation, useGetProductsQuery } from "../shared/api/storeApi";

export default function Wishlist() {
  const items = useWishlistStore((state) => state.items);
  const { data } = useGetProductsQuery({ PageNumber: 1, PageSize: 4 });
  const [addToCart] = useAddToCartMutation();

  const suggestions = data?.data?.products ?? [];

  function moveAllToBag() {
    items.forEach((item) => addToCart(item.id));
  }

  return (
    <>
      <Header />

      <main className="container page-space wishlist-page">
        <div className="wishlist-head">
          <h1>Wishlist ({items.length})</h1>
          {items.length > 0 ? (
            <button className="outline-btn" type="button" onClick={moveAllToBag}>
              Move All To Bag
            </button>
          ) : null}
        </div>

        {items.length === 0 ? (
          <div className="empty-state">
            <p>Список желаний пуст.</p>
            <Link to="/products" className="primary-btn">
              Go shopping
            </Link>
          </div>
        ) : (
          <section className="product-grid four-col">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} showTrash />
            ))}
          </section>
        )}

        {suggestions.length > 0 ? (
          <section className="wishlist-section">
            <SectionTitle kicker="" title="Just For You" actions="See All" />
            <div className="product-grid four-col">
              {suggestions.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <Footer />
    </>
  );
}
