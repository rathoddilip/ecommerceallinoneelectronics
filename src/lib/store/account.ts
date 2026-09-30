import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Address,
  CustomerProduct,
  Order,
  ServiceRequest,
} from "@/lib/types";
import { safeJsonStorage } from "@/lib/store/storage";

interface User {
  name: string;
  mobile: string;
  email?: string;
  walletBalance: number;
  referralCode: string;
}

interface AccountState {
  user: User | null;
  addresses: Address[];
  wishlist: string[];
  orders: Order[];
  serviceRequests: ServiceRequest[];
  myProducts: CustomerProduct[];
  hasHydrated: boolean;

  login: (mobile: string, name?: string) => void;
  logout: () => void;

  addAddress: (address: Address) => void;
  updateAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  toggleWishlist: (productId: string) => void;

  placeOrder: (order: Order) => void;

  addServiceRequest: (req: ServiceRequest) => void;
  updateServiceRequest: (id: string, patch: Partial<ServiceRequest>) => void;

  setHasHydrated: (value: boolean) => void;
}

export const useAccountStore = create<AccountState>()(
  persist(
    (set) => ({
      user: null,
      addresses: [],
      wishlist: [],
      orders: [],
      serviceRequests: [],
      myProducts: [
        {
          id: "cp-demo-1",
          productId: "wp-001",
          name: "Kent Grand Plus RO+UV+UF Water Purifier (9L)",
          serialNo: "KGP-208831",
          purchaseDate: "2025-11-02T00:00:00.000Z",
          installDate: "2025-11-05T00:00:00.000Z",
          warrantyEndDate: "2026-11-05T00:00:00.000Z",
          amcStatus: "active",
          nextFilterChangeDate: "2026-11-05T00:00:00.000Z",
        },
      ],
      hasHydrated: false,

      login: (mobile, name) =>
        set({
          user: {
            name: name?.trim() || "Customer",
            mobile,
            walletBalance: 250,
            referralCode: `AOE${mobile.slice(-4)}`,
          },
        }),
      logout: () => set({ user: null }),

      addAddress: (address) =>
        set((state) => ({ addresses: [...state.addresses, address] })),
      updateAddress: (address) =>
        set((state) => ({
          addresses: state.addresses.map((a) => (a.id === address.id ? address : a)),
        })),
      removeAddress: (id) =>
        set((state) => ({ addresses: state.addresses.filter((a) => a.id !== id) })),
      setDefaultAddress: (id) =>
        set((state) => ({
          addresses: state.addresses.map((a) => ({ ...a, isDefault: a.id === id })),
        })),

      toggleWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.includes(productId)
            ? state.wishlist.filter((id) => id !== productId)
            : [...state.wishlist, productId],
        })),

      placeOrder: (order) =>
        set((state) => ({ orders: [order, ...state.orders] })),

      addServiceRequest: (req) =>
        set((state) => ({ serviceRequests: [req, ...state.serviceRequests] })),
      updateServiceRequest: (id, patch) =>
        set((state) => ({
          serviceRequests: state.serviceRequests.map((r) =>
            r.id === id ? { ...r, ...patch } : r
          ),
        })),

      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "aoe-account",
      storage: safeJsonStorage(),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
