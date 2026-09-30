"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  size = "md",
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
}) {
  const btnSize = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  return (
    <div className="inline-flex items-center rounded-full border border-border-subtle bg-surface">
      <button
        type="button"
        aria-label="Decrease quantity"
        className={cn("flex items-center justify-center rounded-full text-foreground/70 hover:bg-surface-muted disabled:opacity-30", btnSize)}
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus size={14} />
      </button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        className={cn("flex items-center justify-center rounded-full text-foreground/70 hover:bg-surface-muted disabled:opacity-30", btnSize)}
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
