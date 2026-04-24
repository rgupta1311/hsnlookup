import { readFileSync, mkdirSync, writeFileSync, rmSync, cpSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  hsnPage,
  subheadingPage,
  headingPage,
  chapterPage,
  sectionPage,
  homePage,
  aboutPage,
  calculatorPage,
  customsDutyGuidePage,
  whatIsHsnGuidePage,
  hsnCodeListPage,
  dataBundlePage,
  productDutyPage,
  dutyIndexPage,
  privacyPage,
  contactPage,
  chaptersIndexPage,
  sectionsIndexPage,
  sitemapXml,
  robotsTxt,
} from "./templates.js";
import { loadHS, pad2 } from "./loadHS.js";
import { buildSearchIndex } from "./searchIndex.js";
import { PRODUCTS } from "./products.js";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const outDir = join(root, "public");

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

const write = (relPath, contents) => {
  const fullPath = join(outDir, relPath);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, contents);
};

// Prefer the expanded seed (14k+ codes with IGST verified via Cleartax/CBIC)
// and fall back to the hand-curated seed if the expansion file is absent.
let seed;
try {
  seed = JSON.parse(readFileSync(join(root, "data/seed/hsn_expanded.json"), "utf8"));
} catch {
  seed = JSON.parse(readFileSync(join(root, "data/seed/hsn.json"), "utf8"));
}
// Filter out low-value 8-digit pages whose Cleartax description is pure
// filler ("OTHER", "-", empty, or shorter than 4 chars). These don't
// generate search demand and would consume our 20k-file budget on CF's
// free tier for no SEO return.
function isFillerDescription(d) {
  if (!d) return true;
  const t = d.trim().toLowerCase();
  if (t.length <= 3) return true;
  if (t === "other" || t === "others" || t === "-") return true;
  return false;
}
const india8 = seed.codes.filter((c) => !isFillerDescription(c.description));

const india8By6 = new Map();
const india8ByChapter = new Map();
for (const c of india8) {
  const parent6 = c.hsn.slice(0, 6);
  if (!india8By6.has(parent6)) india8By6.set(parent6, []);
  india8By6.get(parent6).push(c);
  const chapterKey = pad2(c.chapter);
  if (!india8ByChapter.has(chapterKey)) india8ByChapter.set(chapterKey, []);
  india8ByChapter.get(chapterKey).push(c);
}

const hs = loadHS();
const sections = [...hs.sectionMap.entries()].map(([section, name]) => ({ section, name }));
const stats = {
  sections: sections.length,
  chapters: hs.chapters.length,
  subheadings: hs.subheadings.length,
  india8: india8.length,
};

write("index.html", homePage(india8, hs.chapters, sections, stats));
write("about/index.html", aboutPage());
write("privacy/index.html", privacyPage());
write("contact/index.html", contactPage());
write("calculator/index.html", calculatorPage());
write("guide/customs-duty/index.html", customsDutyGuidePage());
write("guide/what-is-hsn-code/index.html", whatIsHsnGuidePage());
write("hsn-code-list/index.html", hsnCodeListPage(hs.chapters, india8));
write("data/index.html", dataBundlePage());

const india8ByHsn = new Map(india8.map((c) => [c.hsn, c]));
write("duty/index.html", dutyIndexPage(PRODUCTS, india8ByHsn));
for (const product of PRODUCTS) {
  const hsnEntry = india8ByHsn.get(product.hsn);
  if (!hsnEntry) {
    console.warn(`Product ${product.slug} references HSN ${product.hsn} not in seed — skipping`);
    continue;
  }
  write(`duty/${product.slug}/index.html`, productDutyPage(product, hsnEntry));
}
write("chapters/index.html", chaptersIndexPage(hs.chapters));
write("sections/index.html", sectionsIndexPage(sections));

for (const [section, name] of hs.sectionMap) {
  const chaptersInSection = hs.chaptersBySection.get(section) ?? [];
  write(`section/${section.toLowerCase()}/index.html`, sectionPage(section, name, chaptersInSection));
}

for (const ch of hs.chapters) {
  const children4 = hs.childrenOf.get(ch.code) ?? [];
  const sectionName = hs.sectionMap.get(ch.section);
  const eightDigitInChapter = india8ByChapter.get(ch.code) ?? [];
  write(`chapter/${ch.code}/index.html`, chapterPage(ch, children4, sectionName, eightDigitInChapter));
}

for (const h of hs.headings) {
  const children6 = hs.childrenOf.get(h.code) ?? [];
  const chapterEntry = hs.byCode.get(h.code.slice(0, 2));
  const sectionName = hs.sectionMap.get(h.section);
  write(`heading/${h.code}/index.html`, headingPage(h, children6, chapterEntry?.description, sectionName));
}

for (const s of hs.subheadings) {
  const parent4 = hs.byCode.get(s.code.slice(0, 4));
  const chapterEntry = hs.byCode.get(s.code.slice(0, 2));
  const sectionName = hs.sectionMap.get(s.section);
  const india8sHere = india8By6.get(s.code) ?? [];
  write(`hs/${s.code}/index.html`, subheadingPage(s, parent4, chapterEntry?.description, sectionName, india8sHere));
}

