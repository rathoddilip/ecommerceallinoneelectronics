"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { formatINR } from "@/lib/format";
import type { AmcPlan } from "@/lib/types";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

export default function AdminAmcPlansPage() {
  const [plans, setPlans] = useState<AmcPlan[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    apiFetch<AmcPlan[]>("/api/admin/amc-plans").then(setPlans).finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this AMC plan? This cannot be undone.")) return;
    await apiFetch(`/api/admin/amc-plans/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">AMC Plans</h1>
          <p className="text-foreground/55 text-sm mt-1">{plans.length} plans configured</p>
        </div>
        <Button href="/admin/amc-plans/new" size="sm">
          <Plus size={16} /> Add Plan
        </Button>
      </div>

      {loading ? (
        <p className="text-foreground/40 text-sm py-10 text-center">Loading…</p>
      ) : plans.length === 0 ? (
        <p className="text-foreground/40 text-sm py-10 text-center">No AMC plans yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((p) => (
            <div key={p.id} className="card-surface p-5 space-y-3">
              <div className="flex items-start justify-between">
                <h2 className="font-semibold">{p.name}</h2>
                {p.highlight && <Badge tone="accent">Popular</Badge>}
              </div>
              <p className="text-2xl font-bold">{formatINR(p.price)}</p>
              <div className="flex gap-1.5 flex-wrap">
                {p.applicableCategories.map((c) => (
                  <Badge key={c} tone="neutral" className="capitalize">
                    {c.replace(/-/g, " ")}
                  </Badge>
                ))}
              </div>
              <ul className="text-sm text-foreground/60 space-y-1">
                <li>{p.durationMonths} months · {p.visits} visits</li>
                <li>{p.filtersIncluded ? "Filters included" : "Filters not included"}</li>
                <li>{p.breakdownVisitsIncluded ? "Breakdown visits included" : "Breakdown visits extra"}</li>
              </ul>
              <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
                <Link href={`/admin/amc-plans/${p.id}`} className="text-sm font-medium text-brand-600 hover:text-brand-700">
                  Edit
                </Link>
                <button onClick={() => handleDelete(p.id)} className="text-foreground/40 hover:text-danger-600 transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
