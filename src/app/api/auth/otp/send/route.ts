import { NextResponse } from "next/server";
import { isSmsConfigured, sendOtp } from "@/lib/sms";

export async function POST(req: Request) {
  const { mobile } = (await req.json()) as { mobile?: string };
  if (!mobile || !/^\d{10}$/.test(mobile)) {
    return NextResponse.json({ error: "A valid 10-digit mobile number is required" }, { status: 400 });
  }

  if (!isSmsConfigured()) {
    // Demo mode: no SMS provider configured yet, accept any OTP client-side.
    return NextResponse.json({ sent: true, demo: true });
  }

  try {
    await sendOtp(mobile);
    return NextResponse.json({ sent: true, demo: false });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to send OTP" }, { status: 502 });
  }
}
