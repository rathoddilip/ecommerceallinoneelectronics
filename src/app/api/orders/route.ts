import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getOrCreateSessionId } from "@/lib/session";
import { buildCartResponse } from "@/lib/server/cart";
import { generateOrderNo } from "@/lib/utils";
import { serializeOrder } from "@/lib/serializers";
import { isRazorpayConfigured, verifySignature } from "@/lib/razorpay";

export async function GET() {
  const sessionId = await getOrCreateSessionId();
  const rows = await prisma.order.findMany({
    where: { sessionId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(rows.map(serializeOrder));
}

interface PlaceOrderBody {
  addressId: string;
  paymentMethod: string;
  gstin?: string;
  razorpay?: { orderId: string; paymentId: string; signature: string };
}

export async function POST(req: Request) {
  const sessionId = await getOrCreateSessionId();
  const body = (await req.json()) as PlaceOrderBody;

  const address = await prisma.address.findFirst({
    where: { id: body.addressId, sessionId },
  });
  if (!address) return NextResponse.json({ error: "Address not found" }, { status: 400 });

  const cartData = await buildCartResponse(sessionId);
  if (cartData.lines.length === 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const isCod = body.paymentMethod === "Cash on Delivery";
  let paymentStatus: "pending" | "paid" = isCod ? "pending" : "paid";

  // Once Razorpay is configured, every non-COD order must carry a
  // signature we can verify — no more trusting the client's word that it paid.
  if (!isCod && isRazorpayConfigured()) {
    const rzp = body.razorpay;
    if (!rzp || !verifySignature(rzp.orderId, rzp.paymentId, rzp.signature)) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }
    paymentStatus = "paid";
  }

  const totals = cartData.totals;

  const order = await prisma.order.create({
    data: {
      orderNo: generateOrderNo(),
      sessionId,
      addressId: address.id,
      addressSnapshot: address as unknown as object,
      subtotal: totals.subtotal,
      discount: totals.discount + totals.couponDiscount,
      tax: totals.tax,
      shipping: totals.shipping,
      installationTotal: totals.installationTotal + totals.amcTotal,
      grandTotal: totals.grandTotal,
      paymentMethod: body.paymentMethod,
      paymentStatus,
      status: "placed",
      couponCode: cartData.couponCode,
      gstin: body.gstin,
      items: {
        create: cartData.lines.map((l) => ({
          productId: l.productId,
          name: l.product.name,
          image: l.product.category,
          variantLabel: l.variantLabel,
          qty: l.qty,
          price: l.unitPrice,
          addInstallation: l.addInstallation,
        })),
      },
    },
    include: { items: true },
  });

  const cart = await prisma.cart.findUnique({ where: { sessionId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    await prisma.cart.update({ where: { id: cart.id }, data: { couponCode: null } });
  }

  return NextResponse.json(serializeOrder(order), { status: 201 });
}
