import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/session";

export async function GET() {
  const sessionId = await getOrCreateSessionId();
  const rows = await prisma.customerProduct.findMany({
    where: { sessionId },
    orderBy: { purchaseDate: "desc" },
  });
  return NextResponse.json(rows);
}
