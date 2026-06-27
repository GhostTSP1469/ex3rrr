import { useLangStore } from "../../store/langStore";
import { translations } from "./translations";

// t("nav.home") -> строка на текущем языке (с откатом на английский).
export function useT() {
  const lang = useLangStore((state) => state.lang);
  return (key: string) => translations[lang][key] ?? translations.en[key] ?? key;
}