const productSlugByHsn = new Map(PRODUCTS.map((p) => [p.hsn, p.slug]));
// Siblings map: all 8-digit codes sharing a 6-digit parent. Precomputed
// once so every hsnPage call pulls in O(k) where k = siblings.
const siblingsBy6 = new Map();
for (const c of india8) {
  const parent6 = c.hsn.slice(0, 6);
  if (!siblingsBy6.has(parent6)) siblingsBy6.set(parent6, []);
  siblingsBy6.get(parent6).push(c);
}
for (const c of india8) {
  const parent6 = hs.byCode.get(c.hsn.slice(0, 6));
  const allInSubheading = siblingsBy6.get(c.hsn.slice(0, 6)) || [];
  const siblings = allInSubheading.filter((s) => s.hsn !== c.hsn).slice(0, 20);
  write(
    `hsn/${c.hsn}/index.html`,
    hsnPage(c, parent6, productSlugByHsn.get(c.hsn) || null, siblings),
  );
}

const urls = [
  "/",
  "/about/",
  "/privacy/",
  "/contact/",
  "/calculator/",
  "/guide/customs-duty/",
  "/guide/what-is-hsn-code/",
  "/hsn-code-list/",
  "/data/",
  "/duty/",
  ...PRODUCTS.map((p) => `/duty/${p.slug}/`),
  "/chapters/",
  "/sections/",
  ...[...hs.sectionMap.keys()].map((s) => `/section/${s.toLowerCase()}/`),
  ...hs.chapters.map((c) => `/chapter/${c.code}/`),
  ...hs.headings.map((h) => `/heading/${h.code}/`),
  ...hs.subheadings.map((s) => `/hs/${s.code}/`),
  ...india8.map((c) => `/hsn/${c.hsn}/`),
];
write("sitemap.xml", sitemapXml(urls));
write("robots.txt", robotsTxt());

// Assets
mkdirSync(join(outDir, "assets"), { recursive: true });
writeFileSync(join(outDir, "assets/style.css"), readFileSync(join(root, "src/style.css"), "utf8"));
writeFileSync(join(outDir, "assets/search.js"), readFileSync(join(root, "src/clientSearch.js"), "utf8"));
writeFileSync(join(outDir, "assets/calculator.js"), readFileSync(join(root, "src/calculator.js"), "utf8"));

const searchIdx = buildSearchIndex(hs, india8);
writeFileSync(join(outDir, "assets/search.json"), JSON.stringify(searchIdx));

// Rates lookup for the calculator
const ratesMap = {};
for (const c of india8) {
  ratesMap[c.hsn] = {
    description: c.description,
    bcd: c.bcd, igst: c.igst, sws: c.sws, cess: c.cess || 0,
  };
}
writeFileSync(join(outDir, "assets/rates.json"), JSON.stringify(ratesMap));

// Public JSON API — one bulk file for the full 8-digit dataset. Keeps
// us under Cloudflare free-tier's 20,000-file asset limit. Per-code
// lookups can be added later via a Worker that reads from this bulk
// file once we're above rent and can afford CF Workers Paid.
mkdirSync(join(outDir, "api"), { recursive: true });
writeFileSync(join(outDir, "api/hsn.json"), JSON.stringify({
  generatedAt: new Date().toISOString(),
  count: india8.length,
  license: "CC-BY-4.0 — attribute hsnlookup.in with a visible link",
  source: "hsnlookup.in",
  schema: {
    hsn: "string — India ITC(HS) 8-digit tariff item",
    description: "string",
    chapter: "number — 1..97",
    bcd: "number — Basic Customs Duty percent",
    sws: "number — Social Welfare Surcharge percent of BCD",
    igst: "number — Integrated GST percent",
    cess: "number — Compensation Cess percent",
  },
  data: india8.map((c) => ({
    hsn: c.hsn, description: c.description, chapter: c.chapter,
    bcd: c.bcd, sws: c.sws, igst: c.igst, cess: c.cess || 0,
  })),
}));

// Downloadable assets (Gumroad product zip + free sample CSV).
// Source lives in data/downloads/ so it survives the public/ rebuild.
// Regenerate via scripts/buildProductBundle.py when the underlying seed
// changes.
const downloadsSrc = join(root, "data/downloads");
if (existsSync(downloadsSrc)) {
  cpSync(downloadsSrc, join(outDir, "downloads"), { recursive: true });
}

// IndexNow key file — lets Bing/Yandex index the site fast after push.
const INDEXNOW_KEY = "a0fd0c7dfc4b04b561fe074f305f7dcb";
writeFileSync(join(outDir, `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY);

// Google AdSense ads.txt — authorizes ca-pub-7399885309804978 to sell
// ad inventory on this domain. Required for AdSense review to pass and
// for programmatic ad networks to accept our inventory as legitimate.
writeFileSync(
  join(outDir, "ads.txt"),
  "google.com, pub-7399885309804978, DIRECT, f08c47fec0942fa0\n",
);

console.log(
  `Built ${urls.length} pages · search index: ${searchIdx.length} items · ` +
    `${hs.sectionMap.size} sections, ${hs.chapters.length} chapters, ${hs.headings.length} headings, ${hs.subheadings.length} subheadings, ${india8.length} India 8-digit.`,
);
