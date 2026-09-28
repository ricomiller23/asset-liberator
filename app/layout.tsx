import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "ASSET LIBERATOR • Distressed Public Carve-Out & Clean Shell Rollup Engine",
  description: "Institutional intelligence and execution engine to identify valuable operating subsidiaries trapped in broken public company vehicles and execute Article 9, 363, or consensual clean shell rollups.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-stone-950 text-stone-100 antialiased selection:bg-emerald-500 selection:text-black">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
