import Link from "next/link";
import { copy } from "@/config/copy";
import { Container } from "@/ui";

export const metadata = { title: "Page not found", robots: { index: false } };

// Returns a real HTTP 404 (no soft-404s) and points visitors to the main intents.
export default function NotFound() {
  return (
    <section className="bg-hero">
      <Container size="sm" className="py-24 text-center">
        <p className="text-gradient font-display text-7xl font-extrabold">{copy.notFound.eyebrow}</p>
        <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">{copy.notFound.title}</h1>
        <p className="mt-3 text-lg text-muted">{copy.notFound.lead}</p>
        <ul className="mx-auto mt-10 grid max-w-md gap-3 text-left">
          {copy.notFound.links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="flex items-center justify-between rounded-md border border-border bg-surface px-5 py-4 font-semibold text-heading shadow-sm transition hover:border-accent">
                {l.label} <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
