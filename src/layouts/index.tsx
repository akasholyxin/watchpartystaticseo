import { copy } from "@/config/copy";
import { clusters, articleTypes } from "@/config/taxonomy";
import { byPath, type Entry } from "@/lib/content";
import { headings, renderMdx } from "@/lib/mdx";
import { articleLd, breadcrumbLd, faqLd, graph, organizationLd, softwareLd, webPageLd, websiteLd } from "@/lib/seo";
import { ArticleMeta, AuthorBox, Breadcrumbs, JsonLd, NotAffiliated, ShareLinks } from "@/components/meta";
import { Badge, Container, Media } from "@/ui";
import { CtaBand, FaqSection, FeatureGrid, Hero, RelatedGrid, StepsSection, UseCases, WorksOn } from "@/sections";

// One layout per page type. Routes call renderEntry(); nothing else decides how a page looks.

const crumbsFor = (e: Entry) =>
  e.path === "/"
    ? []
    : e.kind === "blog"
      ? [
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog/" },
          { name: e.h1 ?? e.title, path: e.path },
        ]
      : [
          { name: "Home", path: "/" },
          { name: e.h1 ?? e.title, path: e.path },
        ];

const relatedFor = (e: Entry) =>
  e.related
    .map((p) => byPath(p))
    .filter((r): r is Entry => Boolean(r))
    .map((r) => ({ path: r.path, title: r.h1 ?? r.title, description: r.description, label: clusters[r.cluster].label }));

const ctaFor = (e: Entry) => ({ slug: e.slug, cluster: e.cluster, pageType: e.pageType });

// ── Home ─────────────────────────────────────────────────────────────────────
async function HomeLayout({ entry: e }: { entry: Entry }) {
  const body = await renderMdx(e);
  return (
    <>
      <JsonLd data={graph(organizationLd(), websiteLd(), softwareLd(), faqLd(e.faq))} />
      <Hero
        badge={e.hero?.badge}
        title={e.hero?.title ?? e.h1 ?? e.title}
        highlight={e.hero?.highlight}
        lead={e.hero?.lead ?? e.description}
        image={e.heroImage ?? "hero"}
        cta={ctaFor(e)}
        secondary={{ href: "/how-it-works/", label: "See how it works" }}
      />
      <WorksOn />
      {e.steps.length > 0 && <StepsSection eyebrow="How it works" title="Start a watch party in under a minute" steps={e.steps} />}
      {e.features.length > 0 && <FeatureGrid eyebrow="Features" title="Everything a watch party needs" items={e.features} />}
      {e.body.trim() && (
        <Container size="sm">
          <div className="prose prose-lg prose-wp max-w-none py-16">{body}</div>
        </Container>
      )}
      {e.useCases.length > 0 && <UseCases eyebrow="Made for" title="Who watches together" items={e.useCases} />}
      <FaqSection items={e.faq} />
      <CtaBand cta={ctaFor(e)} />
    </>
  );
}

// ── Landing ──────────────────────────────────────────────────────────────────
async function LandingLayout({ entry: e }: { entry: Entry }) {
  const body = await renderMdx(e);
  const crumbs = crumbsFor(e);
  return (
    <>
      <JsonLd data={graph(webPageLd(e), breadcrumbLd(crumbs), faqLd(e.faq))} />
      <Hero
        badge={e.hero?.badge}
        title={e.hero?.title ?? e.h1 ?? e.title}
        highlight={e.hero?.highlight}
        lead={e.hero?.lead ?? e.description}
        image={e.heroImage ?? "hero"}
        cta={ctaFor(e)}
        breadcrumbs={<Breadcrumbs items={crumbs} />}
      />
      <WorksOn />
      {e.steps.length > 0 && <StepsSection title="How to start" steps={e.steps} />}
      {e.features.length > 0 && <FeatureGrid title="What you get" items={e.features} />}
      <Container size="sm">
        <article className="prose prose-lg prose-wp max-w-none py-16">{body}</article>
        <NotAffiliated brands={e.notAffiliated} />
      </Container>
      {e.useCases.length > 0 && <UseCases title="Ideas" items={e.useCases} />}
      <FaqSection items={e.faq} />
      <CtaBand cta={ctaFor(e)} />
      <RelatedGrid items={relatedFor(e)} />
    </>
  );
}

