"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, Mail, Lock } from "lucide-react";
import Button from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { apiFetch, ApiError } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await apiFetch("/api/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      router.push("/admin");
      router.refresh();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-900 px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white">
            <Zap size={22} className="fill-white" />
          </span>
          <h1 className="font-display text-xl font-bold text-white mt-3">Admin Panel</h1>
          <p className="text-white/50 text-sm mt-1">AllInOne Electronics</p>
        </div>

        <form onSubmit={handleSubmit} className="card-surface p-6 space-y-4">
          <Field label="Email" required>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/35" />
              <Input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@store.com"
                className="pl-10"
              />
            </div>
          </Field>
          <Field label="Password" required>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/35" />
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10"
              />
            </div>
          </Field>
          {error && <p className="text-sm text-danger-500">{error}</p>}
          <Button type="submit" fullWidth size="lg" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
