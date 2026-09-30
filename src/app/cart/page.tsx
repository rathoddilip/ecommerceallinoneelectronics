"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingBag, Trash2, Wrench, Tag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { formatINR } from "@/lib/format";
import ProductVisual from "@/components/product/ProductVisual";
import QuantityStepper from "@/components/ui/QuantityStepper";
import Button from "@/components/ui/Button";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { apiFetch } from "@/lib/api";
import type { AmcPlan } from "@/lib/types";

export default function CartPage() {
  const lines = useCartStore((s) => s.lines);
  const totals = useCartStore((s) => s.totals);
  const hasHydrated = useCartStore((s) => s.hasHydrated);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const toggleInstallation = useCartStore((s) => s.toggleInstallation);
  const couponCode = useCartStore((s) => s.couponCode);
  const couponError = useCartStore((s) => s.couponError);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);

  const [couponInput, setCouponInput] = useState("");
  const [amcPlans, setAmcPlans] = useState<AmcPlan[]>([]);

  useEffect(() => {
    apiFetch<AmcPlan[]>("/api/amc-plans").then(setAmcPlans).catch(() => {});
  }, []);

  if (!hasHydrated) {
    return <div className="container-page py-24 text-center text-foreground/40">Loading your cart…</div>;
  }

  if (lines.length === 0) {
    return (
      <div className="container-page py-20 flex flex-col items-center text-center gap-3">
        <ShoppingBag size={56} className="text-foreground/20" />
        <h1 className="font-display text-xl font-bold">Your cart is empty</h1>
        <p className="text-foreground/55 max-w-sm">
          Looks like you haven&apos;t added anything yet. Explore our electrical, electronics and water purifier range.
        </p>
        <Button href="/products" className="mt-2">Start Shopping</Button>
      </div>
    );
  }

  return (
    <div className="container-page py-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <h1 className="font-display text-2xl font-bold tracking-tight mt-3 mb-6">
        Your Cart <span className="text-foreground/40 font-normal text-lg">({totals.itemCount} items)</span>
      </h1>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {lines.map((line) => {
            const plan = line.addAmcPlanId ? amcPlans.find((p) => p.id === line.addAmcPlanId) : undefined;
            return (
              <div key={`${line.productId}-${line.variantId ?? ""}`} className="card-surface flex gap-4 p-4">
                <Link href={`/products/${line.product.slug}`} className="shrink-0">
                  <ProductVisual
                    department={line.product.department}
                    category={line.product.category}
                    className="h-24 w-24 sm:h-28 sm:w-28"
                    iconClassName="h-10 w-10 sm:h-12 sm:w-12"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/products/${line.product.slug}`} className="font-semibold text-sm hover:text-brand-600 line-clamp-2">
                        {line.product.name}
                      </Link>
                      {line.variantLabel && <p className="text-xs text-foreground/50 mt-0.5">{line.variantLabel}</p>}
                      <p className="text-sm font-bold mt-1.5">{formatINR(line.unitPrice)}</p>
                    </div>
                    <button
                      onClick={() => removeItem(line.productId, line.variantId ?? undefined)}
                      className="shrink-0 p-1.5 text-foreground/30 hover:text-danger-500"
                      aria-label="Remove item"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  {line.product.installation !== "none" && (
                    <label className="mt-2 flex items-center gap-2 text-xs text-foreground/65 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={line.addInstallation}
                        onChange={(e) => toggleInstallation(line.productId, line.variantId ?? undefined, e.target.checked)}
                        className="accent-brand-500"
                      />
                      <Wrench size={12} />
                      {line.product.installation === "free"
                        ? "Free installation included"
                        : `Add installation (+${formatINR(line.product.installationFee)})`}
                    </label>
                  )}
                  {plan && (
                    <p className="mt-1 text-xs text-foreground/65">
                      AMC: {plan.name} (+{formatINR(plan.price)})
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <QuantityStepper
                      size="sm"
                      value={line.qty}
                      onChange={(qty) => updateQty(line.productId, line.variantId ?? undefined, qty)}
                    />
                    <span className="text-sm font-bold">{formatINR(line.lineTotal)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="lg:sticky lg:top-24 h-fit space-y-4">
          <div className="card-surface p-5">
            <h2 className="font-display font-bold mb-4">Price Details</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-foreground/65">
                <span>Price ({totals.itemCount} items)</span>
                <span>{formatINR(totals.mrpTotal)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-success-600">
                  <span>Discount</span>
                  <span>−{formatINR(totals.discount)}</span>
                </div>
              )}
              {totals.installationTotal > 0 && (
                <div className="flex justify-between text-foreground/65">
                  <span>Installation charges</span>
                  <span>{formatINR(totals.installationTotal)}</span>
                </div>
              )}
              {totals.amcTotal > 0 && (
                <div className="flex justify-between text-foreground/65">
                  <span>AMC plan</span>
                  <span>{formatINR(totals.amcTotal)}</span>
                </div>
              )}
              {totals.couponDiscount > 0 && (
                <div className="flex justify-between text-success-600">
                  <span>Coupon discount</span>
                  <span>−{formatINR(totals.couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-foreground/65">
                <span>Delivery</span>
                <span>{totals.shipping === 0 ? "FREE" : formatINR(totals.shipping)}</span>
              </div>
              <div className="flex justify-between text-foreground/40 text-xs">
                <span>Incl. GST</span>
                <span>{formatINR(totals.tax)}</span>
              </div>
              <div className="border-t border-border-subtle pt-3 flex justify-between font-bold text-base">
                <span>Total</span>
                <span>{formatINR(totals.grandTotal)}</span>
              </div>
            </div>
            <Button href="/checkout" fullWidth size="lg" className="mt-5">
              Proceed to Checkout <ArrowRight size={16} />
            </Button>
          </div>

          <div className="card-surface p-5">
            <h3 className="flex items-center gap-1.5 font-semibold text-sm mb-3">
              <Tag size={15} className="text-brand-500" /> Apply Coupon
            </h3>
            {couponCode ? (
              <div className="flex items-center justify-between rounded-lg bg-success-500/10 px-3 py-2 text-sm">
                <span className="font-medium text-success-700">{couponCode} applied</span>
                <button onClick={removeCoupon} className="text-xs font-medium text-danger-500">
                  Remove
                </button>
              </div>
            ) : (
              <div>
                <div className="flex gap-2">
                  <input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 h-10 rounded-lg border border-border-subtle px-3 text-sm outline-none focus:border-brand-500"
                  />
                  <button
                    onClick={() => applyCoupon(couponInput)}
                    className="shrink-0 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-xs text-danger-500 mt-1.5">{couponError}</p>}
                <p className="text-xs text-foreground/45 mt-2">Try WELCOME100 or SAVE500 (min ₹5,000)</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
