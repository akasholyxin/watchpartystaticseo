// Media registry: the ONLY list of images the site may use. Each file has a reviewed .meta.json
// (Rules 11–12; tools/validate/images.mjs). Alt text comes from that reviewed meta.
import type { StaticImageData } from "next/image";
import hero from "@/assets/screens/hero.webp";
import anySite from "@/assets/screens/any-site.webp";
import quality from "@/assets/screens/quality.webp";
import start from "@/assets/screens/start.webp";
import panelRoom from "@/assets/screens/panel-room.webp";
import panelFriends from "@/assets/screens/panel-friends.webp";
import heroMeta from "@/assets/screens/hero.webp.meta.json";
import anySiteMeta from "@/assets/screens/any-site.webp.meta.json";
import qualityMeta from "@/assets/screens/quality.webp.meta.json";
import startMeta from "@/assets/screens/start.webp.meta.json";
import panelRoomMeta from "@/assets/screens/panel-room.webp.meta.json";
import panelFriendsMeta from "@/assets/screens/panel-friends.webp.meta.json";

import { photos } from "./photos.generated";

export type MediaKind = "browser" | "panel" | "graphic" | "photo";
type MediaItem = { src: StaticImageData; alt: string; kind: MediaKind };

export const media = {
  // Approved generated photos (tools/media/build.mjs). Real product screenshots below.
  ...photos,
  hero: { src: hero, alt: heroMeta.alt, kind: "browser" },
  "any-site": { src: anySite, alt: anySiteMeta.alt, kind: "graphic" },
  quality: { src: quality, alt: qualityMeta.alt, kind: "graphic" },
  start: { src: start, alt: startMeta.alt, kind: "graphic" },
  "panel-room": { src: panelRoom, alt: panelRoomMeta.alt, kind: "panel" },
  "panel-friends": { src: panelFriends, alt: panelFriendsMeta.alt, kind: "panel" },
} as const satisfies Record<string, MediaItem>;

export type MediaId = keyof typeof media;
export const mediaIds = Object.keys(media) as [MediaId, ...MediaId[]];
