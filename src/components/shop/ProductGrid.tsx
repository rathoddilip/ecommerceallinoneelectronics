import { PackageSearch } from "lucide-react";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";
import Button from "@/components/ui/Button";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border-subtle py-20 text-center">
        <PackageSearch size={44} className="text-foreground/20" />
        <p className="font-medium">No products match your filters</p>
        <p className="text-sm text-foreground/50 max-w-xs">
          Try adjusting or clearing some filters to see more results.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export function EmptyStateAction({ href, label }: { href: string; label: string }) {
  return (
    <Button href={href} variant="outline" className="mt-2">
      {label}
    </Button>
  );
}
