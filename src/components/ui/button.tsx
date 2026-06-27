import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

// shadcn-style кнопка. Цвета берём из CSS-переменных, поэтому работает и в тёмной теме.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring) focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-(--primary) text-white shadow-[0_8px_20px_rgba(219,68,68,0.28)] hover:opacity-90 active:scale-[0.98]",
        outline: "border border-(--border) bg-(--surface) text-(--text) hover:border-(--primary) hover:text-(--primary)",
        ghost: "text-(--text) hover:bg-(--accent)",
        icon: "border border-(--border) bg-(--surface) text-(--text) hover:border-(--primary)",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-3",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
