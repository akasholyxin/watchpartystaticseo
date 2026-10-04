import { notFound } from "next/navigation";
import { renderEntry } from "@/layouts";
import { allPages, getPage } from "@/lib/content";
import { entryMetadata } from "@/lib/seo";

// Top-level pages from content/pages/*.mdx, statically generated.
export const dynamicParams = false;

export function generateStaticParams() {
  return allPages()
    .filter((p) => p.slug !== "home")
    .map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[slug]">) {
  const e = getPage((await params).slug);
  if (!e) notFound();
  return entryMetadata(e);
}

export default async function Page({ params }: PageProps<"/[slug]">) {
  const e = getPage((await params).slug);
  if (!e || e.slug === "home") notFound();
  return renderEntry(e);
}
