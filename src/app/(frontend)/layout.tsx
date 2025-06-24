import type { Metadata } from "next";

//import "../globals.css";
//import "../(frontend)/index.css";
import "../globals.css";

import Header from "@/components/modules/header";
import Footer from "@/components/modules/footer";

import MobileNav from "@/components/custom/MobileNav";

export const metadata: Metadata = {
  title: "Edimays Couture",
  description: "The No.1 fashion store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="background-light850_dark100">
      <Header />
      {children}
      <Footer />
      <MobileNav />
    </main>
  );
}
