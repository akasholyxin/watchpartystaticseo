import Link from "next/link";
import { abs, site } from "@/config/site";
import { copy } from "@/config/copy";

// Small page-meta pieces shared by layouts.

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  if (items.length < 2) return null;
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={it.path} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">›</span>}
            {i === items.length - 1 ? (
              <span aria-current="page" className="line-clamp-1">
                {it.name}
              </span>
            ) : (
              <Link href={it.path} className="hover:text-heading">
                {it.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

const fmt = (d: Date) => d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

export function ArticleMeta({ published, updated, lastVerified }: { published: Date; updated: Date; lastVerified?: Date }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
      <span className="font-medium text-heading">{copy.article.by}</span>
      <span>
        {copy.article.published} <time dateTime={published.toISOString()}>{fmt(published)}</time>
      </span>
      {updated > published && (
        <span>
          {copy.article.updated} <time dateTime={updated.toISOString()}>{fmt(updated)}</time>
        </span>
      )}
      {lastVerified && (
        <span className="w-full">
          {copy.article.factsChecked} <time dateTime={lastVerified.toISOString()}>{fmt(lastVerified)}</time>
        </span>
      )}
    </div>
  );
}

export function AuthorBox() {
  return (
    <aside className="mt-14 flex gap-4 rounded-lg border border-border bg-bg-soft p-6">
      <span aria-hidden="true" className="bg-brand flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-lg font-extrabold text-white">
        {site.name.charAt(0)}
      </span>
      <div className="text-sm leading-relaxed">
        <p className="font-semibold text-heading">
          <Link href="/about/" className="hover:text-link">
            {copy.article.authorTitle}
          </Link>
        </p>
        <p className="mt-1 text-muted">
          {copy.article.authorBody}{" "}
          <a href={`mailto:${site.supportEmail}`} className="font-medium text-link underline underline-offset-2">
            {site.supportEmail}
          </a>
        </p>
      </div>
    </aside>
  );
}

export function ShareLinks({ path, title }: { path: string; title: string }) {
  const url = encodeURIComponent(abs(path));
  const t = encodeURIComponent(title);
  const links = [
    { name: "X", href: `https://x.com/intent/post?url=${url}&text=${t}` },
    { name: "WhatsApp", href: `https://wa.me/?text=${t}%20${url}` },
    { name: "Reddit", href: `https://www.reddit.com/submit?url=${url}&title=${t}` },
  ];
  const pill = "rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-medium text-heading transition hover:border-accent";
  return (
    <div className="mt-12 flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm text-muted">{copy.article.share}</span>
      {links.map((l) => (
        <a key={l.name} href={l.href} target="_blank" rel="noopener" data-track="share_click" data-network={l.name} className={pill}>
          {l.name}
        </a>
      ))}
      <button type="button" data-copy-page className={pill}>
        {copy.article.copyLink}
      </button>
    </div>
  );
}

export function NotAffiliated({ brands }: { brands: string[] }) {
  if (!brands.length) return null;
  return <p className="mt-10 text-xs leading-relaxed text-muted">{copy.notAffiliated(brands)}</p>;
}

export function JsonLd({ data }: { data: object }) {
  // "<" escaped so content can never close the script tag.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
