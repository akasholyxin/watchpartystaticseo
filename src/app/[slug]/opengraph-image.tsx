import { allPages, getPage } from "@/lib/content";
import { ogSize, renderOg } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const dynamicParams = false;

export function generateStaticParams() {
  return allPages()
    .filter((p) => p.slug !== "home")
    .map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  return renderOg(getPage((await params).slug)!);
}
