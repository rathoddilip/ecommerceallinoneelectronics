// Prefer the unpooled connection string when a host (like Vercel's Neon
// integration) provides both — this app talks to Postgres over Neon's
// WebSocket driver, not a pooled TCP connection, so DATABASE_URL_UNPOOLED
// (or POSTGRES_URL_NON_POOLING, Vercel Postgres's equivalent) is the right
// one to use. Falls back to DATABASE_URL so a plain single-URL setup
// (local dev, other Postgres hosts) still works unchanged.
export function getDatabaseUrl(): string | undefined {
  return (
    process.env.DATABASE_URL_UNPOOLED ??
    process.env.POSTGRES_URL_NON_POOLING ??
    process.env.DATABASE_URL
  );
}
