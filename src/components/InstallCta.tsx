import { copy } from "@/config/copy";
import type { Cluster } from "@/config/taxonomy";
import { ButtonLink } from "@/ui";
import { storeLink, type CtaPosition } from "@/lib/utm";

// The one install button. Plain link (works without JS); analytics reads the data-* attributes.
export function InstallCta({
  slug,
  cluster,
  position,
  pageType,
  size = "md",
  variant = "primary",
  label = copy.cta.install,
  showNote = true,
}: {
  slug: string;
  cluster?: Cluster;
  position: CtaPosition;
  pageType?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "light";
  label?: string;
  showNote?: boolean;
}) {
  return (
    <span className="inline-flex flex-col items-start gap-2">
      <ButtonLink
        href={storeLink({ slug, cluster, position })}
        external
        variant={variant}
        size={size}
        data-track="install_click"
        data-position={position}
        data-cluster={cluster ?? "general"}
        data-page-type={pageType ?? ""}
      >
        <ChromeGlyph />
        {label}
      </ButtonLink>
      {showNote && (
        <span data-not-chrome-note hidden className="text-sm opacity-80">
          {copy.cta.notChrome.before}{" "}
          <button type="button" data-copy-link className="font-semibold underline underline-offset-2">
            {copy.cta.notChrome.action}
          </button>{" "}
          {copy.cta.notChrome.after}
        </span>
      )}
    </span>
  );
}

function ChromeGlyph() {
  return (
    <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="4" />
      <path d="M21.17 8H12M3.95 6.06 8.54 14M10.88 21.94 15.46 14" />
    </svg>
  );
}
