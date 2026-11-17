"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";

export default function StorefrontError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page py-24 flex flex-col items-center text-center gap-3">
      <AlertTriangle size={56} className="text-danger-500/70" />
      <h1 className="font-display text-2xl font-bold">Something went wrong</h1>
      <p className="text-foreground/55 max-w-sm">
        We hit an unexpected error loading this page. Please try again, or head back home.
      </p>
      <div className="flex gap-3 mt-2">
        <Button onClick={reset}>Try Again</Button>
        <Button href="/" variant="outline">Go Home</Button>
      </div>
    </div>
  );
}
