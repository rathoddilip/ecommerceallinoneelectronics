import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { getDatabaseUrl } from "../src/lib/db-url";
import { products } from "../src/lib/data/products";
import { categories } from "../src/lib/data/categories";
import { allBrands } from "../src/lib/data/brands";
import { amcPlans } from "../src/lib/data/amcPlans";

neonConfig.webSocketConstructor = ws;
const adapter = new PrismaNeon({ connectionString: getDatabaseUrl()! });
const prisma = new PrismaClient({ adapter });

function toDeptEnum(dept: string) {
  return dept.replace(/-/g, "_") as "electrical" | "electronics" | "water_purifiers";
}

async function main() {
  console.log("Seeding categories...");
  for (const [i, c] of categories.entries()) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {
        name: c.name,
        department: toDeptEnum(c.department),
        description: c.description,
        sortOrder: i,
      },
      create: {
        slug: c.slug,
        name: c.name,
        department: toDeptEnum(c.department),
        description: c.description,
        sortOrder: i,
      },
    });
  }

  console.log("Seeding brands...");
  for (const name of allBrands) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    await prisma.brand.upsert({
      where: { slug },
      update: { name },
      create: { slug, name },
    });
  }

  console.log("Seeding AMC plans...");
  await prisma.amcPlan.deleteMany();
  for (const plan of amcPlans) {
    await prisma.amcPlan.create({
      data: {
        id: plan.id,
        name: plan.name,
        applicableCategories: plan.applicableCategories.map(toDeptEnum),
        durationMonths: plan.durationMonths,
        visits: plan.visits,
        filtersIncluded: plan.filtersIncluded,
        breakdownVisitsIncluded: plan.breakdownVisitsIncluded,
        price: plan.price,
        highlight: plan.highlight ?? false,
        features: plan.features,
      },
    });
  }

  console.log("Seeding products...");
  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        id: p.id,
        slug: p.slug,
        name: p.name,
        brand: p.brand,
        department: toDeptEnum(p.department),
        category: p.category,
        categoryLabel: p.categoryLabel,
        shortDescription: p.shortDescription,
        description: p.description,
        mrp: p.mrp,
        price: p.price,
        gstRate: p.gstRate,
        rating: p.rating,
        reviewCount: p.reviewCount,
        stock: p.stock,
        warrantyMonths: p.warrantyMonths,
        returnDays: p.returnDays,
        isReturnable: p.isReturnable,
        tags: p.tags,
        attributes: p.attributes as object,
        variants: (p.variants as object | undefined) ?? undefined,
        installation: p.installation,
        installationFee: p.installationFee,
        amcEligible: p.amcEligible,
        badges: (p.badges as object | undefined) ?? undefined,
        whatsInTheBox: p.whatsInTheBox,
        reviews: {
          create: p.reviews.map((r) => ({
            author: r.author,
            rating: r.rating,
            title: r.title,
            text: r.text,
            verified: r.verified,
            createdAt: new Date(r.date),
          })),
        },
      },
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
