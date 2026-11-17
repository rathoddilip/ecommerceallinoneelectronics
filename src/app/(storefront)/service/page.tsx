"use client";

import { useState } from "react";
import {
  Wrench,
  Droplet,
  AlertTriangle,
  ShieldCheck,
  Home,
  Sparkles,
  Check,
  MapPin,
  CalendarClock,
  Camera,
} from "lucide-react";
import type { ServiceRequest, ServiceType } from "@/lib/types";
import { useAccountStore } from "@/lib/store/account";
import { apiFetch } from "@/lib/api";
import { formatINR } from "@/lib/format";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import Button from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

const serviceTypes: { id: ServiceType; label: string; icon: typeof Wrench; charge: number; desc: string }[] = [
  { id: "installation", label: "New Installation", icon: Home, charge: 0, desc: "Free or fixed fee per category" },
  { id: "demo", label: "Demo / Water TDS Test", icon: Sparkles, charge: 0, desc: "Free consultation visit" },
  { id: "filter-replacement", label: "Filter / Membrane Replacement", icon: Droplet, charge: 349, desc: "Parts + visit charge" },
  { id: "repair", label: "Repair / Breakdown", icon: AlertTriangle, charge: 249, desc: "Visit charge + parts if needed" },
  { id: "amc-visit", label: "AMC Preventive Visit", icon: ShieldCheck, charge: 0, desc: "Included in your AMC plan" },
  { id: "uninstall-reinstall", label: "Uninstall / Reinstall (House Shift)", icon: Wrench, charge: 499, desc: "Fixed fee" },
];

