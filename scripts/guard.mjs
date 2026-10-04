#!/usr/bin/env node
// Runs the project validators when building inside the full private workspace (where ../tools exists).
// In the published site-only repo (Vercel) the validators aren't present: that copy was produced by
// tools/publish/export-site.mjs, which refuses to export unless every validator and a production build passed.
// Usage: node scripts/guard.mjs pre|post
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";

const phase = process.argv[2];
if (!existsSync("../tools/validate/content.mjs")) {
  console.log(`[guard] ${phase}: site-only repo; validators ran before export (tools/publish/export-site.mjs).`);
  process.exit(0);
}
const run = (args) => execFileSync(process.execPath, args, { stdio: "inherit" });
if (phase === "pre") {
  run(["../tools/validate/images.mjs", "site/src"]);
  run(["../tools/validate/content.mjs", "site/content"]);
} else if (phase === "post") {
  run(["../tools/validate/content.mjs", "site/.next/server/app"]);
}
