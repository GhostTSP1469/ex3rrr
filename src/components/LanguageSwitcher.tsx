import { useEffect, useRef, useState } from "react";
import { useLangStore, type Lang } from "../store/langStore";
import { languageNames } from "../features/i18n/translations";
import { Button } from "./ui/button";

const langs: Lang[] = ["ru", "en", "ja"];
const codes: Record<Lang, string> = { ru: "RU", en: "EN", ja: "JA" };

function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 12 5 5 9-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Мини-модалка-«селект» с тремя языками в стиле shadcn (popover).
export default function LanguageSwitcher() {
  const current = useLangStore((state) => state.lang);
  const setLang = useLangStore((state) => state.setLang);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  function choose(lang: Lang) {
    setLang(lang);
    setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="icon"
        size="sm"
        className="gap-1.5 rounded-full"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <GlobeIcon />
        {codes[current]}
      </Button>

      {open ? (
        <div
          className="absolute right-0 z-50 mt-2 w-44 origin-top-right overflow-hidden rounded-lg border border-(--border) bg-(--popover) p-1 shadow-2xl"
          role="menu"
        >
          {langs.map((lang) => (
            <button
              key={lang}
              type="button"
              role="menuitemradio"
              aria-checked={current === lang}
              onClick={() => choose(lang)}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-(--text) transition-colors hover:bg-(--accent) ${
                current === lang ? "font-semibold text-(--primary)" : ""
              }`}
            >
              {languageNames[lang]}
              {current === lang ? <CheckIcon /> : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
