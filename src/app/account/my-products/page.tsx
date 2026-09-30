"use client";

import { Zap, ShieldCheck, Droplet, Wrench } from "lucide-react";
import { useAccountStore } from "@/lib/store/account";
import { formatDate } from "@/lib/format";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function MyProductsPage() {
  const myProducts = useAccountStore((s) => s.myProducts);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold">My Products</h1>
        <Button href="/products" variant="outline" size="sm">Buy More</Button>
      </div>

      {myProducts.length === 0 ? (
        <div className="card-surface flex flex-col items-center gap-3 py-16 text-center">
          <Zap size={44} className="text-foreground/20" />
          <p className="font-medium">No registered products yet</p>
          <p className="text-sm text-foreground/50">Products you buy from us are registered here automatically.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {myProducts.map((p) => {
            const warrantyActive = new Date(p.warrantyEndDate) > new Date();
            return (
              <div key={p.id} className="card-surface p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-water-500/10 text-water-600">
                    <Droplet size={20} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold line-clamp-2">{p.name}</p>
                    {p.serialNo && <p className="text-xs text-foreground/45 mt-0.5">S/N: {p.serialNo}</p>}
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/55">Purchased</span>
                    <span className="font-medium">{formatDate(p.purchaseDate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/55">Warranty</span>
                    <span className={cn("font-medium", warrantyActive ? "text-success-600" : "text-danger-500")}>
                      {warrantyActive ? `Active until ${formatDate(p.warrantyEndDate)}` : "Expired"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-foreground/55">
                      <ShieldCheck size={13} /> AMC Status
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-semibold capitalize",
                        p.amcStatus === "active" ? "bg-success-500/10 text-success-600" : "bg-surface-muted text-foreground/50"
                      )}
                    >
                      {p.amcStatus}
                    </span>
                  </div>
                  {p.nextFilterChangeDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-foreground/55">Next Filter Change</span>
                      <span className="font-medium">{formatDate(p.nextFilterChangeDate)}</span>
                    </div>
                  )}
                </div>

                <Button href="/service" size="sm" variant="outline" fullWidth className="mt-4">
                  <Wrench size={14} /> Book Service
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
