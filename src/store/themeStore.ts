import { create } from "zustand";

export type ThemeMode = "light" | "dark";

// Класс на <html> уже выставлен инлайн-скриптом до рендера, отсюда и берём старт.
function initialMode(): ThemeMode {
  if (typeof document !== "undefined" && document.documentElement.classList.contains("dark")) {
    return "dark";
  }
  return "light";
}

interface ThemeState {
  mode: ThemeMode;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: initialMode(),
  toggle: () => {
    const mode: ThemeMode = get().mode === "light" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", mode === "dark");
    localStorage.setItem("theme", mode);
    set({ mode });
  },
}));
