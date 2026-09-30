"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "How do I book installation for a product I already bought?",
    a: "Go to Account → My Products, find the product and tap 'Book Service', or use the general Book a Service page and select 'New Installation'.",
  },
  {
    q: "What is your return policy?",
    a: "Most electronics can be returned within 7 days and electrical items within 10 days of delivery, unless marked non-returnable (like cut-length cables or opened filters). Installed water purifiers are covered for replacement only in case of manufacturing defects, verified by a technician visit.",
  },
  {
    q: "Is Cash on Delivery available?",
    a: "Yes, COD is available on eligible orders up to a value set at checkout. Prepaid options include UPI, cards, net banking and wallets.",
  },
  {
    q: "How do AMC plans work?",
    a: "AMC (Annual Maintenance Contract) plans bundle preventive visits, filter changes and breakdown cover into one annual price. You can add a plan while buying an eligible product, or later from the AMC Plans page.",
  },
  {
    q: "Which cities do you deliver and install in?",
    a: "We currently deliver to 250+ pincodes across India, with installation and service coverage concentrated in major cities. Use the pincode checker on any product page to confirm serviceability in your area.",
  },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border-subtle rounded-2xl border border-border-subtle overflow-hidden">
      {faqs.map((faq, i) => (
        <div key={faq.q}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
          >
            <span className="text-sm font-semibold">{faq.q}</span>
            <ChevronDown size={16} className={cn("shrink-0 text-foreground/40 transition-transform", open === i && "rotate-180")} />
          </button>
          {open === i && <p className="px-5 pb-4 text-sm text-foreground/60 leading-relaxed">{faq.a}</p>}
        </div>
      ))}
    </div>
  );
}
