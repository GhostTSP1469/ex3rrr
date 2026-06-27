import type { Product, ProductDetail } from "./api/storeApi";

export function getDiscountPercent(product: Product) {
  if (!product.hasDiscount || product.price <= 0) return 0;
  return Math.max(0, Math.round(((product.price - product.discountPrice) / product.price) * 100));
}

export function getProductPrice(product: Product) {
  return product.hasDiscount ? product.discountPrice : product.price;
}

// В API нет рейтинга, поэтому считаем его детерминированно по id (3.5–5 с шагом 0.5),
// чтобы у одного товара он не менялся между рендерами.
function ratingFromId(id: number, hasDiscount: boolean) {
  const base = 3.5 + (id % 4) * 0.5;
  return Math.min(5, hasDiscount ? base + 0.5 : base);
}

export function getProductRating(product: Product) {
  return ratingFromId(product.id, product.hasDiscount);
}

export function getReviewCount(product: Product) {
  return 35 + ((product.id * 17) % 291);
}

export function getDetailRating(product: ProductDetail) {
  return ratingFromId(product.id, product.hasDiscount);
}

export function getDetailReviewCount(product: ProductDetail) {
  return 45 + ((product.id * 13) % 240);
}

export function getArrivalDate(product: Product, index: number) {
  const date = new Date();
  const offset = index + (product.id % 4);
  date.setDate(date.getDate() - offset);
  return date;
}

export function formatArrivalDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function getSizeOptions(product: ProductDetail) {
  const baseSizes = ["XS", "S", "M", "L", "XL"];

  if (!product.size) {
    return baseSizes;
  }

  const fromApi = product.size
    .split(/[,\s/|]+/)
    .map((size) => size.trim())
    .filter(Boolean);

  const sizes = fromApi.length > 0 ? fromApi : [product.size];

  return [...new Set([...sizes, ...baseSizes])].slice(0, 7);
}
