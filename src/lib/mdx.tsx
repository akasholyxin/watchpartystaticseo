import "server-only";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import Link from "next/link";
import type { ComponentProps } from "react";
import { Callout, Feature, Features, Figure, Step, Steps } from "@/components/mdx-blocks";
import { InstallCta } from "@/components/InstallCta";
import type { Entry } from "@/lib/content";
import type { MediaId } from "@/config/media";
import GithubSlugger from "github-slugger";

// Compiles an entry's MDX at build time. Headings get ids (table of contents, deep links).
export async function renderMdx(entry: Entry) {
  const { default: Content } = await evaluate(entry.body, { ...runtime, remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] });
  const Install = ({ position = "inline", label }: { position?: "inline" | "mid" | "end"; label?: string }) => (
    <span className="not-prose my-10 flex">
      <InstallCta slug={entry.slug} cluster={entry.cluster} position={position} pageType={entry.pageType} label={label} />
    </span>
  );
  const a = ({ href = "", ...rest }: ComponentProps<"a">) =>
    href.startsWith("/") ? <Link href={href} {...rest} /> : <a href={href} target="_blank" rel="noopener" {...rest} />;
  // Screenshot/PanelShot: older content passes name= instead of id=.
  const Screenshot = ({ name, caption }: { name: MediaId; caption?: string }) => <Figure id={name} caption={caption} />;
  return <Content components={{ a, Callout, Feature, Features, Figure, Screenshot, PanelShot: Screenshot, Step, Steps, Install }} />;
}

/** H2 headings for the table of contents (same slugs rehype-slug generates). */
export function headings(entry: Entry) {
  const slugger = new GithubSlugger();
  return [...entry.body.matchAll(/^## (.+)$/gm)].map((m) => {
    // Plain heading text as rendered: drop markdown link targets and emphasis markers.
    const text = m[1].replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[*_`]/g, "").trim();
    return { id: slugger.slug(text), text };
  });
}
