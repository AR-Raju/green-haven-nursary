import Providers from "@/app/providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Green Haven - Your Plant Paradise",
  description:
    "Discover beautiful plants and gardening supplies at Green Haven. Transform your space with our curated collection of indoor and outdoor plants.",
  keywords:
    "plants, gardening, indoor plants, outdoor plants, plant care, garden supplies",
  authors: [{ name: "Asikur Rahman" }],
  creator: "Asikur Rahman",
  publisher: "Asikur Rahman",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://greenhaven.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Green Haven - Your Plant Paradise",
    description:
      "Discover beautiful plants and gardening supplies at Green Haven. Transform your space with our curated collection of indoor and outdoor plants.",
    url: "https://greenhaven.com",
    siteName: "Green Haven",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Green Haven - Plant Paradise",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Green Haven - Your Plant Paradise",
    description:
      "Discover beautiful plants and gardening supplies at Green Haven.",
    images: ["/twitter-image.jpg"],
    creator: "@greenhaven",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#22c55e" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
