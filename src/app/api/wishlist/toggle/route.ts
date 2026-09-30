import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/session";

export async function POST(req: Request) {
  const sessionId = await getOrCreateSessionId();
  const { productId } = (await req.json()) as { productId: string };

  const existing = await prisma.wishlistItem.findUnique({
    where: { sessionId_productId: { sessionId, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
  } else {
    await prisma.wishlistItem.create({ data: { sessionId, productId } });
  }

  const rows = await prisma.wishlistItem.findMany({ where: { sessionId } });
  return NextResponse.json({ productIds: rows.map((r) => r.productId) });
}
