"use client";

import { useEffect } from "react";
import { AlertTriangle, Zap } from "lucide-react";
import Button from "@/components/ui/Button";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-900 px-4">
      <div className="w-full max-w-sm text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white mb-4">
          <Zap size={22} className="fill-white" />
        </span>
        <div className="card-surface p-6 space-y-3">
          <AlertTriangle size={40} className="text-danger-500/70 mx-auto" />
          <h1 className="font-display text-lg font-bold">Something went wrong</h1>
          <p className="text-sm text-foreground/55">
            This admin page hit an unexpected error. Try again, or go back to the dashboard.
          </p>
          <div className="flex justify-center gap-3 pt-1">
            <Button onClick={reset} size="sm">Try Again</Button>
            <Button href="/admin" variant="outline" size="sm">Dashboard</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
