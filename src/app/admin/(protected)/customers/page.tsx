"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { formatDate, formatINR } from "@/lib/format";
import { Input } from "@/components/ui/Input";

interface CustomerRow {
  id: string;
  name: string;
  mobile: string;
  email: string | null;
  walletBalance: number;
  createdAt: string;
  orderCount: number;
  serviceRequestCount: number;
  totalSpent: number;
}

export default function AdminCustomersPage() {
  const [rows, setRows] = useState<CustomerRow[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<CustomerRow[]>("/api/admin/customers").then(setRows).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => r.name.toLowerCase().includes(q) || r.mobile.includes(q) || (r.email ?? "").toLowerCase().includes(q));
  }, [rows, query]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Customers</h1>
        <p className="text-foreground/55 text-sm mt-1">{rows.length} registered customers</p>
      </div>

      <div className="relative max-w-xs">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/35" />
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, mobile, email…" className="pl-9" />
      </div>

      <div className="card-surface overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border-subtle text-left text-xs font-semibold uppercase tracking-wide text-foreground/45">
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Service Jobs</th>
              <th className="px-4 py-3">Total Spent</th>
              <th className="px-4 py-3">Wallet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-foreground/40">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-foreground/40">No customers found.</td></tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} className="hover:bg-surface-muted/50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/customers/${c.id}`} className="font-medium text-brand-600 hover:text-brand-700">
                      {c.name}
                    </Link>
                    {c.email && <p className="text-xs text-foreground/45">{c.email}</p>}
                  </td>
                  <td className="px-4 py-3 text-foreground/65">{c.mobile}</td>
                  <td className="px-4 py-3 text-foreground/65">{formatDate(c.createdAt)}</td>
                  <td className="px-4 py-3 text-foreground/65">{c.orderCount}</td>
                  <td className="px-4 py-3 text-foreground/65">{c.serviceRequestCount}</td>
                  <td className="px-4 py-3 font-medium">{formatINR(c.totalSpent)}</td>
                  <td className="px-4 py-3 text-foreground/65">{formatINR(c.walletBalance)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
