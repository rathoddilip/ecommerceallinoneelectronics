import { NextResponse } from "next/server";
import { getAdminSession, type AdminSessionUser } from "@/lib/admin/auth";

export class AdminAuthError extends Error {}

export async function requireAdmin(): Promise<AdminSessionUser> {
  const admin = await getAdminSession();
  if (!admin) throw new AdminAuthError("Not authenticated");
  return admin;
}

export function unauthorized() {
  return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
}
