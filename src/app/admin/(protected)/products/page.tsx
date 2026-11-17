"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { formatINR } from "@/lib/format";
import type { Product } from "@/lib/types";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  function load() {
    apiFetch<Product[]>("/api/admin/products")
      .then(setProducts)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => [p.name, p.brand, p.slug].join(" ").toLowerCase().includes(q));
  }, [products, query]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await apiFetch(`/api/admin/products/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Products</h1>
          <p className="text-foreground/55 text-sm mt-1">{products.length} products in catalog</p>
        </div>
        <Button href="/admin/products/new">
          <Plus size={16} /> Add Product
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/35" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products…" className="pl-9" />
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle text-left text-xs font-semibold uppercase tracking-wide text-foreground/45">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-foreground/40">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-foreground/40">No products found.</td></tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="hover:bg-surface-muted/50">
                  <td className="px-4 py-3">
                    <p className="font-medium line-clamp-1">{p.name}</p>
                    <p className="text-xs text-foreground/45">{p.brand}</p>
                  </td>
                  <td className="px-4 py-3 capitalize text-foreground/65">{p.department.replace("-", " ")}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{formatINR(p.price)}</p>
                    <p className="text-xs text-foreground/40 line-through">{formatINR(p.mrp)}</p>
                  </td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-xs font-semibold",
                        p.stock > 0 ? "bg-success-500/10 text-success-600" : "bg-danger-500/10 text-danger-600"
                      )}
                    >
                      {p.stock > 0 ? "Active" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground/50 hover:bg-surface-muted hover:text-foreground"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id, p.name)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-foreground/50 hover:bg-danger-500/10 hover:text-danger-500"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
