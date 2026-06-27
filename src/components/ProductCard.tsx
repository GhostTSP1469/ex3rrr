import { useNavigate } from "react-router-dom";
import { useWishlistStore } from "../store/wishlistStore";
import { useAddToCartMutation, type Product } from "../shared/api/storeApi";
import { imageUrl } from "../shared/api/imageUrl";
import { getDiscountPercent, getProductRating, getReviewCount } from "../shared/productMetrics";
import { CartIcon, EyeIcon, HeartIcon, TrashIcon } from "./Icons";
import StarRating from "./StarRating";

interface ProductCardProps {
  product: Product;
  showTrash?: boolean;
}

export default function ProductCard({ product, showTrash = false }: ProductCardProps) {
  const navigate = useNavigate();
  const toggleWishlist = useWishlistStore((state) => state.toggle);
  const removeFromWishlist = useWishlistStore((state) => state.remove);
  const inWishlist = useWishlistStore((state) =>
    state.items.some((item) => item.id === product.id),
  );
  const [addToCart, { isLoading }] = useAddToCartMutation();

  const discountPercent = getDiscountPercent(product);
  const rating = getProductRating(product);
  const reviews = getReviewCount(product);

  function openProduct() {
    navigate(`/products/${product.id}`);
  }

  function handleWishlist() {
    if (showTrash) {
      removeFromWishlist(product.id);
    } else {
      toggleWishlist(product);
    }
  }

  return (
    <article className={showTrash ? "product-card show-cart" : "product-card"}>
      <div className="product-image">
        {discountPercent > 0 ? <span className="badge">-{discountPercent}%</span> : null}

        <img src={imageUrl(product.image)} alt={product.productName} onClick={openProduct} />

        <div className="card-icons">
          <button
            type="button"
            className={inWishlist && !showTrash ? "active" : ""}
            onClick={handleWishlist}
            aria-label={showTrash ? "Remove from wishlist" : "Add to wishlist"}
          >
            {showTrash ? <TrashIcon /> : <HeartIcon />}
          </button>
          <button type="button" onClick={openProduct} aria-label="View product">
            <EyeIcon />
          </button>
        </div>

        <button
          className="card-cart"
          type="button"
          onClick={() => addToCart(product.id)}
          disabled={isLoading}
        >
          <CartIcon />
          {isLoading ? "Adding..." : "Add To Cart"}
        </button>
      </div>

      <div className="product-info">
        <button type="button" className="product-name" onClick={openProduct}>
          {product.productName}
        </button>
        <div className="price-row">
          {product.hasDiscount ? (
            <>
              <span>${product.discountPrice}</span>
              <del>${product.price}</del>
            </>
          ) : (
            <span>${product.price}</span>
          )}
        </div>
        <StarRating rating={rating} reviews={reviews} />
      </div>
    </article>
  );
}
