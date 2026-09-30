import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/session";
import { serializeOrder } from "@/lib/serializers";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ orderNo: string }> }
) {
  const sessionId = await getOrCreateSessionId();
  const { orderNo } = await params;

  const order = await prisma.order.findFirst({
    where: { orderNo, sessionId },
    include: { items: true },
  });
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(serializeOrder(order));
}
