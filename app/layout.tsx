import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Inter, Manrope } from "next/font/google";
import { Suspense, type ReactNode } from "react";
import { Analytics } from "@/components/analytics";
import { meta } from "@/lib/content";
import { sanitizeYmId } from "@/lib/analytics/ym";
import { isSitePublic } from "@/lib/site";
import "./globals.css";

const manrope = Manrope({
  subsets: ["cyrillic", "latin"],
  weight: ["700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const inter = Inter({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const plex = IBM_Plex_Mono({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500"],
  variable: "--font-plex",
  display: "swap",
});

const published = isSitePublic();

export const metadata: Metadata = {
  title: {
    default: meta.title,
    template: "%s — Ширма",
  },
  description: meta.description,
  robots: published
    ? { index: true, follow: true }
    : { index: false, follow: false },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-64.png", sizes: "64x64", type: "image/png" },
      { url: "/brand/icon-app.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "512x512" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#FAF8F4",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const ymId = sanitizeYmId(process.env.NEXT_PUBLIC_YM_ID);

  return (
    <html lang="ru" className={`${manrope.variable} ${inter.variable} ${plex.variable}`}>
      <body>
        <a className="skip-link" href="#content">
          К содержанию
        </a>
        {children}
        <Suspense fallback={null}>
          <Analytics ymId={ymId} />
        </Suspense>
      </body>
    </html>
  );
}
