import { site } from "./site";

// Every shared UI string lives here. Components never hard-code user-facing text.
export const copy = {
  cta: {
    install: "Add to Chrome, it's free",
    installShort: "Add to Chrome",
    trust: ["Free", "No account needed", "Desktop Chrome"],
    notChrome: { before: `${site.name} works on desktop Chrome.`, action: "Copy the link", after: "to open it on your computer." },
  },
  band: {
    title: "Press play once. Everyone watches together.",
    lead: "Synced playback, live chat and video calls, free in Chrome.",
  },
  hero: { badge: "Free Chrome extension" },
  article: {
    by: `By the ${site.name} team`,
    published: "Published",
    updated: "Updated",
    factsChecked: "Facts about other products checked on",
    share: "Share this guide",
    copyLink: "Copy link",
    copied: "Copied!",
    related: "Keep reading",
    toc: "On this page",
    authorTitle: `Written by the ${site.name} team`,
    authorBody: "We make this extension, so we're not neutral. We still compare options honestly and say when something else fits better.",
  },
  faq: { title: "Frequently asked questions" },
  notAffiliated: (brands: string[]) =>
    `${brands.join(", ")} ${brands.length > 1 ? "are trademarks of their owners" : "is a trademark of its owner"}. ${site.name} is independent and isn't affiliated with or endorsed by ${brands.length > 1 ? "them" : "it"}.`,
  footer: {
    blurb: `${site.tagline}. Free Chrome extension with synced playback, chat and video calls.`,
    legal: `Netflix, YouTube, Twitch, Prime Video, Disney+, Hulu and other names are trademarks of their owners. ${site.name} is an independent extension and isn't affiliated with or endorsed by them.`,
  },
  consent: {
    text: "We use Google Analytics cookies to see which pages help people, only if you agree.",
    policy: "Privacy policy",
    accept: "Accept",
    decline: "Decline",
  },
  notFound: {
    eyebrow: "404",
    title: "This page doesn't exist",
    lead: "It may have moved. These are a good place to start:",
    links: [
      { href: "/watch-party/", label: "Start a watch party" },
      { href: "/watch-netflix-together/", label: "Watch Netflix together" },
      { href: "/watch-youtube-together/", label: "Watch YouTube together" },
      { href: "/how-it-works/", label: `How ${site.name} works` },
      { href: "/blog/", label: "All guides" },
    ],
  },
  blog: {
    title: "Guides for watching together",
    lead: "Step-by-step guides, honest comparisons and fixes for watching with friends anywhere.",
    empty: "Guides are on the way.",
  },
} as const;
