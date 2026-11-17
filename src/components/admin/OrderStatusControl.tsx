"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Select } from "@/components/ui/Input";

const statuses = ["placed", "confirmed", "packed", "shipped", "out-for-delivery", "delivered", "installed"];

export default function OrderStatusControl({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);

  async function handleChange(next: string) {
    setValue(next);
    setSaving(true);
    try {
      await apiFetch(`/api/admin/orders/${orderId}`, { method: "PATCH", body: JSON.stringify({ status: next }) });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={value} onChange={(e) => handleChange(e.target.value)} className="w-auto" disabled={saving}>
        {statuses.map((s) => (
          <option key={s} value={s} className="capitalize">
            {s.replace(/-/g, " ")}
          </option>
        ))}
      </Select>
      {saving && <span className="text-xs text-foreground/40">Saving…</span>}
    </div>
  );
}
