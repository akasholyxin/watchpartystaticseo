import { abs, site } from "@/config/site";
import { allPosts } from "@/lib/content";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);

export function GET() {
  const items = allPosts()
    .filter((p) => !p.noindex)
    .map(
      (p) => `<item><title>${esc(p.h1 ?? p.title)}</title><link>${abs(p.path)}</link><guid>${abs(p.path)}</guid><description>${esc(p.description)}</description><pubDate>${p.publishedAt.toUTCString()}</pubDate></item>`
    )
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(site.name)} Blog</title><link>${abs("/blog/")}</link><description>${esc(site.tagline)}</description><language>en</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