export default function ServicePage() {
  const user = useAccountStore((s) => s.user);
  const login = useAccountStore((s) => s.login);
  const myProducts = useAccountStore((s) => s.myProducts);
  const addresses = useAccountStore((s) => s.addresses);
  const addAddress = useAccountStore((s) => s.addAddress);
  const fetchServiceRequests = useAccountStore((s) => s.fetchServiceRequests);

  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const [type, setType] = useState<ServiceType | null>(null);
  const [productChoice, setProductChoice] = useState<string>("");
  const [manualProduct, setManualProduct] = useState("");
  const [issue, setIssue] = useState("");
  const [photoAttached, setPhotoAttached] = useState(false);
  const [slotDate, setSlotDate] = useState("");
  const [slotTime, setSlotTime] = useState("10:00 AM - 1:00 PM");

  const [addressForm, setAddressForm] = useState({ name: "", phone: "", line1: "", city: "", state: "", pincode: "" });
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(addresses[0]?.id ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState<ServiceRequest | null>(null);

  const selectedType = serviceTypes.find((t) => t.id === type);
  const productName =
    productChoice === "manual" ? manualProduct : myProducts.find((p) => p.id === productChoice)?.name ?? "";

  function handleSendOtp() {
    if (/^\d{10}$/.test(mobile)) setOtpSent(true);
  }
  function handleVerifyOtp() {
    if (otp.length === 4) login(mobile);
  }

  async function handleSubmit() {
    if (!type || !productName || !slotDate) return;

    setSubmitting(true);
    try {
      let addressId = selectedAddressId;
      if (!addressId && addressForm.name && addressForm.line1) {
        await addAddress({ type: "home", ...addressForm });
        addressId = useAccountStore.getState().addresses.at(-1)?.id ?? null;
      }
      if (!addressId) {
        setSubmitting(false);
        return;
      }

      const req = await apiFetch<ServiceRequest>("/api/service-requests", {
        method: "POST",
        body: JSON.stringify({
          type,
          productName,
          issue: issue || "Not specified",
          slotDate,
          slotTime,
          addressId,
          charges: selectedType?.charge ?? 0,
        }),
      });
      await fetchServiceRequests();
      setConfirmed(req);
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmed) {
    return (
      <div className="container-page max-w-xl py-16 text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-500/10 text-success-600">
          <Check size={32} />
        </span>
        <h1 className="font-display text-2xl font-bold mt-4">Service Booked!</h1>
        <p className="text-foreground/60 mt-1">
          Job <strong className="text-foreground">#{confirmed.jobNo}</strong> is confirmed for {confirmed.slotDate}, {confirmed.slotTime}.
        </p>
        <p className="text-sm text-foreground/50 mt-2">
          A technician will be assigned shortly. You can track progress anytime from your account.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button href="/account/service-requests">Track Service Requests</Button>
          <Button href="/" variant="outline">Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Book a Service" }]} />
      <h1 className="font-display text-2xl font-bold tracking-tight mt-3">Book Installation, AMC or Repair</h1>
      <p className="text-foreground/55 text-sm mt-1 mb-6 max-w-2xl">
        Get a certified technician at your doorstep for installation, filter changes, AMC visits or breakdown repairs.
      </p>

      {!user && (
        <div className="mb-6 max-w-md card-surface p-4">
          <p className="text-sm font-semibold mb-2">Login to book a service</p>
          {!otpSent ? (
            <div className="flex gap-2">
              <Input value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile number" />
              <Button onClick={handleSendOtp} className="shrink-0">Send OTP</Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="Enter OTP (any 4 digits)" />
              <Button onClick={handleVerifyOtp} className="shrink-0">Verify</Button>
            </div>
          )}
        </div>
      )}

      <div className={cn("grid gap-6 lg:grid-cols-2", !user && "opacity-50 pointer-events-none")}>
        <div className="card-surface p-5 sm:p-6">
          <h2 className="font-semibold mb-3">1. What do you need?</h2>
          <div className="grid gap-2.5">
            {serviceTypes.map((t) => {
              const Icon = t.icon;
              return (
                <label
                  key={t.id}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3.5 cursor-pointer",
                    type === t.id ? "border-brand-500 bg-brand-50" : "border-border-subtle"
                  )}
                >
                  <input type="radio" checked={type === t.id} onChange={() => setType(t.id)} className="accent-brand-500" />
                  <Icon size={18} className="text-brand-500 shrink-0" />
                  <span className="text-sm flex-1">
                    <span className="block font-semibold">{t.label}</span>
                    <span className="block text-xs text-foreground/50">{t.desc}</span>
                  </span>
                  <span className="text-xs font-semibold text-foreground/60 shrink-0">
                    {t.charge === 0 ? "Free/Included" : `From ${formatINR(t.charge)}`}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-surface p-5 sm:p-6">
            <h2 className="font-semibold mb-3">2. Select Product</h2>
            <div className="space-y-2">
              {myProducts.map((p) => (
                <label key={p.id} className={cn("flex items-center gap-2 rounded-lg border p-3 text-sm cursor-pointer", productChoice === p.id ? "border-brand-500 bg-brand-50" : "border-border-subtle")}>
                  <input type="radio" checked={productChoice === p.id} onChange={() => setProductChoice(p.id)} className="accent-brand-500" />
                  {p.name} {p.serialNo && <span className="text-foreground/40">· S/N {p.serialNo}</span>}
                </label>
              ))}
              <label className={cn("flex items-center gap-2 rounded-lg border p-3 text-sm cursor-pointer", productChoice === "manual" ? "border-brand-500 bg-brand-50" : "border-border-subtle")}>
                <input type="radio" checked={productChoice === "manual"} onChange={() => setProductChoice("manual")} className="accent-brand-500" />
                Enter model / brand manually
              </label>
              {productChoice === "manual" && (
                <Input value={manualProduct} onChange={(e) => setManualProduct(e.target.value)} placeholder="e.g. Kent Grand Plus RO" className="mt-1" />
              )}
            </div>

            <div className="mt-4">
              <Field label="Describe the issue (optional)">
                <Textarea rows={3} value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="E.g. Low water flow, unusual noise, leakage…" />
              </Field>
              <button
                onClick={() => setPhotoAttached((v) => !v)}
                className={cn(
                  "mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
                  photoAttached ? "border-success-500 bg-success-500/10 text-success-600" : "border-border-subtle text-foreground/60"
                )}
              >
                <Camera size={13} /> {photoAttached ? "Photo attached" : "Attach a photo"}
              </button>
            </div>
          </div>

          <div className="card-surface p-5 sm:p-6">
            <h2 className="flex items-center gap-1.5 font-semibold mb-3">
              <CalendarClock size={16} className="text-brand-500" /> 3. Slot & Address
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Preferred Date" required>
                <Input type="date" value={slotDate} onChange={(e) => setSlotDate(e.target.value)} />
              </Field>
              <Field label="Time Slot">
                <Select value={slotTime} onChange={(e) => setSlotTime(e.target.value)}>
                  <option>10:00 AM - 1:00 PM</option>
                  <option>1:00 PM - 4:00 PM</option>
                  <option>4:00 PM - 7:00 PM</option>
                </Select>
              </Field>
            </div>

            {addresses.length > 0 ? (
              <div className="mt-3 space-y-2">
                {addresses.map((a) => (
                  <label key={a.id} className={cn("flex items-start gap-2 rounded-lg border p-3 text-sm cursor-pointer", selectedAddressId === a.id ? "border-brand-500 bg-brand-50" : "border-border-subtle")}>
                    <input type="radio" checked={selectedAddressId === a.id} onChange={() => setSelectedAddressId(a.id)} className="mt-0.5 accent-brand-500" />
                    <span>
                      <span className="flex items-center gap-1 font-medium"><MapPin size={12} /> {a.name}</span>
                      <span className="block text-foreground/55 text-xs mt-0.5">{a.line1}, {a.city} - {a.pincode}</span>
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="mt-3 grid gap-2.5">
                <Input placeholder="Full name" value={addressForm.name} onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })} />
                <Input placeholder="Phone" value={addressForm.phone} onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} />
                <Input placeholder="Address" value={addressForm.line1} onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })} />
                <div className="grid grid-cols-3 gap-2.5">
                  <Input placeholder="City" value={addressForm.city} onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })} />
                  <Input placeholder="State" value={addressForm.state} onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })} />
                  <Input placeholder="Pincode" value={addressForm.pincode} onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })} />
                </div>
              </div>
            )}
          </div>

          <Button
            size="lg"
            fullWidth
            disabled={!type || !productName || !slotDate || submitting}
            onClick={handleSubmit}
          >
            {submitting ? "Booking…" : `Confirm Booking ${selectedType && selectedType.charge > 0 ? `— ${formatINR(selectedType.charge)}` : ""}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
