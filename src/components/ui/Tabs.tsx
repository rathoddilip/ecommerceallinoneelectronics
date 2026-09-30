"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function Tabs({
  tabs,
}: {
  tabs: { label: string; content: ReactNode }[];
}) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className="flex gap-1 border-b border-border-subtle overflow-x-auto scrollbar-thin">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            onClick={() => setActive(i)}
            className={cn(
              "relative shrink-0 px-4 py-3 text-sm font-medium transition-colors",
              active === i ? "text-brand-600" : "text-foreground/55 hover:text-foreground"
            )}
          >
            {tab.label}
            {active === i && (
              <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-500" />
            )}
          </button>
        ))}
      </div>
      <div className="pt-6">{tabs[active].content}</div>
    </div>
  );
}
