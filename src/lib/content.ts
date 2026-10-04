import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { site } from "@/config/site";
import { clusterIds, pageTypes } from "@/config/taxonomy";
import { mediaIds } from "@/config/media";
import { iconNames } from "@/ui/icons";

// Content model (plans/website-v1.json W4). Any invalid file fails the build with a clear message.

const CONTENT_DIR = path.join(process.cwd(), "content");
const isProdBuild = process.env.VERCEL_ENV === "production";


const date = z.coerce.date();

const schema = z
  .object({
    title: z.string().min(10).max(60, "title must be ≤ 60 chars"),
    description: z.string().min(70, "description must be ≥ 70 chars").max(160, "description must be ≤ 160 chars"),
    h1: z.string().optional(),
    primaryKeyword: z.string().min(3),
    cluster: z.enum(clusterIds),
    pageType: z.enum(pageTypes),
    publishedAt: date,
    updatedAt: date,
    draft: z.boolean().default(false),
    noindex: z.boolean().default(false),
    // Must be an approved real image (src/config/media.ts); its alt text comes from the reviewed .meta.json.
    heroImage: z.enum(mediaIds).optional(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    related: z.array(z.string()).default([]),
    lastVerified: date.optional(),
    notAffiliated: z.array(z.string()).default([]),
    // Structured sections for home/landing layouts (words live in content, never in components).
    hero: z
      .object({ badge: z.string().optional(), title: z.string(), highlight: z.string().optional(), lead: z.string().optional() })
      .optional(),
    steps: z.array(z.object({ title: z.string(), body: z.string() })).default([]),
    features: z.array(z.object({ icon: z.enum(iconNames), title: z.string(), body: z.string() })).default([]),
    useCases: z.array(z.object({ emoji: z.string(), title: z.string(), body: z.string(), href: z.string().optional(), image: z.enum(mediaIds).optional() })).default([]),
    /** Set only by the user after reviewing the page (rules/rules.md Rule 15). */
    reviewed: z.boolean().default(false),
  })
  .refine((d) => d.updatedAt >= d.publishedAt, { message: "updatedAt must be ≥ publishedAt" })
  .refine((d) => d.pageType !== "comparison" || d.lastVerified, { message: "comparison pages need lastVerified" });

export type Frontmatter = z.infer<typeof schema>;
export type Entry = Frontmatter & {
  kind: "page" | "blog";
  slug: string;
  /** Canonical path with trailing slash. */
  path: string;
  body: string;
};

function readDir(kind: "page" | "blog"): Entry[] {
  const dir = path.join(CONTENT_DIR, kind === "page" ? "pages" : "blog");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) throw new Error(`content/${kind}/${file}: slug must be lowercase-hyphen`);
      // Brand tokens are resolved first, so length checks run on the real text and a rename is one config edit.
      const raw = fs
        .readFileSync(path.join(dir, file), "utf8")
        .replaceAll("{{brand}}", site.name)
        .replaceAll("{{storeName}}", site.storeName);
      if (/{{w+}}/.test(raw)) throw new Error(`content/${kind}/${file}: unknown {{token}}`);
      const { data, content } = matter(raw);
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        const issues = parsed.error.issues.map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`).join("\n");
        throw new Error(`content/${kind}/${file} frontmatter invalid:\n${issues}`);
      }
      const p = kind === "blog" ? `/blog/${slug}/` : slug === "home" ? "/" : `/${slug}/`;
      return { ...parsed.data, kind, slug, path: p, body: content };
    });
}

let cache: Entry[] | null = null;

/** All published entries, validated as a set. */
export function allEntries(): Entry[] {
  if (cache) return cache;
  const now = new Date();
  const entries = [...readDir("page"), ...readDir("blog")].filter(
    // Drafts and future-dated posts never reach production.
    (e) => !(isProdBuild && (e.draft || e.publishedAt > now))
  );

  // One primary keyword per URL (cannibalisation guard).
  const seen = new Map<string, string>();
  for (const e of entries) {
    const k = e.primaryKeyword.toLowerCase().trim();
    if (seen.has(k)) throw new Error(`primaryKeyword "${k}" used by both ${seen.get(k)} and ${e.path}`);
    seen.set(k, e.path);
  }

  // Rule 15: every page needs a research brief citing saved SERP data, and the user's review.
  // Production deploys fail; local builds warn so drafts can still be previewed.
  // Locally the private briefs are checked directly. In the published site-only repo (Vercel) they don't
  // exist, so the check reads content/.gate.json, written by tools/publish/export-site.mjs after that same check passed.
  const process15: string[] = [];
  const briefsDir = path.join(process.cwd(), "..", "marketing", "briefs");
  const gateFile = path.join(CONTENT_DIR, ".gate.json");
  const gate: string[] | null = fs.existsSync(briefsDir)
    ? null
    : fs.existsSync(gateFile)
      ? (JSON.parse(fs.readFileSync(gateFile, "utf8")).briefed as string[])
      : [];
  for (const e of entries) {
    if (gate) {
      if (!gate.includes(e.slug)) process15.push(`${e.path}: not in the research gate (content/.gate.json)`);
    } else {
      const brief = path.join(briefsDir, `${e.slug}.md`);
      if (!fs.existsSync(brief)) process15.push(`${e.path}: no brief (marketing/briefs/${e.slug}.md)`);
      else if (!/^serp:\s*\S+/m.test(fs.readFileSync(brief, "utf8"))) process15.push(`${e.path}: brief cites no SERP data`);
    }
    if (!e.reviewed) process15.push(`${e.path}: not reviewed by the user`);
  }
  if (process15.length) {
    const msg = `Rule 15 (research + review) not met:\n  - ${process15.join("\n  - ")}`;
    if (isProdBuild) throw new Error(msg);
    console.warn(`⚠ ${msg}`);
  }

  const paths = new Set(entries.map((e) => e.path));
  for (const e of entries) {
    for (const r of e.related) {
      if (!paths.has(r)) throw new Error(`${e.path}: related "${r}" doesn't exist (use full path with trailing slash)`);
    }
    if (e.pageType === "comparison" && e.lastVerified) {
      const days = (now.getTime() - e.lastVerified.getTime()) / 86_400_000;
      if (days > 90) throw new Error(`${e.path}: competitor facts last verified ${Math.floor(days)} days ago (max 90), re-check and update lastVerified`);
      if (days > 60) console.warn(`⚠ ${e.path}: competitor facts verified ${Math.floor(days)} days ago, re-check soon`);
    }
  }

  cache = entries;
  return entries;
}

export const getPage = (slug: string) => allEntries().find((e) => e.kind === "page" && e.slug === slug);
export const getPost = (slug: string) => allEntries().find((e) => e.kind === "blog" && e.slug === slug);
export const allPages = () => allEntries().filter((e) => e.kind === "page");
export const allPosts = () =>
  allEntries()
    .filter((e) => e.kind === "blog")
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
export const byPath = (p: string) => allEntries().find((e) => e.path === p);
