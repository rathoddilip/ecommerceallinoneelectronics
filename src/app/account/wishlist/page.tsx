"use client";

import { Heart } from "lucide-react";
import { useAccountStore } from "@/lib/store/account";
import { getProductById } from "@/lib/data/products";
import ProductCard from "@/components/product/ProductCard";
import Button from "@/components/ui/Button";

export default function WishlistPage() {
  const wishlist = useAccountStore((s) => s.wishlist);
  const items = wishlist.map((id) => getProductById(id)).filter((p): p is NonNullable<typeof p> => !!p);

  if (items.length === 0) {
    return (
      <div className="card-surface flex flex-col items-center gap-3 py-16 text-center">
        <Heart size={44} className="text-foreground/20" />
        <p className="font-medium">Your wishlist is empty</p>
        <p className="text-sm text-foreground/50">Tap the heart icon on any product to save it here.</p>
        <Button href="/products" className="mt-2">Explore Products</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-xl font-bold">Wishlist ({items.length})</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
