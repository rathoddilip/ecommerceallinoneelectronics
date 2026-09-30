import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/lib/types";
import { safeJsonStorage } from "@/lib/store/storage";

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  hasHydrated: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQty: (productId: string, variantId: string | undefined, qty: number) => void;
  toggleInstallation: (productId: string, variantId: string | undefined, value: boolean) => void;
  setAmcPlan: (productId: string, variantId: string | undefined, planId: string | undefined) => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  setHasHydrated: (value: boolean) => void;
}

function sameLine(a: CartItem, productId: string, variantId?: string) {
  return a.productId === productId && a.variantId === variantId;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      couponCode: null,
      hasHydrated: false,
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => sameLine(i, item.productId, item.variantId));
          if (existing) {
            return {
              items: state.items.map((i) =>
                sameLine(i, item.productId, item.variantId)
                  ? { ...i, qty: i.qty + item.qty }
                  : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (productId, variantId) =>
        set((state) => ({
          items: state.items.filter((i) => !sameLine(i, productId, variantId)),
        })),
      updateQty: (productId, variantId, qty) =>
        set((state) => ({
          items: state.items
            .map((i) => (sameLine(i, productId, variantId) ? { ...i, qty } : i))
            .filter((i) => i.qty > 0),
        })),
      toggleInstallation: (productId, variantId, value) =>
        set((state) => ({
          items: state.items.map((i) =>
            sameLine(i, productId, variantId) ? { ...i, addInstallation: value } : i
          ),
        })),
      setAmcPlan: (productId, variantId, planId) =>
        set((state) => ({
          items: state.items.map((i) =>
            sameLine(i, productId, variantId) ? { ...i, addAmcPlanId: planId } : i
          ),
        })),
      applyCoupon: (code) => set({ couponCode: code }),
      removeCoupon: () => set({ couponCode: null }),
      clearCart: () => set({ items: [], couponCode: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "aoe-cart",
      storage: safeJsonStorage(),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
