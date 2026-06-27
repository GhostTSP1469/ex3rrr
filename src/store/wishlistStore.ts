import { create } from "zustand";
import type { Product } from "../shared/api/storeApi";

const STORAGE_KEY = "wishlist";

function read(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  } catch {
    return [];
  }
}

function save(items: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

interface WishlistState {
  items: Product[];
  toggle: (product: Product) => void;
  remove: (id: number) => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: read(),
  toggle: (product) => {
    const exists = get().items.some((item) => item.id === product.id);
    const items = exists
      ? get().items.filter((item) => item.id !== product.id)
      : [...get().items, product];
    save(items);
    set({ items });
  },
  remove: (id) => {
    const items = get().items.filter((item) => item.id !== id);
    save(items);
    set({ items });
  },
}));
