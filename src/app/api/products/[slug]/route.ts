import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productInclude, serializeProduct } from "@/lib/serializers";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const row = await prisma.product.findUnique({
    where: { slug },
    ...productInclude,
  });
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serializeProduct(row));
}
