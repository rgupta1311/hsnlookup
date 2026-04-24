// Verify each seed HSN by grepping notification 45/2025-Customs text for
// the HSN code in its official "NNNN NN NN" space-separated form, plus
// 4-digit and 6-digit variants. Prints every match with surrounding
// context for human/machine review.
//
// Usage: node scripts/verifySeedAgainstNotification.js

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const seed = JSON.parse(
  readFileSync(join(root, "data/seed/hsn.json"), "utf8"),
).codes;
const src = readFileSync(join(root, "data/sources/cst45_2025.txt"), "utf8");
const lines = src.split("\n");

function spaced(hsn) {
  // Convert 85171300 → "8517 13 00"
  if (hsn.length === 8) return `${hsn.slice(0, 4)} ${hsn.slice(4, 6)} ${hsn.slice(6, 8)}`;
  if (hsn.length === 6) return `${hsn.slice(0, 4)} ${hsn.slice(4, 6)}`;
  return hsn;
}

function findMatches(patterns) {
  const results = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    for (const p of patterns) {
      if (l.includes(p)) {
        results.push({
          pattern: p,
          lineIdx: i,
          context: lines
            .slice(Math.max(0, i - 1), Math.min(lines.length, i + 4))
            .join("\n"),
        });
        break;
      }
    }
  }
  return results;
}

console.log(JSON.stringify(
  seed.map((c) => {
    const patterns = [
      spaced(c.hsn),            // 8-digit full e.g. "8517 13 00"
      spaced(c.hsn.slice(0, 6)), // 6-digit e.g. "8517 13"
      c.hsn.slice(0, 4),         // 4-digit heading "8517"
    ];
    const matches = findMatches(patterns);
    return {
      hsn: c.hsn,
      description: c.description,
      seedBcd: c.bcd,
      seedIgst: c.igst,
      matchCount: matches.length,
      firstMatches: matches.slice(0, 3),
    };
  }),
  null,
  2,
));
