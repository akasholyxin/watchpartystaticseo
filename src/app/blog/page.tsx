import Link from "next/link";
import { copy } from "@/config/copy";
import { clusters, type Cluster } from "@/config/taxonomy";
import { Breadcrumbs, JsonLd } from "@/components/meta";
import { allPosts, type Entry } from "@/lib/content";
import { breadcrumbLd, buildMetadata, graph } from "@/lib/seo";
import { Badge, Card, Container, Media } from "@/ui";
import { CtaBand } from "@/sections";

export const metadata = buildMetadata({
  title: "Blog: Guides for Watching Videos Together",
  description: "Guides for watching Netflix, YouTube, movies and anime together online, plus movie night ideas and fixes for common sync problems.",
  path: "/blog/",
});

export default function Blog() {
  const posts = allPosts();
  const groups = posts.reduce<Partial<Record<Cluster, Entry[]>>>((acc, p) => ((acc[p.cluster] ??= []).push(p), acc), {});
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog/" },
  ];
  return (
    <>
      <JsonLd data={graph(breadcrumbLd(crumbs))} />
      <header className="bg-hero border-b border-border">
        <Container className="py-14 sm:py-20">
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold sm:text-6xl">{copy.blog.title}</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted sm:text-xl">{copy.blog.lead}</p>
          <ul aria-label="Topics" className="mt-8 flex flex-wrap gap-2">
            {(Object.keys(groups) as Cluster[]).map((c) => (
              <li key={c} className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-heading">
                {clusters[c].label}
              </li>
            ))}
          </ul>
        </Container>
      </header>
      <Container className="py-14">
        {posts.length === 0 && <p className="text-muted">{copy.blog.empty}</p>}
        {/* One grid: every guide has its own image, so a dense grid reads better than one card per topic. */}
        <h2 className="sr-only">All guides</h2>
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <li key={p.path}>
                  <Link href={p.path} className="block h-full">
                    <Card interactive className="flex h-full flex-col overflow-hidden !p-0">
                      {p.heroImage && <Media id={p.heroImage} className="!rounded-none !border-0 !shadow-none" sizes="(min-width: 1024px) 380px, 100vw" />}
                      <div className="flex flex-1 flex-col p-6">
                        <Badge tone="neutral">{clusters[p.cluster].label}</Badge>
                        <p className="mt-4 font-display text-xl font-bold leading-snug text-heading">{p.h1 ?? p.title}</p>
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{p.description}</p>
                        <span className="mt-auto pt-5 text-sm font-semibold text-link">Read the guide →</span>
                      </div>
                    </Card>
                  </Link>
                </li>
              ))}
        </ul>
      </Container>
      <CtaBand cta={{ slug: "blog", pageType: "hub" }} />
    </>
  );
}
