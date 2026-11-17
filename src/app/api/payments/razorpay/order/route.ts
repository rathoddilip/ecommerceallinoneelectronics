import { NextResponse } from "next/server";
import { getOrCreateSessionId } from "@/lib/session";
import { buildCartResponse } from "@/lib/server/cart";
import { isRazorpayConfigured, createOrder } from "@/lib/razorpay";

export async function POST() {
  if (!isRazorpayConfigured()) {
    return NextResponse.json({ error: "Razorpay is not configured" }, { status: 503 });
  }

  const sessionId = await getOrCreateSessionId();
  const cart = await buildCartResponse(sessionId);
  if (cart.lines.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  try {
    // Razorpay caps `receipt` at 40 characters.
    const order = await createOrder(cart.totals.grandTotal, `rcpt_${sessionId.slice(0, 16)}_${Date.now()}`);
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Failed to create order" }, { status: 502 });
  }
}
