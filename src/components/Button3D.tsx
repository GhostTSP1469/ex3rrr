import type { ReactNode } from "react";

interface Button3DProps {
  onClick?: () => void;
  children: ReactNode;
  ariaLabel?: string;
}

// 3D-кнопка (перевод присланного CSS в Tailwind): три слоя + эффект нажатия через group-active.
export default function Button3D({ onClick, children, ariaLabel }: Button3DProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="group relative min-h-[2.6em] min-w-[2.6em] cursor-pointer rounded-[16px] border-0 bg-transparent p-0"
    >
      <span className="relative z-[2] flex items-center justify-center rounded-[16px] bg-gradient-to-br from-[#6a11cb] to-[#2575fc] px-3 py-2 text-white [text-shadow:0_-1px_rgba(0,0,0,0.25)] transition-transform duration-300 group-active:translate-y-0.5 group-active:rounded-[10px]">
        {children}
      </span>
      <span className="pointer-events-none absolute bottom-1 left-1 z-[1] h-[calc(100%-10px)] w-[calc(100%-8px)] rounded-[16px] bg-gradient-to-br from-[#2575fc] to-[#6a11cb] pt-1.5 shadow-[0px_2px_3px_0px_rgba(0,0,0,0.5)] transition-all duration-200 group-active:rounded-[10px] group-active:pt-0" />
      <span className="pointer-events-none absolute left-0 top-1 z-0 h-[calc(100%-4px)] w-full rounded-[16px] bg-black/15 shadow-[0_1px_1px_0_rgba(255,255,255,0.75),inset_0_2px_2px_rgba(0,0,0,0.25)] transition-all duration-200 group-active:rounded-[10px]" />
    </button>
  );
}
