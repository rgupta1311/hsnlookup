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
  chaptersIndexPage,
  sectionsIndexPage,
  sitemapXml,
  robotsTxt,
} from "./templates.js";
import { loadHS, pad2 } from "./loadHS.js";

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

// --- India 8-digit seed ---
const seed = JSON.parse(readFileSync(join(root, "data/seed/hsn.json"), "utf8"));
const india8 = seed.codes;

// Group seed codes by their 6-digit parent subheading and by chapter.
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

// --- WCO HS 2022 tree ---
const hs = loadHS();

// --- Home / about / indexes ---
write("index.html", homePage(india8, hs.chapters, [...hs.sectionMap.entries()].map(([section, name]) => ({ section, name }))));
write("about/index.html", aboutPage());
write("chapters/index.html", chaptersIndexPage(hs.chapters));
write("sections/index.html", sectionsIndexPage([...hs.sectionMap.entries()].map(([section, name]) => ({ section, name }))));

// --- Sections ---
for (const [section, name] of hs.sectionMap) {
  const chaptersInSection = hs.chaptersBySection.get(section) ?? [];
  write(`section/${section.toLowerCase()}/index.html`, sectionPage(section, name, chaptersInSection));
}

// --- Chapters ---
for (const ch of hs.chapters) {
  const children4 = hs.childrenOf.get(ch.code) ?? [];
  const sectionName = hs.sectionMap.get(ch.section);
  const eightDigitInChapter = india8ByChapter.get(ch.code) ?? [];
  write(
    `chapter/${ch.code}/index.html`,
    chapterPage(ch, children4, sectionName, eightDigitInChapter),
  );
}

// --- Headings (4-digit) ---
for (const h of hs.headings) {
  const children6 = hs.childrenOf.get(h.code) ?? [];
  const chapterEntry = hs.byCode.get(h.code.slice(0, 2));
  const sectionName = hs.sectionMap.get(h.section);
  write(
    `heading/${h.code}/index.html`,
    headingPage(h, children6, chapterEntry?.description, sectionName),
  );
}

// --- Subheadings (6-digit) ---
for (const s of hs.subheadings) {
  const parent4 = hs.byCode.get(s.code.slice(0, 4));
  const chapterEntry = hs.byCode.get(s.code.slice(0, 2));
  const sectionName = hs.sectionMap.get(s.section);
  const india8sHere = india8By6.get(s.code) ?? [];
  write(
    `hs/${s.code}/index.html`,
    subheadingPage(s, parent4, chapterEntry?.description, sectionName, india8sHere),
  );
}

// --- 8-digit HSN pages ---
for (const c of india8) {
  const parent6 = hs.byCode.get(c.hsn.slice(0, 6));
  write(`hsn/${c.hsn}/index.html`, hsnPage(c, parent6));
}

// --- Sitemap + robots ---
const urls = [
  "/",
  "/about/",
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

// --- CSS ---
const css = readFileSync(join(root, "src/style.css"), "utf8");
mkdirSync(join(outDir, "assets"), { recursive: true });
writeFileSync(join(outDir, "assets/style.css"), css);

console.log(
  `Built ${urls.length} pages: ` +
    `home + about + 2 indexes, ` +
    `${hs.sectionMap.size} sections, ` +
    `${hs.chapters.length} chapters, ` +
    `${hs.headings.length} headings, ` +
    `${hs.subheadings.length} subheadings, ` +
    `${india8.length} India 8-digit HSN.`,
);
