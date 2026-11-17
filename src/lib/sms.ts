// MSG91 OTP integration. MSG91 generates, stores and verifies the OTP on
// their end — we never see or store the code ourselves. Falls back to a
// no-op "demo" mode (any OTP accepted client-side) when no API key is set,
// so the storefront keeps working before real credentials are added.

const MSG91_BASE = "https://control.msg91.com/api/v5/otp";

export function isSmsConfigured(): boolean {
  return Boolean(process.env.MSG91_AUTH_KEY && process.env.MSG91_TEMPLATE_ID);
}

function toMsg91Mobile(mobile: string): string {
  const digits = mobile.replace(/\D/g, "");
  return digits.startsWith("91") ? digits : `91${digits}`;
}

export async function sendOtp(mobile: string): Promise<void> {
  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;
  if (!authKey || !templateId) {
    throw new Error("MSG91_AUTH_KEY / MSG91_TEMPLATE_ID is not set");
  }

  const url = `${MSG91_BASE}?template_id=${encodeURIComponent(templateId)}&mobile=${toMsg91Mobile(mobile)}&authkey=${encodeURIComponent(authKey)}&otp_length=4`;
  const res = await fetch(url, { method: "POST" });
  const data = (await res.json().catch(() => ({}))) as { type?: string; message?: string };
  if (!res.ok || data.type === "error") {
    throw new Error(data.message ?? "Failed to send OTP");
  }
}

export async function verifyOtp(mobile: string, otp: string): Promise<boolean> {
  const authKey = process.env.MSG91_AUTH_KEY;
  if (!authKey) throw new Error("MSG91_AUTH_KEY is not set");

  const url = `${MSG91_BASE}/verify?otp=${encodeURIComponent(otp)}&mobile=${toMsg91Mobile(mobile)}`;
  const res = await fetch(url, { headers: { authkey: authKey } });
  const data = (await res.json().catch(() => ({}))) as { type?: string };
  return res.ok && data.type === "success";
}
