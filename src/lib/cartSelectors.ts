import { getProductById } from "@/lib/data/products";
import { amcPlans } from "@/lib/data/amcPlans";
import type { CartItem, Product, ProductVariant } from "@/lib/types";

export interface CartLine {
  item: CartItem;
  product: Product;
  variant?: ProductVariant;
  unitPrice: number;
  unitMrp: number;
  lineSubtotal: number;
  installationFee: number;
  amcFee: number;
  lineTotal: number;
}

export function buildCartLines(items: CartItem[]): CartLine[] {
  return items
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) return null;
      const variant = product.variants?.find((v) => v.id === item.variantId);
      const unitPrice = product.price + (variant?.priceDelta ?? 0);
      const unitMrp = product.mrp + (variant?.priceDelta ?? 0);
      const lineSubtotal = unitPrice * item.qty;
      const installationFee = item.addInstallation ? product.installationFee * item.qty : 0;
      const amcPlan = item.addAmcPlanId ? amcPlans.find((p) => p.id === item.addAmcPlanId) : undefined;
      const amcFee = amcPlan ? amcPlan.price : 0;
      const lineTotal = lineSubtotal + installationFee + amcFee;
      const line: CartLine = { item, product, variant, unitPrice, unitMrp, lineSubtotal, installationFee, amcFee, lineTotal };
      return line;
    })
    .filter((line): line is CartLine => line !== null);
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  mrpTotal: number;
  discount: number;
  installationTotal: number;
  amcTotal: number;
  couponDiscount: number;
  shipping: number;
  tax: number;
  grandTotal: number;
}

const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FEE = 79;

export function computeTotals(lines: CartLine[], couponCode?: string | null): CartTotals {
  const itemCount = lines.reduce((sum, l) => sum + l.item.qty, 0);
  const subtotal = lines.reduce((sum, l) => sum + l.lineSubtotal, 0);
  const mrpTotal = lines.reduce((sum, l) => sum + l.unitMrp * l.item.qty, 0);
  const discount = Math.max(0, mrpTotal - subtotal);
  const installationTotal = lines.reduce((sum, l) => sum + l.installationFee, 0);
  const amcTotal = lines.reduce((sum, l) => sum + l.amcFee, 0);

  let couponDiscount = 0;
  if (couponCode?.toUpperCase() === "WELCOME100" && subtotal > 0) {
    couponDiscount = Math.min(100, Math.round(subtotal * 0.05));
  } else if (couponCode?.toUpperCase() === "SAVE500" && subtotal >= 5000) {
    couponDiscount = 500;
  }

  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const taxableAmount = subtotal - couponDiscount;
  const tax = Math.round(
    lines.reduce((sum, l) => {
      const share = subtotal > 0 ? l.lineSubtotal / subtotal : 0;
      return sum + (taxableAmount * share * l.product.gstRate) / (100 + l.product.gstRate);
    }, 0)
  );
  const grandTotal =
    subtotal - couponDiscount + installationTotal + amcTotal + shipping;

  return {
    itemCount,
    subtotal,
    mrpTotal,
    discount,
    installationTotal,
    amcTotal,
    couponDiscount,
    shipping,
    tax,
    grandTotal: Math.round(grandTotal),
  };
}
