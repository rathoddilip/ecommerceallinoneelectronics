import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import { getDatabaseUrl } from "@/lib/db-url";

// Neon's driver speaks Postgres over WebSocket rather than a raw TCP
// connection — the right choice for a serverless host like Vercel (no
// long-lived connection pool to exhaust) and works through restrictive
// outbound-network sandboxes that only allow HTTPS/WSS traffic.
neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const connectionString = getDatabaseUrl();
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add it to .env (local) or your hosting provider's environment variables."
    );
  }
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
