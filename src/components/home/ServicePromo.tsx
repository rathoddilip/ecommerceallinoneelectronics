import Link from "next/link";
import { Wrench, ShieldCheck, CalendarClock, Droplet } from "lucide-react";

const items = [
  {
    icon: Wrench,
    title: "Book Installation",
    desc: "Professional setup for purifiers, ACs, geysers & TVs at your doorstep.",
    href: "/service",
  },
  {
    icon: ShieldCheck,
    title: "AMC Plans",
    desc: "Annual maintenance plans with filter changes & unlimited breakdown visits.",
    href: "/service/amc",
  },
  {
    icon: Droplet,
    title: "Which Purifier Do I Need?",
    desc: "Answer 3 quick questions and get a personalised recommendation.",
    href: "/water-purifier-guide",
  },
  {
    icon: CalendarClock,
    title: "Track a Service Job",
    desc: "Reschedule, cancel or check the status of your technician visit.",
    href: "/account/service-requests",
  },
];

export default function ServicePromo() {
  return (
    <section className="bg-water-600">
      <div className="container-page py-10 md:py-14">
        <div className="mb-6 text-center sm:text-left">
          <h2 className="font-display text-xl md:text-2xl font-bold text-white">
            Not just products — full-service support
          </h2>
          <p className="text-white/75 text-sm mt-1">
            Installation, AMC and repairs booked and tracked in one place.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, desc, href }) => (
            <Link
              key={title}
              href={href}
              className="group rounded-2xl bg-white/10 p-5 backdrop-blur transition-colors hover:bg-white/20"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white">
                <Icon size={20} />
              </span>
              <h3 className="mt-4 font-semibold text-white">{title}</h3>
              <p className="mt-1 text-sm text-white/70 leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
