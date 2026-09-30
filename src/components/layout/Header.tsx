"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Search, Heart, ShoppingCart, User, Menu, X, Zap } from "lucide-react";
import MegaMenu from "@/components/layout/MegaMenu";
import CartDrawer from "@/components/cart/CartDrawer";
import Portal from "@/components/ui/Portal";
import { useCartStore } from "@/lib/store/cart";
import { useAccountStore } from "@/lib/store/account";
import { useUIStore } from "@/lib/store/ui";
import { departments, categoriesByDepartment } from "@/lib/data/categories";
import { cn } from "@/lib/utils";

export default function Header() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDept, setOpenDept] = useState<string | null>(null);

  const cartCount = useCartStore((s) => s.totals.itemCount);
  const wishlistCount = useAccountStore((s) => s.wishlist.length);
  const user = useAccountStore((s) => s.user);
  const openCart = useUIStore((s) => s.openCart);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setMobileOpen(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur border-b border-border-subtle">
      <div className="container-page flex items-center gap-4 py-3">
        <button
          className="lg:hidden shrink-0 p-2 -ml-2 rounded-lg hover:bg-surface-muted"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
            <Zap size={18} className="fill-white" />
          </span>
          <span className="font-display font-extrabold text-lg tracking-tight hidden sm:block">
            AllInOne<span className="text-brand-500">Electronics</span>
          </span>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-2xl hidden sm:block">
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="Search for products, brands and more"
              className="w-full h-11 rounded-full border border-border-subtle bg-surface-muted pl-4 pr-11 text-sm outline-none focus:border-brand-500 focus:bg-surface focus:ring-2 focus:ring-brand-500/15 transition-colors"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-white hover:bg-brand-600"
            >
              <Search size={15} />
            </button>
          </div>
        </form>

        <div className="flex items-center gap-1 ml-auto shrink-0">
          <Link
            href="/search"
            className="sm:hidden p-2.5 rounded-lg hover:bg-surface-muted"
            aria-label="Search"
          >
            <Search size={20} />
          </Link>
          <Link
            href={user ? "/account" : "/login"}
            className="hidden sm:flex flex-col items-center px-2.5 py-1.5 rounded-lg hover:bg-surface-muted text-xs"
          >
            <User size={19} />
            <span className="mt-0.5 text-foreground/70">{user ? user.name.split(" ")[0] : "Login"}</span>
          </Link>
          <Link
            href="/account/wishlist"
            className="relative hidden sm:flex flex-col items-center px-2.5 py-1.5 rounded-lg hover:bg-surface-muted text-xs"
          >
            <Heart size={19} />
            <span className="mt-0.5 text-foreground/70">Wishlist</span>
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-500 px-1 text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>
          <button
            onClick={openCart}
            className="relative flex flex-col items-center px-2.5 py-1.5 rounded-lg hover:bg-surface-muted text-xs"
          >
            <ShoppingCart size={19} />
            <span className="mt-0.5 text-foreground/70 hidden sm:block">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-0.5 right-0.5 sm:right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-500 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="border-t border-border-subtle">
        <div className="container-page">
          <MegaMenu />
        </div>
      </div>

      {/* Mobile menu */}
      <Portal>
      <div
        className={cn(
          "fixed inset-0 z-[60] lg:hidden transition-opacity",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-[85%] max-w-sm bg-surface transition-transform duration-300 overflow-y-auto",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b border-border-subtle">
            <span className="font-display font-bold">Menu</span>
            <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg hover:bg-surface-muted">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSearch} className="p-4">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder="Search products"
                className="w-full h-11 rounded-full border border-border-subtle bg-surface-muted pl-4 pr-11 text-sm outline-none"
              />
              <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-white">
                <Search size={15} />
              </button>
            </div>
          </form>
          <div className="px-2 pb-6">
            {departments.map((dept) => (
              <div key={dept.slug} className="border-b border-border-subtle last:border-0">
                <button
                  onClick={() => setOpenDept(openDept === dept.slug ? null : dept.slug)}
                  className="w-full flex items-center justify-between px-3 py-3 text-sm font-semibold"
                >
                  {dept.name}
                  <span className="text-foreground/40">{openDept === dept.slug ? "−" : "+"}</span>
                </button>
                {openDept === dept.slug && (
                  <div className="pb-2">
                    {categoriesByDepartment(dept.slug).map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/products?dept=${dept.slug}&category=${cat.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="block px-5 py-2 text-sm text-foreground/65"
                      >
                        {cat.name}
                      </Link>
                    ))}
                    <Link
                      href={`/products?dept=${dept.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="block px-5 py-2 text-sm font-medium text-brand-600"
                    >
                      Shop all {dept.name}
                    </Link>
                  </div>
                )}
              </div>
            ))}
            <Link href="/service" onClick={() => setMobileOpen(false)} className="block px-3 py-3 text-sm font-semibold border-b border-border-subtle">
              Book a Service
            </Link>
            <Link href="/service/amc" onClick={() => setMobileOpen(false)} className="block px-3 py-3 text-sm font-semibold border-b border-border-subtle">
              AMC Plans
            </Link>
            <Link href="/water-purifier-guide" onClick={() => setMobileOpen(false)} className="block px-3 py-3 text-sm font-semibold border-b border-border-subtle">
              Purifier Guide
            </Link>
            <Link href={user ? "/account" : "/login"} onClick={() => setMobileOpen(false)} className="block px-3 py-3 text-sm font-semibold">
              {user ? "My Account" : "Login / Sign up"}
            </Link>
          </div>
        </div>
      </div>
      </Portal>

      <CartDrawer />
    </header>
  );
}
