import type { ReactNode } from "react";
import type { MediaId } from "@/config/media";
import { Card, IconTile, Media } from "@/ui";
import { Icon, type IconName } from "@/ui/icons";

// Components available inside MDX article bodies. They break out of the prose styles ("not-prose").

export function Figure({ id, caption }: { id: MediaId; caption?: string }) {
  return (
    <figure className="not-prose my-10">
      <Media id={id} sizes="(min-width: 1024px) 760px, 100vw" />
      {caption && <figcaption className="mt-3 text-center text-sm text-muted">{caption}</figcaption>}
    </figure>
  );
}

export function Callout({ type = "tip", title, children }: { type?: "tip" | "note" | "warning"; title?: string; children: ReactNode }) {
  const s = {
    tip: "border-accent/40 bg-accent-soft",
    note: "border-border bg-bg-soft",
    warning: "border-warn/40 bg-warn-soft",
  }[type];
  return (
    <aside className={`not-prose my-8 rounded-md border p-5 text-[15px] leading-relaxed ${s}`}>
      {title && <p className="mb-1 font-semibold text-heading">{title}</p>}
      <div className="text-text [&_a]:font-medium [&_a]:text-link [&_a]:underline">{children}</div>
    </aside>
  );
}

export function Steps({ children }: { children: ReactNode }) {
  return <ol className="not-prose my-10 space-y-4 [counter-reset:step]">{children}</ol>;
}
export function Step({ title, children }: { title: string; children: ReactNode }) {
  return (
    <li className="flex gap-4 [counter-increment:step]">
      <span aria-hidden="true" className="bg-brand flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-display font-extrabold text-white before:content-[counter(step)]" />
      <div className="pt-1">
        <p className="font-semibold text-heading">{title}</p>
        <div className="mt-1 leading-relaxed text-muted">{children}</div>
      </div>
    </li>
  );
}

export function Features({ children }: { children: ReactNode }) {
  return <div className="not-prose my-10 grid gap-4 sm:grid-cols-2">{children}</div>;
}
export function Feature({ title, icon = "spark", children }: { title: string; icon?: IconName; children: ReactNode }) {
  return (
    <Card>
      <IconTile>
        <Icon name={icon} />
      </IconTile>
      <p className="mt-4 font-semibold text-heading">{title}</p>
      <div className="mt-1 text-[15px] leading-relaxed text-muted">{children}</div>
    </Card>
  );
}
