import type { PersistStorage, StorageValue } from "zustand/middleware";

export function safeJsonStorage<T>(): PersistStorage<T> {
  return {
    getItem: (name) => {
      if (typeof window === "undefined") return null;
      const str = window.localStorage.getItem(name);
      if (!str) return null;
      try {
        return JSON.parse(str) as StorageValue<T>;
      } catch {
        return null;
      }
    },
    setItem: (name, value) => {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name) => {
      if (typeof window === "undefined") return;
      window.localStorage.removeItem(name);
    },
  };
}
