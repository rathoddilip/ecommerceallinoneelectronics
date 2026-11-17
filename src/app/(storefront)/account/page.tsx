"use client";

import Link from "next/link";
import { Package, Wrench, Heart, Wallet, ArrowRight, Gift } from "lucide-react";
import { useAccountStore } from "@/lib/store/account";
import { formatDate, formatINR } from "@/lib/format";

export default function AccountDashboard() {
  const user = useAccountStore((s) => s.user);
  const orders = useAccountStore((s) => s.orders);
  const serviceRequests = useAccountStore((s) => s.serviceRequests);
  const wishlist = useAccountStore((s) => s.wishlist);

  if (!user) return null;

  const stats = [
    { label: "Orders", value: orders.length, icon: Package, href: "/account/orders" },
    { label: "Service Requests", value: serviceRequests.length, icon: Wrench, href: "/account/service-requests" },
    { label: "Wishlist", value: wishlist.length, icon: Heart, href: "/account/wishlist" },
    { label: "Wallet Balance", value: formatINR(user.walletBalance), icon: Wallet, href: "/account" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Hi, {user.name} 👋</h1>
        <p className="text-foreground/55 text-sm mt-1">Here&apos;s what&apos;s happening with your account.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} className="card-surface p-4 hover:shadow-md transition-shadow">
            <Icon size={18} className="text-brand-500" />
            <p className="mt-2 text-xl font-bold">{value}</p>
            <p className="text-xs text-foreground/50">{label}</p>
          </Link>
        ))}
      </div>

      <div className="card-surface p-4 flex items-center gap-3 bg-accent-400/10 border-accent-400/30">
        <Gift size={20} className="text-accent-600 shrink-0" />
        <p className="text-sm">
          Refer friends using code <strong>{user.referralCode}</strong> and earn ₹100 wallet credit on their first order.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-surface p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Recent Orders</h2>
            <Link href="/account/orders" className="text-xs font-medium text-brand-600 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {orders.length === 0 ? (
            <p className="text-sm text-foreground/50">No orders yet.</p>
          ) : (
            <ul className="space-y-3">
              {orders.slice(0, 3).map((o) => (
                <li key={o.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">#{o.orderNo}</p>
                    <p className="text-xs text-foreground/45">{formatDate(o.createdAt)}</p>
                  </div>
                  <span className="font-semibold">{formatINR(o.grandTotal)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card-surface p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Service Requests</h2>
            <Link href="/account/service-requests" className="text-xs font-medium text-brand-600 flex items-center gap-1">
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {serviceRequests.length === 0 ? (
            <p className="text-sm text-foreground/50">No service requests yet.</p>
          ) : (
            <ul className="space-y-3">
              {serviceRequests.slice(0, 3).map((r) => (
                <li key={r.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="font-medium">#{r.jobNo}</p>
                    <p className="text-xs text-foreground/45">{r.productName}</p>
                  </div>
                  <span className="text-xs font-semibold capitalize text-brand-600">{r.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
