import Image from "next/image";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { media, type MediaId } from "@/config/media";

// UI primitives. Sections and layouts are built only from these, so the look stays consistent.

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

// ── Layout ───────────────────────────────────────────────────────────────────
export function Container({ children, size = "lg", className }: { children: ReactNode; size?: "sm" | "md" | "lg"; className?: string }) {
  const w = { sm: "max-w-3xl", md: "max-w-5xl", lg: "max-w-6xl" }[size];
  return <div className={cx("mx-auto w-full px-4 sm:px-6", w, className)}>{children}</div>;
}

type Tone = "plain" | "soft" | "tint" | "ink" | "brand";
export function Section({ children, tone = "plain", className, id, size = "lg" }: { children: ReactNode; tone?: Tone; className?: string; id?: string; size?: "sm" | "md" | "lg" }) {
  const tones: Record<Tone, string> = {
    plain: "bg-bg",
    soft: "bg-bg-soft",
    tint: "bg-bg-tint",
    ink: "bg-ink text-ink-text [&_h2]:text-white [&_h3]:text-white",
    brand: "bg-brand text-white [&_h2]:text-white [&_h3]:text-white",
  };
  return (
    <section id={id} className={cx("py-16 sm:py-24", tones[tone], className)}>
      <Container size={size}>{children}</Container>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-strong">{children}</p>;
}

export function SectionHeading({ eyebrow, title, lead, align = "center" }: { eyebrow?: string; title: ReactNode; lead?: ReactNode; align?: "center" | "left" }) {
  return (
    <div className={cx("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">{title}</h2>
      {lead && <p className="mt-4 text-lg leading-relaxed text-muted">{lead}</p>}
    </div>
  );
}

// ── Actions ──────────────────────────────────────────────────────────────────
type ButtonVariant = "primary" | "secondary" | "ghost" | "light";
type ButtonSize = "sm" | "md" | "lg";
const buttonBase = "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition duration-200 focus-visible:outline-2";
const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-ink shadow-md hover:-translate-y-0.5 hover:bg-accent-strong hover:shadow-lg",
  secondary: "border border-border-strong bg-surface text-heading hover:border-accent hover:text-accent-strong",
  ghost: "text-heading hover:text-accent-strong",
  light: "bg-white text-[#0b1533] shadow-md hover:-translate-y-0.5 hover:shadow-lg",
};
const buttonSizes: Record<ButtonSize, string> = { sm: "px-4 py-2 text-sm", md: "px-5 py-3 text-[15px]", lg: "px-7 py-4 text-base" };

export function ButtonLink({ href, variant = "primary", size = "md", className, external, ...rest }: Omit<ComponentProps<"a">, "href"> & { href: string; variant?: ButtonVariant; size?: ButtonSize; external?: boolean }) {
  const cls = cx(buttonBase, buttonVariants[variant], buttonSizes[size], className);
  if (external) return <a href={href} target="_blank" rel="noopener" className={cls} {...rest} />;
  return <Link href={href} className={cls} {...rest} />;
}

// ── Content ──────────────────────────────────────────────────────────────────
export function Badge({ children, tone = "accent" }: { children: ReactNode; tone?: "accent" | "neutral" | "light" }) {
  const t = {
    accent: "border-accent/30 bg-accent-soft text-accent-strong",
    neutral: "border-border bg-bg-soft text-muted",
    light: "border-white/30 bg-white/10 text-white",
  }[tone];
  return <span className={cx("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold", t)}>{children}</span>;
}

export function Card({ children, className, interactive = false }: { children: ReactNode; className?: string; interactive?: boolean }) {
  return (
    <div className={cx("rounded-lg border border-border bg-surface p-6 shadow-sm", interactive && "transition duration-200 hover:-translate-y-1 hover:border-accent/50 hover:shadow-md", className)}>
      {children}
    </div>
  );
}

export function IconTile({ children }: { children: ReactNode }) {
  return <span className="flex h-11 w-11 items-center justify-center rounded-md bg-accent-soft text-accent-strong">{children}</span>;
}

// ── Media ────────────────────────────────────────────────────────────────────
/** Renders a registered image with the frame that suits its kind. Only registry images can be shown. */
export function Media({ id, priority = false, className, sizes = "(min-width: 1024px) 640px, 100vw" }: { id: MediaId; priority?: boolean; className?: string; sizes?: string }) {
  const m = media[id];
  const frame = {
    browser: "rounded-lg shadow-lg ring-1 ring-border",
    graphic: "rounded-lg border border-border bg-white shadow-md",
    panel: "mx-auto max-w-[300px] rounded-[28px] border-[6px] border-heading/90 bg-white shadow-lg",
    photo: "rounded-lg shadow-md",
  }[m.kind as "browser" | "graphic" | "panel" | "photo"];
  return (
    <div className={cx("overflow-hidden", frame, className)}>
      <Image src={m.src} alt={m.alt} priority={priority} sizes={m.kind === "panel" ? "300px" : sizes} className="h-auto w-full" />
    </div>
  );
}
