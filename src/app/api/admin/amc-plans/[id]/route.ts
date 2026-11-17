import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized, AdminAuthError } from "@/lib/admin/guard";
import { serializeAmcPlan, toDeptEnum } from "@/lib/serializers";

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
  if (Array.isArray(data.applicableCategories)) {
    data.applicableCategories = (data.applicableCategories as string[]).map(toDeptEnum);
  }

  const updated = await prisma.amcPlan.update({ where: { id }, data });
  return NextResponse.json(serializeAmcPlan(updated));
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
  await prisma.amcPlan.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
