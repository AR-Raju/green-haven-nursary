import { Toaster } from "@/components/ui/toaster";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Green Haven Nursery",
  description: "Your one-stop shop for plants and gardening supplies",
  generator: "Asikur Rahman",
  keywords: [
    "nextjs",
    "radix-ui",
    "tailwindcss",
    "nursery",
    "management",
    "system",
    "react",
    "redux",
    "stripe",
    "ecommerce",
    "dashboard",
    "admin",
    "responsive",
    "modern",
    "ui",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
