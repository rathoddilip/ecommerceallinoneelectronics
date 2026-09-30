import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function Section({
  title,
  subtitle,
  viewAllHref,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("container-page py-10 md:py-14", className)}>
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight">
            {title}
          </h2>
          {subtitle && <p className="text-foreground/60 text-sm mt-1">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 shrink-0"
          >
            View all <ArrowRight size={16} />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
