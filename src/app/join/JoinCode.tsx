"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { site } from "@/config/site";

// Shows ?code= from an invite link with a copy button. Only short alphanumeric codes are accepted,
// so nothing arbitrary from the URL is ever rendered.
export function JoinCode() {
  const raw = useSearchParams().get("code") ?? "";
  const code = /^[A-Za-z0-9-]{4,32}$/.test(raw) ? raw.toUpperCase() : "";

  useEffect(() => {
    window.gtag?.("event", "invite_landing", { has_code: Boolean(code) });
  }, [code]);

  if (!code) {
    return <p className="mt-6 text-sm text-muted">Ask your friend for the room code. It&apos;s shown at the top of their {site.name} panel.</p>;
  }
  return (
    <div className="mx-auto mt-8 flex max-w-sm items-center justify-between gap-3 rounded-card border border-border bg-surface p-4">
      <div className="text-left">
        <p className="text-xs uppercase tracking-wide text-muted">Room code</p>
        <p className="font-mono text-2xl font-bold text-heading">{code}</p>
      </div>
      <button type="button" data-copy-code={code} className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink">
        Copy code
      </button>
    </div>
  );
}
