import { site } from "@/config/site";
import { clusters, type Cluster } from "@/config/taxonomy";

// UTM convention (plans/website-v1.json W8). Chrome Web Store dashboard reports installs by these.

export type CtaPosition = "header" | "hero" | "mid" | "end" | "sticky" | "inline" | "join" | "download";


export function storeLink(opts: { cluster?: Cluster; slug: string; position: CtaPosition }) {
  const u = new URL(site.storeUrl);
  u.searchParams.set("utm_source", "website");
  u.searchParams.set("utm_medium", "organic");
  u.searchParams.set("utm_campaign", clusters[opts.cluster ?? "general"].campaign);
  u.searchParams.set("utm_content", `${opts.slug || "home"}-${opts.position}`);
  return u.toString();
}
