import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized, AdminAuthError } from "@/lib/admin/guard";
import { serializeServiceRequest } from "@/lib/serializers";

export async function GET() {
  try {
    await requireAdmin();
  } catch (e) {
    if (e instanceof AdminAuthError) return unauthorized();
    throw e;
  }

  const rows = await prisma.serviceRequest.findMany({
    include: { address: true },
    orderBy: { createdAt: "desc" },
    take: 500,
  });
  return NextResponse.json(rows.map(serializeServiceRequest));
}
