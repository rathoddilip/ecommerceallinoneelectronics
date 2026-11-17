import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ProductForm, { emptyProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-5 max-w-3xl">
      <Breadcrumbs items={[{ label: "Products", href: "/admin/products" }, { label: "New Product" }]} />
      <h1 className="font-display text-2xl font-bold tracking-tight">Add Product</h1>
      <ProductForm initial={emptyProductForm()} />
    </div>
  );
}
