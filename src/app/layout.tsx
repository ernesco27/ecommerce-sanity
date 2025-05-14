import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Your E-commerce Site",
  description: "E-commerce site with Sanity and Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div>{children}</div>
      </body>
    </html>
  );
}
