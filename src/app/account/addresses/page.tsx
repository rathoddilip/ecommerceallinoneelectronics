"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2, Star } from "lucide-react";
import { useAccountStore } from "@/lib/store/account";
import { generateId } from "@/lib/utils";
import type { Address } from "@/lib/types";
import Button from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

const emptyForm = { name: "", phone: "", line1: "", line2: "", landmark: "", city: "", state: "", pincode: "", type: "home" as Address["type"] };

export default function AddressesPage() {
  const addresses = useAccountStore((s) => s.addresses);
  const addAddress = useAccountStore((s) => s.addAddress);
  const removeAddress = useAccountStore((s) => s.removeAddress);
  const setDefaultAddress = useAccountStore((s) => s.setDefaultAddress);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function handleSave() {
    if (!form.name || !form.phone || !form.line1 || !form.city || !form.pincode) return;
    addAddress({ id: generateId("addr"), isDefault: addresses.length === 0, ...form });
    setForm(emptyForm);
    setShowForm(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold">Saved Addresses</h1>
        {!showForm && (
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus size={15} /> Add New
          </Button>
        )}
      </div>

      {showForm && (
        <div className="card-surface grid gap-3 p-5 sm:grid-cols-2">
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
          <Field label="Type">
            <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Address["type"] })}>
              <option value="home">Home</option>
              <option value="work">Work</option>
            </Select>
          </Field>
          <div className="sm:col-span-2 flex gap-2">
            <Button onClick={handleSave}>Save Address</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="card-surface flex flex-col items-center gap-3 py-16 text-center">
          <MapPin size={44} className="text-foreground/20" />
          <p className="font-medium">No saved addresses</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <div key={a.id} className={cn("card-surface p-4", a.isDefault && "border-brand-500")}>
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold text-sm">
                  {a.name}{" "}
                  <span className="ml-1 rounded bg-surface-muted px-1.5 py-0.5 text-[10px] uppercase text-foreground/50">{a.type}</span>
                </p>
                <button onClick={() => removeAddress(a.id)} className="text-foreground/30 hover:text-danger-500">
                  <Trash2 size={15} />
                </button>
              </div>
              <p className="text-sm text-foreground/60 mt-1.5">
                {a.line1}, {a.line2 ? `${a.line2}, ` : ""}{a.city}, {a.state} - {a.pincode}
              </p>
              <p className="text-xs text-foreground/45 mt-1">Phone: {a.phone}</p>
              {a.isDefault ? (
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand-600">
                  <Star size={12} className="fill-brand-600" /> Default address
                </span>
              ) : (
                <button onClick={() => setDefaultAddress(a.id)} className="mt-2 text-xs font-medium text-brand-600 hover:text-brand-700">
                  Set as default
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
