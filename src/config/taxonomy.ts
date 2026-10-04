// Content clusters: the ONLY list. Content schema, UTM campaigns, blog grouping and badges all read this.
export const clusters = {
  general: { label: "Watch parties", campaign: "watch_party", tone: "teal" },
  netflix: { label: "Netflix", campaign: "netflix_watch_party", tone: "red" },
  youtube: { label: "YouTube", campaign: "youtube_watch_party", tone: "red" },
  movies: { label: "Movies", campaign: "movies_watch_party", tone: "violet" },
  anime: { label: "Anime", campaign: "anime_watch_party", tone: "pink" },
  teleparty: { label: "Teleparty", campaign: "teleparty_alternative", tone: "blue" },
  alternatives: { label: "Comparisons", campaign: "teleparty_alternative", tone: "blue" },
  "use-cases": { label: "Watching together", campaign: "watch_party", tone: "amber" },
  troubleshooting: { label: "Fixes", campaign: "watch_party", tone: "slate" },
  ideas: { label: "Movie night ideas", campaign: "watch_party", tone: "amber" },
} as const;

export type Cluster = keyof typeof clusters;
export const clusterIds = Object.keys(clusters) as [Cluster, ...Cluster[]];

export const pageTypes = ["home", "landing", "guide", "comparison", "troubleshooting", "listicle", "hub", "page"] as const;
export type PageType = (typeof pageTypes)[number];
export const articleTypes: readonly PageType[] = ["guide", "comparison", "troubleshooting", "listicle"];
