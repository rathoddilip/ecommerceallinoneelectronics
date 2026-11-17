import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized, AdminAuthError } from "@/lib/admin/guard";
import { serializeServiceRequest, toEnumValue } from "@/lib/serializers";

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
  const body = (await req.json()) as { status?: string; technicianName?: string };

  const updated = await prisma.serviceRequest.update({
    where: { id },
    data: {
      status: body.status ? (toEnumValue(body.status) as never) : undefined,
      technicianName: body.technicianName,
    },
    include: { address: true },
  });

  return NextResponse.json(serializeServiceRequest(updated));
}
