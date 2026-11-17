import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import MobileTabBar from "@/components/layout/MobileTabBar";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const headingFont = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const siteName = "AllInOne Electronics";
const description =
  "Shop electrical goods, electronics and water purifiers with free installation, genuine warranty and doorstep service across India.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Electrical, Electronics & Water Purifiers`,
    template: `%s | ${siteName}`,
  },
  description,
  keywords: [
    "electrical goods online",
    "electronics store India",
    "water purifier online",
    "RO water purifier",
    "AMC plans",
    "appliance installation",
  ],
  openGraph: {
    type: "website",
    siteName,
    title: `${siteName} — Electrical, Electronics & Water Purifiers`,
    description,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} — Electrical, Electronics & Water Purifiers`,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${bodyFont.variable} ${headingFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <AnnouncementBar />
        <Header />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <Footer />
        <MobileTabBar />
      </body>
    </html>
  );
}
