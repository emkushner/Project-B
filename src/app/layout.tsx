import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Food Tracker",
  description: "Track meals and daily macros in a simple Next.js app"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
