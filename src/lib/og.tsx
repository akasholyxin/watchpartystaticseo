import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/config/site";
import { clusters } from "@/config/taxonomy";
import type { Entry } from "@/lib/content";

// Per-page social preview (1200×630): brand gradient, the real app icon, the page title and its topic.
export const ogSize = { width: 1200, height: 630 };

export async function renderOg(entry: Entry) {
  const [icon, bold, semibold] = await Promise.all([
    readFile(join(process.cwd(), "src/app/icon.png")),
    readFile(join(process.cwd(), "src/assets/fonts/PlusJakartaSans-800.ttf")),
    readFile(join(process.cwd(), "src/assets/fonts/PlusJakartaSans-600.ttf")),
  ]);
  const iconSrc = `data:image/png;base64,${icon.toString("base64")}`;
  const title = entry.h1 ?? entry.title;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0f9e8e 0%, #14b8a6 40%, #2563eb 100%)",
          color: "white",
          fontFamily: "Jakarta",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
          <img src={iconSrc} width={72} height={72} style={{ borderRadius: 18 }} alt="" />
          <div style={{ fontSize: 36, fontWeight: 800 }}>{site.name}</div>
          <div
            style={{
              marginLeft: "auto",
              fontSize: 24,
              fontWeight: 600,
              padding: "8px 20px",
              borderRadius: 999,
              border: "2px solid rgba(255,255,255,0.5)",
            }}
          >
            {clusters[entry.cluster].label}
          </div>
        </div>
        <div style={{ fontSize: title.length > 60 ? 58 : 68, fontWeight: 800, lineHeight: 1.1, letterSpacing: -1, maxWidth: 1000 }}>{title}</div>
        <div style={{ fontSize: 28, fontWeight: 600, opacity: 0.9 }}>Free Chrome extension · Synced playback, chat & video calls</div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Jakarta", data: bold, weight: 800, style: "normal" },
        { name: "Jakarta", data: semibold, weight: 600, style: "normal" },
      ],
    }
  );
}
