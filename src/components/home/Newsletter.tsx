"use client";

import { useState } from "react";
import { Mail, CheckCircle2, Smartphone } from "lucide-react";
import { Input } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="container-page pb-14">
      <div className="grid overflow-hidden rounded-3xl bg-brand-500 sm:grid-cols-2">
        <div className="p-8 sm:p-10">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-white">
            <Mail size={20} />
          </span>
          <h2 className="font-display mt-4 text-xl sm:text-2xl font-bold text-white">
            Get deals & filter-change reminders
          </h2>
          <p className="mt-2 text-sm text-white/80">
            Subscribe for early access to sales, and we&apos;ll remind you when it&apos;s time to change your purifier filter.
          </p>
          {submitted ? (
            <p className="mt-5 inline-flex items-center gap-2 text-white font-medium">
              <CheckCircle2 size={18} /> You&apos;re subscribed! Watch your inbox.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.includes("@")) setSubmitted(true);
              }}
              className="mt-5 flex flex-col sm:flex-row gap-2 max-w-sm"
            >
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-white/95 border-transparent"
              />
              <Button type="submit" variant="secondary" className="shrink-0">
                Subscribe
              </Button>
            </form>
          )}
        </div>
        <div className="flex items-center justify-center gap-4 border-t border-white/10 p-8 sm:border-l sm:border-t-0 sm:p-10">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
            <Smartphone size={20} />
          </span>
          <div>
            <h3 className="font-display font-bold text-white">Shop on the go</h3>
            <p className="mt-1 text-sm text-white/80">
              Our Android &amp; iOS apps are launching soon with push notifications for order and service updates.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
