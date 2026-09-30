import type { AmcPlan } from "@/lib/types";

export const amcPlans: AmcPlan[] = [
  {
    id: "amc-basic",
    name: "Basic Care",
    applicableCategories: ["water-purifiers"],
    durationMonths: 12,
    visits: 2,
    filtersIncluded: false,
    breakdownVisitsIncluded: false,
    price: 999,
    features: [
      "2 preventive maintenance visits",
      "Free service call charges",
      "Discounted spare parts",
      "SMS reminders before due date",
    ],
  },
  {
    id: "amc-comprehensive",
    name: "Comprehensive Care",
    applicableCategories: ["water-purifiers"],
    durationMonths: 12,
    visits: 4,
    filtersIncluded: true,
    breakdownVisitsIncluded: true,
    price: 2499,
    highlight: true,
    features: [
      "4 preventive maintenance visits",
      "All filters & membrane included",
      "Unlimited breakdown visits",
      "Free TDS testing every visit",
      "Priority technician scheduling",
    ],
  },
  {
    id: "amc-3year",
    name: "Comprehensive Care — 3 Year",
    applicableCategories: ["water-purifiers", "electronics"],
    durationMonths: 36,
    visits: 12,
    filtersIncluded: true,
    breakdownVisitsIncluded: true,
    price: 6499,
    features: [
      "12 preventive maintenance visits over 3 years",
      "All filters & membrane included",
      "Unlimited breakdown visits",
      "Save 15% vs yearly plan",
      "Priority technician scheduling",
    ],
  },
  {
    id: "amc-ac-appliance",
    name: "Appliance Shield",
    applicableCategories: ["electronics", "electrical"],
    durationMonths: 12,
    visits: 2,
    filtersIncluded: false,
    breakdownVisitsIncluded: true,
    price: 1799,
    features: [
      "2 preventive service visits (AC/appliance)",
      "Unlimited breakdown visits",
      "Discounted spare parts",
      "Gas top-up at special rates (AC)",
    ],
  },
];

export function amcPlansFor(department: string) {
  return amcPlans.filter((p) => p.applicableCategories.includes(department as never));
}
