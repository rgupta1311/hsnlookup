// Fetch the full Cleartax HSN + GST rate dataset from their public API.
//
// The API: api.clear.in/api/ingestion/config/hsn/v2/search returns an
// array of { hsnCode, taxDetails[{rateOfTax, description, effectiveDate}],
// chapterName, chapterNumber } for a given search key, paginated.
//
// Cleartax's /s/gst-hsn-lookup page uses this API; robots.txt allows
// crawling; we pull chapter-by-chapter at 200ms intervals to be polite.
//
// Output: data/sources/cleartax_hsn.json — { generatedAt, source,
// byHsn: { "7113": { igst, description, chapter, chapterName,
// effectiveDate } } }.
//
// Note on data provenance: Cleartax compiles these from CBIC's GST rate
// notifications. GST rates are public-domain government data (facts, not
// copyrightable). We record Cleartax as the immediate source because
// that's who we pulled from, and because their compilation may include
// edits/interpretations we inherit. When we republish on hsnlookup.in,
// we attribute the rate to "CBIC GST notifications (via Cleartax)".

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const API = "https://api.clear.in/api/ingestion/config/hsn/v2/search";
const POLITE_DELAY_MS = 200;
const PAGE_SIZE = 100;

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchChapter(ch) {
  const key = ch.toString().padStart(2, "0");
  const items = [];
  let page = 0;
  while (true) {
    const url = `${API}?hsnSearchKey=${key}&page=${page}&size=${PAGE_SIZE}`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent":
          "hsnlookup.in-crawler (contact: https://hsnlookup.in/about/) polite, respects robots.txt",
      },
    });
    if (!res.ok) {
      console.error(`Chapter ${key} page ${page}: HTTP ${res.status}, skipping`);
      break;
    }
    const data = await res.json();
    const results = data.results || [];
    items.push(...results);
    if (!data.hasMore || results.length < PAGE_SIZE) break;
    page++;
    await sleep(POLITE_DELAY_MS);
  }
  return items;
}

function toRecord(raw) {
  const tax = (raw.taxDetails && raw.taxDetails[0]) || {};
  return {
    hsn: raw.hsnCode,
    igst: tax.rateOfTax != null ? parseFloat(tax.rateOfTax) : null,
    description: (tax.description || "").trim(),
    chapter: raw.chapterNumber,
    chapterName: raw.chapterName,
    effectiveDate: tax.effectiveDate || null,
    updatedAt: raw.updatedAt || null,
  };
}

const byHsn = {};
let duplicates = 0;
const startedAt = new Date().toISOString();

for (let ch = 1; ch <= 97; ch++) {
  const items = await fetchChapter(ch);
  let kept = 0;
  for (const it of items) {
    if (!it.hsnCode) continue;
    const rec = toRecord(it);
    // Only keep HSN codes that actually start with the chapter number.
    // The search endpoint returns any entry containing the digits (so
    // "7113" matches as a substring inside longer codes too) — filter
    // out the cross-chapter noise.
    if (!rec.hsn.startsWith(ch.toString().padStart(2, "0"))) continue;
    if (byHsn[rec.hsn]) {
      duplicates++;
      continue;
    }
    byHsn[rec.hsn] = rec;
    kept++;
  }
  const chStr = ch.toString().padStart(2, "0");
  console.error(
    `  chapter ${chStr}: ${items.length} returned, ${kept} kept (${Object.keys(byHsn).length} total so far)`,
  );
  await sleep(POLITE_DELAY_MS);
}

const out = {
  source: "Cleartax HSN lookup API (api.clear.in/api/ingestion/config/hsn/v2/search)",
  underlyingAuthority: "CBIC GST Rate Schedules (notifications under the Integrated Goods and Services Tax Act, 2017)",
  fetchedAt: startedAt,
  finishedAt: new Date().toISOString(),
  hsnCount: Object.keys(byHsn).length,
  duplicatesCollapsed: duplicates,
  byHsn,
};

const outDir = join(root, "data/sources");
mkdirSync(outDir, { recursive: true });
writeFileSync(
  join(outDir, "cleartax_hsn.json"),
  JSON.stringify(out, null, 2),
);

console.log(
  `\nWrote data/sources/cleartax_hsn.json with ${out.hsnCount} HSN codes.`,
);
