import { allPosts, getPost } from "@/lib/content";
import { ogSize, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
  return allPosts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  return renderOg(getPost((await params).slug)!);
}
