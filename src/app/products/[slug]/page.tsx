import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { categories, departments } from "@/lib/data/categories";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import ProductRail from "@/components/product/ProductRail";
import { prisma } from "@/lib/prisma";
import { productInclude, serializeProduct } from "@/lib/serializers";
import { toDeptEnum } from "@/lib/serializers";

export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
  const row = await prisma.product.findUnique({ where: { slug }, ...productInclude });
  return row ? serializeProduct(row) : null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const dept = departments.find((d) => d.slug === product.department);
  const category = categories.find((c) => c.slug === product.category);

  const relatedRows = await prisma.product.findMany({
    where: {
      category: product.category,
      department: toDeptEnum(product.department),
      NOT: { id: product.id },
    },
    ...productInclude,
    take: 4,
  });
  const related = relatedRows.map(serializeProduct);

  return (
    <div className="container-page py-6">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: dept?.name ?? "Shop", href: `/products?dept=${product.department}` },
          ...(category
            ? [{ label: category.name, href: `/products?dept=${product.department}&category=${category.slug}` }]
            : []),
          { label: product.name },
        ]}
      />
      <div className="mt-5">
        <ProductDetailClient product={product} />
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="font-display text-xl font-bold tracking-tight mb-6">Similar Products</h2>
          <ProductRail products={related} />
        </div>
      )}
    </div>
  );
}
