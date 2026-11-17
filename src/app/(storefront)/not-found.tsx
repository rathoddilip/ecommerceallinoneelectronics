import { SearchX } from "lucide-react";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-page py-24 flex flex-col items-center text-center gap-3">
      <SearchX size={56} className="text-foreground/20" />
      <h1 className="font-display text-2xl font-bold">Page not found</h1>
      <p className="text-foreground/55 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or may have moved.
      </p>
      <div className="flex gap-3 mt-2">
        <Button href="/">Go Home</Button>
        <Button href="/products" variant="outline">Browse Products</Button>
      </div>
    </div>
  );
}
