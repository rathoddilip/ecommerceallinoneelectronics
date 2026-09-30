"use client";

import { useMemo, useState } from "react";
import { Heart, Share2, ShieldCheck, RotateCcw, Wrench, Truck, Check } from "lucide-react";
import type { Product } from "@/lib/types";
import ProductVisual from "@/components/product/ProductVisual";
import PriceTag from "@/components/ui/PriceTag";
import Rating from "@/components/ui/Rating";
import Badge from "@/components/ui/Badge";
import QuantityStepper from "@/components/ui/QuantityStepper";
import Button from "@/components/ui/Button";
import Tabs from "@/components/ui/Tabs";
import PincodeCheck from "@/components/product/PincodeCheck";
import { useCartStore } from "@/lib/store/cart";
import { useAccountStore } from "@/lib/store/account";
import { useUIStore } from "@/lib/store/ui";
import { amcPlansFor } from "@/lib/data/amcPlans";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

export default function ProductDetailClient({ product }: { product: Product }) {
  const [variantId, setVariantId] = useState(product.variants?.[0]?.id);
  const [qty, setQty] = useState(1);
  const [addInstallation, setAddInstallation] = useState(product.installation === "free");
  const [amcPlanId, setAmcPlanId] = useState<string | undefined>(undefined);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUIStore((s) => s.openCart);
  const isWishlisted = useAccountStore((s) => s.wishlist.includes(product.id));
  const toggleWishlist = useAccountStore((s) => s.toggleWishlist);

  const variant = product.variants?.find((v) => v.id === variantId);
  const price = product.price + (variant?.priceDelta ?? 0);
  const mrp = product.mrp + (variant?.priceDelta ?? 0);
  const plans = useMemo(() => amcPlansFor(product.department), [product.department]);

  function handleAddToCart() {
    addItem({
      productId: product.id,
      variantId,
      qty,
      addInstallation,
      addAmcPlanId: amcPlanId,
    });
    openCart();
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      {/* Gallery */}
      <div>
        <ProductVisual
          department={product.department}
          category={product.category}
          className="aspect-square w-full"
          iconClassName="h-28 w-28 sm:h-36 sm:w-36"
        />
        <div className="mt-3 grid grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductVisual
              key={i}
              department={product.department}
              category={product.category}
              className="aspect-square"
              iconClassName="h-8 w-8"
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-brand-600">{product.brand}</p>
            <h1 className="font-display text-xl sm:text-2xl font-bold leading-snug mt-1">{product.name}</h1>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => toggleWishlist(product.id)}
              aria-label="Toggle wishlist"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle hover:bg-surface-muted"
            >
              <Heart size={18} className={cn(isWishlisted ? "fill-danger-500 text-danger-500" : "text-foreground/50")} />
            </button>
            <button
              aria-label="Share"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle hover:bg-surface-muted"
            >
              <Share2 size={16} className="text-foreground/50" />
            </button>
          </div>
        </div>

        <div className="mt-3">
          <Rating value={product.rating} count={product.reviewCount} />
        </div>

        <div className="mt-4">
          <PriceTag price={price} mrp={mrp} size="lg" />
          <p className="text-xs text-foreground/45 mt-1">Inclusive of all taxes (GST {product.gstRate}%)</p>
        </div>

        {product.badges && product.badges.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {product.badges.map((b) => (
              <Badge key={b} tone="success">
                <Check size={12} /> {b}
              </Badge>
            ))}
          </div>
        )}

        {product.variants && product.variants.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-2">
              Variant: <span className="font-normal text-foreground/60">{variant?.label}</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVariantId(v.id)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    v.id === variantId
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-border-subtle hover:bg-surface-muted",
                    v.stock === 0 && "opacity-40 cursor-not-allowed"
                  )}
                  disabled={v.stock === 0}
                >
                  {v.label}
                  {v.priceDelta > 0 && ` (+${formatINR(v.priceDelta)})`}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center gap-4">
          <span className="text-sm font-semibold">Quantity</span>
          <QuantityStepper value={qty} onChange={setQty} max={Math.min(10, variant?.stock ?? product.stock)} />
          <span className={cn("text-sm font-medium", product.stock > 0 ? "text-success-600" : "text-danger-500")}>
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        {product.installation !== "none" && (
          <label className="mt-5 flex items-start gap-3 rounded-xl border border-border-subtle p-4 cursor-pointer">
            <input
              type="checkbox"
              checked={addInstallation}
              onChange={(e) => setAddInstallation(e.target.checked)}
              className="mt-0.5 accent-brand-500"
            />
            <span>
              <span className="flex items-center gap-1.5 text-sm font-semibold">
                <Wrench size={15} className="text-brand-500" /> Add professional installation
              </span>
              <span className="block text-xs text-foreground/55 mt-0.5">
                {product.installation === "free" ? "Included free with this product" : `+${formatINR(product.installationFee)} — scheduled after delivery`}
              </span>
            </span>
          </label>
        )}

        {product.amcEligible && plans.length > 0 && (
          <div className="mt-4">
            <h3 className="flex items-center gap-1.5 text-sm font-semibold mb-2">
              <ShieldCheck size={15} className="text-brand-500" /> Add an AMC plan (optional)
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 rounded-lg border border-border-subtle px-3 py-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="amc"
                  checked={!amcPlanId}
                  onChange={() => setAmcPlanId(undefined)}
                  className="accent-brand-500"
                />
                No AMC plan
              </label>
              {plans.map((plan) => (
                <label
                  key={plan.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border-subtle px-3 py-2 text-sm cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="amc"
                      checked={amcPlanId === plan.id}
                      onChange={() => setAmcPlanId(plan.id)}
                      className="accent-brand-500"
                    />
                    {plan.name} · {plan.durationMonths / 12}yr · {plan.visits} visits
                  </span>
                  <span className="font-semibold shrink-0">{formatINR(plan.price)}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Button onClick={handleAddToCart} size="lg" className="flex-1" disabled={product.stock === 0}>
            Add to Cart
          </Button>
          <Button href="/checkout" onClick={handleAddToCart} variant="secondary" size="lg" className="flex-1">
            Buy Now
          </Button>
        </div>

        <div className="mt-6">
          <PincodeCheck installationAvailable={product.installation !== "none"} />
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-foreground/60">
          <div className="rounded-xl border border-border-subtle p-3">
            <Truck size={18} className="mx-auto text-brand-500" />
            <p className="mt-1.5">{product.installation === "free" ? "Free delivery" : "Fast delivery"}</p>
          </div>
          <div className="rounded-xl border border-border-subtle p-3">
            <RotateCcw size={18} className="mx-auto text-brand-500" />
            <p className="mt-1.5">{product.isReturnable ? `${product.returnDays}-day returns` : "Non-returnable"}</p>
          </div>
          <div className="rounded-xl border border-border-subtle p-3">
            <ShieldCheck size={18} className="mx-auto text-brand-500" />
            <p className="mt-1.5">{product.warrantyMonths}-month warranty</p>
          </div>
        </div>
      </div>

      {/* Tabs — full width */}
      <div className="lg:col-span-2 mt-4">
        <Tabs
          tabs={[
            {
              label: "Description",
              content: <p className="text-sm leading-relaxed text-foreground/75 max-w-3xl">{product.description}</p>,
            },
            {
              label: "Specifications",
              content: (
                <div className="max-w-2xl divide-y divide-border-subtle rounded-xl border border-border-subtle overflow-hidden">
                  {product.attributes.map((attr) => (
                    <div key={attr.label} className="flex justify-between gap-4 px-4 py-2.5 text-sm odd:bg-surface-muted/50">
                      <span className="text-foreground/55">{attr.label}</span>
                      <span className="font-medium text-right">{attr.value}</span>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              label: "What's in the Box",
              content: (
                <ul className="space-y-1.5 text-sm text-foreground/75 max-w-md">
                  {product.whatsInTheBox.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check size={14} className="text-success-600" /> {item}
                    </li>
                  ))}
                </ul>
              ),
            },
            {
              label: `Reviews (${product.reviewCount})`,
              content: (
                <div className="max-w-2xl space-y-5">
                  {product.reviews.map((r) => (
                    <div key={r.id} className="border-b border-border-subtle pb-4 last:border-0">
                      <div className="flex items-center gap-2">
                        <Rating value={r.rating} size="xs" showCount={false} />
                        <span className="text-sm font-semibold">{r.title}</span>
                      </div>
                      <p className="text-sm text-foreground/70 mt-1.5">{r.text}</p>
                      <p className="text-xs text-foreground/45 mt-1.5">
                        {r.author} {r.verified && "· Verified Buyer"}
                      </p>
                    </div>
                  ))}
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
