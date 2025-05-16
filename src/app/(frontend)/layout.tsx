import type { Metadata } from "next";
import { Jost } from "next/font/google";

//import "../globals.css";
import "../(frontend)/index.css";

import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/modules/header";
import Footer from "@/components/modules/footer";
import { cn } from "@/lib/utils";
import MobileNav from "@/components/custom/MobileNav";

export const metadata: Metadata = {
  title: "Edimays Couture",
  description: "The No.1 fashion store",
};

const jost = Jost({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <body
          className={cn(
            "min-h-screen  w-full max-w-full overflow-x-hidden pb-16 lg:pb-0",
            jost.className,
          )}
        >
          <main id="app">
            <Header />
            {children}
            <Footer />
            <MobileNav />
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
