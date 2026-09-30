"use client";

import { Select } from "@/components/ui/Input";

export type SortOption = "relevance" | "price-asc" | "price-desc" | "newest" | "popularity" | "rating" | "discount";

const options: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "popularity", label: "Popularity" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Customer Rating" },
  { value: "discount", label: "Discount" },
];

export default function SortDropdown({
  value,
  onChange,
}: {
  value: SortOption;
  onChange: (value: SortOption) => void;
}) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-sm text-foreground/55 hidden sm:inline">Sort by</span>
      <Select value={value} onChange={(e) => onChange(e.target.value as SortOption)} className="w-auto min-w-[9.5rem]">
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
