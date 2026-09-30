import HeroSlider from "@/components/home/HeroSlider";
import DepartmentShowcase from "@/components/home/DepartmentShowcase";
import ServicePromo from "@/components/home/ServicePromo";
import BrandStrip from "@/components/home/BrandStrip";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import Section from "@/components/ui/Section";
import ProductRail from "@/components/product/ProductRail";
import { products } from "@/lib/data/products";

export default function Home() {
  const deals = products.filter((p) => p.tags.includes("deal")).slice(0, 8);
  const bestsellers = products.filter((p) => p.tags.includes("bestseller")).slice(0, 8);
  const topRatedPurifiers = products
    .filter((p) => p.department === "water-purifiers")
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  return (
    <div>
      <HeroSlider />
      <DepartmentShowcase />

      <Section title="Deals of the Day" subtitle="Limited-time offers, refreshed daily" viewAllHref="/products?sort=discount">
        <ProductRail products={deals} />
      </Section>

      <ServicePromo />

      <Section title="Best Sellers" subtitle="Loved by thousands of customers across India" viewAllHref="/products?sort=popularity">
        <ProductRail products={bestsellers} />
      </Section>

      <Section
        title="Top-Rated Water Purifiers"
        subtitle="RO, UV & UF purifiers with free installation and AMC support"
        viewAllHref="/products?dept=water-purifiers"
      >
        <ProductRail products={topRatedPurifiers} />
      </Section>

      <BrandStrip />

      <Section title="What our customers say">
        <Testimonials />
      </Section>

      <Newsletter />
    </div>
  );
}
