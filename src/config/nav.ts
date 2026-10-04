import { site } from "./site";

export const headerNav = [
  { href: "/how-it-works/", label: "How it works" },
  { href: "/watch-party-guide/", label: "Guide" },
  { href: "/teleparty-alternatives/", label: "Compare" },
  { href: "/blog/", label: "Blog" },
  { href: "/faq/", label: "FAQ" },
] as const;

export const footerNav = [
  {
    title: "Watch together",
    links: [
      { href: "/watch-party/", label: "Watch party" },
      { href: "/watch-netflix-together/", label: "Netflix together" },
      { href: "/watch-youtube-together/", label: "YouTube together" },
      { href: "/watch-movies-together/", label: "Movies together" },
      { href: "/watch-anime-together/", label: "Anime together" },
    ],
  },
  {
    title: "Learn",
    links: [
      { href: "/how-it-works/", label: "How it works" },
      { href: "/watch-party-guide/", label: "Watch party guide" },
      { href: "/teleparty-alternatives/", label: "Teleparty alternatives" },
      { href: "/blog/", label: "Blog" },
      { href: "/faq/", label: "FAQ" },
    ],
  },
  {
    title: site.name,
    links: [
      { href: "/download/", label: "Download" },
      { href: "/about/", label: "About" },
      { href: "/contact/", label: "Contact" },
      { href: "/privacy/", label: "Privacy" },
      { href: "/terms/", label: "Terms" },
    ],
  },
] as const;
