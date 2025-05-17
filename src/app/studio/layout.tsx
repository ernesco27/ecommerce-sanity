import "../globals.css";

export const metadata = {
  title: "Sanity Studio",
  description: "Backend management for your e-commerce platform",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, height: "100vh" }}>{children}</body>
    </html>
  );
}
