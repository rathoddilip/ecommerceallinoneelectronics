import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Meena Joshi",
    city: "Pune",
    text: "Ordered a water purifier and the technician installed it the very next day. Genuinely impressed with the service quality.",
    rating: 5,
  },
  {
    name: "Arvind Suri",
    city: "Lucknow",
    text: "Great prices on electrical items and the AMC plan for my AC has saved me so many repair calls already.",
    rating: 5,
  },
  {
    name: "Faisal Ahmed",
    city: "Hyderabad",
    text: "The CCTV kit installation was smooth, and support answered all my questions on WhatsApp within minutes.",
    rating: 4,
  },
];

export default function Testimonials() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {testimonials.map((t) => (
        <div key={t.name} className="card-surface p-6">
          <Quote size={22} className="text-brand-200" />
          <p className="mt-3 text-sm text-foreground/75 leading-relaxed">{t.text}</p>
          <div className="mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">{t.name}</p>
              <p className="text-xs text-foreground/45">{t.city}</p>
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < t.rating ? "fill-accent-400 text-accent-400" : "text-border-subtle"}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
