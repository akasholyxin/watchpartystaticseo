import Link from "next/link";
import type { ReactNode } from "react";
import { copy } from "@/config/copy";
import { media, type MediaId } from "@/config/media";
import type { Cluster } from "@/config/taxonomy";
import { InstallCta } from "@/components/InstallCta";
import { Badge, ButtonLink, Card, Container, IconTile, Media, Section, SectionHeading } from "@/ui";
import { Icon, type IconName } from "@/ui/icons";

// Page sections. Layouts compose these; content (MDX/frontmatter) supplies the words.

type CtaCtx = { slug: string; cluster?: Cluster; pageType?: string };

// ── Hero ─────────────────────────────────────────────────────────────────────
export function Hero({
  badge = copy.hero.badge,
  title,
  highlight,
  lead,
  image,
  cta,
  secondary,
  breadcrumbs,
}: {
  badge?: string;
  title: string;
  highlight?: string;
  lead: string;
  image: MediaId;
  cta: CtaCtx;
  secondary?: { href: string; label: string };
  breadcrumbs?: ReactNode;
}) {
  return (
    <section className="bg-hero relative overflow-hidden border-b border-border">
      <Container>
        <div className="grid items-center gap-12 pb-16 pt-10 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:pb-24 lg:pt-16">
          <div>
            {breadcrumbs}
            <div className={breadcrumbs ? "mt-6" : ""}>
              <Badge>
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {badge}
              </Badge>
            </div>
            <h1 className="mt-5 text-[2.4rem] font-extrabold leading-[1.08] sm:text-5xl xl:text-[3.25rem]">
              <span className="block">{title}</span>
              {highlight && <span className="text-gradient block">{highlight}</span>}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">{lead}</p>
            <div className="mt-8 flex flex-wrap items-start gap-3">
              <InstallCta slug={cta.slug} cluster={cta.cluster} pageType={cta.pageType} position="hero" size="lg" />
              {secondary && (
                <ButtonLink href={secondary.href} variant="secondary" size="lg">
                  {secondary.label}
                </ButtonLink>
              )}
            </div>
            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              {copy.cta.trust.map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check /> {t}
                </li>
              ))}
            </ul>
          </div>
          <HeroVisual image={image} />
        </div>
      </Container>
    </section>
  );
}

/**
 * Hero image. The decorative chips ("In sync", reactions) echo real UI elements, so they're only shown
 * on the in-sync room screenshot ("browser" kind); on any other image they would contradict what's shown.
 */
function HeroVisual({ image }: { image: MediaId }) {
  const showChips = media[image].kind === "browser";
  return (
    <div className="relative">
      <div aria-hidden="true" className="bg-brand absolute -inset-4 -z-10 rounded-[32px] opacity-[0.12] blur-2xl" />
      <Media id={image} priority />
      {showChips && (
        <>
          <div aria-hidden="true" className="animate-float absolute -left-3 top-10 hidden rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-semibold text-accent-strong shadow-md sm:block">
            ● In sync
          </div>
          <div aria-hidden="true" className="animate-float absolute -bottom-6 right-10 hidden rounded-2xl border border-border bg-surface px-3 py-2 text-xl shadow-md [animation-delay:1.5s] sm:block">
            😂 ❤️ 🍿
          </div>
        </>
      )}
    </div>
  );
}

function Check() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 text-accent" fill="currentColor">
      <path d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 1 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z" />
    </svg>
  );
}

// ── Works-on strip (styled like the extension's real "WATCH ON" list) ─────────
const platforms = [
  { name: "YouTube", color: "#ff0000", letter: "Y" },
  { name: "Netflix", color: "#e50914", letter: "N" },
  { name: "Twitch", color: "#9146ff", letter: "T" },
  { name: "Prime Video", color: "#00a8e1", letter: "P" },
  { name: "Disney+", color: "#113ccf", letter: "D" },
  { name: "Hulu", color: "#1ce783", letter: "H" },
];
export function WorksOn() {
  return (
    <div className="border-b border-border bg-bg">
      <Container>
        <div className="flex flex-col items-center gap-4 py-8 sm:flex-row sm:justify-between">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Works on</p>
          <ul className="flex flex-wrap justify-center gap-2">
            {platforms.map((p) => (
              <li key={p.name} className="flex items-center gap-2 rounded-full border border-border bg-surface py-1.5 pl-1.5 pr-3.5 text-sm font-medium text-heading">
                <span className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: p.color }}>
                  {p.letter}
                </span>
                {p.name}
              </li>
            ))}
            <li className="flex items-center rounded-full border border-dashed border-border-strong px-3.5 py-1.5 text-sm text-muted">+ any site with a video</li>
          </ul>
        </div>
      </Container>
    </div>
  );
}

