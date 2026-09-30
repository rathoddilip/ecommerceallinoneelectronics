import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Rating({
  value,
  count,
  size = "sm",
  showCount = true,
}: {
  value: number;
  count?: number;
  size?: "xs" | "sm" | "md";
  showCount?: boolean;
}) {
  const iconSize = size === "xs" ? 12 : size === "sm" ? 14 : 16;
  return (
    <div className="inline-flex items-center gap-1.5">
      <span className="inline-flex items-center gap-0.5 rounded bg-success-600 px-1.5 py-0.5 text-white text-xs font-semibold">
        {value.toFixed(1)}
        <Star size={iconSize - 2} className="fill-white" />
      </span>
      {showCount && count !== undefined && (
        <span className={cn("text-foreground/50", size === "xs" ? "text-xs" : "text-sm")}>
          ({count.toLocaleString("en-IN")})
        </span>
      )}
    </div>
  );
}
