interface ShopNowCtaProps {
  label: string;
}

// CTA с анимацией подчёркивания и выезжающей стрелкой. Цвет наследуется (currentColor),
// поэтому хорошо виден и на светлом, и на тёмном фоне.
export default function ShopNowCta({ label }: ShopNowCtaProps) {
  return (
    <span className="cta">
      <span className="hover-underline-animation">{label}</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="10" viewBox="0 0 46 16" aria-hidden="true">
        <path
          d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z"
          transform="translate(30)"
        />
      </svg>
    </span>
  );
}
