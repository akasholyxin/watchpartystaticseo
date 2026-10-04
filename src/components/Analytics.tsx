"use client";

import Link from "next/link";
import { copy as text } from "@/config/copy";
import { useEffect, useSyncExternalStore } from "react";

// The site's only client script. Handles:
// - GA4 with Consent Mode v2: nothing loads until the visitor accepts (plans/website-v1.json W8)
// - delegated tracking from data-* attributes (install_click, share_click, cta_view, faq_open, scroll_depth)
// - the "<brand> works on desktop Chrome" notice for other browsers
// - copy-link buttons
// Disabled entirely unless enabled=true (production deployment with a GA4 id).

type Props = { enabled: boolean; gaId: string };
type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

const CONSENT_KEY = "wp_consent";
const debug = process.env.NODE_ENV !== "production";

type Consent = "granted" | "denied" | null;

// Consent lives in localStorage; exposed as an external store so server and client render consistently.
const listeners = new Set<() => void>();
function readConsent(): Consent {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}
function writeConsent(v: "granted" | "denied") {
  try {
    localStorage.setItem(CONSENT_KEY, v);
  } catch {}
  listeners.forEach((l) => l());
}
const subscribe = (l: () => void) => (listeners.add(l), () => listeners.delete(l));
// On the server we don't know yet: "unknown" renders nothing, avoiding a banner flash or mismatch.
const serverSnapshot = (): Consent | "unknown" => "unknown";

function track(name: string, params: Record<string, unknown> = {}) {
  if (debug) console.info("[analytics]", name, params);
  window.gtag?.("event", name, params);
}

function isDesktopChrome(): boolean {
  const nav = navigator as Navigator & { userAgentData?: { brands: { brand: string }[]; mobile: boolean }; brave?: unknown };
  if (nav.brave) return false;
  if (nav.userAgentData) {
    return !nav.userAgentData.mobile && nav.userAgentData.brands.some((b) => b.brand === "Google Chrome");
  }
  const ua = navigator.userAgent;
  return /Chrome\//.test(ua) && !/Edg\/|OPR\/|Mobile|Android|CriOS/.test(ua);
}

function loadGa(gaId: string) {
  if (document.getElementById("ga4")) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params -- gtag requires the arguments object
    window.dataLayer!.push(arguments);
  };
  window.gtag("consent", "default", { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "granted" });
  window.gtag("js", new Date());
  window.gtag("config", gaId, { anonymize_ip: true });
  const s = document.createElement("script");
  s.id = "ga4";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
  document.head.appendChild(s);
}

export function Analytics({ enabled, gaId }: Props) {
  const stored = useSyncExternalStore(subscribe, readConsent, serverSnapshot);
  const consent = enabled ? stored : "denied";

  useEffect(() => {
    if (enabled && consent === "granted") {
      loadGa(gaId);
      // Page context comes from the [data-page-root] wrapper rendered by the layouts.
      const root = document.querySelector<HTMLElement>("[data-page-root]");
      const pageType = root?.dataset.pageType;
      if (pageType && ["guide", "comparison", "troubleshooting", "listicle"].includes(pageType)) {
        track("article_view", { page_type: pageType, cluster: root?.dataset.cluster });
      }
    }
  }, [enabled, consent, gaId]);

  // Page behaviour that works with or without analytics consent.
  useEffect(() => {
    const desktopChrome = isDesktopChrome();
    if (!desktopChrome) {
      document.querySelectorAll<HTMLElement>("[data-not-chrome-note]").forEach((el) => (el.hidden = false));
      if (document.querySelector("[data-not-chrome-note]")) track("not_chrome_notice_shown");
    }

    const copy = async (text: string, btn: HTMLElement) => {
      try {
        await navigator.clipboard.writeText(text);
        const old = btn.textContent;
        btn.textContent = "Copied!";
        setTimeout(() => (btn.textContent = old), 1800);
      } catch {
        window.prompt("Copy this link:", text);
      }
    };

    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-track],[data-copy-link],[data-copy-page],[data-copy-code]");
      if (!el) return;
      if (el.dataset.copyLink !== undefined) {
        copy(window.location.href, el);
        track("copy_link", { context: "not_chrome" });
      } else if (el.dataset.copyPage !== undefined) {
        copy(window.location.href, el);
        track("share_click", { network: "copy" });
      } else if (el.dataset.copyCode !== undefined) {
        copy(el.dataset.copyCode, el);
        track("join_code_copy");
      } else if (el.dataset.track === "install_click") {
        track("cta_click", { cta: "install", position: el.dataset.position });
        track("install_click", {
          page_path: location.pathname,
          cta_position: el.dataset.position,
          cluster: el.dataset.cluster,
          page_type: el.dataset.pageType,
        });
      } else if (el.dataset.track) {
        track(el.dataset.track, { network: el.dataset.network, page_path: location.pathname });
      }
    };
    document.addEventListener("click", onClick);

    const onToggle = (e: Event) => {
      const d = e.target as HTMLDetailsElement;
      if (d.open && d.dataset.faqIndex !== undefined) track("faq_open", { index: Number(d.dataset.faqIndex) });
    };
    document.addEventListener("toggle", onToggle, true);

    const seen = new WeakSet<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) {
        if (en.isIntersecting && !seen.has(en.target)) {
          seen.add(en.target);
          track("cta_view", { position: (en.target as HTMLElement).dataset.position });
        }
      }
    });
    document.querySelectorAll('[data-track="install_click"]').forEach((el) => io.observe(el));

    const marks = new Set<number>();
    const onScroll = () => {
      const h = document.documentElement;
      const pct = ((h.scrollTop + innerHeight) / h.scrollHeight) * 100;
      for (const m of [50, 90]) {
        if (pct >= m && !marks.has(m)) {
          marks.add(m);
          track("scroll_depth", { percent: m });
        }
      }
    };
    addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("toggle", onToggle, true);
      removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  if (!enabled || consent !== null) return null;

  const decide = writeConsent;

  return (
    <div role="dialog" aria-label="Cookie consent" className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-md border border-border bg-surface p-5 text-sm shadow-lg">
      <p>
        {text.consent.text}{" "}
        <Link href="/privacy/" className="font-medium text-link underline">
          {text.consent.policy}
        </Link>
      </p>
      <div className="mt-4 flex gap-2">
        <button type="button" onClick={() => decide("granted")} className="rounded-full bg-accent px-5 py-2 font-semibold text-accent-ink">
          {text.consent.accept}
        </button>
        <button type="button" onClick={() => decide("denied")} className="rounded-full border border-border-strong px-5 py-2 font-semibold text-heading">
          {text.consent.decline}
        </button>
      </div>
    </div>
  );
}
