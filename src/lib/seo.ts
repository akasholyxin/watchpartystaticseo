import type { Metadata } from "next";
import { abs, site } from "@/config/site";
import type { Entry } from "@/lib/content";
import og from "@/app/opengraph-image.png";

// Every page's <head> goes through here, so none can ship without title, description, canonical and OG.

type MetaInput = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  type?: "website" | "article";
  publishedTime?: Date;
  modifiedTime?: Date;
  /** True when the route has its own opengraph-image file (per-page preview); then we don't force the shared one. */
  ownImage?: boolean;
};

export function buildMetadata(m: MetaInput): Metadata {
  if (!m.title || m.title.length > 60) throw new Error(`${m.path}: title missing or > 60 chars`);
  if (!m.description || m.description.length < 70 || m.description.length > 160)
    throw new Error(`${m.path}: description must be 70–160 chars (got ${m.description?.length ?? 0})`);
  if (!m.path.startsWith("/") || !m.path.endsWith("/") || m.path !== m.path.toLowerCase())
    throw new Error(`${m.path}: path must be lowercase with leading and trailing slash`);

  const url = abs(m.path);
  // Nested openGraph objects replace the root one (shallow merge), so pages without their own
  // opengraph-image get the shared real-product image explicitly.
  // Per-page images are referenced with the trailing slash so crawlers don't hit a 308 redirect first
  // (Next's auto URL omits it while the site enforces trailingSlash).
  const images = m.ownImage
    ? [{ url: `${m.path}opengraph-image/`, width: 1200, height: 630, alt: m.title }]
    : [{ url: og.src, width: og.width, height: og.height, alt: m.title }];
  return {
    // Home uses the bare title; every other page gets "| <brand>" appended by the layout template.
    title: m.path === "/" ? { absolute: m.title } : m.title,
    description: m.description,
    alternates: { canonical: url },
    robots: m.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: m.type ?? "website",
      url,
      title: m.title,
      description: m.description,
      siteName: site.name,
      locale: site.locale,
      images,
      ...(m.type === "article"
        ? { publishedTime: m.publishedTime?.toISOString(), modifiedTime: m.modifiedTime?.toISOString() }
        : {}),
    },
    twitter: { card: "summary_large_image", title: m.title, description: m.description, images },
  };
}

export const entryMetadata = (e: Entry): Metadata =>
  buildMetadata({
    title: e.title,
    description: e.description,
    path: e.path,
    noindex: e.noindex,
    type: e.kind === "blog" ? "article" : "website",
    publishedTime: e.publishedAt,
    modifiedTime: e.updatedAt,
    // Every content route except home has a generated opengraph-image (src/lib/og.tsx).
    ownImage: e.path !== "/",
  });

// ── JSON-LD (only types the page truly is; see technical-seo skill) ─────────────

const orgId = `${site.url}/#organization`;

export const organizationLd = () => ({
  "@type": "Organization",
  "@id": orgId,
  name: site.name,
  url: abs("/"),
  logo: abs("/icon.png"),
  email: site.supportEmail,
  sameAs: [site.storeUrl],
});

export const websiteLd = () => ({
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  name: site.name,
  url: abs("/"),
  publisher: { "@id": orgId },
});

export const softwareLd = () => ({
  "@type": "SoftwareApplication",
  name: site.storeName,
  applicationCategory: "BrowserApplication",
  operatingSystem: "Chrome",
  description: site.description,
  url: site.storeUrl,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@id": orgId },
});

export const breadcrumbLd = (items: { name: string; path: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
});

export const articleLd = (e: Entry) => ({
  "@type": "BlogPosting",
  headline: e.h1 ?? e.title,
  description: e.description,
  datePublished: e.publishedAt.toISOString(),
  dateModified: e.updatedAt.toISOString(),
  author: { "@type": "Organization", name: site.author.name, url: abs(site.author.url) },
  publisher: { "@id": orgId },
  mainEntityOfPage: abs(e.path),
  image: abs("/opengraph-image.png"),
});

export const webPageLd = (e: Entry) => ({
  "@type": "WebPage",
  name: e.h1 ?? e.title,
  description: e.description,
  url: abs(e.path),
  dateModified: e.updatedAt.toISOString(),
  isPartOf: { "@id": `${site.url}/#website` },
});

export const faqLd = (faq: { q: string; a: string }[]) =>
  faq.length
    ? {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      }
    : null;

/** Wrap nodes in one @graph; null entries are dropped. */
export const graph = (...nodes: (object | null)[]) => ({
  "@context": "https://schema.org",
  "@graph": nodes.filter(Boolean),
});
