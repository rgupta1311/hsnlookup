// Parse CBIC exemption notification 45/2025-Customs (and amendments) into
// a machine-readable HSN → rate map.
//
// Source: Gazette of India / CBIC Notification No. 45/2025-Customs,
// dated 24-Oct-2025. This is THE consolidated effective-rate table: it
// supersedes 29+ prior notifications and lists, for each tariff line
// (chapter / heading / subheading / 8-digit), the BCD, IGST and Cess
// rates an importer actually pays (exemptions applied).
//
// For HSNs NOT listed in this notification, the statutory First Schedule
// rate of the Customs Tariff Act applies. Those are marked UNCOVERED in
// the output so the site can show a "verify at CBIC" disclaimer.
//
// Amendments: notification 02/2026-Customs (1 Feb 2026) makes deletions
// and date-limit changes to 45/2025. The amendment file is parsed
// separately and applied on top.
//
// Output: data/generated/tariff.json — a dictionary where each key is an
// HSN pattern (2/4/6/8 digits, comma-joined for multi-HSN rows) and each
// value has { bcd, igst, cess, description, table, row, conditionNo,
// effectiveUntil? }.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

const src = readFileSync(join(root, "data/sources/cst45_2025.txt"), "utf8");
const lines = src.split("\n");

// Detect table boundaries by their section headers.
const tableStarts = [];
lines.forEach((l, i) => {
  const m = l.match(/^\s+(TABLE|Table)\s+(I|II|III|IV|V)\b/);
  if (m) tableStarts.push({ lineIdx: i, table: m[2] });
});

// Narrow to the four real data tables. The first "TABLE I" appears as a
// toc-style header; the second is the actual data start. We accept all and
// rely on row-format validation downstream.
const DATA_TABLES = ["I", "II", "III", "IV"];

// A data row starts with S.No. at left margin, followed by HSN code(s),
// description, rate columns. The continuation lines wrap with no S.No. at
// the left — those are joined into the previous row.
//
// Regex for a row starter: ^<digits>(.)<spaces>...  (S.No. dot/period)
const ROW_START = /^\s{0,6}(\d+[A-Z]?)\.\s{2,}(.+)$/;

// An HSN token is 2/4/6/8 digits optionally split by spaces — or the
// special forms "Chapter N" / "All goods". We grab the leading HSN
// column and then the remaining text.
function parseHsnAndRest(colBlock) {
  // colBlock is the text after S.No., i.e. the HSN column continuing
  // through description and rate columns. We need to separate the HSN
  // token(s) at the left from the description + rates.
  //
  // Heuristic: the HSN column ends when we hit the description. HSNs are
  // made of digits, spaces between 2-digit groups, commas (for multi-HSN
  // rows like "0713 40 00, 0713 60 00"), and occasionally "or".
  // Everything after that is description + rate columns.
  //
  // We use a regex that greedily matches HSN-like tokens at the start.
  const hsnTokenRe =
    /^((?:\d{2}(?:\s?\d{2}){0,3}(?:\s*,\s*|\s+or\s+|\s+)?)+)(.*)$/;
  const m = colBlock.match(hsnTokenRe);
  if (!m) return { hsns: [], rest: colBlock };
  const rawHsn = m[1].trim().replace(/\s+or\s+/g, ", ");
  const rest = m[2].trim();
  const hsns = rawHsn
    .split(",")
    .map((s) => s.trim().replace(/\s+/g, " "))
    .filter(Boolean);
  return { hsns, rest };
}

// The rate column is the rightmost N columns of the row. In Table I/II:
// Standard (BCD), IGST, Condition. In Table III: BCD, IGST, Cess,
// Condition. Pdftotext -layout gives us aligned spaces; we can extract
// rate tokens by matching from the right.
//
// Rate values: "Nil", "10%", "32.5%", "Rs. 100 per kg/-", "-", numbers.
const RATE_TOKEN = /(Nil|Rs\.?\s*\d[\d,\.\s]*(?:per|\/)\S*|\d+(?:\.\d+)?\s*%|-)/g;

function normRate(t) {
  if (!t || t === "-") return null;
  if (t.toLowerCase() === "nil") return 0;
  if (t.endsWith("%")) return parseFloat(t);
  if (t.startsWith("Rs")) return t.replace(/\s+/g, " "); // specific duty
  return t;
}

