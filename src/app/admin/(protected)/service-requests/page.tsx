"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { formatDate, formatINR } from "@/lib/format";
import type { ServiceRequest } from "@/lib/types";
import { Input, Select } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

const statusTone: Record<string, string> = {
  requested: "bg-brand-50 text-brand-700",
  assigned: "bg-accent-400/15 text-accent-600",
  "in-progress": "bg-accent-400/15 text-accent-600",
  completed: "bg-success-500/10 text-success-600",
  cancelled: "bg-danger-500/10 text-danger-600",
};

const statuses = ["requested", "assigned", "in-progress", "completed", "cancelled"];

export default function AdminServiceRequestsPage() {
  const [rows, setRows] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  function load() {
    apiFetch<ServiceRequest[]>("/api/admin/service-requests").then(setRows).finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function updateRow(id: string, patch: { status?: string; technicianName?: string }) {
    setSavingId(id);
    try {
      await apiFetch(`/api/admin/service-requests/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
      load();
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Service Jobs</h1>
        <p className="text-foreground/55 text-sm mt-1">{rows.length} service requests</p>
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle text-left text-xs font-semibold uppercase tracking-wide text-foreground/45">
              <th className="px-4 py-3">Job</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Slot</th>
              <th className="px-4 py-3">Technician</th>
              <th className="px-4 py-3">Charges</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-foreground/40">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-foreground/40">No service requests yet.</td></tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="hover:bg-surface-muted/50">
                  <td className="px-4 py-3 font-medium">#{r.jobNo}</td>
                  <td className="px-4 py-3 capitalize text-foreground/65">{r.type.replace(/-/g, " ")}</td>
                  <td className="px-4 py-3 text-foreground/65 max-w-[160px] truncate">{r.productName}</td>
                  <td className="px-4 py-3 text-foreground/65">{r.slotDate}<br /><span className="text-xs text-foreground/45">{r.slotTime}</span></td>
                  <td className="px-4 py-3">
                    <Input
                      defaultValue={r.technicianName ?? ""}
                      placeholder="Unassigned"
                      className="h-8 w-32 text-xs"
                      onBlur={(e) => {
                        if (e.target.value !== (r.technicianName ?? "")) updateRow(r.id, { technicianName: e.target.value });
                      }}
                    />
                  </td>
                  <td className="px-4 py-3">{r.charges > 0 ? formatINR(r.charges) : "Free"}</td>
                  <td className="px-4 py-3">
                    <Select
                      value={r.status}
                      disabled={savingId === r.id}
                      onChange={(e) => updateRow(r.id, { status: e.target.value })}
                      className={cn("h-8 w-auto text-xs font-semibold capitalize border-0", statusTone[r.status])}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{s.replace(/-/g, " ")}</option>
                      ))}
                    </Select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-foreground/40">Created {rows.length > 0 && formatDate(rows[0].createdAt)} and earlier · newest first</p>
    </div>
  );
}
