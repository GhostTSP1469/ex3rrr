import { create } from "zustand";

// В API у корзины нет ни цвета, ни размера — выбор пользователя храним на клиенте.
const COLORS_KEY = "cartColors";
const SIZES_KEY = "cartSizes";

function read(key: string): Record<number, string> {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Record<number, string>) : {};
  } catch {
    return {};
  }
}

function save(key: string, value: Record<number, string>) {
  localStorage.setItem(key, JSON.stringify(value));
}

interface CartColorState {
  colors: Record<number, string>;
  sizes: Record<number, string>;
  setColor: (productId: number, color: string) => void;
  setSize: (productId: number, size: string) => void;
}

export const useCartColorStore = create<CartColorState>((set, get) => ({
  colors: read(COLORS_KEY),
  sizes: read(SIZES_KEY),
  setColor: (productId, color) => {
    const colors = { ...get().colors, [productId]: color };
    save(COLORS_KEY, colors);
    set({ colors });
  },
  setSize: (productId, size) => {
    const sizes = { ...get().sizes, [productId]: size };
    save(SIZES_KEY, sizes);
    set({ sizes });
  },
}));
