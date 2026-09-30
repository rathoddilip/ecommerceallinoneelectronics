import type { Category, Department } from "@/lib/types";

export const departments: {
  slug: Department;
  name: string;
  tagline: string;
}[] = [
  {
    slug: "electrical",
    name: "Electrical",
    tagline: "Wiring, switches, fans, inverters & more",
  },
  {
    slug: "electronics",
    name: "Electronics",
    tagline: "Mobiles, TVs, appliances & smart devices",
  },
  {
    slug: "water-purifiers",
    name: "Water Purifiers",
    tagline: "RO, UV & UF purifiers with free installation",
  },
];

export const categories: Category[] = [
  // Electrical
  { slug: "wires-cables", name: "Wires & Cables", department: "electrical" },
  { slug: "switches-sockets", name: "Switches & Sockets", department: "electrical" },
  { slug: "mcb-distribution", name: "MCB / RCCB & Distribution Boards", department: "electrical" },
  { slug: "led-lights", name: "LED Lights & Bulbs", department: "electrical" },
  { slug: "fans", name: "Ceiling / Wall / Exhaust Fans", department: "electrical" },
  { slug: "water-heaters", name: "Water Heaters / Geysers", department: "electrical" },
  { slug: "inverters-batteries", name: "Inverters & Batteries", department: "electrical" },
  { slug: "stabilizers", name: "Stabilizers", department: "electrical" },

  // Electronics
  { slug: "mobiles-accessories", name: "Mobiles & Accessories", department: "electronics" },
  { slug: "tvs", name: "Televisions", department: "electronics" },
  { slug: "audio", name: "Audio (Speakers, Soundbars, Headphones)", department: "electronics" },
  { slug: "home-appliances", name: "Home Appliances", department: "electronics" },
  { slug: "kitchen-appliances", name: "Kitchen Appliances", department: "electronics" },
  { slug: "computer-accessories", name: "Computer Accessories", department: "electronics" },
  { slug: "cctv-security", name: "CCTV & Security", department: "electronics" },
  { slug: "smart-home", name: "Smart Home Devices", department: "electronics" },

  // Water purifiers
  { slug: "ro-purifiers", name: "RO Purifiers", department: "water-purifiers" },
  { slug: "uv-purifiers", name: "UV Purifiers", department: "water-purifiers" },
  { slug: "ro-uv-uf-combo", name: "RO+UV+UF Combo", department: "water-purifiers" },
  { slug: "gravity-non-electric", name: "Gravity / Non-Electric", department: "water-purifiers" },
  { slug: "commercial-purifiers", name: "Commercial (25-500 LPH)", department: "water-purifiers" },
  { slug: "water-softeners", name: "Water Softeners", department: "water-purifiers" },
  { slug: "spares-filters", name: "Spare Filters & Membranes", department: "water-purifiers" },
];

export function categoriesByDepartment(department: Department) {
  return categories.filter((c) => c.department === department);
}
