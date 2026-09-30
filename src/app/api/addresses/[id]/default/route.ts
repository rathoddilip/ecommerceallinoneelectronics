import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/session";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const sessionId = await getOrCreateSessionId();
  const { id } = await params;

  const existing = await prisma.address.findFirst({ where: { id, sessionId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.address.updateMany({ where: { sessionId }, data: { isDefault: false } });
  await prisma.address.update({ where: { id }, data: { isDefault: true } });

  const rows = await prisma.address.findMany({ where: { sessionId }, orderBy: { createdAt: "asc" } });
  return NextResponse.json(rows);
}