// Collect rate tokens from the END of a row string. Tables I/II have 3
// trailing columns: BCD, IGST, Cond. Table III has 4: BCD, IGST, Cess,
// Cond. We don't know which table without state — pass it in.
function extractTrailingRates(rowText, table) {
  const tokens = [];
  let working = rowText;
  // Walk from right, grabbing rate-like tokens separated by >=2 spaces.
  // Pdftotext -layout uses many spaces between columns.
  const rightColRe = /(.*?)(\s{2,})([^\s].*?)$/;
  let matched;
  // Grab up to 4 columns from the right.
  for (let i = 0; i < 4; i++) {
    matched = working.match(rightColRe);
    if (!matched) break;
    tokens.unshift(matched[3].trim());
    working = matched[1];
  }
  // Depending on table, map tokens to named fields.
  if (table === "III") {
    // expect 4 tokens: bcd, igst, cess, cond
    const [bcd, igst, cess, cond] = tokens.slice(-4);
    return {
      bcd: normRate(bcd),
      igst: normRate(igst),
      cess: normRate(cess),
      cond: cond === "-" ? null : cond,
      description: working.trim(),
    };
  }
  // Tables I, II, IV: 3 trailing tokens bcd, igst, cond (IV is singular
  // standard rate; treat missing as null).
  const [bcd, igst, cond] = tokens.slice(-3);
  return {
    bcd: normRate(bcd),
    igst: normRate(igst),
    cess: null,
    cond: cond === "-" ? null : cond,
    description: working.trim(),
  };
}

// State machine: iterate lines, track current table, assemble rows.
let currentTable = null;
const rows = [];
let buf = null;

function flush() {
  if (!buf) return;
  const { sNo, rawCol, table } = buf;
  const { hsns, rest } = parseHsnAndRest(rawCol);
  const parsed = extractTrailingRates(rest, table);
  if (hsns.length && (parsed.bcd !== null || parsed.igst !== null)) {
    rows.push({
      table,
      sNo,
      hsns,
      description: parsed.description,
      bcd: parsed.bcd,
      igst: parsed.igst,
      cess: parsed.cess,
      conditionNo: parsed.cond,
    });
  }
  buf = null;
}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const tblMatch = line.match(/^\s+(TABLE|Table)\s+(I|II|III|IV)\b/);
  if (tblMatch) {
    flush();
    const t = tblMatch[2];
    if (DATA_TABLES.includes(t)) currentTable = t;
    continue;
  }
  if (!currentTable) continue;

  // Skip clearly non-data lines (page breaks, URLs, legal preambles)
  if (/^\s*https?:/i.test(line)) continue;
  if (/^\s*$/.test(line)) continue;
  if (/^\s*\(\d+\)\s/.test(line) && !/^\s*\d+\./.test(line)) continue;
  if (/Annexure/i.test(line) && line.length < 40) continue;

  const rm = line.match(ROW_START);
  if (rm) {
    flush();
    buf = { sNo: rm[1], rawCol: rm[2], table: currentTable };
  } else if (buf) {
    // Continuation of previous row — append, preserving spaces.
    buf.rawCol += " " + line.trim();
  }
}
flush();

// Build the map: key = canonical HSN (digits only, no spaces). For
// multi-HSN rows, create one entry per HSN pointing to the same rate.
const byHsn = {};
let duplicates = 0;
for (const r of rows) {
  for (const h of r.hsns) {
    const key = h.replace(/\s/g, "").replace(/,/g, "");
    if (!/^\d{2,8}$/.test(key)) continue; // reject malformed
    if (byHsn[key]) {
      duplicates++;
      // Keep the most recent (later in doc) — typically more specific.
    }
    byHsn[key] = {
      bcd: r.bcd,
      igst: r.igst,
      cess: r.cess,
      description: r.description,
      table: r.table,
      sNo: r.sNo,
      conditionNo: r.conditionNo,
    };
  }
}

const outDir = join(root, "data/generated");
mkdirSync(outDir, { recursive: true });
writeFileSync(
  join(outDir, "tariff.json"),
  JSON.stringify(
    {
      source: "CBIC Notification No. 45/2025-Customs, dated 24-Oct-2025",
      parsedAt: new Date().toISOString(),
      rowCount: rows.length,
      hsnCount: Object.keys(byHsn).length,
      byHsn,
    },
    null,
    2,
  ),
);

console.log(
  `Parsed ${rows.length} rows → ${Object.keys(byHsn).length} unique HSN keys (${duplicates} duplicates collapsed).`,
);

// Emit a terse audit summary to stderr so a human can spot-check.
const sample = Object.entries(byHsn).slice(0, 20);
for (const [k, v] of sample) {
  console.error(
    `  ${k.padEnd(10)} BCD=${String(v.bcd).padEnd(8)} IGST=${String(v.igst).padEnd(6)} Cess=${String(v.cess).padEnd(6)} ${v.description.slice(0, 60)}`,
  );
}
