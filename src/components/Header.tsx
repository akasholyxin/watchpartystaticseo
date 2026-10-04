import Link from "next/link";
import Image from "next/image";
import icon from "@/app/icon.png";
import { site } from "@/config/site";
import { headerNav } from "@/config/nav";
import { copy } from "@/config/copy";
import { Container } from "@/ui";
import { InstallCta } from "./InstallCta";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-bg/80 backdrop-blur-xl">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src={icon} alt="" width={34} height={34} className="rounded-[10px]" priority />
            <span className="font-display text-lg font-extrabold tracking-tight text-heading">{site.name}</span>
          </Link>
          <nav aria-label="Main" className="hidden items-center gap-7 text-[15px] font-medium md:flex">
            {headerNav.map((n) => (
              <Link key={n.href} href={n.href} className="text-text transition hover:text-heading">
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <InstallCta slug="header" position="header" size="sm" label={copy.cta.installShort} showNote={false} />
            </div>
            <details className="relative md:hidden">
              <summary className="cursor-pointer list-none rounded-full border border-border px-4 py-2 text-sm font-semibold text-heading">Menu</summary>
              <nav aria-label="Mobile" className="absolute right-0 mt-2 w-60 rounded-md border border-border bg-surface p-2 shadow-lg">
                {headerNav.map((n) => (
                  <Link key={n.href} href={n.href} className="block rounded-sm px-3 py-2.5 text-[15px] hover:bg-bg-soft">
                    {n.label}
                  </Link>
                ))}
                <Link href="/download/" className="block rounded-sm px-3 py-2.5 text-[15px] font-semibold text-link hover:bg-bg-soft">
                  Download
                </Link>
              </nav>
            </details>
          </div>
        </div>
      </Container>
    </header>
  );
}
