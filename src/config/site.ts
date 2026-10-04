// The only place site-wide values live. Change the domain here and every
// canonical, sitemap entry and JSON-LD URL follows (domain migration, see technical-seo skill).

const isProd = process.env.VERCEL_ENV === "production";

// ── Brand: the ONLY place the product name is written. Content uses {{brand}} / {{storeName}} tokens.
const BRAND = "Watch Party"; // short name for running text
const STORE_NAME = "Watch Party: Sync Video, Chat & Call"; // full extension name (messages.json appName = store listing)

export const site = {
  name: BRAND,
  storeName: STORE_NAME,
  tagline: "Watch videos together with friends",
  description:
    `${BRAND} is a free Chrome extension that keeps video in sync for everyone in the room, with live chat, reactions and group video calls on any site with a video.`,
  // Vercel subdomain = the extension's full name (chosen by the user 2026-10-04). Change only here when moving to a brand domain.
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://watch-party-sync-video-chat-call.vercel.app").replace(/\/$/, ""),
  locale: "en_US",
  storeUrl: "https://chromewebstore.google.com/detail/watch-party-sync-video-ch/iidpifbcdnnpdmfokkkmkekhcbnekffl",
  supportEmail: "watchpartyapplive@gmail.com",
  author: { name: `${BRAND} team`, url: "/about/" },
  // GA4 property "Watch Party website" (account "Watch Party", stream 16038981631). Public by design; still
  // only loads after cookie consent and only on the production deployment.
  ga4Id: process.env.NEXT_PUBLIC_GA4_ID ?? "G-C2ZYTEH9G5",
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION ?? "",
    bing: process.env.NEXT_PUBLIC_BING_VERIFICATION ?? "",
  },
  /** true only on the production deployment, so previews/localhost never index or track. */
  isProd,
} as const;


export const abs = (path: string) => `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
