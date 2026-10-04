import { notFound } from "next/navigation";
import { renderEntry } from "@/layouts";
import { getPage } from "@/lib/content";
import { entryMetadata } from "@/lib/seo";

export function generateMetadata() {
  const e = getPage("home");
  if (!e) notFound();
  return entryMetadata(e);
}

export default function Home() {
  const e = getPage("home");
  if (!e) notFound();
  return renderEntry(e);
}
