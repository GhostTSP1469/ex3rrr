interface BrandLogoProps {
  className?: string;
}

// Лого: SVG-иконка тележки + текст «fastcard». Цвет текста и иконки наследуются от родителя.
export default function BrandLogo({ className = "" }: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 64 64"
        className="h-8 w-8 shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M12 16H18L22 36H42L46 24H24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="24" cy="44" r="4" fill="currentColor" />
        <circle cx="40" cy="44" r="4" fill="currentColor" />
        <path d="M24 24H38" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className="text-xl font-extrabold tracking-tight">fastcard</span>
    </span>
  );
}
