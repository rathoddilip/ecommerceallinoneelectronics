import type { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import MobileTabBar from "@/components/layout/MobileTabBar";

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileTabBar />
    </>
  );
}
