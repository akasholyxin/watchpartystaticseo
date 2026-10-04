import type { Metadata } from "next";
import { Suspense } from "react";
import { site } from "@/config/site";
import { InstallCta } from "@/components/InstallCta";
import { Card, Container, Media } from "@/ui";
import { JoinCode } from "./JoinCode";

// Invite landing page (decision D9). Not for search: noindex (left crawlable so the noindex is seen).
export const metadata: Metadata = {
  title: "You're invited to a watch party",
  description: `A friend invited you to watch together with ${site.name}. Add the free Chrome extension, then paste the room code to join.`,
  robots: { index: false, follow: false },
};

const steps = [
  { title: `Add ${site.name} to Chrome`, body: "It's free and takes a few seconds. No account needed." },
  { title: `Click the ${site.name} icon`, body: "The side panel opens on the right. Pin the icon so it's easy to find." },
  { title: "Paste the room code", body: 'Use the "Paste room ID" box on the Room tab and you land on the same video, in sync.' },
];

export default function Join() {
  return (
    <section className="bg-hero">
      <Container size="md" className="py-16 sm:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">You&apos;re invited to a watch party</h1>
            <p className="mt-4 text-lg text-muted">Your friend is watching with {site.name}. Join in three steps.</p>
            <Suspense fallback={null}>
              <JoinCode />
            </Suspense>
            <ol className="mt-8 space-y-4">
              {steps.map((s, i) => (
                <li key={s.title}>
                  <Card className="flex gap-4">
                    <span className="bg-brand flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-display text-lg font-extrabold text-white">{i + 1}</span>
                    <div>
                      <p className="font-semibold text-heading">{s.title}</p>
                      <p className="mt-1 text-sm text-muted">{s.body}</p>
                      {i === 0 && (
                        <div className="mt-4">
                          <InstallCta slug="join" position="join" pageType="utility" />
                        </div>
                      )}
                    </div>
                  </Card>
                </li>
              ))}
            </ol>
          </div>
          <Media id="panel-room" />
        </div>
      </Container>
    </section>
  );
}
