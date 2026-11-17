import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized, AdminAuthError } from "@/lib/admin/guard";
import { serializeOrder, toEnumValue } from "@/lib/serializers";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch (e) {
    if (e instanceof AdminAuthError) return unauthorized();
    throw e;
  }

  const { id } = await params;
  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serializeOrder(order));
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch (e) {
    if (e instanceof AdminAuthError) return unauthorized();
    throw e;
  }

  const { id } = await params;
  const body = (await req.json()) as { status?: string; paymentStatus?: string };

  const updated = await prisma.order.update({
    where: { id },
    data: {
      status: body.status ? (toEnumValue(body.status) as never) : undefined,
      paymentStatus: body.paymentStatus as never,
    },
    include: { items: true },
  });

  return NextResponse.json(serializeOrder(updated));
}
