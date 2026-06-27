import { useThemeStore } from "../store/themeStore";
import { Button } from "./ui/button";

// Кнопка темы: в светлой — солнце, в тёмной — луна.
// Превращение солнце→луна сделано в CSS (.dark .theme-icon ...): rotate + маска-полумесяц.
export default function ThemeToggle() {
  const mode = useThemeStore((state) => state.mode);
  const toggle = useThemeStore((state) => state.toggle);

  return (
    <Button
      variant="icon"
      size="icon"
      className="theme-toggle rounded-full"
      onClick={toggle}
      aria-label={mode === "dark" ? "Включить светлую тему" : "Включить тёмную тему"}
    >
      <svg className="theme-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <mask id="moonMask">
          <rect x="0" y="0" width="24" height="24" fill="#fff" />
          <circle className="moon-cut" cx="22" cy="3" r="6" fill="#000" />
        </mask>
        <circle className="sun-core" cx="12" cy="12" r="5.4" fill="currentColor" mask="url(#moonMask)" />
        <g className="sun-rays" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <line x1="12" y1="1.4" x2="12" y2="3.6" />
          <line x1="12" y1="20.4" x2="12" y2="22.6" />
          <line x1="1.4" y1="12" x2="3.6" y2="12" />
          <line x1="20.4" y1="12" x2="22.6" y2="12" />
          <line x1="4.2" y1="4.2" x2="5.8" y2="5.8" />
          <line x1="18.2" y1="18.2" x2="19.8" y2="19.8" />
          <line x1="4.2" y1="19.8" x2="5.8" y2="18.2" />
          <line x1="18.2" y1="5.8" x2="19.8" y2="4.2" />
        </g>
      </svg>
    </Button>
  );
}
