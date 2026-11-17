import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { productInclude, serializeProduct } from "@/lib/serializers";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductForm, { productToForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await prisma.product.findUnique({ where: { id }, ...productInclude });
  if (!row) notFound();
  const product = serializeProduct(row);

  return (
    <div className="space-y-5 max-w-3xl">
      <Breadcrumbs items={[{ label: "Products", href: "/admin/products" }, { label: product.name }]} />
      <h1 className="font-display text-2xl font-bold tracking-tight">Edit Product</h1>
      <ProductForm initial={productToForm(product)} productId={product.id} />
    </div>
  );
}
