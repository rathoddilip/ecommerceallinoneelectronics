"use client";

import Link from "next/link";
import { Heart, Wrench } from "lucide-react";
import type { Product } from "@/lib/types";
import ProductVisual from "@/components/product/ProductVisual";
import PriceTag from "@/components/ui/PriceTag";
import Rating from "@/components/ui/Rating";
import Badge from "@/components/ui/Badge";
import { useAccountStore } from "@/lib/store/account";
import { useCartStore } from "@/lib/store/cart";
import { useUIStore } from "@/lib/store/ui";
import { cn } from "@/lib/utils";

export default function ProductCard({ product, className }: { product: Product; className?: string }) {
  const isWishlisted = useAccountStore((s) => s.wishlist.includes(product.id));
  const toggleWishlist = useAccountStore((s) => s.toggleWishlist);
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem({ productId: product.id, qty: 1, addInstallation: product.installation === "free" });
    openCart();
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border-subtle bg-surface transition-shadow hover:shadow-lg hover:shadow-black/5",
        className
      )}
    >
      <div className="relative p-3">
        <ProductVisual
          department={product.department}
          category={product.category}
          className="aspect-square w-full transition-transform duration-300 group-hover:scale-[1.03]"
          iconClassName="h-14 w-14 sm:h-16 sm:w-16"
        />
        <button
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-surface/90 shadow-sm backdrop-blur hover:bg-surface"
        >
          <Heart size={15} className={cn(isWishlisted ? "fill-danger-500 text-danger-500" : "text-foreground/50")} />
        </button>
        {product.tags.includes("deal") && (
          <Badge tone="danger" className="absolute left-4 top-4">
            Deal
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-4 pb-4">
        <span className="text-xs font-medium text-foreground/45">{product.brand}</span>
        <h3 className="text-sm font-semibold leading-snug line-clamp-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        <Rating value={product.rating} count={product.reviewCount} size="xs" />
        <PriceTag price={product.price} mrp={product.mrp} size="sm" />
        {product.installation === "free" && (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-success-600">
            <Wrench size={12} /> Free installation
          </span>
        )}
        <button
          onClick={handleAddToCart}
          className="mt-2 h-9 rounded-full border border-brand-500 text-sm font-semibold text-brand-600 transition-colors hover:bg-brand-500 hover:text-white"
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
