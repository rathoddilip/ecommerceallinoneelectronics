# AllInOne Electronics

A modern, fully responsive e-commerce storefront for **electrical goods, consumer electronics and water purifiers** — built with Next.js 16 (App Router), TypeScript, Tailwind CSS v4 and Zustand.

This project focuses on the **customer-facing website**: browsing, cart, checkout, and the service features (installation booking, AMC plans, water purifier recommendation quiz) that set this store apart from a generic shop. It is a frontend implementation with a realistic, swappable mock data layer — see [Architecture notes](#architecture-notes) below for how to connect a real backend.

## Features

- **Catalog** across three departments (Electrical, Electronics, Water Purifiers) with category-specific filters, brand/price/rating filters and sorting.
- **Product detail pages** with variants, specifications, reviews, "what's in the box", installation add-on, AMC plan selection, pincode delivery check and related products.
- **Cart & multi-step checkout** (address → delivery slot → payment → review) with coupon codes, GST-inclusive pricing breakdown and a persistent slide-over cart drawer.
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
| State | Zustand (cart, account/mock-backend, UI), persisted to `localStorage` |
| Icons | lucide-react |

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # run the production build
npm run lint    # ESLint
```

## Architecture Notes

This is a **frontend demo with a mock backend**, designed so each piece can be swapped for a real API without restructuring the UI:

- `src/lib/data/*` — the product catalog, categories, brands and AMC plans. Replace these with calls to a real `/api/v1/*` service (see the original requirements doc for the full REST surface).
- `src/lib/store/cart.ts` and `src/lib/store/account.ts` — Zustand stores standing in for a backend: cart, orders, service requests, addresses, wishlist and "my products" all persist to `localStorage`. Swap the `persist` middleware for real API calls when a backend exists.
- Login is a **mocked OTP/Google flow** (any 4-digit code works) — wire up real auth (mobile OTP via MSG91/Twilio, Google OAuth) server-side.
- Payments are **UI-only** — no real gateway is called. Integrate Razorpay/Cashfree with server-side webhook verification before going live.
- Product images are **generated illustrations** (icon + gradient per category) rather than photography, so the project needs no external image hosting to run. Swap `ProductVisual` for real product photography.

Out of scope for this build (per the original platform requirements): native mobile apps, technician app, multi-vendor seller panel, and the admin panel — this repository is the customer website only.

## Project Structure

```
src/
  app/                  # routes (App Router)
  components/
    layout/             # Header, Footer, mobile nav, cart drawer host
    home/                # Homepage sections
    product/             # Product card, gallery, visuals
    shop/                 # Filters, sort, grid
    cart/                 # Cart drawer
    account/               # Account sidebar nav
    contact/                # FAQ accordion
    ui/                      # Design-system primitives (Button, Badge, Input, Tabs, ...)
  lib/
    data/                  # Mock catalog data
    store/                  # Zustand stores
    types.ts, format.ts, utils.ts, cartSelectors.ts
```
