import { notFound } from "next/navigation";
import { renderEntry } from "@/layouts";
import { allPosts, getPost } from "@/lib/content";
import { entryMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return allPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  const e = getPost((await params).slug);
  if (!e) notFound();
  return entryMetadata(e);
}

export default async function Post({ params }: PageProps<"/blog/[slug]">) {
  const e = getPost((await params).slug);
  if (!e) notFound();
  return renderEntry(e);
}
