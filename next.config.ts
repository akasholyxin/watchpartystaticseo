import type { NextConfig } from "next";
import redirects from "./redirects.json";

const isProd = process.env.VERCEL_ENV === "production";

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
];

const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  // The stylesheet is small; inlining it removes a render-blocking request (mobile LCP was 3.3s).
  experimental: { inlineCss: true },
  async headers() {
    return [
      {
        source: "/:path*",
        // Previews and local builds must never be indexed (duplicate-content guard).
        headers: isProd ? securityHeaders : [...securityHeaders, { key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
  // URLs never change after launch; if one must, add a 301 to redirects.json in the same change.
  async redirects() {
    return (redirects as { from: string; to: string }[]).map((r) => ({ source: r.from, destination: r.to, permanent: true }));
  },
};

export default nextConfig;
