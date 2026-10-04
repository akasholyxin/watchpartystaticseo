import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { site } from "@/config/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/Analytics";

// Body text uses display "optional": no late font swap, so the hero paragraph (the mobile LCP element)
// paints once instead of re-rendering when the web font arrives.
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "optional" });
// Display face for headings, close to the bold geometric type in the store artwork.
const display = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["700", "800"], variable: "--font-display", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name}: ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  // Verification tokens are public by design; set via Vercel env vars.
  verification: {
    google: site.verification.google || undefined,
    other: site.verification.bing ? { "msvalidate.01": site.verification.bing } : undefined,
  },
  alternates: { types: { "application/rss+xml": "/blog/rss.xml" } },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${display.variable} antialiased`}>
      <body className="flex min-h-screen flex-col font-sans">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-bg focus:px-3 focus:py-2">
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <Analytics enabled={site.isProd && Boolean(site.ga4Id)} gaId={site.ga4Id} />
        {site.isProd && (
          <>
            <VercelAnalytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