// ── Article (guides, comparisons, troubleshooting) ───────────────────────────
async function ArticleLayout({ entry: e }: { entry: Entry }) {
  const body = await renderMdx(e);
  const crumbs = crumbsFor(e);
  const toc = headings(e);
  const isPost = e.kind === "blog";
  return (
    <>
      <JsonLd data={graph(isPost ? articleLd(e) : webPageLd(e), breadcrumbLd(crumbs), faqLd(e.faq))} />
      <header className="bg-hero border-b border-border">
        <Container size="md" className="py-12 sm:py-16">
          <Breadcrumbs items={crumbs} />
          <div className="mt-6">
            <Badge>{clusters[e.cluster].label}</Badge>
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">{e.h1 ?? e.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">{e.description}</p>
          <div className="mt-6">
            <ArticleMeta published={e.publishedAt} updated={e.updatedAt} lastVerified={e.lastVerified} />
          </div>
        </Container>
      </header>
      <Container size="md">
        <div className="grid gap-12 py-12 lg:grid-cols-[1fr_220px]">
          <article className="prose prose-lg prose-wp min-w-0 max-w-none">
            {e.heroImage && (
              <div className="not-prose mb-10">
                <Media id={e.heroImage} priority sizes="(min-width: 1024px) 760px, 100vw" />
              </div>
            )}
            {body}
          </article>
          {toc.length > 2 && (
            <aside className="hidden lg:block">
              <nav aria-label={copy.article.toc} className="sticky top-24 text-sm">
                <p className="font-semibold text-heading">{copy.article.toc}</p>
                <ul className="mt-3 space-y-2 border-l border-border">
                  {toc.map((h) => (
                    <li key={h.id}>
                      <a href={`#${h.id}`} className="-ml-px block border-l border-transparent pl-4 text-muted hover:border-accent hover:text-heading">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          )}
        </div>
        <div className="max-w-3xl">
          {isPost && <ShareLinks path={e.path} title={e.h1 ?? e.title} />}
          <AuthorBox />
          <NotAffiliated brands={e.notAffiliated} />
        </div>
      </Container>
      <FaqSection items={e.faq} tone="plain" />
      <CtaBand cta={ctaFor(e)} />
      <RelatedGrid items={relatedFor(e)} />
    </>
  );
}

// ── Plain page (about, privacy, terms…) ──────────────────────────────────────
async function PageLayout({ entry: e }: { entry: Entry }) {
  const body = await renderMdx(e);
  const crumbs = crumbsFor(e);
  return (
    <>
      <JsonLd data={graph(webPageLd(e), breadcrumbLd(crumbs), faqLd(e.faq))} />
      <header className="bg-hero border-b border-border">
        <Container size="sm" className="py-12 sm:py-16">
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-5 text-4xl font-extrabold sm:text-5xl">{e.h1 ?? e.title}</h1>
          <p className="mt-4 text-lg text-muted">{e.description}</p>
        </Container>
      </header>
      <Container size="sm">
        <article className="prose prose-lg prose-wp max-w-none py-12">{body}</article>
      </Container>
      {/* On the FAQ page itself the H1 already says "Frequently asked questions"; don't repeat it. */}
      <FaqSection items={e.faq} showTitle={(e.h1 ?? e.title) !== copy.faq.title} />
    </>
  );
}

function pick(entry: Entry) {
  if (entry.pageType === "home") return <HomeLayout entry={entry} />;
  if (entry.pageType === "landing" || entry.pageType === "hub") return <LandingLayout entry={entry} />;
  if (articleTypes.includes(entry.pageType)) return <ArticleLayout entry={entry} />;
  return <PageLayout entry={entry} />;
}

/** Page root carries data-page-root so analytics reads page context from it (not from CTA buttons). */
export function renderEntry(entry: Entry) {
  return (
    <div data-page-root data-page-type={entry.pageType} data-cluster={entry.cluster}>
      {pick(entry)}
    </div>
  );
}
