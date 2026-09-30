"use client";

import Link from "next/link";
import { useState } from "react";
import { categoriesByDepartment, departments } from "@/lib/data/categories";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const deptAccent: Record<string, string> = {
  electrical: "hover:text-electrical-600",
  electronics: "hover:text-electronics-600",
  "water-purifiers": "hover:text-water-600",
};

export default function MegaMenu() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {departments.map((dept) => {
        const cats = categoriesByDepartment(dept.slug);
        return (
          <div
            key={dept.slug}
            className="relative"
            onMouseEnter={() => setOpen(dept.slug)}
            onMouseLeave={() => setOpen(null)}
          >
            <Link
              href={`/products?dept=${dept.slug}`}
              className={cn(
                "flex items-center gap-1 px-3.5 py-2 text-sm font-semibold text-foreground/80 transition-colors rounded-lg",
                deptAccent[dept.slug]
              )}
            >
              {dept.name}
              <ChevronDown size={14} className="text-foreground/40" />
            </Link>
            {open === dept.slug && (
              <div className="absolute left-0 top-full z-40 w-[560px] rounded-2xl border border-border-subtle bg-surface p-5 shadow-xl shadow-black/5">
                <p className="text-xs font-semibold uppercase tracking-wide text-foreground/40 mb-3">
                  {dept.tagline}
                </p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {cats.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/products?dept=${dept.slug}&category=${cat.slug}`}
                      className="rounded-lg px-2.5 py-1.5 text-sm text-foreground/70 hover:bg-surface-muted hover:text-foreground transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/products?dept=${dept.slug}`}
                  className="mt-4 inline-block text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  Shop all {dept.name} →
                </Link>
              </div>
            )}
          </div>
        );
      })}
      <Link
        href="/service"
        className="px-3.5 py-2 text-sm font-semibold text-foreground/80 hover:text-brand-600 transition-colors rounded-lg"
      >
        Book a Service
      </Link>
      <Link
        href="/water-purifier-guide"
        className="px-3.5 py-2 text-sm font-semibold text-foreground/80 hover:text-water-600 transition-colors rounded-lg"
      >
        Purifier Guide
      </Link>
    </nav>
  );
}
