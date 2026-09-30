import { Truck, ShieldCheck, Wrench, BadgePercent } from "lucide-react";

const items = [
  { icon: Truck, text: "Free delivery above ₹999" },
  { icon: Wrench, text: "Free installation on select purifiers & TVs" },
  { icon: ShieldCheck, text: "100% genuine products & warranty" },
  { icon: BadgePercent, text: "EMI & Cash on Delivery available" },
];

export default function AnnouncementBar() {
  return (
    <div className="hidden md:block bg-brand-900 text-white/90 text-xs">
      <div className="container-page flex items-center justify-center gap-8 py-2">
        {items.map(({ icon: Icon, text }) => (
          <span key={text} className="inline-flex items-center gap-1.5">
            <Icon size={13} className="text-accent-400" />
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
