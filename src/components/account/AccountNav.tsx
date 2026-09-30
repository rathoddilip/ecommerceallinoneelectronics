"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  MapPin,
  Heart,
  Wrench,
  Zap,
  LogOut,
} from "lucide-react";
import { useAccountStore } from "@/lib/store/account";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const links = [
  { href: "/account", label: "Dashboard", icon: LayoutDashboard },
  { href: "/account/orders", label: "My Orders", icon: Package },
  { href: "/account/service-requests", label: "Service Requests", icon: Wrench },
  { href: "/account/my-products", label: "My Products", icon: Zap },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
];

export default function AccountNav() {
  const pathname = usePathname();
  const user = useAccountStore((s) => s.user);
  const logout = useAccountStore((s) => s.logout);
  const router = useRouter();

  return (
    <nav className="card-surface p-3">
      {user && (
        <div className="px-3 py-3 mb-1 border-b border-border-subtle">
          <p className="font-semibold text-sm">{user.name}</p>
          <p className="text-xs text-foreground/50">+91 {user.mobile}</p>
        </div>
      )}
      <ul className="space-y-0.5 mt-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === "/account" ? pathname === "/account" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-brand-50 text-brand-700" : "text-foreground/65 hover:bg-surface-muted"
                )}
              >
                <Icon size={16} /> {label}
              </Link>
            </li>
          );
        })}
      </ul>
      {user && (
        <button
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="mt-2 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-danger-500 hover:bg-danger-500/5"
        >
          <LogOut size={16} /> Logout
        </button>
      )}
    </nav>
  );
}
