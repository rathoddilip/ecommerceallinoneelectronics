"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Package, MapPin, CreditCard } from "lucide-react";
import { useAccountStore } from "@/lib/store/account";
import { formatDate, formatINR } from "@/lib/format";
import Button from "@/components/ui/Button";

function SuccessContent() {
  const orderNo = useSearchParams().get("order");
  const orders = useAccountStore((s) => s.orders);
  const order = orders.find((o) => o.orderNo === orderNo);

  if (!order) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-foreground/60">We couldn&apos;t find that order.</p>
        <Button href="/account/orders" className="mt-4">View My Orders</Button>
      </div>
    );
  }

  return (
    <div className="container-page max-w-2xl py-12">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success-500/10 text-success-600">
          <CheckCircle2 size={36} />
        </span>
        <h1 className="font-display text-2xl font-bold mt-4">Order Placed Successfully!</h1>
        <p className="text-foreground/60 mt-1">
          Order <strong className="text-foreground">#{order.orderNo}</strong> was placed on {formatDate(order.createdAt)}
        </p>
      </div>

      <div className="mt-8 card-surface p-5 space-y-4">
        <div className="flex items-start gap-3">
          <Package size={18} className="text-brand-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold">{order.items.length} item(s)</p>
            <p className="text-sm text-foreground/60">
              {order.items.map((i) => i.name).join(", ")}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <MapPin size={18} className="text-brand-500 mt-0.5 shrink-0" />
          <div className="text-sm text-foreground/60">
            <p className="font-semibold text-foreground">{order.addressSnapshot.name}</p>
            <p>
              {order.addressSnapshot.line1}, {order.addressSnapshot.city}, {order.addressSnapshot.state} - {order.addressSnapshot.pincode}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <CreditCard size={18} className="text-brand-500 mt-0.5 shrink-0" />
          <div className="text-sm text-foreground/60">
            <p>
              Paid via <strong className="text-foreground">{order.paymentMethod}</strong>
            </p>
            <p className="font-bold text-foreground text-base mt-1">{formatINR(order.grandTotal)}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <Button href="/account/orders" fullWidth>Track Order</Button>
        <Button href="/products" variant="outline" fullWidth>Continue Shopping</Button>
      </div>

      <p className="text-center text-xs text-foreground/40 mt-6">
        A confirmation SMS and email have been sent for your records.{" "}
        <Link href="/contact" className="text-brand-600 font-medium">Need help?</Link>
      </p>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="container-page py-24 text-center text-foreground/40">Loading…</div>}>
      <SuccessContent />
    </Suspense>
  );
}
