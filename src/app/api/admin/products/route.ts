import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized, AdminAuthError } from "@/lib/admin/guard";
import { productInclude, serializeProduct, toDeptEnum } from "@/lib/serializers";

export async function GET() {
  try {
    await requireAdmin();
  } catch (e) {
    if (e instanceof AdminAuthError) return unauthorized();
    throw e;
  }

  const rows = await prisma.product.findMany({ ...productInclude, orderBy: { createdAt: "desc" } });
  return NextResponse.json(rows.map(serializeProduct));
}

interface NewProductBody {
  name: string;
  slug: string;
  brand: string;
  department: string;
  category: string;
  categoryLabel: string;
  shortDescription: string;
  description: string;
  mrp: number;
  price: number;
  gstRate: number;
  stock: number;
  warrantyMonths: number;
  returnDays: number;
  isReturnable: boolean;
  installation: "none" | "free" | "paid";
  installationFee: number;
  amcEligible: boolean;
  whatsInTheBox: string[];
  attributes: { label: string; value: string }[];
  tags: string[];
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch (e) {
    if (e instanceof AdminAuthError) return unauthorized();
    throw e;
  }

  const body = (await req.json()) as NewProductBody;
  if (!body.name || !body.slug) {
    return NextResponse.json({ error: "name and slug are required" }, { status: 400 });
  }

  const created = await prisma.product.create({
    data: {
      name: body.name,
      slug: body.slug,
      brand: body.brand,
      department: toDeptEnum(body.department) as never,
      category: body.category,
      categoryLabel: body.categoryLabel,
      shortDescription: body.shortDescription,
      description: body.description,
      mrp: body.mrp,
      price: body.price,
      gstRate: body.gstRate,
      stock: body.stock,
      warrantyMonths: body.warrantyMonths,
      returnDays: body.returnDays,
      isReturnable: body.isReturnable,
      installation: body.installation,
      installationFee: body.installationFee,
      amcEligible: body.amcEligible,
      whatsInTheBox: body.whatsInTheBox ?? [],
      attributes: (body.attributes ?? []) as object,
      tags: body.tags ?? [],
    },
    ...productInclude,
  });

  return NextResponse.json(serializeProduct(created), { status: 201 });
}