// ── Steps ────────────────────────────────────────────────────────────────────
export type Step = { title: string; body: string };
export function StepsSection({ eyebrow, title, lead, steps, tone = "plain" }: { eyebrow?: string; title: string; lead?: string; steps: Step[]; tone?: "plain" | "soft" }) {
  return (
    <Section tone={tone}>
      <SectionHeading eyebrow={eyebrow} title={title} lead={lead} />
      <ol className="relative mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div aria-hidden="true" className="bg-brand absolute left-0 right-0 top-7 hidden h-0.5 opacity-30 lg:block" />
        {steps.map((s, i) => (
          <li key={s.title} className="relative">
            <span className="bg-brand relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl font-display text-2xl font-extrabold text-white shadow-md">
              {i + 1}
            </span>
            <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
            <p className="mt-2 leading-relaxed text-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

// ── Features ─────────────────────────────────────────────────────────────────
export type Feature = { icon: IconName; title: string; body: string };
export function FeatureGrid({ eyebrow, title, lead, items, tone = "soft" }: { eyebrow?: string; title: string; lead?: string; items: Feature[]; tone?: "plain" | "soft" }) {
  return (
    <Section tone={tone}>
      <SectionHeading eyebrow={eyebrow} title={title} lead={lead} />
      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((f) => (
          <Card key={f.title} interactive>
            <IconTile>
              <Icon name={f.icon} className="h-5 w-5" />
            </IconTile>
            <h3 className="mt-5 text-lg font-bold">{f.title}</h3>
            <p className="mt-2 leading-relaxed text-muted">{f.body}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

// ── Split: text beside a real image ──────────────────────────────────────────
export function Split({ eyebrow, title, children, image, reverse = false, tone = "plain" }: { eyebrow?: string; title: string; children: ReactNode; image: MediaId; reverse?: boolean; tone?: "plain" | "soft" | "ink" }) {
  return (
    <Section tone={tone}>
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className={reverse ? "lg:order-2" : ""}>
          <SectionHeading eyebrow={eyebrow} title={title} align="left" />
          <div className="mt-6 space-y-4 text-lg leading-relaxed [&_li]:flex [&_li]:gap-3 [&_ul]:space-y-3">{children}</div>
        </div>
        <Media id={image} />
      </div>
    </Section>
  );
}

// ── Use cases ────────────────────────────────────────────────────────────────
export type UseCase = { emoji: string; title: string; body: string; href?: string; image?: MediaId };
export function UseCases({ eyebrow, title, items }: { eyebrow?: string; title: string; items: UseCase[] }) {
  return (
    <Section>
      <SectionHeading eyebrow={eyebrow} title={title} />
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((u) => {
          const inner = (
            <Card interactive={Boolean(u.href)} className="flex h-full flex-col overflow-hidden !p-0">
              {u.image && <Media id={u.image} className="!rounded-none !shadow-none" sizes="(min-width: 1024px) 290px, 100vw" />}
              <div className="flex flex-1 flex-col p-6">
                {!u.image && (
                  <span aria-hidden="true" className="text-3xl">
                    {u.emoji}
                  </span>
                )}
                <h3 className={u.image ? "text-lg font-bold" : "mt-4 text-lg font-bold"}>{u.title}</h3>
                <p className="mt-2 text-muted">{u.body}</p>
                {u.href && <span className="mt-auto pt-4 text-sm font-semibold text-link">Read the guide →</span>}
              </div>
            </Card>
          );
          return u.href ? (
            <Link key={u.title} href={u.href} className="block h-full">
              {inner}
            </Link>
          ) : (
            <div key={u.title}>{inner}</div>
          );
        })}
      </div>
    </Section>
  );
}

// ── FAQ ──────────────────────────────────────────────────────────────────────
export function FaqSection({ items, tone = "soft", showTitle = true }: { items: { q: string; a: string }[]; tone?: "plain" | "soft"; showTitle?: boolean }) {
  if (!items.length) return null;
  return (
    <Section tone={tone} size="md" className={showTitle ? "" : "!pt-8"}>
      {showTitle ? <SectionHeading title={copy.faq.title} /> : <h2 className="sr-only">{copy.faq.title}</h2>}
      <div className="mx-auto mt-12 max-w-3xl space-y-3">
        {items.map((f, i) => (
          <details key={f.q} className="group rounded-md border border-border bg-surface p-5 shadow-sm open:shadow-md" data-faq-index={i}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold text-heading">
              {f.q}
              <span aria-hidden="true" className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent-strong transition group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

// ── Final CTA band ───────────────────────────────────────────────────────────
export function CtaBand({ cta, title = copy.band.title, lead = copy.band.lead }: { cta: CtaCtx; title?: string; lead?: string }) {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="bg-brand relative mx-auto max-w-6xl overflow-hidden rounded-lg px-6 py-14 text-center text-white shadow-lg sm:px-12 sm:py-20">
        <div aria-hidden="true" className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div aria-hidden="true" className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <h2 className="relative mx-auto max-w-2xl text-3xl font-extrabold text-white sm:text-5xl">{title}</h2>
        <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/85">{lead}</p>
        <div className="relative mt-9 flex justify-center">
          <InstallCta slug={cta.slug} cluster={cta.cluster} pageType={cta.pageType} position="end" size="lg" variant="light" />
        </div>
      </div>
    </section>
  );
}

// ── Related ──────────────────────────────────────────────────────────────────
export function RelatedGrid({ title = copy.article.related, items }: { title?: string; items: { path: string; title: string; description: string; label: string }[] }) {
  if (!items.length) return null;
  return (
    <Section size="lg" className="!pt-0">
      <h2 className="text-2xl font-extrabold">{title}</h2>
      <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((r) => (
          <li key={r.path}>
            <Link href={r.path} className="block h-full">
              <Card interactive className="h-full">
                <Badge tone="neutral">{r.label}</Badge>
                <p className="mt-4 font-display text-lg font-bold leading-snug text-heading">{r.title}</p>
                <p className="mt-2 line-clamp-3 text-sm text-muted">{r.description}</p>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
