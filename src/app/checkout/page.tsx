"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  MapPin,
  Truck,
  CreditCard,
  ShieldCheck,
  Plus,
  Smartphone,
  Landmark,
  Wallet,
  Banknote,
} from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useAccountStore } from "@/lib/store/account";
import { buildCartLines, computeTotals } from "@/lib/cartSelectors";
import { formatINR } from "@/lib/format";
import { generateId, generateOrderNo } from "@/lib/utils";
import type { Address, Order, OrderStatus } from "@/lib/types";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Input";
import ProductVisual from "@/components/product/ProductVisual";
import { cn } from "@/lib/utils";

const steps = ["Address", "Delivery Slot", "Payment", "Review"] as const;
type PaymentMethod = "upi" | "card" | "netbanking" | "wallet" | "cod";

const paymentOptions: { id: PaymentMethod; label: string; icon: typeof Smartphone; hint: string }[] = [
  { id: "upi", label: "UPI", icon: Smartphone, hint: "Pay via Google Pay, PhonePe, Paytm" },
  { id: "card", label: "Credit / Debit Card", icon: CreditCard, hint: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net Banking", icon: Landmark, hint: "All major Indian banks" },
  { id: "wallet", label: "Store Wallet", icon: Wallet, hint: "Use your wallet balance" },
  { id: "cod", label: "Cash on Delivery", icon: Banknote, hint: "Pay when your order arrives" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const couponCode = useCartStore((s) => s.couponCode);
  const clearCart = useCartStore((s) => s.clearCart);

  const user = useAccountStore((s) => s.user);
  const login = useAccountStore((s) => s.login);
  const addresses = useAccountStore((s) => s.addresses);
  const addAddress = useAccountStore((s) => s.addAddress);
  const placeOrder = useAccountStore((s) => s.placeOrder);

  const lines = useMemo(() => buildCartLines(items), [items]);
  const totals = useMemo(() => computeTotals(lines, couponCode), [lines, couponCode]);
  const needsInstallation = lines.some((l) => l.item.addInstallation);

  const [step, setStep] = useState(0);
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(addresses[0]?.id ?? null);
  const [showAddressForm, setShowAddressForm] = useState(addresses.length === 0);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    line1: "",
    line2: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    type: "home" as Address["type"],
  });

  const [deliverySlot, setDeliverySlot] = useState("Standard (3-5 days)");
  const [installationDate, setInstallationDate] = useState("");
  const [installationSlot, setInstallationSlot] = useState("10:00 AM - 1:00 PM");

  const [payment, setPayment] = useState<PaymentMethod>("upi");
  const [gstin, setGstin] = useState("");
  const [placing, setPlacing] = useState(false);

  if (lines.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <p className="text-foreground/60">Your cart is empty. Add products before checking out.</p>
        <Button href="/products" className="mt-4">Browse Products</Button>
      </div>
    );
  }

  function handleSendOtp() {
    if (/^\d{10}$/.test(mobile)) setOtpSent(true);
  }
  function handleVerifyOtp() {
    if (otp.length === 4) login(mobile);
  }

  function handleSaveAddress() {
    if (!form.name || !form.phone || !form.line1 || !form.city || !form.pincode) return;
    const address: Address = { id: generateId("addr"), isDefault: addresses.length === 0, ...form };
    addAddress(address);
    setSelectedAddressId(address.id);
    setShowAddressForm(false);
  }

  function handlePlaceOrder() {
    const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
    if (!selectedAddress) return;
    setPlacing(true);

    const order: Order = {
      id: generateId("order"),
      orderNo: generateOrderNo(),
      createdAt: new Date().toISOString(),
      items: lines.map((l) => ({
        productId: l.product.id,
        name: l.product.name,
        image: l.product.category,
        variantLabel: l.variant?.label,
        qty: l.item.qty,
        price: l.unitPrice,
        addInstallation: l.item.addInstallation,
      })),
      addressId: selectedAddress.id,
      addressSnapshot: selectedAddress,
      subtotal: totals.subtotal,
      discount: totals.discount + totals.couponDiscount,
      tax: totals.tax,
      shipping: totals.shipping,
      installationTotal: totals.installationTotal + totals.amcTotal,
      grandTotal: totals.grandTotal,
      paymentMethod: paymentOptions.find((p) => p.id === payment)?.label ?? payment,
      paymentStatus: payment === "cod" ? "pending" : "paid",
      status: "placed" as OrderStatus,
      couponCode: couponCode ?? undefined,
      gstin: gstin || undefined,
    };

    setTimeout(() => {
      placeOrder(order);
      clearCart();
      router.push(`/checkout/success?order=${order.orderNo}`);
    }, 900);
  }

  return (
    <div className="container-page py-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <h1 className="font-display text-2xl font-bold tracking-tight mt-3 mb-6">Checkout</h1>

      <div className="mb-8 flex items-center gap-2 overflow-x-auto scrollbar-thin">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2 shrink-0">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                i < step ? "bg-success-500 text-white" : i === step ? "bg-brand-500 text-white" : "bg-surface-muted text-foreground/40"
              )}
            >
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            <span className={cn("text-sm font-medium", i === step ? "text-foreground" : "text-foreground/40")}>{s}</span>
            {i < steps.length - 1 && <div className="h-px w-8 bg-border-subtle" />}
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="card-surface p-5 sm:p-6">
          {!user && (
            <div className="mb-6 rounded-xl border border-border-subtle p-4">
              <p className="text-sm font-semibold mb-2">Login to continue</p>
              {!otpSent ? (
                <div className="flex gap-2">
                  <Input
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    placeholder="10-digit mobile number"
                  />
                  <Button onClick={handleSendOtp} className="shrink-0">Send OTP</Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    placeholder="Enter OTP (any 4 digits)"
                  />
                  <Button onClick={handleVerifyOtp} className="shrink-0">Verify</Button>
                </div>
              )}
            </div>
          )}

          {/* Step 0: Address */}
          {step === 0 && (
            <div className={cn(!user && "opacity-50 pointer-events-none")}>
              <h2 className="flex items-center gap-2 font-display font-bold mb-4">
                <MapPin size={18} className="text-brand-500" /> Delivery Address
              </h2>

              <div className="space-y-3">
                {addresses.map((a) => (
                  <label
                    key={a.id}
                    className={cn(
                      "block rounded-xl border p-4 cursor-pointer",
                      selectedAddressId === a.id ? "border-brand-500 bg-brand-50" : "border-border-subtle"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        checked={selectedAddressId === a.id}
                        onChange={() => setSelectedAddressId(a.id)}
                        className="mt-1 accent-brand-500"
                      />
                      <div className="text-sm">
                        <p className="font-semibold">
                          {a.name} <span className="ml-2 rounded bg-surface-muted px-1.5 py-0.5 text-xs uppercase text-foreground/50">{a.type}</span>
                        </p>
                        <p className="text-foreground/65 mt-0.5">
                          {a.line1}, {a.line2 ? `${a.line2}, ` : ""}{a.city}, {a.state} - {a.pincode}
                        </p>
                        <p className="text-foreground/50 mt-0.5">Phone: {a.phone}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {showAddressForm ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-2 rounded-xl border border-border-subtle p-4">
                  <Field label="Full Name" required>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </Field>
                  <Field label="Phone" required>
                    <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} />
                  </Field>
                  <Field label="Address Line 1" required>
                    <Input value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
                  </Field>
                  <Field label="Address Line 2">
                    <Input value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} />
                  </Field>
                  <Field label="Landmark">
                    <Input value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} />
                  </Field>
                  <Field label="City" required>
                    <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                  </Field>
                  <Field label="State" required>
                    <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
                  </Field>
                  <Field label="Pincode" required>
                    <Input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })} />
                  </Field>
                  <Field label="Address Type">
                    <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Address["type"] })}>
                      <option value="home">Home</option>
                      <option value="work">Work</option>
                    </Select>
                  </Field>
                  <div className="sm:col-span-2 flex gap-2">
                    <Button onClick={handleSaveAddress}>Save Address</Button>
                    {addresses.length > 0 && (
                      <Button variant="outline" onClick={() => setShowAddressForm(false)}>Cancel</Button>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
                >
                  <Plus size={16} /> Add a new address
                </button>
              )}

              <div className="mt-6">
                <Field label="GSTIN (optional, for business invoice)">
                  <Input value={gstin} onChange={(e) => setGstin(e.target.value.toUpperCase())} placeholder="22AAAAA0000A1Z5" />
                </Field>
              </div>

              <Button
                onClick={() => setStep(1)}
                disabled={!selectedAddressId}
                className="mt-6"
                size="lg"
              >
                Continue to Delivery Slot
              </Button>
            </div>
          )}

          {/* Step 1: Slot */}
          {step === 1 && (
            <div>
              <h2 className="flex items-center gap-2 font-display font-bold mb-4">
                <Truck size={18} className="text-brand-500" /> Delivery & Installation
              </h2>
              <Field label="Delivery Speed">
                <Select value={deliverySlot} onChange={(e) => setDeliverySlot(e.target.value)}>
                  <option>Standard (3-5 days)</option>
                  <option>Express (1-2 days) +₹99</option>
                </Select>
              </Field>

              {needsInstallation && (
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <Field label="Preferred Installation Date">
                    <Input type="date" value={installationDate} onChange={(e) => setInstallationDate(e.target.value)} />
                  </Field>
                  <Field label="Time Slot">
                    <Select value={installationSlot} onChange={(e) => setInstallationSlot(e.target.value)}>
                      <option>10:00 AM - 1:00 PM</option>
                      <option>1:00 PM - 4:00 PM</option>
                      <option>4:00 PM - 7:00 PM</option>
                    </Select>
                  </Field>
                </div>
              )}

              <div className="mt-6 flex gap-2">
                <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
                <Button onClick={() => setStep(2)}>Continue to Payment</Button>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div>
              <h2 className="flex items-center gap-2 font-display font-bold mb-4">
                <CreditCard size={18} className="text-brand-500" /> Payment Method
              </h2>
              <div className="space-y-2.5">
                {paymentOptions.map((opt) => {
                  const Icon = opt.icon;
                  const disabled = opt.id === "cod" && totals.grandTotal > 50000;
                  return (
                    <label
                      key={opt.id}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer",
                        payment === opt.id ? "border-brand-500 bg-brand-50" : "border-border-subtle",
                        disabled && "opacity-40 pointer-events-none"
                      )}
                    >
                      <input
                        type="radio"
                        checked={payment === opt.id}
                        onChange={() => setPayment(opt.id)}
                        className="accent-brand-500"
                      />
                      <Icon size={18} className="text-foreground/60" />
                      <span className="text-sm">
                        <span className="block font-semibold">{opt.label}</span>
                        <span className="block text-xs text-foreground/50">{opt.hint}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
              <div className="mt-6 flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)}>Review Order</Button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div>
              <h2 className="flex items-center gap-2 font-display font-bold mb-4">
                <ShieldCheck size={18} className="text-brand-500" /> Review Your Order
              </h2>
              <div className="divide-y divide-border-subtle">
                {lines.map((line) => (
                  <div key={`${line.item.productId}-${line.item.variantId ?? ""}`} className="flex gap-3 py-3">
                    <ProductVisual department={line.product.department} category={line.product.category} className="h-14 w-14" iconClassName="h-6 w-6" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">{line.product.name}</p>
                      <p className="text-xs text-foreground/50">Qty {line.item.qty} {line.variant && `· ${line.variant.label}`}</p>
                    </div>
                    <span className="text-sm font-semibold">{formatINR(line.lineTotal)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 grid gap-1 text-sm text-foreground/65">
                <p>Paying via <strong className="text-foreground">{paymentOptions.find((p) => p.id === payment)?.label}</strong></p>
                <p>Delivery: <strong className="text-foreground">{deliverySlot}</strong></p>
                {needsInstallation && installationDate && (
                  <p>Installation: <strong className="text-foreground">{installationDate}, {installationSlot}</strong></p>
                )}
              </div>
              <div className="mt-6 flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={handlePlaceOrder} disabled={placing} size="lg">
                  {placing ? "Placing order…" : `Place Order — ${formatINR(totals.grandTotal)}`}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-24 h-fit card-surface p-5">
          <h2 className="font-display font-bold mb-4">Order Summary</h2>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-foreground/65">
              <span>Subtotal</span>
              <span>{formatINR(totals.subtotal)}</span>
            </div>
            {totals.installationTotal > 0 && (
              <div className="flex justify-between text-foreground/65">
                <span>Installation</span>
                <span>{formatINR(totals.installationTotal)}</span>
              </div>
            )}
            {totals.amcTotal > 0 && (
              <div className="flex justify-between text-foreground/65">
                <span>AMC Plan</span>
                <span>{formatINR(totals.amcTotal)}</span>
              </div>
            )}
            {totals.couponDiscount > 0 && (
              <div className="flex justify-between text-success-600">
                <span>Coupon</span>
                <span>−{formatINR(totals.couponDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-foreground/65">
              <span>Delivery</span>
              <span>{totals.shipping === 0 ? "FREE" : formatINR(totals.shipping)}</span>
            </div>
            <div className="border-t border-border-subtle pt-3 flex justify-between font-bold text-base">
              <span>Total</span>
              <span>{formatINR(totals.grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
