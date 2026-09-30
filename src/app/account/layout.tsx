"use client";

import { UserCircle2 } from "lucide-react";
import { useAccountStore } from "@/lib/store/account";
import AccountNav from "@/components/account/AccountNav";
import Button from "@/components/ui/Button";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = useAccountStore((s) => s.user);
  const hasHydrated = useAccountStore((s) => s.hasHydrated);

  if (hasHydrated && !user) {
    return (
      <div className="container-page py-20 flex flex-col items-center text-center gap-3">
        <UserCircle2 size={56} className="text-foreground/20" />
        <h1 className="font-display text-xl font-bold">You&apos;re not logged in</h1>
        <p className="text-foreground/55 max-w-sm">
          Login to view your orders, service requests, addresses and wishlist.
        </p>
        <Button href="/login?redirect=/account" className="mt-2">Login</Button>
      </div>
    );
  }

  return (
    <div className="container-page py-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "My Account" }]} />
      <div className="mt-4 grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 h-fit">
          <AccountNav />
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
