import { createHmac, timingSafeEqual } from "crypto";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const COOKIE_NAME = "aoe_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not set. Add a long random string to .env (local) or your hosting provider's environment variables."
    );
  }
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createAdminSession(adminUserId: string) {
  const issuedAt = Date.now().toString();
  const payload = `${adminUserId}.${issuedAt}`;
  const signature = sign(payload);
  const value = `${payload}.${signature}`;

  const store = await cookies();
  store.set(COOKIE_NAME, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE_SECONDS,
    path: "/",
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete({ name: COOKIE_NAME, path: "/" });
}

export interface AdminSessionUser {
  id: string;
  email: string;
  name: string;
  role: "super_admin" | "staff";
}

export async function getAdminSession(): Promise<AdminSessionUser | null> {
  const store = await cookies();
  const value = store.get(COOKIE_NAME)?.value;
  if (!value) return null;

  const parts = value.split(".");
  if (parts.length !== 3) return null;
  const [adminUserId, issuedAt, signature] = parts;

  const expectedSignature = sign(`${adminUserId}.${issuedAt}`);
  if (!safeEqual(signature, expectedSignature)) return null;

  const age = Date.now() - Number(issuedAt);
  if (!Number.isFinite(age) || age < 0 || age > MAX_AGE_SECONDS * 1000) return null;

  const admin = await prisma.adminUser.findUnique({ where: { id: adminUserId } });
  if (!admin || !admin.isActive) return null;

  return { id: admin.id, email: admin.email, name: admin.name, role: admin.role };
}
