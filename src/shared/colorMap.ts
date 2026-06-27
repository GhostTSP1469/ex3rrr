// Сопоставление названий цветов с реальными hex (en + ru).
const NAMED: Record<string, string> = {
  black: "#111111",
  white: "#ffffff",
  red: "#e23b3b",
  green: "#22c55e",
  blue: "#3b82f6",
  yellow: "#facc15",
  orange: "#f97316",
  purple: "#a855f7",
  pink: "#ec4899",
  gray: "#9ca3af",
  grey: "#9ca3af",
  brown: "#92400e",
  silver: "#cbd5e1",
  gold: "#d4af37",
  cyan: "#06b6d4",
  magenta: "#d946ef",
  navy: "#1e3a8a",
  teal: "#14b8a6",
  lime: "#84cc16",
  maroon: "#7f1d1d",
  beige: "#e8d8b0",
  violet: "#8b5cf6",
  indigo: "#6366f1",
  coral: "#fb7185",
  "чёрный": "#111111",
  "черный": "#111111",
  "белый": "#ffffff",
  "красный": "#e23b3b",
  "зелёный": "#22c55e",
  "зеленый": "#22c55e",
  "синий": "#3b82f6",
  "голубой": "#38bdf8",
  "жёлтый": "#facc15",
  "желтый": "#facc15",
  "оранжевый": "#f97316",
  "фиолетовый": "#a855f7",
  "розовый": "#ec4899",
  "серый": "#9ca3af",
  "коричневый": "#92400e",
  "золотой": "#d4af37",
  "серебряный": "#cbd5e1",
};

export interface ResolvedColor {
  known: boolean;
  hex: string;
  // если цвет не распознан — показываем букву из названия
  letter: string;
}

export function resolveColor(name: string): ResolvedColor {
  const key = (name ?? "").trim().toLowerCase();
  if (key && NAMED[key]) {
    return { known: true, hex: NAMED[key], letter: "" };
  }
  // составные названия вроде "dark blue" — ищем известное слово внутри
  const part = Object.keys(NAMED).find((word) => key.includes(word));
  if (part) {
    return { known: true, hex: NAMED[part], letter: "" };
  }
  return { known: false, hex: "#e5e7eb", letter: (name ?? "?").trim().charAt(0).toUpperCase() || "?" };
}
