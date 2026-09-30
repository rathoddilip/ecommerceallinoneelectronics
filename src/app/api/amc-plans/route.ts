import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeAmcPlan } from "@/lib/serializers";

export async function GET() {
  const rows = await prisma.amcPlan.findMany();
  return NextResponse.json(rows.map(serializeAmcPlan));
}
