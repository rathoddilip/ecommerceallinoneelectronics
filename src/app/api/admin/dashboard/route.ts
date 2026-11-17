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

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    todayOrders,
    ordersByStatusRaw,
    pendingInstallations,
    openServiceJobs,
    lowStockProducts,
    recentOrders,
    totalProducts,
    totalCustomers,
  ] = await Promise.all([
    prisma.order.findMany({ where: { createdAt: { gte: startOfToday } } }),
    prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.orderItem.count({ where: { addInstallation: true, order: { status: { notIn: ["installed", "delivered"] } } } }),
    prisma.serviceRequest.count({ where: { status: { in: ["requested", "assigned", "in_progress"] } } }),
    prisma.product.findMany({ where: { stock: { lte: 10 } }, orderBy: { stock: "asc" }, take: 10 }),
    prisma.order.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      orderBy: { createdAt: "asc" },
      select: { createdAt: true, grandTotal: true },
    }),
    prisma.product.count(),
    prisma.user.count(),
  ]);

  const todaySales = todayOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  const ordersByStatus = Object.fromEntries(ordersByStatusRaw.map((r) => [r.status, r._count._all]));

  // Group revenue by day for a simple 30-day chart.
  const revenueByDay = new Map<string, number>();
  for (const o of recentOrders) {
    const key = o.createdAt.toISOString().slice(0, 10);
    revenueByDay.set(key, (revenueByDay.get(key) ?? 0) + o.grandTotal);
  }

  const topProductsRaw = await prisma.orderItem.groupBy({
    by: ["productId", "name"],
    _sum: { qty: true },
    orderBy: { _sum: { qty: "desc" } },
    take: 5,
  });

  return NextResponse.json({
    todaySales,
    todayOrderCount: todayOrders.length,
    ordersByStatus,
    pendingInstallations,
    openServiceJobs,
    lowStockProducts: lowStockProducts.map((p) => ({ id: p.id, name: p.name, stock: p.stock, slug: p.slug })),
    revenueByDay: Array.from(revenueByDay.entries()).map(([date, total]) => ({ date, total })),
    topProducts: topProductsRaw.map((p) => ({ productId: p.productId, name: p.name, qty: p._sum.qty ?? 0 })),
    totalProducts,
    totalCustomers,
  });
}
