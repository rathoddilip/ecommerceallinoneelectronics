import { NextResponse } from "next/server";
import { getOrCreateSessionId } from "@/lib/session";
import { getOrCreateCart, buildCartResponse } from "@/lib/server/cart";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const sessionId = await getOrCreateSessionId();
  const { code } = (await req.json()) as { code: string };
  const cart = await getOrCreateCart(sessionId);

  // Validate by checking the resulting discount is non-zero before persisting.
  await prisma.cart.update({ where: { id: cart.id }, data: { couponCode: code } });
  const data = await buildCartResponse(sessionId);

  if (data.totals.couponDiscount <= 0) {
    await prisma.cart.update({ where: { id: cart.id }, data: { couponCode: null } });
    return NextResponse.json(
      { error: "Invalid or inapplicable coupon code" },
      { status: 400 }
    );
  }

  return NextResponse.json(data);
}

export async function DELETE() {
  const sessionId = await getOrCreateSessionId();
  const cart = await getOrCreateCart(sessionId);
  await prisma.cart.update({ where: { id: cart.id }, data: { couponCode: null } });
  return NextResponse.json(await buildCartResponse(sessionId));
}
