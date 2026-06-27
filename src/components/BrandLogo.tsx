interface BrandLogoProps {
  className?: string;
}

// Лого: картинка корзины + текст «fastcard». Цвет текста наследуется от родителя.
export default function BrandLogo({ className = "" }: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img src="/mockup/cart-logo.png" alt="fastcard logo" className="h-8 w-auto" />
      <span className="text-xl font-extrabold tracking-tight">fastcard</span>
    </span>
  );
}
