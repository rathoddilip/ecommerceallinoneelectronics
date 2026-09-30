"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Zap, Tv, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
  {
    key: "electrical",
    eyebrow: "Electrical essentials",
    title: "Power your home, the safe way",
    subtitle: "ISI-marked wires, switches, fans & inverters with expert installation.",
    cta: "Shop Electrical",
    href: "/products?dept=electrical",
    icon: Zap,
    gradient: "from-electrical-600 via-electrical-500 to-amber-400",
  },
  {
    key: "electronics",
    eyebrow: "Big brands, better prices",
    title: "Upgrade your electronics today",
    subtitle: "Mobiles, TVs, appliances & more — with easy EMI and free delivery.",
    cta: "Shop Electronics",
    href: "/products?dept=electronics",
    icon: Tv,
    gradient: "from-electronics-700 via-electronics-500 to-brand-400",
  },
  {
    key: "water-purifiers",
    eyebrow: "Pure water, guaranteed",
    title: "RO purifiers with free installation",
    subtitle: "Not sure which one you need? Take our 30-second purifier quiz.",
    cta: "Shop Purifiers",
    href: "/products?dept=water-purifiers",
    icon: Droplets,
    gradient: "from-water-700 via-water-500 to-cyan-400",
  },
];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5500);
    return () => clearInterval(id);
  }, []);

  const slide = slides[index];
  const Icon = slide.icon;

  return (
    <div className="relative overflow-hidden">
      <div
        className={cn(
          "relative bg-gradient-to-br transition-colors duration-700",
          slide.gradient
        )}
      >
        <div className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1.5px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="container-page relative flex flex-col-reverse items-center gap-8 py-12 sm:flex-row sm:py-20">
          <div className="flex-1 text-white text-center sm:text-left">
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-white/80">
              {slide.eyebrow}
            </p>
            <h1 className="font-display mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              {slide.title}
            </h1>
            <p className="mt-4 max-w-md mx-auto sm:mx-0 text-white/85 text-sm sm:text-base">
              {slide.subtitle}
            </p>
            <div className="mt-7 flex items-center justify-center sm:justify-start gap-3">
              <Link
                href={slide.href}
                className="inline-flex h-12 items-center rounded-full bg-white px-6 text-sm font-bold text-brand-800 shadow-lg shadow-black/10 hover:bg-white/90 transition-colors"
              >
                {slide.cta}
              </Link>
              <Link
                href="/service"
                className="inline-flex h-12 items-center rounded-full border border-white/40 px-6 text-sm font-bold text-white hover:bg-white/10 transition-colors"
              >
                Book a Service
              </Link>
            </div>
          </div>
          <div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-[2rem] bg-white/15 backdrop-blur sm:h-56 sm:w-56">
            <Icon size={88} strokeWidth={1.1} className="text-white" />
          </div>
        </div>
      </div>

      <button
        onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 hidden -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-white/25 text-white hover:bg-white/40 sm:flex"
      >
        <ChevronLeft size={18} />
      </button>
      <button
        onClick={() => setIndex((i) => (i + 1) % slides.length)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 hidden -translate-y-1/2 h-9 w-9 items-center justify-center rounded-full bg-white/25 text-white hover:bg-white/40 sm:flex"
      >
        <ChevronRight size={18} />
      </button>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
        {slides.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === index ? "w-6 bg-white" : "w-1.5 bg-white/40"
            )}
          />
        ))}
      </div>
    </div>
  );
}
