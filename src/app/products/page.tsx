import { Suspense } from "react";
import type { Metadata } from "next";
import ShopClient from "@/components/shop/ShopClient";
import { prisma } from "@/lib/prisma";
import { productInclude, serializeProduct } from "@/lib/serializers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop All Products",
  description: "Browse electrical goods, electronics and water purifiers with filters for price, brand and ratings.",
};

export default async function ProductsPage() {
  const rows = await prisma.product.findMany({ ...productInclude, orderBy: { createdAt: "asc" } });
  const products = rows.map(serializeProduct);

  return (
    <Suspense fallback={<div className="container-page py-20 text-center text-foreground/50">Loading products…</div>}>
      <ShopClient products={products} />
    </Suspense>
  );
}
