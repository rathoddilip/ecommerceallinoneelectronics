import { allBrands } from "@/lib/data/brands";

export default function BrandStrip() {
  return (
    <div className="border-y border-border-subtle bg-surface-muted/60">
      <div className="container-page py-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-foreground/40 mb-4">
          Trusted brands we sell
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {allBrands.map((brand) => (
            <span key={brand} className="text-sm font-bold text-foreground/35 hover:text-foreground/60 transition-colors">
              {brand}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
