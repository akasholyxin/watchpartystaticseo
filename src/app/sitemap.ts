import type { MetadataRoute } from "next";
import { abs } from "@/config/site";
import { allEntries, allPosts } from "@/lib/content";

// Every indexable URL, auto-updated on each build. Drafts, future posts and noindex pages are excluded.
export default function sitemap(): MetadataRoute.Sitemap {
  const entries = allEntries().filter((e) => !e.noindex);
  const latestPost = allPosts()[0]?.updatedAt;
  return [
    ...entries.map((e) => ({ url: abs(e.path), lastModified: e.updatedAt })),
    ...(latestPost ? [{ url: abs("/blog/"), lastModified: latestPost }] : []),
  ];
}
