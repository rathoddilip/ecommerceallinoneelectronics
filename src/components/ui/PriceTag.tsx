import { discountPercent, formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function PriceTag({
  price,
  mrp,
  size = "md",
  className,
}: {
  price: number;
  mrp: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const pct = discountPercent(mrp, price);
  const priceClass =
    size === "lg" ? "text-2xl md:text-3xl" : size === "sm" ? "text-base" : "text-xl";

  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className={cn("font-bold tracking-tight", priceClass)}>{formatINR(price)}</span>
      {pct > 0 && (
        <>
          <span className="text-foreground/40 line-through text-sm">{formatINR(mrp)}</span>
          <span className="text-success-600 text-sm font-semibold">{pct}% off</span>
        </>
      )}
    </div>
  );
}
