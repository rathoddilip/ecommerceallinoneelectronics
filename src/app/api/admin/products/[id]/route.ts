import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized, AdminAuthError } from "@/lib/admin/guard";
import { productInclude, serializeProduct, toDeptEnum } from "@/lib/serializers";

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
  const body = (await req.json()) as Record<string, unknown>;

  const data: Record<string, unknown> = { ...body };
  if (typeof data.department === "string") data.department = toDeptEnum(data.department);
  if (data.attributes) data.attributes = data.attributes as object;

  const updated = await prisma.product.update({
    where: { id },
    data,
    ...productInclude,
  });

  return NextResponse.json(serializeProduct(updated));
}

export async function DELETE(
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
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
