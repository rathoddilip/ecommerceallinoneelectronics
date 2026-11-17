import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized, AdminAuthError } from "@/lib/admin/guard";
import { serializeOrder, serializeServiceRequest } from "@/lib/serializers";

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
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      addresses: true,
      orders: { include: { items: true }, orderBy: { createdAt: "desc" } },
      serviceRequests: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    id: user.id,
    name: user.name,
    mobile: user.mobile,
    email: user.email,
    walletBalance: user.walletBalance,
    referralCode: user.referralCode,
    createdAt: user.createdAt,
    addresses: user.addresses,
    orders: user.orders.map(serializeOrder),
    serviceRequests: user.serviceRequests.map(serializeServiceRequest),
  });
}
