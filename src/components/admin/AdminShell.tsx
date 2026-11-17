"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Wrench,
  Users,
  ShieldCheck,
  LogOut,
  Zap,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import type { AdminSessionUser } from "@/lib/admin/auth";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";
import Portal from "@/components/ui/Portal";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/service-requests", label: "Service Jobs", icon: Wrench },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/amc-plans", label: "AMC Plans", icon: ShieldCheck },
];

function BrandMark() {
  return (
    <div className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
        <Zap size={18} className="fill-white" />
      </span>
      <div>
        <p className="font-display font-bold leading-tight">AllInOne</p>
        <p className="text-xs text-white/50 leading-tight">Admin Panel</p>
      </div>
    </div>
  );
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 px-3 py-4 space-y-0.5">
      {links.map(({ href, label, icon: Icon }) => {
        const active = href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon size={17} /> {label}
          </Link>
        );
      })}
    </nav>
  );
}

function FooterLinks({ onLogout, onNavigate }: { onLogout: () => void; onNavigate?: () => void }) {
  return (
    <div className="border-t border-white/10 p-3 space-y-0.5">
      <Link
        href="/"
        target="_blank"
        onClick={onNavigate}
        className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white"
      >
        <ExternalLink size={16} /> View Store
      </Link>
      <button
        onClick={() => {
          onNavigate?.();
          onLogout();
        }}
        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/5 hover:text-white"
      >
        <LogOut size={16} /> Logout
      </button>
    </div>
  );
}

export default function AdminShell({
  admin,
  children,
}: {
  admin: AdminSessionUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await apiFetch("/api/admin/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-surface-muted/40 flex">
      <aside className="hidden lg:flex w-64 shrink-0 flex-col bg-brand-900 text-white">
        <div className="px-5 py-5 border-b border-white/10">
          <BrandMark />
        </div>
        <NavLinks pathname={pathname} />
        <FooterLinks onLogout={handleLogout} />
      </aside>

      <Portal>
        <div
          className={cn(
            "fixed inset-0 z-[60] lg:hidden transition-opacity",
            mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div
            className={cn(
              "absolute left-0 top-0 flex h-full w-[80%] max-w-xs flex-col bg-brand-900 text-white transition-transform duration-300",
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            <div className="flex items-center justify-between gap-2 px-5 py-5 border-b border-white/10">
              <BrandMark />
              <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-white/10">
                <X size={18} />
              </button>
            </div>
            <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            <FooterLinks onLogout={handleLogout} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      </Portal>

      <div className="flex-1 min-w-0">
        <header className="flex items-center justify-between border-b border-border-subtle bg-surface px-4 py-3 lg:px-8">
          <div className="flex items-center gap-2 lg:hidden">
            <button onClick={() => setMobileOpen(true)} className="p-1.5 -ml-1.5 rounded-lg hover:bg-surface-muted">
              <Menu size={20} />
            </button>
            <p className="font-display font-bold text-lg">Admin</p>
          </div>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold leading-tight">{admin.name}</p>
              <p className="text-xs text-foreground/45 leading-tight capitalize">{admin.role.replace("_", " ")}</p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-700">
              {admin.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
