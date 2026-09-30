import { prisma } from "@/lib/prisma";
import { toDeptSlug } from "@/lib/serializers";
import { computeTotals, type CartTotals } from "@/lib/cartSelectors";
import type { Department } from "@/lib/types";

export interface CartLineDTO {
  productId: string;
  variantId: string | null;
  qty: number;
  addInstallation: boolean;
  addAmcPlanId: string | null;
  product: {
    id: string;
    slug: string;
    name: string;
    brand: string;
    department: Department;
    category: string;
    installation: string;
    installationFee: number;
    amcEligible: boolean;
    stock: number;
    gstRate: number;
  };
  variantLabel: string | null;
  unitPrice: number;
  unitMrp: number;
  lineSubtotal: number;
  installationFee: number;
  amcFee: number;
  lineTotal: number;
}

export interface CartResponse {
  couponCode: string | null;
  lines: CartLineDTO[];
  totals: CartTotals;
}

export async function getOrCreateCart(sessionId: string) {
  return prisma.cart.upsert({
    where: { sessionId },
    update: {},
    create: { sessionId },
  });
}

export async function buildCartResponse(sessionId: string): Promise<CartResponse> {
  const cart = await prisma.cart.findUnique({
    where: { sessionId },
    include: { items: { include: { product: true } } },
  });

  if (!cart) {
    return { couponCode: null, lines: [], totals: computeTotals([], null) };
  }

  const amcPlanIds = cart.items.map((i) => i.addAmcPlanId).filter((id): id is string => !!id);
  const amcPlans = amcPlanIds.length
    ? await prisma.amcPlan.findMany({ where: { id: { in: amcPlanIds } } })
    : [];

  const lines: CartLineDTO[] = cart.items.map((item) => {
    const variants = (item.product.variants as unknown as
      | { id: string; label: string; priceDelta: number; stock: number }[]
      | null) ?? [];
    const variant = variants.find((v) => v.id === item.variantId);
    const unitPrice = item.product.price + (variant?.priceDelta ?? 0);
    const unitMrp = item.product.mrp + (variant?.priceDelta ?? 0);
    const lineSubtotal = unitPrice * item.qty;
    const installationFee = item.addInstallation ? item.product.installationFee * item.qty : 0;
    const amcPlan = item.addAmcPlanId ? amcPlans.find((p) => p.id === item.addAmcPlanId) : undefined;
    const amcFee = amcPlan ? amcPlan.price : 0;

    return {
      productId: item.productId,
      variantId: item.variantId,
      qty: item.qty,
      addInstallation: item.addInstallation,
      addAmcPlanId: item.addAmcPlanId,
      product: {
        id: item.product.id,
        slug: item.product.slug,
        name: item.product.name,
        brand: item.product.brand,
        department: toDeptSlug(item.product.department),
        category: item.product.category,
        installation: item.product.installation,
        installationFee: item.product.installationFee,
        amcEligible: item.product.amcEligible,
        stock: item.product.stock,
        gstRate: item.product.gstRate,
      },
      variantLabel: variant?.label ?? null,
      unitPrice,
      unitMrp,
      lineSubtotal,
      installationFee,
      amcFee,
      lineTotal: lineSubtotal + installationFee + amcFee,
    };
  });

  // Reuse the shared pure pricing engine by feeding it line summaries
  // shaped like CartLine (only the fields computeTotals reads).
  const totals = computeTotals(
    lines.map((l) => ({
      item: {
        productId: l.productId,
        variantId: l.variantId ?? undefined,
        qty: l.qty,
        addInstallation: l.addInstallation,
        addAmcPlanId: l.addAmcPlanId ?? undefined,
      },
      product: { gstRate: l.product.gstRate },
      unitPrice: l.unitPrice,
      unitMrp: l.unitMrp,
      lineSubtotal: l.lineSubtotal,
      installationFee: l.installationFee,
      amcFee: l.amcFee,
      lineTotal: l.lineTotal,
    })),
    cart.couponCode
  );

  return { couponCode: cart.couponCode, lines, totals };
}
