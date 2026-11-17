"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Zap, Smartphone, Mail } from "lucide-react";
import { useAccountStore } from "@/lib/store/account";
import Button from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

function GoogleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6c-2 1.5-4.6 2.7-7.7 2.7-5.2 0-9.6-3.3-11.2-8l-6.6 5.1C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.6 5.6C39.8 37.1 44 31.4 44 24c0-1.3-.1-2.7-.4-3.5z" />
    </svg>
  );
}

function LoginContent() {
  const router = useRouter();
  const redirect = useSearchParams().get("redirect") ?? "/account";
  const login = useAccountStore((s) => s.login);

  const [mode, setMode] = useState<"otp" | "password">("otp");
  const [mobile, setMobile] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSendOtp() {
    if (/^\d{10}$/.test(mobile)) setOtpSent(true);
  }

  async function handleVerifyOtp() {
    if (otp.length === 4) {
      await login(mobile, name);
      router.push(redirect);
    }
  }

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    if (email.includes("@") && password.length >= 4) {
      await login(email.split("@")[0], email.split("@")[0]);
      router.push(redirect);
    }
  }

  async function handleGoogle() {
    await login("9999900000", "Google User");
    router.push(redirect);
  }

  return (
    <div className="container-page max-w-md py-14">
      <div className="flex flex-col items-center text-center mb-6">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500 text-white">
          <Zap size={22} className="fill-white" />
        </span>
        <h1 className="font-display text-2xl font-bold mt-3">Welcome back</h1>
        <p className="text-foreground/55 text-sm mt-1">Login or create an account to continue</p>
      </div>

      <div className="card-surface p-6">
        <div className="flex rounded-full bg-surface-muted p-1 mb-6">
          <button
            onClick={() => setMode("otp")}
            className={cn("flex-1 rounded-full py-2 text-sm font-semibold transition-colors", mode === "otp" ? "bg-surface shadow-sm" : "text-foreground/50")}
          >
            Mobile OTP
          </button>
          <button
            onClick={() => setMode("password")}
            className={cn("flex-1 rounded-full py-2 text-sm font-semibold transition-colors", mode === "password" ? "bg-surface shadow-sm" : "text-foreground/50")}
          >
            Email & Password
          </button>
        </div>

        {mode === "otp" ? (
          <div className="space-y-4">
            <Field label="Mobile Number" required>
              <div className="relative">
                <Smartphone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/35" />
                <Input
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="10-digit mobile number"
                  className="pl-10"
                  disabled={otpSent}
                />
              </div>
            </Field>
            {!otpSent ? (
              <Button fullWidth size="lg" disabled={mobile.length !== 10} onClick={handleSendOtp}>
                Send OTP
              </Button>
            ) : (
              <>
                <Field label="Your Name">
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Optional" />
                </Field>
                <Field label="Enter OTP" required hint="For this demo, any 4 digits will work">
                  <Input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="••••" />
                </Field>
                <Button fullWidth size="lg" disabled={otp.length !== 4} onClick={handleVerifyOtp}>
                  Verify & Continue
                </Button>
              </>
            )}
          </div>
        ) : (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <Field label="Email" required>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/35" />
                <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-10" />
              </div>
            </Field>
            <Field label="Password" required>
              <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </Field>
            <Button type="submit" fullWidth size="lg">Login</Button>
          </form>
        )}

        <div className="my-5 flex items-center gap-3 text-xs text-foreground/40">
          <span className="h-px flex-1 bg-border-subtle" /> OR <span className="h-px flex-1 bg-border-subtle" />
        </div>

        <Button variant="outline" fullWidth size="lg" onClick={handleGoogle}>
          <GoogleIcon /> Continue with Google
        </Button>

        <p className="mt-5 text-center text-xs text-foreground/45">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container-page py-24 text-center text-foreground/40">Loading…</div>}>
      <LoginContent />
    </Suspense>
  );
}
