"use client";

import { Wrench, Calendar, MapPin, X } from "lucide-react";
import { useAccountStore } from "@/lib/store/account";
import { formatINR } from "@/lib/format";
import type { ServiceStatus } from "@/lib/types";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const statusTone: Record<ServiceStatus, string> = {
  requested: "bg-brand-50 text-brand-700",
  assigned: "bg-accent-400/15 text-accent-600",
  "in-progress": "bg-accent-400/15 text-accent-600",
  completed: "bg-success-500/10 text-success-600",
  cancelled: "bg-danger-500/10 text-danger-600",
};

export default function ServiceRequestsPage() {
  const requests = useAccountStore((s) => s.serviceRequests);
  const addresses = useAccountStore((s) => s.addresses);
  const updateServiceRequest = useAccountStore((s) => s.updateServiceRequest);

  if (requests.length === 0) {
    return (
      <div className="card-surface flex flex-col items-center gap-3 py-16 text-center">
        <Wrench size={44} className="text-foreground/20" />
        <p className="font-medium">No service requests yet</p>
        <p className="text-sm text-foreground/50">Book installation, AMC visits or repairs anytime.</p>
        <Button href="/service" className="mt-2">Book a Service</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-xl font-bold">Service Requests</h1>
      {requests.map((r) => {
        const address = addresses.find((a) => a.id === r.addressId);
        return (
          <div key={r.id} className="card-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">#{r.jobNo} · {r.productName}</p>
                <p className="text-xs text-foreground/50 mt-0.5 capitalize">{r.type.replace(/-/g, " ")}</p>
              </div>
              <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold capitalize shrink-0", statusTone[r.status])}>
                {r.status.replace(/-/g, " ")}
              </span>
            </div>

            <div className="mt-3 grid gap-1.5 text-xs text-foreground/55 sm:grid-cols-2">
              <p className="flex items-center gap-1.5">
                <Calendar size={13} /> {r.slotDate} · {r.slotTime}
              </p>
              {address && (
                <p className="flex items-center gap-1.5">
                  <MapPin size={13} /> {address.city} - {address.pincode}
                </p>
              )}
            </div>

            {r.issue && r.issue !== "Not specified" && (
              <p className="mt-2 text-sm text-foreground/65">&quot;{r.issue}&quot;</p>
            )}

            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-semibold">{r.charges > 0 ? formatINR(r.charges) : "Free"}</span>
              {(r.status === "requested" || r.status === "assigned") && (
                <button
                  onClick={() => updateServiceRequest(r.id, { status: "cancelled" })}
                  className="inline-flex items-center gap-1 text-xs font-medium text-danger-500 hover:text-danger-600"
                >
                  <X size={13} /> Cancel Request
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
