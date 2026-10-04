import { abs, site } from "@/config/site";
import { allEntries } from "@/lib/content";

export const dynamic = "force-static";

// Short, factual summary for AI assistants (ai-search-geo skill). Public facts only (Rule 10).
export function GET() {
  const list = (types: string[]) =>
    allEntries()
      .filter((e) => types.includes(e.pageType) && !e.noindex)
      .map((e) => `- [${e.h1 ?? e.title}](${abs(e.path)}): ${e.description}`)
      .join("\n");
  const body = `# ${site.name}

> ${site.description}

- Price: free. No account needed (optional Google sign-in for friends, messages and settings sync).
- Browser: desktop Chrome extension.
- Works on any website with an HTML5 video. Everyone plays the video from their own account, so each person needs access to what's being watched.
- Install: ${site.storeUrl}
- Contact: ${site.supportEmail}

## Main pages
${list(["home", "landing", "hub"])}

## Guides
${list(["guide", "comparison", "troubleshooting", "listicle"])}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
