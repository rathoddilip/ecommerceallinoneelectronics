import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { serializeOrder } from "@/lib/serializers";
import { formatDate, formatINR } from "@/lib/format";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import OrderStatusControl from "@/components/admin/OrderStatusControl";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const row = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!row) notFound();
  const order = serializeOrder(row);
  const address = order.addressSnapshot as {
    name: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };

  return (
    <div className="space-y-5 max-w-4xl">
      <Breadcrumbs items={[{ label: "Orders", href: "/admin/orders" }, { label: `#${order.orderNo}` }]} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Order #{order.orderNo}</h1>
          <p className="text-foreground/55 text-sm mt-1">Placed on {formatDate(order.createdAt.toISOString())}</p>
        </div>
        <OrderStatusControl orderId={order.id} status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card-surface p-5">
          <h2 className="font-semibold mb-4">Items</h2>
          <div className="divide-y divide-border-subtle">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-foreground/50">
                    {item.variantLabel && `${item.variantLabel} · `}Qty {item.qty}
                    {item.addInstallation && " · Installation included"}
                  </p>
                </div>
                <p className="font-semibold">{formatINR(item.price * item.qty)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card-surface p-5">
            <h2 className="font-semibold mb-3">Delivery Address</h2>
            <p className="text-sm font-medium">{address.name}</p>
            <p className="text-sm text-foreground/65 mt-0.5">
              {address.line1}
              {address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.state} - {address.pincode}
            </p>
            <p className="text-sm text-foreground/50 mt-1">Phone: {address.phone}</p>
          </div>

          <div className="card-surface p-5 space-y-2 text-sm">
            <h2 className="font-semibold mb-1">Payment Summary</h2>
            <div className="flex justify-between text-foreground/65"><span>Subtotal</span><span>{formatINR(order.subtotal)}</span></div>
            <div className="flex justify-between text-foreground/65"><span>Discount</span><span>-{formatINR(order.discount)}</span></div>
            <div className="flex justify-between text-foreground/65"><span>Installation/AMC</span><span>{formatINR(order.installationTotal)}</span></div>
            <div className="flex justify-between text-foreground/65"><span>Shipping</span><span>{formatINR(order.shipping)}</span></div>
            <div className="flex justify-between font-bold border-t border-border-subtle pt-2"><span>Total</span><span>{formatINR(order.grandTotal)}</span></div>
            <p className="text-xs text-foreground/50 pt-1">Paid via {order.paymentMethod} · {order.paymentStatus}</p>
            {order.gstin && <p className="text-xs text-foreground/50">GSTIN: {order.gstin}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
