import { cookies } from "next/headers";
import { randomUUID } from "crypto";

const SESSION_COOKIE = "aoe_session";
const LOGGED_IN_COOKIE = "aoe_logged_in";

export async function getOrCreateSessionId(): Promise<string> {
  const store = await cookies();
  const existing = store.get(SESSION_COOKIE)?.value;
  if (existing) return existing;

  const id = randomUUID();
  store.set(SESSION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return id;
}

export async function getSessionId(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

export async function isLoggedIn(): Promise<boolean> {
  const store = await cookies();
  return store.get(LOGGED_IN_COOKIE)?.value === "1";
}

export async function setLoggedIn(value: boolean) {
  const store = await cookies();
  if (value) {
    store.set(LOGGED_IN_COOKIE, "1", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  } else {
    store.delete(LOGGED_IN_COOKIE);
  }
}
