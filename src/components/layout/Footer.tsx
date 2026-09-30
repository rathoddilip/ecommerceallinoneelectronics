import Link from "next/link";
import { Zap, Mail, Phone, MapPin } from "lucide-react";
import { departments } from "@/lib/data/categories";

function SocialIcon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" width={15} height={15} fill="currentColor" aria-hidden>
      <path d={path} />
    </svg>
  );
}

const socialIcons = [
  // Facebook
  "M22 12.06C22 6.53 17.52 2.06 12 2.06S2 6.53 2 12.06c0 5 3.66 9.13 8.44 9.88v-6.99H7.9v-2.9h2.54V9.83c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.45 2.9h-2.33V21.9c4.78-.75 8.44-4.88 8.44-9.84z",
  // Instagram
  "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.97.24 2.43.4.6.23 1.03.51 1.48.96.45.45.73.88.96 1.48.16.46.35 1.26.4 2.43.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.97-.4 2.43a4 4 0 0 1-.96 1.48 4 4 0 0 1-1.48.96c-.46.16-1.26.35-2.43.4-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.24-2.43-.4a4 4 0 0 1-1.48-.96 4 4 0 0 1-.96-1.48c-.16-.46-.35-1.26-.4-2.43C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.24-1.97.4-2.43.23-.6.51-1.03.96-1.48.45-.45.88-.73 1.48-.96.46-.16 1.26-.35 2.43-.4C8.42 2.17 8.8 2.16 12 2.16zm0 1.8c-3.15 0-3.5.01-4.73.07-1.03.05-1.6.22-1.97.36-.5.19-.85.42-1.22.79-.37.37-.6.72-.79 1.22-.14.37-.3.94-.36 1.97-.06 1.23-.07 1.58-.07 4.73s.01 3.5.07 4.73c.05 1.03.22 1.6.36 1.97.19.5.42.85.79 1.22.37.37.72.6 1.22.79.37.14.94.3 1.97.36 1.23.06 1.58.07 4.73.07s3.5-.01 4.73-.07c1.03-.05 1.6-.22 1.97-.36.5-.19.85-.42 1.22-.79.37-.37.6-.72.79-1.22.14-.37.3-.94.36-1.97.06-1.23.07-1.58.07-4.73s-.01-3.5-.07-4.73c-.05-1.03-.22-1.6-.36-1.97a3.3 3.3 0 0 0-.79-1.22 3.3 3.3 0 0 0-1.22-.79c-.37-.14-.94-.3-1.97-.36-1.23-.06-1.58-.07-4.73-.07zm0 4.6a5.44 5.44 0 1 1 0 10.88 5.44 5.44 0 0 1 0-10.88zm0 1.8a3.64 3.64 0 1 0 0 7.28 3.64 3.64 0 0 0 0-7.28zm5.65-1.99a1.27 1.27 0 1 1-2.54 0 1.27 1.27 0 0 1 2.54 0z",
  // X / Twitter
  "M18.9 2H22l-7.4 8.46L23.3 22h-6.85l-5.37-6.63L4.9 22H1.78l7.93-9.06L1 2h7.02l4.86 6.06L18.9 2zm-1.2 18h1.9L7.4 4h-2l12.3 16z",
  // YouTube
  "M23.5 7.2a3.02 3.02 0 0 0-2.12-2.14C19.5 4.5 12 4.5 12 4.5s-7.5 0-9.38.56A3.02 3.02 0 0 0 .5 7.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 4.8 3.02 3.02 0 0 0 2.12 2.14c1.88.56 9.38.56 9.38.56s7.5 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-4.8zM9.6 15.4V8.6l6.27 3.4-6.27 3.4z",
];

const columns = [
  {
    title: "Shop",
    links: departments.map((d) => ({ label: d.name, href: `/products?dept=${d.slug}` })),
  },
  {
    title: "Services",
    links: [
      { label: "Book Installation / Repair", href: "/service" },
      { label: "AMC Plans", href: "/service/amc" },
      { label: "Water Purifier Guide", href: "/water-purifier-guide" },
      { label: "Track Order", href: "/account/orders" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact Us", href: "/contact" },
      { label: "Careers", href: "/contact" },
      { label: "Blog", href: "/about" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "FAQs", href: "/contact" },
      { label: "Returns & Refunds", href: "/contact" },
      { label: "Shipping Policy", href: "/contact" },
      { label: "Privacy Policy", href: "/contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-border-subtle bg-brand-900 text-white/80">
      <div className="container-page py-12 grid grid-cols-2 gap-8 md:grid-cols-6">
        <div className="col-span-2">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-white">
              <Zap size={18} className="fill-white" />
            </span>
            <span className="font-display font-extrabold text-lg text-white tracking-tight">
              AllInOne<span className="text-accent-400">Electronics</span>
            </span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed text-white/60 max-w-xs">
            Your one-stop shop for electrical goods, electronics and water purifiers —
            with genuine warranty, doorstep installation and dependable after-sales service.
          </p>
          <div className="mt-5 space-y-2 text-sm text-white/60">
            <p className="flex items-center gap-2"><Phone size={14} /> 1800-123-4567 (Toll-free)</p>
            <p className="flex items-center gap-2"><Mail size={14} /> support@allinoneelectronics.in</p>
            <p className="flex items-center gap-2"><MapPin size={14} /> Serving 250+ pincodes across India</p>
          </div>
          <div className="mt-5 flex items-center gap-3">
            {socialIcons.map((path, i) => (
              <span
                key={i}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 cursor-pointer transition-colors"
              >
                <SocialIcon path={path} />
              </span>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-semibold text-white mb-3">{col.title}</h3>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-page py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <p>© {new Date().getFullYear()} AllInOne Electronics. All rights reserved.</p>
          <p>Secure payments via UPI, Cards, Net Banking & COD</p>
        </div>
      </div>
    </footer>
  );
}
