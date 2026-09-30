import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/session";
import { buildCartResponse } from "@/lib/server/cart";

export async function GET() {
  const sessionId = await getOrCreateSessionId();
  const data = await buildCartResponse(sessionId);
  return NextResponse.json(data);
}

export async function DELETE() {
  const sessionId = await getOrCreateSessionId();
  const cart = await prisma.cart.findUnique({ where: { sessionId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    await prisma.cart.update({ where: { id: cart.id }, data: { couponCode: null } });
  }
  const data = await buildCartResponse(sessionId);
  return NextResponse.json(data);
}
