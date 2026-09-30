"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";
import { categories, departments } from "@/lib/data/categories";
import type { Department, Product } from "@/lib/types";
import FilterSidebar, { PRICE_CEILING, type ShopFilters } from "@/components/shop/FilterSidebar";
import SortDropdown, { type SortOption } from "@/components/shop/SortDropdown";
import ProductGrid from "@/components/shop/ProductGrid";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { cn } from "@/lib/utils";

function isDepartment(value: string | null): value is Department {
  return value === "electrical" || value === "electronics" || value === "water-purifiers";
}

export default function ShopClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialDept = searchParams.get("dept");
  const initialCategory = searchParams.get("category");

  const [filters, setFilters] = useState<ShopFilters>({
    dept: isDepartment(initialDept) ? initialDept : "all",
    category: initialCategory ?? "all",
    brands: [],
    maxPrice: PRICE_CEILING,
    minRating: 0,
    installationFree: false,
  });
  const [sort, setSort] = useState<SortOption>("relevance");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.dept !== "all") params.set("dept", filters.dept);
    if (filters.category !== "all") params.set("category", filters.category);
    const qs = params.toString();
    router.replace(qs ? `/products?${qs}` : "/products", { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.dept, filters.category]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (filters.dept !== "all" && p.department !== filters.dept) return false;
      if (filters.category !== "all" && p.category !== filters.category) return false;
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false;
      if (p.price > filters.maxPrice) return false;
      if (p.rating < filters.minRating) return false;
      if (filters.installationFree && p.installation !== "free") return false;
      return true;
    });

    switch (sort) {
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case "popularity":
        list = [...list].sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "discount":
        list = [...list].sort(
          (a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp
        );
        break;
      case "newest":
        list = [...list].reverse();
        break;
      default:
        break;
    }
    return list;
  }, [products, filters, sort]);

  const deptMeta = filters.dept !== "all" ? departments.find((d) => d.slug === filters.dept) : null;
  const categoryMeta = filters.category !== "all" ? categories.find((c) => c.slug === filters.category) : null;

  const availableBrands = useMemo(() => {
    const base = filters.dept === "all" ? products : products.filter((p) => p.department === filters.dept);
    return Array.from(new Set(base.map((p) => p.brand))).sort();
  }, [products, filters.dept]);

  return (
    <div className="container-page py-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/products" },
          ...(deptMeta ? [{ label: deptMeta.name, href: `/products?dept=${deptMeta.slug}` }] : []),
          ...(categoryMeta ? [{ label: categoryMeta.name }] : []),
        ]}
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          {categoryMeta?.name ?? deptMeta?.name ?? "All Products"}
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden inline-flex items-center gap-1.5 rounded-full border border-border-subtle px-3.5 py-2 text-sm font-medium"
          >
            <SlidersHorizontal size={15} /> Filters
          </button>
          <SortDropdown value={sort} onChange={setSort} />
        </div>
      </div>
      <p className="text-sm text-foreground/50 mt-1 mb-6">{filtered.length} products found</p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 card-surface p-5">
            <FilterSidebar filters={filters} setFilters={setFilters} availableBrands={availableBrands} />
          </div>
        </aside>

        <div
          className={cn(
            "fixed inset-0 z-[70] lg:hidden transition-opacity",
            mobileFiltersOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div
            className={cn(
              "absolute right-0 top-0 h-full w-[85%] max-w-xs overflow-y-auto bg-surface p-5 transition-transform duration-300",
              mobileFiltersOpen ? "translate-x-0" : "translate-x-full"
            )}
          >
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              availableBrands={availableBrands}
              onClose={() => setMobileFiltersOpen(false)}
            />
          </div>
        </div>

        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}
