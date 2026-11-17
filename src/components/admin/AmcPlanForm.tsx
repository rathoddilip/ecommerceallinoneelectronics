"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Input, Field, Select, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import type { AmcPlan, Department } from "@/lib/types";

export interface AmcPlanFormValues {
  name: string;
  applicableCategories: Department[];
  durationMonths: number;
  visits: number;
  filtersIncluded: boolean;
  breakdownVisitsIncluded: boolean;
  price: number;
  highlight: boolean;
  features: string;
}

export function emptyAmcPlanForm(): AmcPlanFormValues {
  return {
    name: "",
    applicableCategories: [],
    durationMonths: 12,
    visits: 2,
    filtersIncluded: true,
    breakdownVisitsIncluded: false,
    price: 999,
    highlight: false,
    features: "",
  };
}

export function amcPlanToForm(p: AmcPlan): AmcPlanFormValues {
  return {
    name: p.name,
    applicableCategories: p.applicableCategories,
    durationMonths: p.durationMonths,
    visits: p.visits,
    filtersIncluded: p.filtersIncluded,
    breakdownVisitsIncluded: p.breakdownVisitsIncluded,
    price: p.price,
    highlight: p.highlight ?? false,
    features: p.features.join("\n"),
  };
}

const departments: { value: Department; label: string }[] = [
  { value: "electrical", label: "Electrical" },
  { value: "electronics", label: "Electronics" },
  { value: "water-purifiers", label: "Water Purifiers" },
];

export default function AmcPlanForm({ initial, planId }: { initial: AmcPlanFormValues; planId?: string }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof AmcPlanFormValues>(key: K, value: AmcPlanFormValues[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleCategory(dep: Department) {
    set(
      "applicableCategories",
      form.applicableCategories.includes(dep)
        ? form.applicableCategories.filter((d) => d !== dep)
        : [...form.applicableCategories, dep]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const body = {
        name: form.name,
        applicableCategories: form.applicableCategories,
        durationMonths: form.durationMonths,
        visits: form.visits,
        filtersIncluded: form.filtersIncluded,
        breakdownVisitsIncluded: form.breakdownVisitsIncluded,
        price: form.price,
        highlight: form.highlight,
        features: form.features.split("\n").map((f) => f.trim()).filter(Boolean),
      };
      if (planId) {
        await apiFetch(`/api/admin/amc-plans/${planId}`, { method: "PATCH", body: JSON.stringify(body) });
      } else {
        await apiFetch("/api/admin/amc-plans", { method: "POST", body: JSON.stringify(body) });
      }
      router.push("/admin/amc-plans");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card-surface p-5 space-y-4">
      {error && <p className="text-sm text-danger-600">{error}</p>}

      <Field label="Plan name">
        <Input value={form.name} onChange={(e) => set("name", e.target.value)} required />
      </Field>

      <Field label="Applicable categories">
        <div className="flex gap-4 flex-wrap">
          {departments.map((d) => (
            <label key={d.value} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.applicableCategories.includes(d.value)}
                onChange={() => toggleCategory(d.value)}
              />
              {d.label}
            </label>
          ))}
        </div>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Duration (months)">
          <Input type="number" min={1} value={form.durationMonths} onChange={(e) => set("durationMonths", Number(e.target.value))} required />
        </Field>
        <Field label="Visits included">
          <Input type="number" min={0} value={form.visits} onChange={(e) => set("visits", Number(e.target.value))} required />
        </Field>
        <Field label="Price (₹)">
          <Input type="number" min={0} value={form.price} onChange={(e) => set("price", Number(e.target.value))} required />
        </Field>
        <Field label="Highlight as popular?">
          <Select value={form.highlight ? "yes" : "no"} onChange={(e) => set("highlight", e.target.value === "yes")}>
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </Select>
        </Field>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.filtersIncluded} onChange={(e) => set("filtersIncluded", e.target.checked)} />
          Filters included
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.breakdownVisitsIncluded} onChange={(e) => set("breakdownVisitsIncluded", e.target.checked)} />
          Breakdown visits included
        </label>
      </div>

      <Field label="Features (one per line)">
        <Textarea rows={5} value={form.features} onChange={(e) => set("features", e.target.value)} />
      </Field>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/amc-plans")}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : planId ? "Save Changes" : "Create Plan"}
        </Button>
      </div>
    </form>
  );
}
