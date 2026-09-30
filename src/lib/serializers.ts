import type { Prisma } from "@/generated/prisma/client";
import type {
  AmcPlan,
  Category,
  Department,
  Product,
  ProductAttribute,
  ProductVariant,
  Review,
} from "@/lib/types";

const productWithReviews = { include: { reviews: true } } satisfies Prisma.ProductDefaultArgs;
export type ProductRow = Prisma.ProductGetPayload<typeof productWithReviews>;

export function toDeptSlug(dept: string): Department {
  return dept.replace(/_/g, "-") as Department;
}

export function toSlug(value: string): string {
  return value.replace(/_/g, "-");
}

export function toEnumValue(value: string): string {
  return value.replace(/-/g, "_");
}

export function toDeptEnum(dept: string): "electrical" | "electronics" | "water_purifiers" {
  return dept.replace(/-/g, "_") as "electrical" | "electronics" | "water_purifiers";
}

export function serializeProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    brand: row.brand,
    department: toDeptSlug(row.department),
    category: row.category,
    categoryLabel: row.categoryLabel,
    shortDescription: row.shortDescription,
    description: row.description,
    mrp: row.mrp,
    price: row.price,
    gstRate: row.gstRate,
    rating: row.rating,
    reviewCount: row.reviewCount,
    stock: row.stock,
    warrantyMonths: row.warrantyMonths,
    returnDays: row.returnDays,
    isReturnable: row.isReturnable,
    tags: row.tags as string[],
    attributes: row.attributes as unknown as ProductAttribute[],
    variants: (row.variants as unknown as ProductVariant[] | null) ?? undefined,
    installation: row.installation,
    installationFee: row.installationFee,
    amcEligible: row.amcEligible,
    badges: (row.badges as unknown as string[] | null) ?? undefined,
    whatsInTheBox: row.whatsInTheBox as string[],
    reviews: row.reviews.map(
      (r): Review => ({
        id: r.id,
        author: r.author,
        rating: r.rating,
        title: r.title,
        text: r.text,
        date: r.createdAt.toISOString(),
        verified: r.verified,
      })
    ),
  };
}

export function serializeCategory(row: {
  slug: string;
  name: string;
  department: string;
  description: string | null;
}): Category {
  return {
    slug: row.slug,
    name: row.name,
    department: toDeptSlug(row.department),
    description: row.description ?? undefined,
  };
}

export function serializeAmcPlan(row: {
  id: string;
  name: string;
  applicableCategories: string[];
  durationMonths: number;
  visits: number;
  filtersIncluded: boolean;
  breakdownVisitsIncluded: boolean;
  price: number;
  highlight: boolean;
  features: unknown;
}): AmcPlan {
  return {
    id: row.id,
    name: row.name,
    applicableCategories: row.applicableCategories.map(toDeptSlug),
    durationMonths: row.durationMonths,
    visits: row.visits,
    filtersIncluded: row.filtersIncluded,
    breakdownVisitsIncluded: row.breakdownVisitsIncluded,
    price: row.price,
    highlight: row.highlight,
    features: row.features as string[],
  };
}

export const productInclude = productWithReviews;

export function serializeOrder<T extends { status: string }>(row: T): T {
  return { ...row, status: toSlug(row.status) };
}

export function serializeServiceRequest<T extends { type: string }>(row: T): T {
  return { ...row, type: toSlug(row.type) };
}
