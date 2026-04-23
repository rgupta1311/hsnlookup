import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

// Minimal CSV parser tolerant of quoted commas and BOM.
function parseCSV(raw) {
  const text = raw.replace(/^\uFEFF/, "");
  const rows = [];
  let cur = [""];
  let inQ = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQ) {
      if (ch === '"' && text[i + 1] === '"') {
        cur[cur.length - 1] += '"';
        i++;
      } else if (ch === '"') {
        inQ = false;
      } else {
        cur[cur.length - 1] += ch;
      }
    } else {
      if (ch === '"') inQ = true;
      else if (ch === ",") cur.push("");
      else if (ch === "\n") {
        rows.push(cur);
        cur = [""];
      } else if (ch === "\r") {
        // skip
      } else {
        cur[cur.length - 1] += ch;
      }
    }
  }
  if (cur.length > 1 || cur[0] !== "") rows.push(cur);
  const headers = rows.shift().map((h) => h.trim());
  return rows
    .filter((r) => r.some((c) => c.length > 0))
    .map((r) => {
      const obj = {};
      headers.forEach((h, i) => (obj[h] = (r[i] ?? "").trim()));
      return obj;
    });
}

export function pad2(n) {
  return String(n).padStart(2, "0");
}

export function loadHS() {
  const hsRaw = readFileSync(join(root, "data/wco/hs.csv"), "utf8");
  const secRaw = readFileSync(join(root, "data/wco/sections.csv"), "utf8");
  const rows = parseCSV(hsRaw);
  const sections = parseCSV(secRaw);

  const byCode = new Map();
  const chapters = [];      // level 2
  const headings = [];      // level 4
  const subheadings = [];   // level 6
  for (const r of rows) {
    const entry = {
      section: r.section,
      code: r.hscode,
      description: r.description,
      parent: r.parent,
      level: parseInt(r.level),
    };
    byCode.set(entry.code, entry);
    if (entry.level === 2) chapters.push(entry);
    else if (entry.level === 4) headings.push(entry);
    else if (entry.level === 6) subheadings.push(entry);
  }

  // children index
  const childrenOf = new Map();
  for (const e of [...headings, ...subheadings]) {
    if (!childrenOf.has(e.parent)) childrenOf.set(e.parent, []);
    childrenOf.get(e.parent).push(e);
  }
  for (const list of childrenOf.values()) {
    list.sort((a, b) => a.code.localeCompare(b.code));
  }

  // chapters by section
  const chaptersBySection = new Map();
  for (const c of chapters) {
    if (!chaptersBySection.has(c.section)) chaptersBySection.set(c.section, []);
    chaptersBySection.get(c.section).push(c);
  }
  for (const list of chaptersBySection.values()) {
    list.sort((a, b) => a.code.localeCompare(b.code));
  }

  const sectionMap = new Map(sections.map((s) => [s.section, s.name]));

  return {
    byCode,
    chapters,
    headings,
    subheadings,
    childrenOf,
    chaptersBySection,
    sectionMap,
  };
}
