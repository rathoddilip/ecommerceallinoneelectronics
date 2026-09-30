import { Suspense } from "react";
import type { Metadata } from "next";
import ShopClient from "@/components/shop/ShopClient";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse electrical goods, electronics and water purifiers with filters for price, brand and ratings.",
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container-page py-20 text-center text-foreground/50">Loading products…</div>}>
      <ShopClient />
    </Suspense>
  );
}
