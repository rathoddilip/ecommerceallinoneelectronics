# AllInOne Electronics

A modern, fully responsive e-commerce storefront for **electrical goods, consumer electronics and water purifiers** — built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Prisma/PostgreSQL and Zustand.

This project is the **customer-facing website**: browsing, cart, checkout, and the service features (installation booking, AMC plans, water purifier recommendation quiz) that set this store apart from a generic shop — backed by a real Postgres database, not mock data.

## Features

- **Catalog** across three departments (Electrical, Electronics, Water Purifiers) with category-specific filters, brand/price/rating filters and sorting.
- **Product detail pages** with variants, specifications, reviews, "what's in the box", installation add-on, AMC plan selection, pincode delivery check and related products.
- **Cart & multi-step checkout** (address → delivery slot → payment → review) with coupon codes, GST-inclusive pricing breakdown and a persistent slide-over cart drawer — cart, addresses and orders all live in Postgres, not the browser.
- **Service module**: book installation, demo/TDS test, filter replacement, repair or AMC visits; browse and compare AMC plans; a guided "which purifier do I need?" quiz.
- **Account area**: OTP/email login, orders with status timeline and downloadable invoice, service request tracking, registered products (warranty/AMC/filter reminders), addresses and wishlist.
- **Search**, About, Contact (with FAQ) pages.
- Fully responsive: desktop mega-menu navigation and a mobile bottom tab bar + slide-out menu.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (custom design tokens for brand/department colors) |
| Database | PostgreSQL via Prisma 7 (`@prisma/adapter-pg`) |
| Client state | Zustand (cart/account stores sync with the API; no data persisted client-side) |
| Icons | lucide-react |

## Getting Started

1. **Database.** Create a free Postgres database — easiest is the **Storage** tab of this project on Vercel (Postgres via Neon). Open it, go to the **.env.local** tab, and copy the `DATABASE_URL_UNPOOLED` value (the app talks to Neon over WebSocket, not a TCP pool, so the unpooled string is the right one to use everywhere).
2. Copy `.env.example` to `.env` and paste that value into `DATABASE_URL`.
3. Install, create the tables, load the catalog, and run:

```bash
npm install
npm run db:push    # creates tables from prisma/schema.prisma
npm run db:seed    # loads the product catalog, categories, brands, AMC plans
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build      # production build (compile only — no database needed)
npm run start      # run the production build
npm run lint       # ESLint
npm run db:studio  # browse the database in Prisma Studio
```

### Deploying

On Vercel: connect a Postgres database from the project's **Storage** tab. That auto-adds several env vars, including a pooled `DATABASE_URL` — **overwrite that one** (Project Settings → Environment Variables) with the value of the `DATABASE_URL_UNPOOLED` var it also added, since this app's Prisma client uses Neon's WebSocket driver rather than a pooled TCP connection.

Deploys use the `vercel-build` script (Vercel picks it up automatically in place of `build`), which runs a schema push and an idempotent re-seed before compiling — so once `DATABASE_URL` is set there's no separate manual database step. Every `git push` redeploys (and re-syncs the schema/catalog) automatically.

## Architecture Notes

- **Identity without full auth:** every visitor gets a random, `httpOnly` session cookie (`src/lib/session.ts`) that keys their cart, addresses, orders, service requests and wishlist in the database — so data persists across visits and devices aren't required to "own" it. Login (`src/app/api/auth/*`) is a **mocked OTP/Google flow** (any 4-digit code works) that attaches a display profile (name, mobile, wallet balance) to that session; swap in real SMS OTP (MSG91/Twilio) or OAuth when ready.
- **API layer:** `src/app/api/**` are Next.js Route Handlers backed by Prisma (`src/lib/prisma.ts`, `src/lib/server/cart.ts`). The cart's pricing math (`src/lib/cartSelectors.ts`) is computed server-side and trusted from there — the client only ever displays it.
- **Catalog data:** seeded from `src/lib/data/*.ts` (`prisma/seed.ts`) into Postgres; the app reads products/categories/brands/AMC plans from the database (`src/app/api/products`, `/categories`, `/amc-plans`), not from those static files, at runtime.
- Payments are **UI-only** — no real gateway is called. Integrate Razorpay/Cashfree with server-side webhook verification before going live.
- Product images are **generated illustrations** (icon + gradient per category) rather than photography, so the project needs no external image hosting to run. Swap `ProductVisual` for real product photography.

Out of scope for this build (per the original platform requirements): native mobile apps, technician app, multi-vendor seller panel, and the admin panel — this repository is the customer website only.

## Project Structure

```
prisma/
  schema.prisma          # database schema
  seed.ts                 # loads src/lib/data/* into Postgres
src/
  app/
    api/                  # Route Handlers (products, cart, orders, auth, ...)
    ...                   # pages (App Router)
  components/
    layout/               # Header, Footer, mobile nav, cart drawer host
    home/                 # Homepage sections
    product/               # Product card, gallery, visuals
    shop/                   # Filters, sort, grid
    cart/                    # Cart drawer
    account/                  # Account sidebar nav
    contact/                   # FAQ accordion
    ui/                          # Design-system primitives (Button, Badge, Input, Tabs, ...)
  lib/
    data/                  # Seed source data (catalog, categories, brands, AMC plans)
    server/                 # Server-only helpers (cart pricing builder)
    store/                   # Zustand stores (sync with the API)
    prisma.ts, session.ts, serializers.ts, api.ts
    types.ts, format.ts, utils.ts, cartSelectors.ts
```
