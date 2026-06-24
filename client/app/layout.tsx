import type { Metadata } from "next";
import { Toaster } from "sonner";
import Providers from "./Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "StockFlow",
  description: "StockFlow — Procurement & supply chain management platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
