import { create } from "zustand";

export type Lang = "ru" | "en" | "ja";

function initialLang(): Lang {
  const saved = localStorage.getItem("lang");
  if (saved === "ru" || saved === "en" || saved === "ja") return saved;
  return "en";
}

interface LangState {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useLangStore = create<LangState>((set) => ({
  lang: initialLang(),
  setLang: (lang) => {
    localStorage.setItem("lang", lang);
    set({ lang });
  },
}));
