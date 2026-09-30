import type { Metadata } from "next";
import { ShieldCheck, Truck, Wrench, Users, Award, Leaf } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about AllInOne Electronics — our mission, service promise and coverage across India.",
};

const stats = [
  { label: "Pincodes Served", value: "250+" },
  { label: "Products Listed", value: "1,000+" },
  { label: "Verified Technicians", value: "500+" },
  { label: "Orders Delivered", value: "2 lakh+" },
];

const values = [
  { icon: ShieldCheck, title: "Genuine Products", desc: "Every product is 100% authentic with manufacturer warranty." },
  { icon: Wrench, title: "Real After-Sales Service", desc: "From installation to AMC, we stay with you after the sale." },
  { icon: Truck, title: "Reliable Delivery", desc: "Partnered courier network plus our own fleet for large appliances." },
  { icon: Leaf, title: "Energy-Conscious Range", desc: "We highlight energy-efficient and BLDC/5-star rated options." },
];

export default function AboutPage() {
  return (
    <div>
      <div className="bg-brand-900 text-white">
        <div className="container-page py-14">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />
          <h1 className="font-display text-3xl sm:text-4xl font-bold mt-4 max-w-2xl">
            Electrical, electronics & water purifiers — bought and serviced in one place
          </h1>
          <p className="text-white/70 mt-4 max-w-xl">
            AllInOne Electronics started with a simple idea: buying electrical and electronic products shouldn&apos;t
            end at delivery. Installation, AMC and repairs are part of the same promise.
          </p>
        </div>
      </div>

      <div className="container-page py-12">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card-surface p-5 text-center">
              <p className="font-display text-2xl font-extrabold text-brand-600">{s.value}</p>
              <p className="text-xs text-foreground/55 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 items-start">
          <div>
            <h2 className="font-display text-2xl font-bold">Our Story</h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/65">
              We noticed that buying a water purifier, a fan or a TV online was easy — but getting it installed,
              maintained or repaired was a separate, frustrating hunt for a technician. So we built a platform
              where the product and the service that keeps it running live under one roof, tracked from a single
              dashboard.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/65">
              Today we serve customers across electrical essentials, consumer electronics and a dedicated water
              purifier range — each backed by installation support, AMC plans and a technician network that shows
              up when promised.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold">Our Promise</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {values.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="card-surface p-4">
                  <Icon size={20} className="text-brand-500" />
                  <h3 className="font-semibold text-sm mt-2">{title}</h3>
                  <p className="text-xs text-foreground/55 mt-1">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          <div className="card-surface p-6 flex items-start gap-4">
            <Users size={26} className="text-brand-500 shrink-0" />
            <div>
              <h3 className="font-semibold">Join our technician network</h3>
              <p className="text-sm text-foreground/60 mt-1">
                We&apos;re always looking for certified electricians and RO technicians across India. Reach out via our
                contact page to get onboarded.
              </p>
            </div>
          </div>
          <div className="card-surface p-6 flex items-start gap-4">
            <Award size={26} className="text-brand-500 shrink-0" />
            <div>
              <h3 className="font-semibold">Quality you can verify</h3>
              <p className="text-sm text-foreground/60 mt-1">
                ISI-marked electricals, BIS-compliant electronics and NSF-referenced purifiers — every listing
                states its certifications up front.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
