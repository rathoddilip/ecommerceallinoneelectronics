"use client";

import Link from "next/link";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { useUIStore } from "@/lib/store/ui";
import { useCartStore } from "@/lib/store/cart";
import { formatINR } from "@/lib/format";
import ProductVisual from "@/components/product/ProductVisual";
import QuantityStepper from "@/components/ui/QuantityStepper";
import Button from "@/components/ui/Button";
import Portal from "@/components/ui/Portal";
import { cn } from "@/lib/utils";

export default function CartDrawer() {
  const isOpen = useUIStore((s) => s.isCartOpen);
  const closeCart = useUIStore((s) => s.closeCart);
  const lines = useCartStore((s) => s.lines);
  const totals = useCartStore((s) => s.totals);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);

  return (
    <Portal>
    <div
      className={cn(
        "fixed inset-0 z-[70] transition-opacity",
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <div className="absolute inset-0 bg-black/40" onClick={closeCart} />
      <div
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-surface transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-border-subtle p-4">
          <h2 className="font-display font-bold text-lg">
            Your Cart {lines.length > 0 && <span className="text-foreground/40 font-normal text-sm">({totals.itemCount} items)</span>}
          </h2>
          <button onClick={closeCart} className="p-1.5 rounded-lg hover:bg-surface-muted" aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <ShoppingBag size={48} className="text-foreground/20" />
            <p className="font-medium">Your cart is empty</p>
            <p className="text-sm text-foreground/50">Add products to see them here.</p>
            <Button href="/products" onClick={closeCart} className="mt-2">
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto divide-y divide-border-subtle">
              {lines.map((line) => (
                <div key={`${line.productId}-${line.variantId ?? ""}`} className="flex gap-3 p-4">
                  <ProductVisual
                    department={line.product.department}
                    category={line.product.category}
                    className="h-16 w-16 shrink-0"
                    iconClassName="h-7 w-7"
                  />
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${line.product.slug}`}
                      onClick={closeCart}
                      className="text-sm font-medium line-clamp-2 hover:text-brand-600"
                    >
                      {line.product.name}
                    </Link>
                    {line.variantLabel && (
                      <p className="text-xs text-foreground/50 mt-0.5">{line.variantLabel}</p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <QuantityStepper
                        size="sm"
                        value={line.qty}
                        onChange={(qty) => updateQty(line.productId, line.variantId ?? undefined, qty)}
                      />
                      <span className="text-sm font-semibold">{formatINR(line.lineTotal)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(line.productId, line.variantId ?? undefined)}
                    aria-label="Remove item"
                    className="self-start p-1.5 text-foreground/30 hover:text-danger-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-border-subtle p-4 space-y-3">
              <div className="flex items-center justify-between text-sm text-foreground/60">
                <span>Subtotal</span>
                <span>{formatINR(totals.subtotal)}</span>
              </div>
              {totals.installationTotal > 0 && (
                <div className="flex items-center justify-between text-sm text-foreground/60">
                  <span>Installation</span>
                  <span>{formatINR(totals.installationTotal)}</span>
                </div>
              )}
              <div className="flex items-center justify-between font-semibold">
                <span>Total</span>
                <span>{formatINR(totals.grandTotal)}</span>
              </div>
              <Button href="/checkout" onClick={closeCart} fullWidth size="lg">
                Checkout
              </Button>
              <Button href="/cart" onClick={closeCart} variant="outline" fullWidth>
                View Cart
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
    </Portal>
  );
}
