import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/session";
import { serializeServiceRequest, toEnumValue } from "@/lib/serializers";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const sessionId = await getOrCreateSessionId();
  const { id } = await params;
  const body = (await req.json()) as { status?: string };

  const existing = await prisma.serviceRequest.findFirst({ where: { id, sessionId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const updated = await prisma.serviceRequest.update({
    where: { id },
    data: { status: body.status ? (toEnumValue(body.status) as never) : undefined },
  });
  return NextResponse.json(serializeServiceRequest(updated));
}
