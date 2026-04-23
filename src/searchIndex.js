// Build the compact search index that ships to the browser.
// Shape per item: [code, description, url, typeTag]
//   typeTag: "india" (8-digit w/ duty), "hs" (6-digit), "heading" (4-digit), "chapter" (2-digit)
import { pad2 } from "./loadHS.js";

const tidy = (s) => {
  if (!s) return s;
  const t = String(s).trim().replace(/\s+/g, " ");
  return t.charAt(0).toUpperCase() + t.slice(1);
};

export function buildSearchIndex(hs, india8) {
  const items = [];
  for (const c of india8) {
    items.push({
      c: c.hsn,
      d: c.description,
      u: `/hsn/${c.hsn}/`,
      t: "india",
      p: (c.common_products ?? []).join(" "),
    });
  }
  for (const s of hs.subheadings) {
    items.push({ c: s.code, d: tidy(s.description), u: `/hs/${s.code}/`, t: "hs" });
  }
  for (const h of hs.headings) {
    items.push({ c: h.code, d: tidy(h.description), u: `/heading/${h.code}/`, t: "heading" });
  }
  for (const ch of hs.chapters) {
    items.push({ c: ch.code, d: tidy(ch.description), u: `/chapter/${ch.code}/`, t: "chapter" });
  }
  return items;
}
