import type { Metadata } from "next";
import { Cairo, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer/Footer";

const cairo = Cairo({
  subsets: ["arabic"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://saudi-eta.vercel.app"
  ),

  title: {
    default: "سعودي عندك | منتجات سعودية في مصر",
    template: "%s | سعودي عندك",
  },

  description:
    "اطلب منتجات سعودية أصلية وتوصّل لحد باب بيتك في جميع محافظات مصر. اطلب منتجك بالاسم والصورة بسهولة.",

  keywords: [
    "منتجات سعودية في مصر",
    "شراء منتجات سعودية",
    "طلب مسبق من السعودية",
    "شحن من السعودية إلى مصر",
    "سعودي عندك",
  ],

  authors: [{ name: "سعودي عندك" }],
  creator: "سعودي عندك",
  applicationName: "سعودي عندك",

  alternates: {
    canonical: "/",
  },

  verification: {
    google: "iXnp9YRQDpmxH7Fkx7jeMP58QvM9hk8kee6_3Uucwrg",
  },

  openGraph: {
    type: "website",
    locale: "ar_EG",
    siteName: "سعودي عندك",
    title: "سعودي عندك | منتجات سعودية في مصر",
    description:
      "منتجات سعودية أصلية من السعودية إلى مصر، مع طلب مسبق وتوصيل لجميع المحافظات.",
  },

  twitter: {
    card: "summary_large_image",
    title: "سعودي عندك | منتجات سعودية في مصر",
    description: "اطلب منتجاتك السعودية وتوصّل لحد باب بيتك في مصر.",
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="ar-EG"
      dir="rtl"
      className={`${cairo.className} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        className={`${cairo.className} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}

