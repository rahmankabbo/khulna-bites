import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

// Bengali fallback so Bangla content renders correctly everywhere.
const bengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bengali",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Khulna Bites — Everything happening in Khulna, in one place",
    template: "%s · Khulna Bites",
  },
  description:
    "Khulna Bites is a local media and discovery platform for Khulna, Bangladesh: news, offers, events, and a direct line between local businesses and the city.",
  openGraph: {
    siteName: "Khulna Bites",
    type: "website",
    locale: "en_US",
    images: [{ url: "/images/og-default.jpg", width: 1280, height: 860 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${bengali.variable}`}>
      <body className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
