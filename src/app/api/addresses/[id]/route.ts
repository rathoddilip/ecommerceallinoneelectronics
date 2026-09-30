import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/session";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const sessionId = await getOrCreateSessionId();
  const { id } = await params;
  const body = await req.json();

  const existing = await prisma.address.findFirst({ where: { id, sessionId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.address.update({ where: { id }, data: body });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const sessionId = await getOrCreateSessionId();
  const { id } = await params;

  const existing = await prisma.address.findFirst({ where: { id, sessionId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.address.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
