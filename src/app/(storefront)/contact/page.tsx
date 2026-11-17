"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, CheckCircle2 } from "lucide-react";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { Field, Input, Select, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import FaqAccordion from "@/components/contact/FaqAccordion";

const infoCards = [
  { icon: Phone, title: "Call Us", detail: "1800-123-4567", sub: "Mon-Sat, 9am - 7pm" },
  { icon: Mail, title: "Email Us", detail: "support@allinoneelectronics.in", sub: "We reply within 24 hours" },
  { icon: MessageCircle, title: "WhatsApp Us", detail: "+91 98765 43210", sub: "Fastest response" },
  { icon: MapPin, title: "Head Office", detail: "Pune, Maharashtra", sub: "Serving 250+ pincodes" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "order", message: "" });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.name && form.email && form.message) setSubmitted(true);
  }

  return (
    <div className="container-page py-6">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} />
      <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mt-3">We&apos;re here to help</h1>
      <p className="text-foreground/55 text-sm mt-1 mb-8 max-w-xl">
        Questions about an order, a product or a service booking? Reach us however&apos;s easiest for you.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        {infoCards.map(({ icon: Icon, title, detail, sub }) => (
          <div key={title} className="card-surface p-5">
            <Icon size={20} className="text-brand-500" />
            <h3 className="font-semibold text-sm mt-2.5">{title}</h3>
            <p className="text-sm font-medium mt-1">{detail}</p>
            <p className="text-xs text-foreground/45 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="card-surface p-6">
          <h2 className="font-display font-bold mb-4">Send us a message</h2>
          {submitted ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <CheckCircle2 size={40} className="text-success-600" />
              <p className="font-medium">Thanks, {form.name}!</p>
              <p className="text-sm text-foreground/55">We&apos;ve received your message and will respond within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Your Name" required>
                  <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                </Field>
                <Field label="Email" required>
                  <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </Field>
              </div>
              <Field label="Subject">
                <Select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                  <option value="order">Order Query</option>
                  <option value="service">Service / Installation</option>
                  <option value="product">Product Question</option>
                  <option value="partnership">Technician / Partnership</option>
                  <option value="other">Other</option>
                </Select>
              </Field>
              <Field label="Message" required>
                <Textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </Field>
              <Button type="submit" size="lg">Send Message</Button>
            </form>
          )}
        </div>

        <div>
          <h2 className="font-display font-bold mb-4">Frequently Asked Questions</h2>
          <FaqAccordion />
        </div>
      </div>
    </div>
  );
}
