import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productInclude, serializeProduct } from "@/lib/serializers";

export async function GET() {
  const rows = await prisma.product.findMany({
    ...productInclude,
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(rows.map(serializeProduct));
}
