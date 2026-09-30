import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "brand" | "accent" | "success" | "danger" | "neutral" | "electrical" | "electronics" | "water";

const toneClasses: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-700",
  accent: "bg-accent-400/15 text-accent-600",
  success: "bg-success-500/10 text-success-600",
  danger: "bg-danger-500/10 text-danger-600",
  neutral: "bg-surface-muted text-foreground/70",
  electrical: "bg-electrical-500/10 text-electrical-600",
  electronics: "bg-electronics-500/10 text-electronics-600",
  water: "bg-water-500/10 text-water-600",
};

export default function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
