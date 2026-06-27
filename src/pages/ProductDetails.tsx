import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { HeartIcon } from "../components/Icons";
import ProductCard from "../components/ProductCard";
import SectionTitle from "../components/SectionTitle";
import StarRating from "../components/StarRating";
import { useWishlistStore } from "../store/wishlistStore";
import { useCartColorStore } from "../store/cartColorStore";
import { resolveColor } from "../shared/colorMap";
import { imageUrl } from "../shared/api/imageUrl";
import { getDetailRating, getDetailReviewCount, getSizeOptions } from "../shared/productMetrics";
import {
  useAddToCartMutation,
  useGetProductByIdQuery,
  useGetProductsQuery,
  useIncreaseCartMutation,
  useLazyGetCartQuery,
  type Product,
} from "../shared/api/storeApi";

export default function ProductDetails() {
  const { id } = useParams();
  const productId = Number(id);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useGetProductByIdQuery(productId, {
    skip: Number.isNaN(productId),
  });
  const { data: related } = useGetProductsQuery({ PageNumber: 1, PageSize: 4 });
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [increaseCart] = useIncreaseCartMutation();
  const [fetchCart] = useLazyGetCartQuery();

  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const inWishlist = useWishlistStore((state) => state.items.some((item) => item.id === productId));
  const setCartColor = useCartColorStore((state) => state.setColor);
  const setCartSize = useCartColorStore((state) => state.setSize);

  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [qty, setQty] = useState(1);

  const product = data?.data;

  if (!isLoading && (isError || !product)) {
    return (
      <>
        <Header />
        <main className="container page-space not-found-page">
          <h1>Product not found</h1>
          <p>Этого товара нет. Загляни в магазин.</p>
          <Link to="/products" className="primary-btn">
            Back to shop
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  if (isLoading || !product) {
    return (
      <>
        <Header />
        <main className="container page-space">
          <p className="state-text">Loading product...</p>
        </main>
        <Footer />
      </>
    );
  }

  const images = product.images.length > 0 ? product.images : [{ id: 0, images: "" }];
  const sizeOptions = getSizeOptions(product);
  const activeSize = selectedSize || sizeOptions[0] || "";
  const rating = getDetailRating(product);
  const reviews = getDetailReviewCount(product);

  // Цвета — только те, что привязаны к товару (в API это поле color, иногда через запятую).
  const colorOptions = (product.color ?? "")
    .split(/[,/|]+/)
    .map((c) => c.trim())
    .filter(Boolean);
  const activeColor = selectedColor || colorOptions[0] || "";

  function handleWishlist() {
    if (!product) return;
    const asProduct: Product = {
      id: product.id,
      productName: product.productName,
      image: product.images[0]?.images ?? "",
      color: product.color,
      price: product.price,
      hasDiscount: product.hasDiscount,
      discountPrice: product.discountPrice,
      quantity: product.quantity,
      productInMyCart: product.productInMyCart,
      categoryId: 0,
      categoryName: null,
    };
    toggleWishlist(asProduct);
  }

  async function handleBuyNow() {
    if (activeColor) setCartColor(productId, activeColor);
    if (activeSize) setCartSize(productId, activeSize);
    // кладём товар в корзину (повторный add даёт 400 "already exist" — это ок)
    await addToCart(productId).unwrap().catch(() => {});
    // increase работает по id строки корзины, поэтому берём его из самой корзины
    if (qty > 1) {
      const cart = await fetchCart().unwrap().catch(() => null);
      const row = cart?.data?.[0]?.productsInCart.find((item) => item.product.id === productId);
      if (row) {
        for (let i = 1; i < qty; i++) {
          await increaseCart(row.id).unwrap().catch(() => {});
        }
      }
    }
    navigate("/cart");
  }

  const relatedProducts = (related?.data?.products ?? []).filter((item) => item.id !== productId);

  return (
    <>
      <Header />

      <main className="container page-space">
        <Breadcrumb items={[product.brand || "Catalog", product.productName]} />

        <section className="details-layout">
          <div className="details-gallery">
            <div className="thumb-column">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={image.id}
                  className={index === activeImage ? "thumb-item active" : "thumb-item"}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={imageUrl(image.images)} alt="" />
                </button>
              ))}
            </div>
            <img
              className="main-product-image"
              src={imageUrl(images[activeImage]?.images)}
              alt={product.productName}
            />
          </div>

          <div className="details-info">
            <h1>{product.productName}</h1>
            <div className="details-rating">
              <StarRating rating={rating} reviews={reviews} />
              <i />
              <strong>{product.quantity > 0 ? "In Stock" : "Out of Stock"}</strong>
            </div>
            <h2>${product.hasDiscount ? product.discountPrice : product.price}</h2>
            <p>{product.description}</p>

            {colorOptions.length > 0 ? (
              <div className="details-colors">
                <span>Colours:</span>
                <div className="color-swatches">
                  {colorOptions.map((name) => {
                    const resolved = resolveColor(name);
                    const isSelected = activeColor.toLowerCase() === name.toLowerCase();
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setSelectedColor(name)}
                        className={isSelected ? "color-swatch selected" : "color-swatch"}
                        title={name}
                      >
                        <span
                          className="swatch-dot"
                          style={{ background: resolved.hex, color: resolved.known ? "transparent" : "#111" }}
                        >
                          {resolved.known ? "" : resolved.letter}
                        </span>
                        <span className="swatch-name">{name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div className="details-line">
              <span>Size:</span>
              <div className="size-list">
                {sizeOptions.map((size) => (
                  <button
                    className={activeSize === size ? "size-btn active" : "size-btn"}
                    type="button"
                    key={size}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="buy-row">
              <div className="qty-control">
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease">
                  −
                </button>
                <span>{qty}</span>
                <button type="button" onClick={() => setQty((q) => q + 1)} aria-label="Increase">
                  +
                </button>
              </div>
              <button
                className="primary-btn buy-btn"
                type="button"
                onClick={handleBuyNow}
                disabled={isAdding}
              >
                {isAdding ? "Adding..." : "Buy Now"}
              </button>
              <button
                className={inWishlist ? "wish-button active" : "wish-button"}
                type="button"
                onClick={handleWishlist}
                aria-label="Add to wishlist"
              >
                <HeartIcon />
              </button>
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 ? (
          <section className="related-section">
            <SectionTitle kicker="Related Item" title="" />
            <div className="product-grid four-col">
              {relatedProducts.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        ) : null}
      </main>

      <Footer />
    </>
  );
}
