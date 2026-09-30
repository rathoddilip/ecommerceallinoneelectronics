import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { serializeCategory } from "@/lib/serializers";

export async function GET() {
  const rows = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(rows.map(serializeCategory));
}
