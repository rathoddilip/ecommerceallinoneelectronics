import { create } from "zustand";
import { apiFetch } from "@/lib/api";
import { computeTotals } from "@/lib/cartSelectors";
import type { CartLineDTO, CartResponse } from "@/lib/server/cart";

interface CartState {
  lines: CartLineDTO[];
  couponCode: string | null;
  totals: CartResponse["totals"];
  hasHydrated: boolean;
  isMutating: boolean;
  couponError: string | null;

  fetchCart: () => Promise<void>;
  addItem: (item: {
    productId: string;
    variantId?: string;
    qty?: number;
    addInstallation?: boolean;
    addAmcPlanId?: string;
  }) => Promise<void>;
  updateQty: (productId: string, variantId: string | undefined, qty: number) => Promise<void>;
  removeItem: (productId: string, variantId?: string) => Promise<void>;
  toggleInstallation: (productId: string, variantId: string | undefined, value: boolean) => Promise<void>;
  setAmcPlan: (productId: string, variantId: string | undefined, planId: string | undefined) => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  clearCart: () => Promise<void>;
}

const emptyTotals = computeTotals([], null);

function qs(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) search.set(k, v);
  const str = search.toString();
  return str ? `?${str}` : "";
}

export const useCartStore = create<CartState>()((set) => ({
  lines: [],
  couponCode: null,
  totals: emptyTotals,
  hasHydrated: false,
  isMutating: false,
  couponError: null,

  fetchCart: async () => {
    const data = await apiFetch<CartResponse>("/api/cart");
    set({ lines: data.lines, couponCode: data.couponCode, totals: data.totals, hasHydrated: true });
  },

  addItem: async (item) => {
    set({ isMutating: true });
    try {
      const data = await apiFetch<CartResponse>("/api/cart/items", {
        method: "POST",
        body: JSON.stringify(item),
      });
      set({ lines: data.lines, couponCode: data.couponCode, totals: data.totals });
    } finally {
      set({ isMutating: false });
    }
  },

  updateQty: async (productId, variantId, qty) => {
    const data = await apiFetch<CartResponse>("/api/cart/items", {
      method: "PATCH",
      body: JSON.stringify({ productId, variantId, qty }),
    });
    set({ lines: data.lines, couponCode: data.couponCode, totals: data.totals });
  },

  removeItem: async (productId, variantId) => {
    const data = await apiFetch<CartResponse>(`/api/cart/items${qs({ productId, variantId })}`, {
      method: "DELETE",
    });
    set({ lines: data.lines, couponCode: data.couponCode, totals: data.totals });
  },

  toggleInstallation: async (productId, variantId, value) => {
    const data = await apiFetch<CartResponse>("/api/cart/items", {
      method: "PATCH",
      body: JSON.stringify({ productId, variantId, addInstallation: value }),
    });
    set({ lines: data.lines, couponCode: data.couponCode, totals: data.totals });
  },

  setAmcPlan: async (productId, variantId, planId) => {
    const data = await apiFetch<CartResponse>("/api/cart/items", {
      method: "PATCH",
      body: JSON.stringify({ productId, variantId, addAmcPlanId: planId ?? null }),
    });
    set({ lines: data.lines, couponCode: data.couponCode, totals: data.totals });
  },

  applyCoupon: async (code) => {
    try {
      const data = await apiFetch<CartResponse>("/api/cart/coupon", {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      set({ lines: data.lines, couponCode: data.couponCode, totals: data.totals, couponError: null });
    } catch (e) {
      set({ couponError: e instanceof Error ? e.message : "Could not apply coupon" });
    }
  },

  removeCoupon: async () => {
    const data = await apiFetch<CartResponse>("/api/cart/coupon", { method: "DELETE" });
    set({ lines: data.lines, couponCode: data.couponCode, totals: data.totals, couponError: null });
  },

  clearCart: async () => {
    const data = await apiFetch<CartResponse>("/api/cart", { method: "DELETE" });
    set({ lines: data.lines, couponCode: data.couponCode, totals: data.totals });
  },
}));

// Kick off the initial fetch once, client-side only.
if (typeof window !== "undefined") {
  useCartStore.getState().fetchCart();
}
