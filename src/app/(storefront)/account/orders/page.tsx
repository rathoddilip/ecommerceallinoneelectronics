"use client";

import { useState } from "react";
import { Package, Download, ChevronDown, Truck, Wrench } from "lucide-react";
import { useAccountStore } from "@/lib/store/account";
import { formatDate, formatINR } from "@/lib/format";
import type { Order, OrderStatus } from "@/lib/types";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const statusFlow: OrderStatus[] = ["placed", "confirmed", "packed", "shipped", "out-for-delivery", "delivered"];

const statusLabel: Record<OrderStatus, string> = {
  placed: "Placed",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  "out-for-delivery": "Out for Delivery",
  delivered: "Delivered",
  installed: "Installed",
};

function downloadInvoice(order: Order) {
  const lines = [
    `AllInOne Electronics — Tax Invoice`,
    `Order No: ${order.orderNo}`,
    `Date: ${formatDate(order.createdAt)}`,
    `--------------------------------------------`,
    `Bill To: ${order.addressSnapshot.name}`,
    `${order.addressSnapshot.line1}, ${order.addressSnapshot.city}, ${order.addressSnapshot.state} - ${order.addressSnapshot.pincode}`,
    order.gstin ? `GSTIN: ${order.gstin}` : "",
    `--------------------------------------------`,
    ...order.items.map(
      (i) => `${i.name}${i.variantLabel ? ` (${i.variantLabel})` : ""} x${i.qty} — ${formatINR(i.price * i.qty)}`
    ),
    `--------------------------------------------`,
    `Subtotal: ${formatINR(order.subtotal)}`,
    `Discount: -${formatINR(order.discount)}`,
    `Installation/AMC: ${formatINR(order.installationTotal)}`,
    `Shipping: ${formatINR(order.shipping)}`,
    `Grand Total: ${formatINR(order.grandTotal)}`,
    `Payment: ${order.paymentMethod} (${order.paymentStatus})`,
  ]
    .filter(Boolean)
    .join("\n");

  const blob = new Blob([lines], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Invoice-${order.orderNo}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function OrdersPage() {
  const orders = useAccountStore((s) => s.orders);
  const [expanded, setExpanded] = useState<string | null>(null);

  if (orders.length === 0) {
    return (
      <div className="card-surface flex flex-col items-center gap-3 py-16 text-center">
        <Package size={44} className="text-foreground/20" />
        <p className="font-medium">No orders yet</p>
        <p className="text-sm text-foreground/50">Your order history will show up here.</p>
        <Button href="/products" className="mt-2">Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-xl font-bold">My Orders</h1>
      {orders.map((order) => {
        const isOpen = expanded === order.id;
        const currentIndex = statusFlow.indexOf(order.status);
        return (
          <div key={order.id} className="card-surface overflow-hidden">
            <button
              onClick={() => setExpanded(isOpen ? null : order.id)}
              className="flex w-full items-center justify-between gap-4 p-4 text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Package size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold">#{order.orderNo}</p>
                  <p className="text-xs text-foreground/50">
                    {formatDate(order.createdAt)} · {order.items.length} item(s)
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-bold hidden sm:block">{formatINR(order.grandTotal)}</span>
                <span className="rounded-full bg-success-500/10 px-2.5 py-1 text-xs font-semibold text-success-600 capitalize">
                  {statusLabel[order.status]}
                </span>
                <ChevronDown size={16} className={cn("transition-transform text-foreground/40", isOpen && "rotate-180")} />
              </div>
            </button>

            {isOpen && (
              <div className="border-t border-border-subtle p-4 space-y-4">
                <div className="flex items-center gap-1 overflow-x-auto scrollbar-thin pb-1">
                  {statusFlow.map((s, i) => (
                    <div key={s} className="flex items-center gap-1 shrink-0">
                      <div
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold",
                          i <= currentIndex ? "bg-success-500 text-white" : "bg-surface-muted text-foreground/40"
                        )}
                      >
                        {i + 1}
                      </div>
                      <span className={cn("text-[11px] whitespace-nowrap", i <= currentIndex ? "text-foreground" : "text-foreground/35")}>
                        {statusLabel[s]}
                      </span>
                      {i < statusFlow.length - 1 && <div className="h-px w-5 bg-border-subtle" />}
                    </div>
                  ))}
                </div>

                <div className="divide-y divide-border-subtle">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2 text-sm">
                      <span>
                        {item.name} {item.variantLabel && <span className="text-foreground/45">({item.variantLabel})</span>} × {item.qty}
                        {item.addInstallation && (
                          <span className="ml-2 inline-flex items-center gap-1 text-xs text-brand-600">
                            <Wrench size={11} /> Installation
                          </span>
                        )}
                      </span>
                      <span className="font-medium">{formatINR(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <p className="flex items-center gap-1.5 text-xs text-foreground/50">
                    <Truck size={13} /> Delivering to {order.addressSnapshot.city} - {order.addressSnapshot.pincode}
                  </p>
                  <button
                    onClick={() => downloadInvoice(order)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
                  >
                    <Download size={15} /> Download Invoice
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
