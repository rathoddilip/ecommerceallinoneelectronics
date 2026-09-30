import { create } from "zustand";
import { apiFetch } from "@/lib/api";
import type {
  Address,
  CustomerProduct,
  Order,
  ServiceRequest,
} from "@/lib/types";

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

  hydrate: () => Promise<void>;
  login: (mobile: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;

  fetchAddresses: () => Promise<void>;
  addAddress: (address: Omit<Address, "id" | "isDefault"> & { isDefault?: boolean }) => Promise<void>;
  updateAddress: (address: Address) => Promise<void>;
  removeAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;

  fetchWishlist: () => Promise<void>;
  toggleWishlist: (productId: string) => Promise<void>;

  fetchOrders: () => Promise<void>;

  fetchServiceRequests: () => Promise<void>;
  updateServiceRequest: (id: string, patch: { status?: string }) => Promise<void>;

  fetchMyProducts: () => Promise<void>;
}

export const useAccountStore = create<AccountState>()((set, get) => ({
  user: null,
  addresses: [],
  wishlist: [],
  orders: [],
  serviceRequests: [],
  myProducts: [],
  hasHydrated: false,

  hydrate: async () => {
    const { user } = await apiFetch<{ user: User | null }>("/api/auth/me");
    set({ user, hasHydrated: true });
    await Promise.all([
      get().fetchAddresses(),
      get().fetchWishlist(),
      user ? get().fetchOrders() : Promise.resolve(),
      user ? get().fetchServiceRequests() : Promise.resolve(),
      user ? get().fetchMyProducts() : Promise.resolve(),
    ]);
  },

  login: async (mobile, name) => {
    const user = await apiFetch<User>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ mobile, name }),
    });
    set({ user });
    await Promise.all([get().fetchOrders(), get().fetchServiceRequests(), get().fetchMyProducts()]);
  },

  logout: async () => {
    await apiFetch("/api/auth/logout", { method: "POST" });
    set({ user: null, orders: [], serviceRequests: [], myProducts: [] });
  },

  fetchAddresses: async () => {
    const addresses = await apiFetch<Address[]>("/api/addresses");
    set({ addresses });
  },
  addAddress: async (address) => {
    await apiFetch<Address>("/api/addresses", { method: "POST", body: JSON.stringify(address) });
    await get().fetchAddresses();
  },
  updateAddress: async (address) => {
    await apiFetch<Address>(`/api/addresses/${address.id}`, {
      method: "PATCH",
      body: JSON.stringify(address),
    });
    await get().fetchAddresses();
  },
  removeAddress: async (id) => {
    await apiFetch(`/api/addresses/${id}`, { method: "DELETE" });
    await get().fetchAddresses();
  },
  setDefaultAddress: async (id) => {
    const addresses = await apiFetch<Address[]>(`/api/addresses/${id}/default`, { method: "POST" });
    set({ addresses });
  },

  fetchWishlist: async () => {
    const { productIds } = await apiFetch<{ productIds: string[] }>("/api/wishlist");
    set({ wishlist: productIds });
  },
  toggleWishlist: async (productId) => {
    const { productIds } = await apiFetch<{ productIds: string[] }>("/api/wishlist/toggle", {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
    set({ wishlist: productIds });
  },

  fetchOrders: async () => {
    const orders = await apiFetch<Order[]>("/api/orders");
    set({ orders });
  },

  fetchServiceRequests: async () => {
    const serviceRequests = await apiFetch<ServiceRequest[]>("/api/service-requests");
    set({ serviceRequests });
  },
  updateServiceRequest: async (id, patch) => {
    await apiFetch(`/api/service-requests/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
    await get().fetchServiceRequests();
  },

  fetchMyProducts: async () => {
    const myProducts = await apiFetch<CustomerProduct[]>("/api/my-products");
    set({ myProducts });
  },
}));

if (typeof window !== "undefined") {
  useAccountStore.getState().hydrate();
}
