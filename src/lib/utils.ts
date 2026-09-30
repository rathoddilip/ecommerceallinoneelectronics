import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function generateOrderNo(): string {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `AOE${n}`;
}

export function generateJobNo(): string {
  const n = Math.floor(10000 + Math.random() * 90000);
  return `SVC${n}`;
}

export function generateOtp(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}
