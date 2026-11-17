"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Input";
import { apiFetch, ApiError } from "@/lib/api";
import type { Product } from "@/lib/types";

export interface ProductFormValues {
  name: string;
  slug: string;
  brand: string;
  department: string;
  category: string;
  categoryLabel: string;
  shortDescription: string;
  description: string;
  mrp: number;
  price: number;
  gstRate: number;
  stock: number;
  warrantyMonths: number;
  returnDays: number;
  isReturnable: boolean;
  installation: "none" | "free" | "paid";
  installationFee: number;
  amcEligible: boolean;
  whatsInTheBox: string[];
  attributes: { label: string; value: string }[];
  tags: string[];
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function emptyProductForm(): ProductFormValues {
  return {
    name: "",
    slug: "",
    brand: "",
    department: "electrical",
    category: "",
    categoryLabel: "",
    shortDescription: "",
    description: "",
    mrp: 0,
    price: 0,
    gstRate: 18,
    stock: 0,
    warrantyMonths: 12,
    returnDays: 7,
    isReturnable: true,
    installation: "none",
    installationFee: 0,
    amcEligible: false,
    whatsInTheBox: [],
    attributes: [],
    tags: [],
  };
}

export function productToForm(p: Product): ProductFormValues {
  return {
    name: p.name,
    slug: p.slug,
    brand: p.brand,
    department: p.department,
    category: p.category,
    categoryLabel: p.categoryLabel,
    shortDescription: p.shortDescription,
    description: p.description,
    mrp: p.mrp,
    price: p.price,
    gstRate: p.gstRate,
    stock: p.stock,
    warrantyMonths: p.warrantyMonths,
    returnDays: p.returnDays,
    isReturnable: p.isReturnable,
    installation: p.installation,
    installationFee: p.installationFee,
    amcEligible: p.amcEligible,
    whatsInTheBox: p.whatsInTheBox,
    attributes: p.attributes,
    tags: p.tags,
  };
}

export default function ProductForm({
  initial,
  productId,
}: {
  initial: ProductFormValues;
  productId?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(!!productId);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function update<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (productId) {
        await apiFetch(`/api/admin/products/${productId}`, { method: "PATCH", body: JSON.stringify(form) });
      } else {
        await apiFetch("/api/admin/products", { method: "POST", body: JSON.stringify(form) });
      }
      router.push("/admin/products");
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not save product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <p className="rounded-lg bg-danger-500/10 px-4 py-3 text-sm text-danger-600">{error}</p>}

      <div className="card-surface p-5 grid gap-4 sm:grid-cols-2">
        <Field label="Product Name" required>
          <Input
            required
            value={form.name}
            onChange={(e) => {
              update("name", e.target.value);
              if (!slugTouched) update("slug", slugify(e.target.value));
            }}
          />
        </Field>
        <Field label="Slug (URL)" required hint="Used in the product page URL">
          <Input
            required
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              update("slug", e.target.value);
            }}
          />
        </Field>
        <Field label="Brand" required>
          <Input required value={form.brand} onChange={(e) => update("brand", e.target.value)} />
        </Field>
        <Field label="Department" required>
          <Select value={form.department} onChange={(e) => update("department", e.target.value)}>
            <option value="electrical">Electrical</option>
            <option value="electronics">Electronics</option>
            <option value="water-purifiers">Water Purifiers</option>
          </Select>
        </Field>
        <Field label="Category (slug)" required hint="e.g. ro-purifiers, fans, tvs">
          <Input required value={form.category} onChange={(e) => update("category", e.target.value)} />
        </Field>
        <Field label="Category Label" required hint="Display name, e.g. RO Purifiers">
          <Input required value={form.categoryLabel} onChange={(e) => update("categoryLabel", e.target.value)} />
        </Field>
      </div>

      <div className="card-surface p-5 grid gap-4">
        <Field label="Short Description" required>
          <Input required value={form.shortDescription} onChange={(e) => update("shortDescription", e.target.value)} />
        </Field>
        <Field label="Full Description" required>
          <Textarea required rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} />
        </Field>
      </div>

      <div className="card-surface p-5 grid gap-4 sm:grid-cols-3">
        <Field label="MRP (₹)" required>
          <Input type="number" required min={0} value={form.mrp} onChange={(e) => update("mrp", Number(e.target.value))} />
        </Field>
        <Field label="Selling Price (₹)" required>
          <Input type="number" required min={0} value={form.price} onChange={(e) => update("price", Number(e.target.value))} />
        </Field>
        <Field label="GST Rate (%)" required>
          <Input type="number" required min={0} max={28} value={form.gstRate} onChange={(e) => update("gstRate", Number(e.target.value))} />
        </Field>
        <Field label="Stock Quantity" required>
          <Input type="number" required min={0} value={form.stock} onChange={(e) => update("stock", Number(e.target.value))} />
        </Field>
        <Field label="Warranty (months)">
          <Input type="number" min={0} value={form.warrantyMonths} onChange={(e) => update("warrantyMonths", Number(e.target.value))} />
        </Field>
        <Field label="Return Window (days)">
          <Input type="number" min={0} value={form.returnDays} onChange={(e) => update("returnDays", Number(e.target.value))} />
        </Field>
      </div>

      <div className="card-surface p-5 grid gap-4 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={form.isReturnable} onChange={(e) => update("isReturnable", e.target.checked)} className="accent-brand-500" />
          Returnable
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={form.amcEligible} onChange={(e) => update("amcEligible", e.target.checked)} className="accent-brand-500" />
          AMC Eligible
        </label>
        <Field label="Installation">
          <Select value={form.installation} onChange={(e) => update("installation", e.target.value as ProductFormValues["installation"])}>
            <option value="none">None</option>
            <option value="free">Free</option>
            <option value="paid">Paid</option>
          </Select>
        </Field>
        {form.installation === "paid" && (
          <Field label="Installation Fee (₹)">
            <Input type="number" min={0} value={form.installationFee} onChange={(e) => update("installationFee", Number(e.target.value))} />
          </Field>
        )}
      </div>

      <div className="card-surface p-5 space-y-3">
        <h3 className="font-semibold text-sm">Specifications</h3>
        {form.attributes.map((attr, i) => (
          <div key={i} className="flex gap-2">
            <Input
              placeholder="Label (e.g. Wattage)"
              value={attr.label}
              onChange={(e) => {
                const next = [...form.attributes];
                next[i] = { ...next[i], label: e.target.value };
                update("attributes", next);
              }}
            />
            <Input
              placeholder="Value (e.g. 9W)"
              value={attr.value}
              onChange={(e) => {
                const next = [...form.attributes];
                next[i] = { ...next[i], value: e.target.value };
                update("attributes", next);
              }}
            />
            <button
              type="button"
              onClick={() => update("attributes", form.attributes.filter((_, j) => j !== i))}
              className="shrink-0 p-2 text-foreground/40 hover:text-danger-500"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => update("attributes", [...form.attributes, { label: "", value: "" }])}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600"
        >
          <Plus size={14} /> Add specification
        </button>
      </div>

      <div className="card-surface p-5 grid gap-4 sm:grid-cols-2">
        <Field label="What's in the Box" hint="One item per line">
          <Textarea
            rows={3}
            value={form.whatsInTheBox.join("\n")}
            onChange={(e) => update("whatsInTheBox", e.target.value.split("\n").filter(Boolean))}
          />
        </Field>
        <Field label="Tags" hint="Comma separated, e.g. bestseller, deal">
          <Input
            value={form.tags.join(", ")}
            onChange={(e) => update("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
          />
        </Field>
      </div>

      <div className="flex gap-2">
        <Button type="submit" size="lg" disabled={saving}>
          {saving ? "Saving…" : productId ? "Save Changes" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
