import type { Metadata } from "next";
import "./globals.css";
import Providers from "../../providers";
import { Jost } from "next/font/google";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Your E-commerce Site",
  description: "E-commerce site with Sanity and Next.js",
};

const jost = Jost({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen  w-full max-w-full overflow-x-hidden pb-16 lg:pb-0",
          jost.className,
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
