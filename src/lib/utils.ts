import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateOrderNo(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `AOE${n}`;
}

export function generateJobNo(): string {
  const n = Math.floor(10000 + Math.random() * 90000);
  return `SVC${n}`;
}
