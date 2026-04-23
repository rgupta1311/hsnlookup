import { readFileSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
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
  chaptersIndexPage,
  sectionsIndexPage,
  sitemapXml,
  robotsTxt,
} from "./templates.js";
import { loadHS, pad2 } from "./loadHS.js";
import { buildSearchIndex } from "./searchIndex.js";

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

const seed = JSON.parse(readFileSync(join(root, "data/seed/hsn.json"), "utf8"));
const india8 = seed.codes;

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
write("calculator/index.html", calculatorPage());
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

for (const c of india8) {
  const parent6 = hs.byCode.get(c.hsn.slice(0, 6));
  write(`hsn/${c.hsn}/index.html`, hsnPage(c, parent6));
}

const urls = [
  "/",
  "/about/",
  "/calculator/",
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

// IndexNow key file — lets Bing/Yandex index the site fast after push.
const INDEXNOW_KEY = "a0fd0c7dfc4b04b561fe074f305f7dcb";
writeFileSync(join(outDir, `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY);

console.log(
  `Built ${urls.length} pages · search index: ${searchIdx.length} items · ` +
    `${hs.sectionMap.size} sections, ${hs.chapters.length} chapters, ${hs.headings.length} headings, ${hs.subheadings.length} subheadings, ${india8.length} India 8-digit.`,
);
