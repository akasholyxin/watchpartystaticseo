import type { MetadataRoute } from "next";
import { abs, site } from "@/config/site";

// Production: allow everyone, including AI crawlers (ai-search-geo skill). Previews: block everything.
export default function robots(): MetadataRoute.Robots {
  if (!site.isProd) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: [
      // /join/ stays crawlable so Google can see its noindex tag.
      { userAgent: "*", allow: "/" },
      { userAgent: ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "ClaudeBot", "Google-Extended"], allow: "/" },
    ],
    sitemap: abs("/sitemap.xml"),
    host: site.url,
  };
}
