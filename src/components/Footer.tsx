import Link from "next/link";
import Image from "next/image";
import icon from "@/app/icon.png";
import { site } from "@/config/site";
import { footerNav } from "@/config/nav";
import { copy } from "@/config/copy";
import { Container } from "@/ui";

export function Footer() {
  return (
    <footer className="border-t border-border bg-bg-soft">
      <Container>
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Image src={icon} alt="" width={32} height={32} className="rounded-[9px]" />
              <span className="font-display text-lg font-extrabold text-heading">{site.name}</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{copy.footer.blurb}</p>
            <a href={`mailto:${site.supportEmail}`} className="mt-4 inline-block text-sm font-medium text-link underline underline-offset-2">
              {site.supportEmail}
            </a>
          </div>
          {footerNav.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="text-sm font-semibold text-heading">{col.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-muted transition hover:text-heading">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="border-t border-border py-6 text-xs leading-relaxed text-muted">
          <p>
            © {new Date().getFullYear()} {site.storeName}. {copy.footer.legal}
          </p>
        </div>
      </Container>
    </footer>
  );
}
