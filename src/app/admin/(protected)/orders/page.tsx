"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { formatDate, formatINR } from "@/lib/format";
import type { Order } from "@/lib/types";
import { Input, Select } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

const statusTone: Record<string, string> = {
  placed: "bg-brand-50 text-brand-700",
  confirmed: "bg-brand-50 text-brand-700",
  packed: "bg-accent-400/15 text-accent-600",
  shipped: "bg-accent-400/15 text-accent-600",
  "out-for-delivery": "bg-accent-400/15 text-accent-600",
  delivered: "bg-success-500/10 text-success-600",
  installed: "bg-success-500/10 text-success-600",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<Order[]>("/api/admin/orders").then(setOrders).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (query.trim() && !o.orderNo.toLowerCase().includes(query.trim().toLowerCase())) return false;
      return true;
    });
  }, [orders, query, statusFilter]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-foreground/55 text-sm mt-1">{orders.length} total orders</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative max-w-xs flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/35" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search order number…" className="pl-9" />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-auto">
          <option value="all">All Statuses</option>
          <option value="placed">Placed</option>
          <option value="confirmed">Confirmed</option>
          <option value="packed">Packed</option>
          <option value="shipped">Shipped</option>
          <option value="out-for-delivery">Out for Delivery</option>
          <option value="delivered">Delivered</option>
          <option value="installed">Installed</option>
        </Select>
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle text-left text-xs font-semibold uppercase tracking-wide text-foreground/45">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-foreground/40">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-foreground/40">No orders found.</td></tr>
            ) : (
              filtered.map((o) => (
                <tr key={o.id} className="hover:bg-surface-muted/50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${o.id}`} className="font-medium text-brand-600 hover:text-brand-700">
                      #{o.orderNo}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-foreground/65">{formatDate(o.createdAt)}</td>
                  <td className="px-4 py-3 text-foreground/65">{o.items.length}</td>
                  <td className="px-4 py-3 font-medium">{formatINR(o.grandTotal)}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", o.paymentStatus === "paid" ? "bg-success-500/10 text-success-600" : "bg-surface-muted text-foreground/50")}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold capitalize", statusTone[o.status])}>
                      {o.status.replace(/-/g, " ")}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
