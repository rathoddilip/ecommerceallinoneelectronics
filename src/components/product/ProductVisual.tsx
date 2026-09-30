import {
  Cable,
  ToggleLeft,
  Rows3,
  Lightbulb,
  Fan,
  Flame,
  BatteryCharging,
  Gauge,
  Smartphone,
  Tv,
  Speaker,
  Refrigerator,
  CookingPot,
  Keyboard,
  Camera,
  Home,
  Droplets,
  Waves,
  Filter,
  Factory,
  ShowerHead,
  type LucideIcon,
} from "lucide-react";
import type { Department } from "@/lib/types";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, LucideIcon> = {
  "wires-cables": Cable,
  "switches-sockets": ToggleLeft,
  "mcb-distribution": Rows3,
  "led-lights": Lightbulb,
  fans: Fan,
  "water-heaters": Flame,
  "inverters-batteries": BatteryCharging,
  stabilizers: Gauge,
  "mobiles-accessories": Smartphone,
  tvs: Tv,
  audio: Speaker,
  "home-appliances": Refrigerator,
  "kitchen-appliances": CookingPot,
  "computer-accessories": Keyboard,
  "cctv-security": Camera,
  "smart-home": Home,
  "ro-purifiers": Droplets,
  "uv-purifiers": Waves,
  "ro-uv-uf-combo": Droplets,
  "gravity-non-electric": ShowerHead,
  "commercial-purifiers": Factory,
  "water-softeners": Waves,
  "spares-filters": Filter,
};

const departmentGradient: Record<Department, string> = {
  electrical: "from-electrical-500/15 via-electrical-500/5 to-transparent",
  electronics: "from-electronics-500/15 via-electronics-500/5 to-transparent",
  "water-purifiers": "from-water-500/15 via-water-500/5 to-transparent",
};

const departmentIconColor: Record<Department, string> = {
  electrical: "text-electrical-600",
  electronics: "text-electronics-600",
  "water-purifiers": "text-water-600",
};

export default function ProductVisual({
  department,
  category,
  className,
  iconClassName,
}: {
  department: Department;
  category: string;
  className?: string;
  iconClassName?: string;
}) {
  const Icon = categoryIcons[category] ?? Lightbulb;
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br",
        departmentGradient[department],
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "16px 16px",
        }}
      />
      <Icon
        className={cn(departmentIconColor[department], "relative", iconClassName)}
        strokeWidth={1.4}
      />
    </div>
  );
}
