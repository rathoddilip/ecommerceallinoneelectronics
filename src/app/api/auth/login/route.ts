import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId, setLoggedIn } from "@/lib/session";
import { isSmsConfigured, verifyOtp } from "@/lib/sms";

// `via: "otp"` is the one real auth path: when MSG91 is configured, the
// OTP sent to `mobile` is verified here before we trust it. The Google and
// email/password buttons on the login page are still demo-only mocks (out
// of scope for this pass) and don't set `via`, so they keep working
// unchanged — this gate only ever applies to the mobile-OTP flow.
export async function POST(req: Request) {
  const { mobile, name, otp, via } = (await req.json()) as {
    mobile: string;
    name?: string;
    otp?: string;
    via?: string;
  };
  if (!mobile) return NextResponse.json({ error: "mobile is required" }, { status: 400 });

  if (via === "otp" && isSmsConfigured()) {
    if (!otp) return NextResponse.json({ error: "otp is required" }, { status: 400 });
    const verified = await verifyOtp(mobile, otp).catch(() => false);
    if (!verified) return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
  }

  const sessionId = await getOrCreateSessionId();

  const user = await prisma.user.upsert({
    where: { sessionId },
    update: { mobile, name: name?.trim() || "Customer" },
    create: {
      sessionId,
      mobile,
      name: name?.trim() || "Customer",
      walletBalance: 250,
      referralCode: `AOE${mobile.slice(-4)}`,
    },
  });

  // Seed one demo registered product on first login, matching the
  // storefront's original "My Products" preview.
  const existingDemo = await prisma.customerProduct.findFirst({ where: { sessionId } });
  if (!existingDemo) {
    const demoProduct = await prisma.product.findUnique({
      where: { slug: "kent-grand-plus-ro-uv-uf-9l" },
    });
    if (demoProduct) {
      await prisma.customerProduct.create({
        data: {
          sessionId,
          productId: demoProduct.id,
          name: demoProduct.name,
          serialNo: "KGP-208831",
          purchaseDate: new Date("2025-11-02"),
          installDate: new Date("2025-11-05"),
          warrantyEndDate: new Date("2026-11-05"),
          amcStatus: "active",
          nextFilterChangeDate: new Date("2026-11-05"),
        },
      });
    }
  }

  await setLoggedIn(true);

  return NextResponse.json({
    name: user.name,
    mobile: user.mobile,
    email: user.email,
    walletBalance: user.walletBalance,
    referralCode: user.referralCode,
  });
}
