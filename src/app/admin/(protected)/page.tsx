"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  IndianRupee,
  Package,
  Wrench,
  AlertTriangle,
  ShoppingCart,
  Users,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { formatINR } from "@/lib/format";

interface DashboardData {
  todaySales: number;
  todayOrderCount: number;
  ordersByStatus: Record<string, number>;
  pendingInstallations: number;
  openServiceJobs: number;
  lowStockProducts: { id: string; name: string; stock: number; slug: string }[];
  revenueByDay: { date: string; total: number }[];
  topProducts: { productId: string; name: string; qty: number }[];
  totalProducts: number;
  totalCustomers: number;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    apiFetch<DashboardData>("/api/admin/dashboard").then(setData).catch(() => {});
  }, []);

  if (!data) {
    return <div className="text-foreground/40">Loading dashboard…</div>;
  }

  const maxRevenue = Math.max(1, ...data.revenueByDay.map((d) => d.total));
  const totalOrders = Object.values(data.ordersByStatus).reduce((a, b) => a + b, 0);

  const stats = [
    { label: "Today's Sales", value: formatINR(data.todaySales), sub: `${data.todayOrderCount} orders today`, icon: IndianRupee, tone: "text-success-600 bg-success-500/10" },
    { label: "Total Orders", value: totalOrders.toLocaleString("en-IN"), sub: "all time", icon: ShoppingCart, tone: "text-brand-600 bg-brand-50" },
    { label: "Pending Installations", value: data.pendingInstallations, sub: "awaiting installation", icon: Package, tone: "text-electrical-600 bg-electrical-500/10" },
    { label: "Open Service Jobs", value: data.openServiceJobs, sub: "requested/in progress", icon: Wrench, tone: "text-water-600 bg-water-500/10" },
    { label: "Total Customers", value: data.totalCustomers.toLocaleString("en-IN"), sub: "registered", icon: Users, tone: "text-electronics-600 bg-electronics-500/10" },
    { label: "Low Stock Alerts", value: data.lowStockProducts.length, sub: "products ≤ 10 units", icon: AlertTriangle, tone: "text-danger-600 bg-danger-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-foreground/55 text-sm mt-1">Overview of your store&apos;s activity.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map(({ label, value, sub, icon: Icon, tone }) => (
          <div key={label} className="card-surface p-4">
            <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tone}`}>
              <Icon size={17} />
            </span>
            <p className="mt-3 text-xl font-bold">{value}</p>
            <p className="text-xs font-medium text-foreground/60 mt-0.5">{label}</p>
            <p className="text-[11px] text-foreground/40">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card-surface p-5">
          <h2 className="font-semibold mb-4">Revenue — last 30 days</h2>
          {data.revenueByDay.length === 0 ? (
            <p className="text-sm text-foreground/45 py-10 text-center">No orders in this period yet.</p>
          ) : (
            <div className="flex items-end gap-1 h-40">
              {data.revenueByDay.map((d) => (
                <div
                  key={d.date}
                  className="flex-1 rounded-t bg-brand-500/80 hover:bg-brand-500 transition-colors min-w-[3px]"
                  style={{ height: `${Math.max(4, (d.total / maxRevenue) * 100)}%` }}
                  title={`${d.date}: ${formatINR(d.total)}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="card-surface p-5">
          <h2 className="font-semibold mb-4">Orders by Status</h2>
          <div className="space-y-2.5">
            {Object.entries(data.ordersByStatus).length === 0 ? (
              <p className="text-sm text-foreground/45">No orders yet.</p>
            ) : (
              Object.entries(data.ordersByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-foreground/65">{status.replace(/_/g, " ")}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-surface p-5">
          <h2 className="font-semibold mb-4">Top Products</h2>
          {data.topProducts.length === 0 ? (
            <p className="text-sm text-foreground/45">No sales data yet.</p>
          ) : (
            <div className="space-y-2.5">
              {data.topProducts.map((p) => (
                <div key={p.productId} className="flex items-center justify-between text-sm">
                  <span className="truncate pr-2">{p.name}</span>
                  <span className="font-semibold shrink-0">{p.qty} sold</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card-surface p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Low Stock</h2>
            <Link href="/admin/products" className="text-xs font-medium text-brand-600">Manage products →</Link>
          </div>
          {data.lowStockProducts.length === 0 ? (
            <p className="text-sm text-foreground/45">All products are well stocked.</p>
          ) : (
            <div className="space-y-2.5">
              {data.lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <span className="truncate pr-2">{p.name}</span>
                  <span className="font-semibold text-danger-500 shrink-0">{p.stock} left</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
