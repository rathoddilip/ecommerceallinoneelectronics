import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/session";
import { serializeProduct } from "@/lib/serializers";

export async function GET() {
  const sessionId = await getOrCreateSessionId();
  const rows = await prisma.wishlistItem.findMany({
    where: { sessionId },
    include: { product: { include: { reviews: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({
    productIds: rows.map((r) => r.productId),
    products: rows.map((r) => serializeProduct(r.product)),
  });
}
