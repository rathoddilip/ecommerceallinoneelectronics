import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/session";
import { getOrCreateCart, buildCartResponse } from "@/lib/server/cart";

interface AddBody {
  productId: string;
  variantId?: string | null;
  qty?: number;
  addInstallation?: boolean;
  addAmcPlanId?: string | null;
}

// POST: add (or increment) a line item
export async function POST(req: Request) {
  const sessionId = await getOrCreateSessionId();
  const body = (await req.json()) as AddBody;
  if (!body.productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  const cart = await getOrCreateCart(sessionId);
  const variantId = body.variantId ?? null;

  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId: body.productId, variantId },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { qty: existing.qty + (body.qty ?? 1) },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId: body.productId,
        variantId,
        qty: body.qty ?? 1,
        addInstallation: body.addInstallation ?? false,
        addAmcPlanId: body.addAmcPlanId ?? null,
      },
    });
  }

  return NextResponse.json(await buildCartResponse(sessionId));
}

interface UpdateBody {
  productId: string;
  variantId?: string | null;
  qty?: number;
  addInstallation?: boolean;
  addAmcPlanId?: string | null;
}

// PATCH: update qty / installation / amc plan for a line item. qty <= 0 removes it.
export async function PATCH(req: Request) {
  const sessionId = await getOrCreateSessionId();
  const body = (await req.json()) as UpdateBody;
  const cart = await getOrCreateCart(sessionId);
  const variantId = body.variantId ?? null;

  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId: body.productId, variantId },
  });
  if (!existing) return NextResponse.json(await buildCartResponse(sessionId));

  if (body.qty !== undefined && body.qty <= 0) {
    await prisma.cartItem.delete({ where: { id: existing.id } });
  } else {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: {
        qty: body.qty ?? existing.qty,
        addInstallation: body.addInstallation ?? existing.addInstallation,
        addAmcPlanId:
          body.addAmcPlanId === undefined ? existing.addAmcPlanId : body.addAmcPlanId,
      },
    });
  }

  return NextResponse.json(await buildCartResponse(sessionId));
}

// DELETE: remove a line item entirely (?productId=&variantId=)
export async function DELETE(req: Request) {
  const sessionId = await getOrCreateSessionId();
  const url = new URL(req.url);
  const productId = url.searchParams.get("productId");
  const variantId = url.searchParams.get("variantId");
  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  const cart = await getOrCreateCart(sessionId);
  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id, productId, variantId: variantId || null },
  });

  return NextResponse.json(await buildCartResponse(sessionId));
}
