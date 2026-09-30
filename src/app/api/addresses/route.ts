import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/session";
import type { Address } from "@/lib/types";

export async function GET() {
  const sessionId = await getOrCreateSessionId();
  const rows = await prisma.address.findMany({
    where: { sessionId },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(rows);
}

type NewAddress = Omit<Address, "id" | "isDefault"> & { isDefault?: boolean };

export async function POST(req: Request) {
  const sessionId = await getOrCreateSessionId();
  const body = (await req.json()) as NewAddress;

  const count = await prisma.address.count({ where: { sessionId } });
  const isDefault = count === 0 || !!body.isDefault;

  if (isDefault) {
    await prisma.address.updateMany({ where: { sessionId }, data: { isDefault: false } });
  }

  const address = await prisma.address.create({
    data: {
      sessionId,
      name: body.name,
      phone: body.phone,
      line1: body.line1,
      line2: body.line2,
      landmark: body.landmark,
      city: body.city,
      state: body.state,
      pincode: body.pincode,
      type: body.type,
      isDefault,
    },
  });

  return NextResponse.json(address, { status: 201 });
}
