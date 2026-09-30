"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingCart, Wrench, User } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/products", label: "Shop", icon: LayoutGrid },
  { href: "/service", label: "Service", icon: Wrench },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/account", label: "Account", icon: User },
];

export default function MobileTabBar() {
  const pathname = usePathname();
  const cartCount = useCartStore((s) => s.totals.itemCount);

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden border-t border-border-subtle bg-surface/95 backdrop-blur">
      <div className="grid grid-cols-5">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex flex-col items-center gap-0.5 py-2.5 text-[11px]",
                active ? "text-brand-600" : "text-foreground/50"
              )}
            >
              <Icon size={19} />
              {label}
              {href === "/cart" && cartCount > 0 && (
                <span className="absolute top-1 right-[28%] flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-500 px-1 text-[9px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
