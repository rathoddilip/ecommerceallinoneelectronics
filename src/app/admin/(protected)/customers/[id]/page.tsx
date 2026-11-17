import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { serializeOrder, serializeServiceRequest } from "@/lib/serializers";
import { formatDate, formatINR } from "@/lib/format";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Badge from "@/components/ui/Badge";

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      addresses: true,
      orders: { include: { items: true }, orderBy: { createdAt: "desc" } },
      serviceRequests: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!user) notFound();

  const orders = user.orders.map(serializeOrder);
  const serviceRequests = user.serviceRequests.map(serializeServiceRequest);
  const totalSpent = orders.reduce((sum, o) => sum + o.grandTotal, 0);

  return (
    <div className="space-y-5 max-w-4xl">
      <Breadcrumbs items={[{ label: "Customers", href: "/admin/customers" }, { label: user.name }]} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">{user.name}</h1>
          <p className="text-foreground/55 text-sm mt-1">
            {user.mobile} {user.email && `· ${user.email}`} · Joined {formatDate(user.createdAt.toISOString())}
          </p>
        </div>
        <div className="flex gap-4 text-sm">
          <div className="text-right">
            <p className="text-foreground/45 text-xs">Total Spent</p>
            <p className="font-bold">{formatINR(totalSpent)}</p>
          </div>
          <div className="text-right">
            <p className="text-foreground/45 text-xs">Wallet</p>
            <p className="font-bold">{formatINR(user.walletBalance)}</p>
          </div>
        </div>
      </div>

      <div className="card-surface p-5">
        <h2 className="font-semibold mb-3">Addresses</h2>
        {user.addresses.length === 0 ? (
          <p className="text-sm text-foreground/45">No saved addresses.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {user.addresses.map((a) => (
              <div key={a.id} className="rounded-lg border border-border-subtle p-3 text-sm">
                <p className="font-medium capitalize">{a.name} · {a.type}</p>
                <p className="text-foreground/60 mt-0.5">
                  {a.line1}{a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} - {a.pincode}
                </p>
                <p className="text-foreground/45 text-xs mt-1">{a.phone}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card-surface p-5">
        <h2 className="font-semibold mb-3">Orders ({orders.length})</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-foreground/45">No orders yet.</p>
        ) : (
          <div className="divide-y divide-border-subtle">
            {orders.map((o) => (
              <Link
                key={o.id}
                href={`/admin/orders/${o.id}`}
                className="flex items-center justify-between py-2.5 text-sm hover:text-brand-600"
              >
                <span className="font-medium">#{o.orderNo}</span>
                <span className="text-foreground/50">{formatDate(o.createdAt.toISOString())}</span>
                <Badge className="capitalize">{o.status.replace(/-/g, " ")}</Badge>
                <span className="font-semibold">{formatINR(o.grandTotal)}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="card-surface p-5">
        <h2 className="font-semibold mb-3">Service Requests ({serviceRequests.length})</h2>
        {serviceRequests.length === 0 ? (
          <p className="text-sm text-foreground/45">No service requests yet.</p>
        ) : (
          <div className="divide-y divide-border-subtle">
            {serviceRequests.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2.5 text-sm">
                <span className="font-medium">#{r.jobNo}</span>
                <span className="text-foreground/50 capitalize">{r.type.replace(/-/g, " ")}</span>
                <span className="text-foreground/50">{formatDate(r.createdAt.toISOString())}</span>
                <Badge className="capitalize">{r.status.replace(/-/g, " ")}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
