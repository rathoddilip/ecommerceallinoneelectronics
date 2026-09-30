"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { departments } from "@/lib/data/categories";
import type { Product } from "@/lib/types";
import { apiFetch } from "@/lib/api";
import ProductGrid from "@/components/shop/ProductGrid";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

function SearchContent() {
  const router = useRouter();
  const initialQ = useSearchParams().get("q") ?? "";
  const [query, setQuery] = useState(initialQ);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    apiFetch<Product[]>("/api/products").then(setProducts).catch(() => {});
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) =>
      [p.name, p.brand, p.categoryLabel, p.shortDescription, ...p.tags]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [products, query]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.replace(`/search?q=${encodeURIComponent(query.trim())}`, { scroll: false });
  }

  return (
    <div className="container-page py-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />

      <form onSubmit={handleSubmit} className="mt-4 max-w-xl">
        <div className="relative">
          <SearchIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/35" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products, brands and categories"
            className="w-full h-12 rounded-full border border-border-subtle bg-surface pl-11 pr-4 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
          />
        </div>
      </form>

      {query.trim() ? (
        <>
          <p className="text-sm text-foreground/50 mt-5 mb-4">
            {results.length} result{results.length !== 1 && "s"} for &quot;{query}&quot;
          </p>
          <ProductGrid products={results} />
        </>
      ) : (
        <div className="mt-10">
          <p className="text-sm font-semibold mb-3">Popular categories</p>
          <div className="flex flex-wrap gap-2">
            {departments.map((d) => (
              <a
                key={d.slug}
                href={`/products?dept=${d.slug}`}
                className="rounded-full border border-border-subtle px-4 py-2 text-sm hover:bg-surface-muted"
              >
                {d.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container-page py-20 text-center text-foreground/40">Loading…</div>}>
      <SearchContent />
    </Suspense>
  );
}
