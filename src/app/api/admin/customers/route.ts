import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, unauthorized, AdminAuthError } from "@/lib/admin/guard";

export async function GET() {
  try {
    await requireAdmin();
  } catch (e) {
    if (e instanceof AdminAuthError) return unauthorized();
    throw e;
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
    include: {
      _count: { select: { orders: true, serviceRequests: true } },
      orders: { select: { grandTotal: true } },
    },
  });

  return NextResponse.json(
    users.map((u) => ({
      id: u.id,
      name: u.name,
      mobile: u.mobile,
      email: u.email,
      walletBalance: u.walletBalance,
      createdAt: u.createdAt,
      orderCount: u._count.orders,
      serviceRequestCount: u._count.serviceRequests,
      totalSpent: u.orders.reduce((sum, o) => sum + o.grandTotal, 0),
    }))
  );
}
