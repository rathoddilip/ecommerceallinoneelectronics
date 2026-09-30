"use client";

import { X } from "lucide-react";
import { categoriesByDepartment, departments } from "@/lib/data/categories";
import type { Department } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface ShopFilters {
  dept: Department | "all";
  category: string | "all";
  brands: string[];
  maxPrice: number;
  minRating: number;
  installationFree: boolean;
}

const PRICE_CEILING = 50000;

export default function FilterSidebar({
  filters,
  setFilters,
  availableBrands,
  onClose,
}: {
  filters: ShopFilters;
  setFilters: (updater: (f: ShopFilters) => ShopFilters) => void;
  availableBrands: string[];
  onClose?: () => void;
}) {
  const categories = filters.dept === "all" ? [] : categoriesByDepartment(filters.dept as Department);

  return (
    <div className="space-y-6">
      {onClose && (
        <div className="flex items-center justify-between lg:hidden">
          <h3 className="font-display font-bold">Filters</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-muted">
            <X size={18} />
          </button>
        </div>
      )}

      <div>
        <h4 className="text-sm font-semibold mb-2.5">Department</h4>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="dept"
              checked={filters.dept === "all"}
              onChange={() => setFilters((f) => ({ ...f, dept: "all", category: "all" }))}
              className="accent-brand-500"
            />
            All Departments
          </label>
          {departments.map((d) => (
            <label key={d.slug} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="dept"
                checked={filters.dept === d.slug}
                onChange={() => setFilters((f) => ({ ...f, dept: d.slug, category: "all" }))}
                className="accent-brand-500"
              />
              {d.name}
            </label>
          ))}
        </div>
      </div>

      {categories.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-2.5">Category</h4>
          <div className="space-y-1.5 max-h-56 overflow-y-auto scrollbar-thin pr-1">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={filters.category === "all"}
                onChange={() => setFilters((f) => ({ ...f, category: "all" }))}
                className="accent-brand-500"
              />
              All Categories
            </label>
            {categories.map((c) => (
              <label key={c.slug} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="category"
                  checked={filters.category === c.slug}
                  onChange={() => setFilters((f) => ({ ...f, category: c.slug }))}
                  className="accent-brand-500"
                />
                {c.name}
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <h4 className="text-sm font-semibold mb-2.5">Brand</h4>
        <div className="space-y-1.5 max-h-40 overflow-y-auto scrollbar-thin pr-1">
          {availableBrands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={filters.brands.includes(brand)}
                onChange={() =>
                  setFilters((f) => ({
                    ...f,
                    brands: f.brands.includes(brand)
                      ? f.brands.filter((b) => b !== brand)
                      : [...f.brands, brand],
                  }))
                }
                className="accent-brand-500"
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2.5">Max Price: ₹{filters.maxPrice.toLocaleString("en-IN")}</h4>
        <input
          type="range"
          min={500}
          max={PRICE_CEILING}
          step={500}
          value={filters.maxPrice}
          onChange={(e) => setFilters((f) => ({ ...f, maxPrice: Number(e.target.value) }))}
          className="w-full accent-brand-500"
        />
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2.5">Minimum Rating</h4>
        <div className="flex gap-2">
          {[0, 3, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setFilters((f) => ({ ...f, minRating: r }))}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                filters.minRating === r
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-border-subtle text-foreground/60 hover:bg-surface-muted"
              )}
            >
              {r === 0 ? "Any" : `${r}+`}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={filters.installationFree}
          onChange={() => setFilters((f) => ({ ...f, installationFree: !f.installationFree }))}
          className="accent-brand-500"
        />
        Free installation only
      </label>

      <button
        onClick={() =>
          setFilters(() => ({
            dept: "all",
            category: "all",
            brands: [],
            maxPrice: PRICE_CEILING,
            minRating: 0,
            installationFree: false,
          }))
        }
        className="text-sm font-medium text-brand-600 hover:text-brand-700"
      >
        Clear all filters
      </button>
    </div>
  );
}

export { PRICE_CEILING };
