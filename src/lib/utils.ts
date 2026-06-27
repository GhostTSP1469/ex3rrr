import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Склейка классов в стиле shadcn: clsx + дедуп конфликтов tailwind-merge.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
