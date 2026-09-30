"use client";

import { useState } from "react";
import { Droplet, Check, RotateCcw } from "lucide-react";
import { products } from "@/lib/data/products";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import ProductRail from "@/components/product/ProductRail";
import { cn } from "@/lib/utils";

type Source = "municipal" | "borewell" | "tanker";
type Tds = "low" | "medium" | "high" | "very-high";
type FamilySize = "1-2" | "3-4" | "5-6" | "7+";

const sourceOptions: { id: Source; label: string; desc: string }[] = [
  { id: "municipal", label: "Municipal Corporation Supply", desc: "Usually treated, lower TDS" },
  { id: "borewell", label: "Borewell / Groundwater", desc: "Often high TDS & hardness" },
  { id: "tanker", label: "Tanker Water", desc: "Quality can vary a lot" },
];

const tdsOptions: { id: Tds; label: string }[] = [
  { id: "low", label: "Below 200 ppm (tastes fine, soft)" },
  { id: "medium", label: "200 - 500 ppm (slightly hard / salty)" },
  { id: "high", label: "500 - 1500 ppm (noticeably hard)" },
  { id: "very-high", label: "Above 1500 ppm / Not sure" },
];

const familyOptions: { id: FamilySize; label: string }[] = [
  { id: "1-2", label: "1-2 members" },
  { id: "3-4", label: "3-4 members" },
  { id: "5-6", label: "5-6 members" },
  { id: "7+", label: "7+ members / small office" },
];

function recommend(source: Source, tds: Tds, family: FamilySize) {
  const needsRo = source !== "municipal" || tds === "high" || tds === "very-high" || tds === "medium";
  const isLarge = family === "5-6" || family === "7+";
  const isCommercial = family === "7+" && (tds === "high" || tds === "very-high");

  let category: string;
  let storage: string;
  let reason: string;

  if (isCommercial) {
    category = "commercial-purifiers";
    storage = "25+ LPH commercial unit";
    reason = "With a large household and high TDS water, a commercial-grade RO plant gives you reliable daily capacity.";
  } else if (needsRo) {
    category = isLarge ? "ro-uv-uf-combo" : "ro-purifiers";
    storage = isLarge ? "8-10 L storage" : "6-7 L storage";
    reason = `Your water source and TDS level (${tds.replace("-", " ")}) mean dissolved salts need to be removed — RO purification is recommended${isLarge ? ", combined with UV+UF for complete protection" : ""}.`;
  } else {
    category = "uv-purifiers";
    storage = "6 L storage";
    reason = "Municipal water with low TDS mainly needs disinfection — a UV purifier preserves natural minerals while eliminating bacteria and viruses.";
  }

  return { category, storage, reason };
}

export default function WaterPurifierGuidePage() {
  const [step, setStep] = useState(0);
  const [source, setSource] = useState<Source | null>(null);
  const [tds, setTds] = useState<Tds | null>(null);
  const [family, setFamily] = useState<FamilySize | null>(null);

  const done = source && tds && family;
  const result = done ? recommend(source, tds, family) : null;
  const recommendedProducts = result
    ? products.filter((p) => p.category === result.category).slice(0, 4)
    : [];

  function reset() {
    setStep(0);
    setSource(null);
    setTds(null);
    setFamily(null);
  }

  return (
    <div className="container-page py-6 max-w-3xl">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Purifier Guide" }]} />

      <div className="mt-3 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-water-500/10 text-water-600">
          <Droplet size={22} />
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Which purifier do I need?</h1>
          <p className="text-foreground/55 text-sm">Answer 3 quick questions for a personalised recommendation.</p>
        </div>
      </div>

      {!result ? (
        <div className="mt-8 card-surface p-6 sm:p-8">
          {step === 0 && (
            <div>
              <h2 className="font-semibold mb-4">1. What is your water source?</h2>
              <div className="grid gap-2.5 sm:grid-cols-3">
                {sourceOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSource(opt.id);
                      setStep(1);
                    }}
                    className={cn(
                      "rounded-xl border p-4 text-left transition-colors",
                      source === opt.id ? "border-brand-500 bg-brand-50" : "border-border-subtle hover:bg-surface-muted"
                    )}
                  >
                    <span className="block text-sm font-semibold">{opt.label}</span>
                    <span className="block text-xs text-foreground/50 mt-1">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-semibold mb-4">2. What&apos;s your water&apos;s TDS level?</h2>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {tdsOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setTds(opt.id);
                      setStep(2);
                    }}
                    className={cn(
                      "rounded-xl border p-4 text-left text-sm font-medium transition-colors",
                      tds === opt.id ? "border-brand-500 bg-brand-50" : "border-border-subtle hover:bg-surface-muted"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-foreground/45 mt-3">
                Tip: book a free doorstep water TDS test if you&apos;re unsure — see the &quot;Demo / TDS Test&quot; option on our service page.
              </p>
              <Button variant="ghost" size="sm" onClick={() => setStep(0)} className="mt-3">Back</Button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-semibold mb-4">3. How many people in your household?</h2>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {familyOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setFamily(opt.id)}
                    className={cn(
                      "rounded-xl border p-4 text-left text-sm font-medium transition-colors",
                      family === opt.id ? "border-brand-500 bg-brand-50" : "border-border-subtle hover:bg-surface-muted"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="mt-3">Back</Button>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-8">
          <div className="card-surface p-6 sm:p-8 border-brand-200">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-success-500/10 px-3 py-1 text-xs font-semibold text-success-600">
              <Check size={13} /> Recommendation ready
            </span>
            <h2 className="font-display text-xl font-bold mt-3">
              We recommend: {result.category.split("-").join(" ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </h2>
            <p className="text-sm text-foreground/65 mt-2 max-w-xl">{result.reason}</p>
            <p className="text-sm text-foreground/50 mt-1">Suggested capacity: {result.storage}</p>
            <button onClick={reset} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700">
              <RotateCcw size={14} /> Retake the quiz
            </button>
          </div>

          {recommendedProducts.length > 0 && (
            <div className="mt-8">
              <h3 className="font-display font-bold mb-4">Matching products</h3>
              <ProductRail products={recommendedProducts} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
