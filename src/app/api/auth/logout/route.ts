import { NextResponse } from "next/server";
import { setLoggedIn } from "@/lib/session";

export async function POST() {
  await setLoggedIn(false);
  return NextResponse.json({ ok: true });
}
