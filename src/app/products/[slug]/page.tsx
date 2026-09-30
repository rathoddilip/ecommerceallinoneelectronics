import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductBySlug, products, relatedProducts } from "@/lib/data/products";
import { categories, departments } from "@/lib/data/categories";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductDetailClient from "@/components/product/ProductDetailClient";
import ProductRail from "@/components/product/ProductRail";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
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
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const dept = departments.find((d) => d.slug === product.department);
  const category = categories.find((c) => c.slug === product.category);
  const related = relatedProducts(product);

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
