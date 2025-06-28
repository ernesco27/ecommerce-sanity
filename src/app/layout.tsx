import type { Metadata } from "next";
import "./globals.css";
import Providers from "../../providers";

import { cn } from "@/lib/utils";
import Script from "next/script";
import { Toaster } from "sonner";
import localFont from "next/font/local";

export const metadata: Metadata = {
  title: "Your E-commerce Site",
  description: "E-commerce site with Sanity and Next.js",
};

// const jost = Jost({
//   subsets: ["latin"],
//   display: "swap",
// });

const jost = localFont({
  src: "./fonts/JostVF.ttf",
  variable: "--font-jost",
  weight: "100 200 300 400 500 600 700 800 900",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://js.paystack.co/v1/inline.js"
          strategy="beforeInteractive"
        />
      </head>
      <body
        className={cn(
          "min-h-screen  w-full max-w-full overflow-x-hidden pb-16 lg:pb-0 custom-scrollbar",
          jost.className,
        )}
      >
        <Providers>{children}</Providers>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
