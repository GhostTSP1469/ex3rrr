const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function imageUrl(file: string | null | undefined) {
  if (!file) return "/mockup/cart-logo.png";
  return `${API_BASE_URL}/images/${file}`;
}
