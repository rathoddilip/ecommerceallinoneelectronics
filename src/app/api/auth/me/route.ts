import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionId, isLoggedIn } from "@/lib/session";

export async function GET() {
  const sessionId = await getSessionId();
  const loggedIn = await isLoggedIn();
  if (!sessionId || !loggedIn) return NextResponse.json({ user: null });

  const user = await prisma.user.findUnique({ where: { sessionId } });
  if (!user) return NextResponse.json({ user: null });

  return NextResponse.json({
    user: {
      name: user.name,
      mobile: user.mobile,
      email: user.email,
      walletBalance: user.walletBalance,
      referralCode: user.referralCode,
    },
  });
}
