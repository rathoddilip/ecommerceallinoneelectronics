"use client";

import { useEffect, useState } from "react";
import { Check, ShieldCheck, Star } from "lucide-react";
import { departments } from "@/lib/data/categories";
import type { AmcPlan, Department } from "@/lib/types";
import { apiFetch } from "@/lib/api";
import { formatINR } from "@/lib/format";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function AmcPlansPage() {
  const [dept, setDept] = useState<Department>("water-purifiers");
  const [amcPlans, setAmcPlans] = useState<AmcPlan[]>([]);

  useEffect(() => {
    apiFetch<AmcPlan[]>("/api/amc-plans").then(setAmcPlans).catch(() => {});
  }, []);

  const plans = amcPlans.filter((p) => p.applicableCategories.includes(dept));

  return (
    <div className="container-page py-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "AMC Plans" }]} />

      <div className="max-w-2xl mt-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
          <ShieldCheck size={13} /> Annual Maintenance Contracts
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mt-3">
          Worry-free maintenance for your appliances
        </h1>
        <p className="text-foreground/60 mt-2">
          Preventive visits, filter changes and breakdown cover — all bundled into one simple annual plan with
          reminders sent 30, 15 and 7 days before expiry.
        </p>
      </div>

      <div className="mt-6 flex gap-2">
        {departments
          .filter((d) => d.slug !== "electrical")
          .map((d) => (
            <button
              key={d.slug}
              onClick={() => setDept(d.slug)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                dept === d.slug ? "border-brand-500 bg-brand-500 text-white" : "border-border-subtle text-foreground/60 hover:bg-surface-muted"
              )}
            >
              {d.name}
            </button>
          ))}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "relative flex flex-col rounded-2xl border p-6",
              plan.highlight ? "border-brand-500 shadow-lg shadow-brand-500/10" : "border-border-subtle"
            )}
          >
            {plan.highlight && (
              <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-accent-500 px-3 py-1 text-xs font-bold text-white">
                <Star size={11} className="fill-white" /> Most Popular
              </span>
            )}
            <h3 className="font-display font-bold text-lg">{plan.name}</h3>
            <p className="text-sm text-foreground/50 mt-1">{plan.durationMonths / 12} year(s) · {plan.visits} visits</p>
            <p className="mt-4">
              <span className="text-3xl font-extrabold">{formatINR(plan.price)}</span>
              <span className="text-foreground/50 text-sm"> /plan</span>
            </p>
            <ul className="mt-5 space-y-2.5 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground/70">
                  <Check size={15} className="text-success-600 mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Button href={`/products?dept=${dept}`} variant={plan.highlight ? "primary" : "outline"} fullWidth className="mt-6">
              Choose a Product to Add This Plan
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-10 card-surface p-6 max-w-2xl">
        <h2 className="font-semibold mb-2">How it works</h2>
        <ol className="space-y-2 text-sm text-foreground/65 list-decimal list-inside">
          <li>Pick an AMC plan while buying a product, or from any eligible product&apos;s page.</li>
          <li>Preventive visits are auto-scheduled — you&apos;ll get an SMS/WhatsApp reminder before each one.</li>
          <li>Raise a breakdown request anytime from your account; covered visits are free of charge.</li>
          <li>Renewal reminders arrive 30, 15 and 7 days before your plan expires.</li>
        </ol>
      </div>
    </div>
  );
}
