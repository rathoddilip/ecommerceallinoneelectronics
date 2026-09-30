import Link from "next/link";
import { Zap, Tv, Droplets, ArrowRight } from "lucide-react";

const cards = [
  {
    href: "/products?dept=electrical",
    name: "Electrical",
    desc: "Wires, switches, fans, inverters, geysers & more",
    icon: Zap,
    tone: "bg-electrical-500/10 text-electrical-600",
    ring: "hover:border-electrical-500/40",
  },
  {
    href: "/products?dept=electronics",
    name: "Electronics",
    desc: "Mobiles, TVs, audio, appliances & smart devices",
    icon: Tv,
    tone: "bg-electronics-500/10 text-electronics-600",
    ring: "hover:border-electronics-500/40",
  },
  {
    href: "/products?dept=water-purifiers",
    name: "Water Purifiers",
    desc: "RO, UV & UF purifiers with free installation",
    icon: Droplets,
    tone: "bg-water-500/10 text-water-600",
    ring: "hover:border-water-500/40",
  },
];

export default function DepartmentShowcase() {
  return (
    <div className="container-page -mt-8 relative z-10 grid gap-4 sm:grid-cols-3 sm:-mt-10">
      {cards.map(({ href, name, desc, icon: Icon, tone, ring }) => (
        <Link
          key={name}
          href={href}
          className={`group flex items-center gap-4 rounded-2xl border border-border-subtle bg-surface p-5 shadow-sm transition-all hover:shadow-lg ${ring}`}
        >
          <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${tone}`}>
            <Icon size={26} />
          </span>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold">{name}</h3>
            <p className="text-xs text-foreground/55 mt-0.5 line-clamp-2">{desc}</p>
          </div>
          <ArrowRight size={18} className="shrink-0 text-foreground/30 transition-transform group-hover:translate-x-1" />
        </Link>
      ))}
    </div>
  );
}
