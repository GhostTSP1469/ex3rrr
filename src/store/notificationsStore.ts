import { create } from "zustand";

export type NotifType = "add" | "edit" | "delete" | "info";

export interface Notif {
  id: number;
  type: NotifType;
  message: string;
  productId?: number;
  time: number;
}

export interface Highlight {
  id: number;
  type: "add" | "edit";
}

const KEY = "admin-notifs";

function read(): Notif[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Notif[]) : [];
  } catch {
    return [];
  }
}

function save(items: Notif[]) {
  localStorage.setItem(KEY, JSON.stringify(items.slice(0, 50)));
}

interface NotifState {
  items: Notif[];
  highlight: Highlight | null;
  push: (type: NotifType, message: string, productId?: number) => void;
  clear: () => void;
  setHighlight: (highlight: Highlight | null) => void;
}

export const useNotifStore = create<NotifState>((set, get) => ({
  items: read(),
  highlight: null,
  push: (type, message, productId) => {
    const items = [
      { id: Date.now() + Math.random(), type, message, productId, time: Date.now() },
      ...get().items,
    ].slice(0, 50);
    save(items);
    set({ items });
  },
  clear: () => {
    save([]);
    set({ items: [] });
  },
  setHighlight: (highlight) => set({ highlight }),
}));
