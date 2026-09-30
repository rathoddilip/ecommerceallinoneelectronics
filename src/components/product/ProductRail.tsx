import type { Product } from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";

export default function ProductRail({ products }: { products: Product[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin snap-x snap-mandatory sm:grid sm:grid-cols-2 sm:overflow-visible md:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          className="w-[62vw] shrink-0 snap-start sm:w-auto"
        />
      ))}
    </div>
  );
}
