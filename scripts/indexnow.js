// Notify IndexNow (Bing, Yandex, etc.) of URLs after a deploy.
// Usage: node scripts/indexnow.js
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const KEY = "a0fd0c7dfc4b04b561fe074f305f7dcb";
const HOST = "hsnlookup.in";

const sitemap = readFileSync(join(root, "public/sitemap.xml"), "utf8");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

// IndexNow caps requests at 10,000 URLs each.
const chunks = [];
for (let i = 0; i < urls.length; i += 10000) chunks.push(urls.slice(i, i + 10000));

for (const batch of chunks) {
  const body = { host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: batch };
  const res = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  console.log(`IndexNow ${batch.length} URLs → HTTP ${res.status}`);
}
