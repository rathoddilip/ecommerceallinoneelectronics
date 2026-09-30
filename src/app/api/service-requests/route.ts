import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/session";
import { generateJobNo } from "@/lib/utils";
import type { ServiceType } from "@/lib/types";
import { serializeServiceRequest } from "@/lib/serializers";

export async function GET() {
  const sessionId = await getOrCreateSessionId();
  const rows = await prisma.serviceRequest.findMany({
    where: { sessionId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(rows.map(serializeServiceRequest));
}

interface NewServiceRequest {
  type: ServiceType;
  productName: string;
  issue?: string;
  slotDate: string;
  slotTime: string;
  addressId: string;
  charges?: number;
}

export async function POST(req: Request) {
  const sessionId = await getOrCreateSessionId();
  const body = (await req.json()) as NewServiceRequest;

  const address = await prisma.address.findFirst({
    where: { id: body.addressId, sessionId },
  });
  if (!address) return NextResponse.json({ error: "Address not found" }, { status: 400 });

  const dbType = body.type.replace(/-/g, "_") as
    | "installation"
    | "demo"
    | "filter_replacement"
    | "repair"
    | "amc_visit"
    | "uninstall_reinstall";

  const request = await prisma.serviceRequest.create({
    data: {
      jobNo: generateJobNo(),
      sessionId,
      type: dbType,
      productName: body.productName,
      issue: body.issue || "Not specified",
      slotDate: body.slotDate,
      slotTime: body.slotTime,
      addressId: address.id,
      charges: body.charges ?? 0,
      status: "requested",
    },
  });

  return NextResponse.json(serializeServiceRequest(request), { status: 201 });
}
