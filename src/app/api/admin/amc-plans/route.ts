import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized, AdminAuthError } from "@/lib/admin/guard";
import { serializeAmcPlan, toDeptEnum } from "@/lib/serializers";

export async function GET() {
  try {
    await requireAdmin();
  } catch (e) {
    if (e instanceof AdminAuthError) return unauthorized();
    throw e;
  }

  const rows = await prisma.amcPlan.findMany();
  return NextResponse.json(rows.map(serializeAmcPlan));
}

interface NewPlanBody {
  name: string;
  applicableCategories: string[];
  durationMonths: number;
  visits: number;
  filtersIncluded: boolean;
  breakdownVisitsIncluded: boolean;
  price: number;
  highlight?: boolean;
  features: string[];
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch (e) {
    if (e instanceof AdminAuthError) return unauthorized();
    throw e;
  }

  const body = (await req.json()) as NewPlanBody;
  const created = await prisma.amcPlan.create({
    data: {
      name: body.name,
      applicableCategories: body.applicableCategories.map(toDeptEnum) as never,
      durationMonths: body.durationMonths,
      visits: body.visits,
      filtersIncluded: body.filtersIncluded,
      breakdownVisitsIncluded: body.breakdownVisitsIncluded,
      price: body.price,
      highlight: body.highlight ?? false,
      features: body.features ?? [],
    },
  });

  return NextResponse.json(serializeAmcPlan(created), { status: 201 });
}
