"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/types";
import { apiFetch } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import Button from "@/components/ui/Button";

export default function WishlistPage() {
  const [items, setItems] = useState<Product[] | null>(null);

  useEffect(() => {
    apiFetch<{ products: Product[] }>("/api/wishlist")
      .then((data) => setItems(data.products))
      .catch(() => setItems([]));
  }, []);

  if (items === null) {
    return <div className="py-16 text-center text-foreground/40">Loading…</div>;
  }

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
