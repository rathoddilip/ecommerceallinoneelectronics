import { products } from "@/lib/data/products";

export function brandsInDepartment(department: string): string[] {
  const set = new Set<string>();
  products
    .filter((p) => p.department === department)
    .forEach((p) => set.add(p.brand));
  return Array.from(set).sort();
}

export const allBrands = Array.from(new Set(products.map((p) => p.brand))).sort();
