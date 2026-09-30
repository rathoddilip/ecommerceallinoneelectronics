"use client";

import { useState } from "react";
import { MapPin, CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { formatDate, addDays } from "@/lib/format";

export default function PincodeCheck({ installationAvailable }: { installationAvailable: boolean }) {
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<null | { deliveryDate: string; cod: boolean; serviceable: boolean }>(null);

  function check() {
    if (!/^\d{6}$/.test(pincode)) {
      setResult({ deliveryDate: "", cod: false, serviceable: false });
      return;
    }
    const seed = Number(pincode) % 10;
    const serviceable = seed !== 9;
    const days = 2 + (seed % 4);
    setResult({
      deliveryDate: formatDate(addDays(new Date(), days)),
      cod: seed % 3 !== 0,
      serviceable,
    });
  }

  return (
    <div className="rounded-xl border border-border-subtle p-4">
      <p className="flex items-center gap-1.5 text-sm font-semibold">
        <MapPin size={15} className="text-brand-500" /> Check delivery & installation
      </p>
      <div className="mt-2.5 flex gap-2">
        <Input
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="Enter pincode"
          className="h-10"
        />
        <button
          onClick={check}
          className="shrink-0 rounded-lg bg-brand-500 px-4 text-sm font-semibold text-white hover:bg-brand-600"
        >
          Check
        </button>
      </div>
      {result && (
        <div className="mt-3 text-sm">
          {!/^\d{6}$/.test(pincode) ? (
            <p className="text-danger-500">Enter a valid 6-digit pincode.</p>
          ) : result.serviceable ? (
            <div className="space-y-1">
              <p className="flex items-center gap-1.5 text-success-600 font-medium">
                <CheckCircle2 size={15} /> Delivery by {result.deliveryDate}
              </p>
              <p className="text-foreground/60">
                {result.cod ? "Cash on Delivery available" : "Prepaid orders only for this pincode"}
              </p>
              {installationAvailable && (
                <p className="text-foreground/60">Installation slots available in your area</p>
              )}
            </div>
          ) : (
            <p className="flex items-center gap-1.5 text-danger-500 font-medium">
              <XCircle size={15} /> Currently not serviceable at this pincode
            </p>
          )}
        </div>
      )}
    </div>
  );
}
