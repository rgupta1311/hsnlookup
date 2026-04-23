import { SITE, DISCLAIMER } from "./site.js";
import { computeDuty, inr } from "./duty.js";
import { pad2 } from "./loadHS.js";

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Capitalize first letter of descriptions (WCO data is mostly lowercase).
const tidy = (s) => {
  if (!s) return s;
  const t = s.trim().replace(/\s+/g, " ");
  return t.charAt(0).toUpperCase() + t.slice(1);
};

const chapterUrl = (ch) => `/chapter/${pad2(ch)}/`;
const headingUrl = (c) => `/heading/${c}/`;
const subheadingUrl = (c) => `/hs/${c}/`;
const hsnUrl = (c) => `/hsn/${c}/`;
const sectionUrl = (s) => `/section/${s.toLowerCase()}/`;

function layout({ title, description, canonical, bodyHtml, jsonLd }) {
  const ld = jsonLd
    ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
    : "";
  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:type" content="website">
<meta name="robots" content="index,follow">
<link rel="stylesheet" href="/assets/style.css">
${ld}
</head>
<body>
<header class="site-header">
  <a href="/" class="logo">${SITE.name}</a>
  <nav><a href="/chapters/">Chapters</a><a href="/sections/">Sections</a><a href="/about/">About</a></nav>
</header>
<main>${bodyHtml}</main>
<footer class="site-footer">
  <p>© ${SITE.copyrightYear} ${SITE.name}. Informational use only. ${esc(DISCLAIMER)}</p>
</footer>
</body>
</html>`;
}

// ————— 8-digit HSN page (with duty breakdown) —————
export function hsnPage(code, parent6) {
  const example = computeDuty(100000, code);
  const ch = pad2(code.chapter);
  const heading4 = code.hsn.slice(0, 4);
  const title = `HSN ${code.hsn} — ${code.description} — Customs Duty India`;
  const description = `${code.description}. HSN ${code.hsn}: BCD ${code.bcd}%, IGST ${code.igst}%, SWS ${code.sws}% of BCD${code.cess ? `, Cess ${code.cess}%` : ""}. Landed cost on ₹1,00,000 = ${inr(example.landed)}.`;
  const canonical = `${SITE.origin}${hsnUrl(code.hsn)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What is the HSN code for ${code.description}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The HSN code for ${code.description} in India is ${code.hsn}, under Chapter ${ch}.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the customs duty on HSN ${code.hsn}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Under HSN ${code.hsn} (${code.description}): Basic Customs Duty ${code.bcd}%, Social Welfare Surcharge ${code.sws}% of BCD, IGST ${code.igst}%${code.cess ? `, Compensation Cess ${code.cess}%` : ""}. Effective duty on a ₹1,00,000 assessable value is ${example.effectiveRate}%.`,
        },
      },
    ],
  };

  const productsHtml = (code.common_products ?? [])
    .map((p) => `<li>${esc(p)}</li>`)
    .join("");

  const parentLink = parent6
    ? `<a href="${subheadingUrl(parent6.code)}">${parent6.code}</a>`
    : `<span>${code.hsn.slice(0, 6)}</span>`;

  const body = `
<article class="hsn">
  <nav class="crumbs"><a href="/">Home</a> › <a href="${chapterUrl(ch)}">Chapter ${ch}</a> › <a href="${headingUrl(heading4)}">${heading4}</a> › ${parentLink} › <span>${esc(code.hsn)}</span></nav>
  <h1>HSN Code ${esc(code.hsn)}</h1>
  <p class="lead">${esc(code.description)}</p>

  <section class="rates">
    <h2>Customs duty rates</h2>
    <table>
      <tr><th>Basic Customs Duty (BCD)</th><td>${code.bcd}%</td></tr>
      <tr><th>Social Welfare Surcharge (SWS)</th><td>${code.sws}% of BCD</td></tr>
      <tr><th>IGST</th><td>${code.igst}%</td></tr>
      ${code.cess ? `<tr><th>Compensation Cess</th><td>${code.cess}%</td></tr>` : ""}
    </table>
    ${code.notes ? `<p class="note">${esc(code.notes)}</p>` : ""}
  </section>

  <section class="example">
    <h2>Worked example: landed cost on ₹1,00,000 assessable value</h2>
    <table>
      <tr><th>Assessable Value (CIF + 1% landing)</th><td>${inr(example.av)}</td></tr>
      <tr><th>BCD @ ${code.bcd}%</th><td>${inr(example.bcd)}</td></tr>
      <tr><th>SWS @ ${code.sws}% of BCD</th><td>${inr(example.sws)}</td></tr>
      ${code.cess ? `<tr><th>Compensation Cess @ ${code.cess}%</th><td>${inr(example.cess)}</td></tr>` : ""}
      <tr><th>IGST @ ${code.igst}%</th><td>${inr(example.igst)}</td></tr>
      <tr class="total"><th>Total Duty</th><td>${inr(example.totalDuty)}</td></tr>
      <tr class="total"><th>Landed Cost</th><td>${inr(example.landed)}</td></tr>
      <tr><th>Effective Duty Rate</th><td>${example.effectiveRate}%</td></tr>
    </table>
  </section>

  ${productsHtml ? `<section class="products"><h2>Common products under this HSN</h2><ul>${productsHtml}</ul></section>` : ""}

  <section class="about">
    <h2>About HSN ${esc(code.hsn)}</h2>
    <p>HSN (Harmonised System of Nomenclature) code ${esc(code.hsn)} falls under Chapter ${ch} of India's Customs Tariff Act. The first six digits (${esc(code.hsn.slice(0, 6))}) follow the World Customs Organization's global HS 2022 classification; the last two digits are India's national extension.</p>
    <p>For import, declare this 8-digit code on the Bill of Entry in ICEGATE. For GST-registered taxpayers with turnover above ₹5 crore, the 8-digit HSN is also mandatory on B2B invoices.</p>
  </section>
</article>`;

  return layout({ title, description, canonical, bodyHtml: body, jsonLd });
}

// ————— 6-digit subheading page (WCO data + India context) —————
export function subheadingPage(entry, parent4, chapterDesc, sectionName, india8s) {
  const ch = entry.code.slice(0, 2);
  const h4 = entry.code.slice(0, 4);
  const desc = tidy(entry.description);
  const title = `HS ${entry.code} — ${desc} — HSN India`;
  const description = `HS subheading ${entry.code}: ${desc}. India uses 8-digit HSN codes extending this subheading. Chapter ${ch} of the Customs Tariff.`;
  const canonical = `${SITE.origin}${subheadingUrl(entry.code)}`;

  const rows8 = india8s
    .map(
      (c) =>
        `<tr><td><a href="${hsnUrl(c.hsn)}">${c.hsn}</a></td><td>${esc(c.description)}</td><td>${c.bcd}%</td><td>${c.igst}%</td></tr>`,
    )
    .join("");

  const india8Block = india8s.length
    ? `<section class="table-wrap"><h2>India 8-digit HSN codes with duty rates</h2>
      <table class="listing"><thead><tr><th>HSN</th><th>Description</th><th>BCD</th><th>IGST</th></tr></thead><tbody>${rows8}</tbody></table></section>`
    : `<section><h2>India 8-digit HSN codes</h2>
      <p>India extends this 6-digit HS subheading to 8 digits under the Customs Tariff Act Schedule I. A worked 8-digit lookup for this subheading is not yet on ${SITE.name} — check <a href="https://old.cbic.gov.in/htdocs-cbec/customs/custom-tariff" rel="nofollow noopener">CBIC Customs Tariff</a> for the current 8-digit breakdown under ${entry.code}.</p></section>`;

  const body = `
<article>
  <nav class="crumbs"><a href="/">Home</a> › <a href="${sectionUrl(entry.section)}">Section ${entry.section}</a> › <a href="${chapterUrl(ch)}">Ch ${ch}</a> › <a href="${headingUrl(h4)}">${h4}</a> › <span>${entry.code}</span></nav>
  <h1>HS ${esc(entry.code)}</h1>
  <p class="lead">${esc(desc)}</p>
  ${india8Block}
  <section>
    <h2>Classification context</h2>
    <p>Parent heading <a href="${headingUrl(h4)}">${h4}</a> — ${esc(tidy(parent4?.description ?? ""))}. Chapter <a href="${chapterUrl(ch)}">${ch}</a>${chapterDesc ? ` — ${esc(tidy(chapterDesc))}` : ""}. Section <a href="${sectionUrl(entry.section)}">${entry.section}</a> — ${esc(sectionName ?? "")}.</p>
    <p>The first 6 digits (${esc(entry.code)}) are the global WCO Harmonized System 2022 subheading. India extends this to 8 digits for tariff classification.</p>
  </section>
</article>`;
  return layout({ title, description, canonical, bodyHtml: body });
}

// ————— 4-digit heading page —————
export function headingPage(entry, children6, chapterDesc, sectionName) {
  const ch = entry.code.slice(0, 2);
  const desc = tidy(entry.description);
  const title = `HS Heading ${entry.code} — ${desc} — HSN India`;
  const description = `HS heading ${entry.code}: ${desc}. ${children6.length} subheadings under Chapter ${ch} of India's Customs Tariff.`;
  const canonical = `${SITE.origin}${headingUrl(entry.code)}`;

  const rows = children6
    .map(
      (c) =>
        `<tr><td><a href="${subheadingUrl(c.code)}">${c.code}</a></td><td>${esc(tidy(c.description))}</td></tr>`,
    )
    .join("");

  const body = `
<article>
  <nav class="crumbs"><a href="/">Home</a> › <a href="${sectionUrl(entry.section)}">Section ${entry.section}</a> › <a href="${chapterUrl(ch)}">Ch ${ch}</a> › <span>${entry.code}</span></nav>
  <h1>HS ${esc(entry.code)}</h1>
  <p class="lead">${esc(desc)}</p>
  <section class="table-wrap">
    <h2>Subheadings (6-digit)</h2>
    <table class="listing"><thead><tr><th>Code</th><th>Description</th></tr></thead><tbody>${rows}</tbody></table>
  </section>
  <section>
    <h2>Context</h2>
    <p>Chapter <a href="${chapterUrl(ch)}">${ch}</a>${chapterDesc ? ` — ${esc(tidy(chapterDesc))}` : ""}. Section <a href="${sectionUrl(entry.section)}">${entry.section}</a> — ${esc(sectionName ?? "")}.</p>
  </section>
</article>`;
  return layout({ title, description, canonical, bodyHtml: body });
}

// ————— Chapter page —————
export function chapterPage(chapterEntry, children4, sectionName, eightDigitInChapter) {
  const ch = chapterEntry.code;
  const desc = tidy(chapterEntry.description);
  const title = `Chapter ${ch} — ${desc} — HSN Codes India`;
  const description = `All HS headings under Chapter ${ch} of India's Customs Tariff — ${desc}. With links to 6-digit subheadings and 8-digit HSN codes.`;
  const canonical = `${SITE.origin}${chapterUrl(ch)}`;

  const rows = children4
    .map(
      (c) =>
        `<tr><td><a href="${headingUrl(c.code)}">${c.code}</a></td><td>${esc(tidy(c.description))}</td></tr>`,
    )
    .join("");

  const rows8 = eightDigitInChapter
    .map(
      (c) =>
        `<tr><td><a href="${hsnUrl(c.hsn)}">${c.hsn}</a></td><td>${esc(c.description)}</td><td>${c.bcd}%</td><td>${c.igst}%</td></tr>`,
    )
    .join("");

  const eightDigitBlock = eightDigitInChapter.length
    ? `<section class="table-wrap"><h2>8-digit HSN codes with duty rates (in this chapter)</h2>
      <table class="listing"><thead><tr><th>HSN</th><th>Description</th><th>BCD</th><th>IGST</th></tr></thead><tbody>${rows8}</tbody></table></section>`
    : "";

  const body = `
<article>
  <nav class="crumbs"><a href="/">Home</a> › <a href="${sectionUrl(chapterEntry.section)}">Section ${chapterEntry.section}</a> › <span>Chapter ${ch}</span></nav>
  <h1>Chapter ${esc(ch)}</h1>
  <p class="lead">${esc(desc)}</p>
  ${eightDigitBlock}
  <section class="table-wrap">
    <h2>Headings (4-digit)</h2>
    <table class="listing"><thead><tr><th>Code</th><th>Description</th></tr></thead><tbody>${rows}</tbody></table>
  </section>
  <section>
    <h2>Section</h2>
    <p>Chapter ${ch} is part of <a href="${sectionUrl(chapterEntry.section)}">Section ${chapterEntry.section}</a> — ${esc(sectionName ?? "")}.</p>
  </section>
</article>`;
  return layout({ title, description, canonical, bodyHtml: body });
}

// ————— Section page —————
export function sectionPage(sec, sectionName, chaptersInSection) {
  const title = `Section ${sec} — ${sectionName} — HSN India`;
  const description = `Section ${sec} of India's Customs Tariff: ${sectionName}. Chapters and HSN codes.`;
  const canonical = `${SITE.origin}${sectionUrl(sec)}`;

  const rows = chaptersInSection
    .map(
      (c) =>
        `<tr><td><a href="${chapterUrl(c.code)}">${c.code}</a></td><td>${esc(tidy(c.description))}</td></tr>`,
    )
    .join("");

  const body = `
<article>
  <nav class="crumbs"><a href="/">Home</a> › <a href="/sections/">Sections</a> › <span>Section ${sec}</span></nav>
  <h1>Section ${esc(sec)}</h1>
  <p class="lead">${esc(sectionName)}</p>
  <section class="table-wrap">
    <h2>Chapters in this section</h2>
    <table class="listing"><thead><tr><th>Chapter</th><th>Description</th></tr></thead><tbody>${rows}</tbody></table>
  </section>
</article>`;
  return layout({ title, description, canonical, bodyHtml: body });
}

// ————— Home —————
export function homePage(india8s, chapters, sections) {
  const title = `${SITE.name} — ${SITE.tagline}`;
  const description = SITE.description;
  const canonical = SITE.origin + "/";

  const popular = india8s
    .slice(0, 20)
    .map(
      (c) =>
        `<li><a href="${hsnUrl(c.hsn)}"><strong>${c.hsn}</strong> — ${esc(c.description)}</a></li>`,
    )
    .join("");

  const sectionsList = sections
    .map(
      (s) =>
        `<li><a href="${sectionUrl(s.section)}"><strong>Sec ${s.section}</strong> — ${esc(tidy(s.name))}</a></li>`,
    )
    .join("");

  const body = `
<section class="hero">
  <h1>Indian HSN code & customs duty lookup</h1>
  <p class="lead">BCD, IGST, SWS and cess for Indian HSN codes — with a worked landed-cost example on ₹1,00,000. Plus the full WCO HS 2022 classification tree.</p>
</section>
<section>
  <h2>Popular 8-digit HSN codes (with duty rates)</h2>
  <ul class="code-list">${popular}</ul>
</section>
<section>
  <h2>Browse all 21 sections</h2>
  <ul class="code-list">${sectionsList}</ul>
  <p><a href="/chapters/">See all 97 chapters →</a></p>
</section>`;

  return layout({ title, description, canonical, bodyHtml: body });
}

// ————— About —————
export function aboutPage() {
  const title = `About ${SITE.name}`;
  const description = `About ${SITE.name}, data sources, update cadence and disclaimer.`;
  const canonical = SITE.origin + "/about/";
  const body = `
<article>
  <h1>About ${SITE.name}</h1>
  <p>${SITE.name} is a free reference for Indian HSN codes and customs duty rates. The site covers the full WCO Harmonized System 2022 classification tree (21 sections, 97 chapters, ~1,200 headings, ~5,600 subheadings) with India-specific 8-digit HSN codes and duty rates layered on top.</p>
  <h2>Data sources</h2>
  <ul>
    <li>HS 2-/4-/6-digit nomenclature: <strong>World Customs Organization (WCO) Harmonized System 2022</strong>, via <a href="https://github.com/datasets/harmonized-system" rel="nofollow noopener">datasets/harmonized-system</a> (ODC-PDDL public domain).</li>
    <li>8-digit HSN classifications: <strong>ITC(HS) 2022 Schedule 1</strong>, published by the Directorate General of Foreign Trade (DGFT).</li>
    <li>Rate structure: <strong>Customs Tariff Act Schedule I</strong>, as amended by the Finance Act and CBIC notifications.</li>
    <li>GST rate: <strong>CBIC GST Rate Schedule</strong>.</li>
  </ul>
  <h2>Update cadence</h2>
  <p>Rates are reviewed after every CBIC rate-change notification and on each Finance Act.</p>
  <h2>Disclaimer</h2>
  <p>${DISCLAIMER}</p>
</article>`;
  return layout({ title, description, canonical, bodyHtml: body });
}

// ————— Chapters index —————
export function chaptersIndexPage(chapters) {
  const title = `All Chapters — HSN Codes India — ${SITE.name}`;
  const description = `All 97 chapters of India's Customs Tariff (HS 2022), with HSN codes and duty rates.`;
  const canonical = SITE.origin + "/chapters/";

  const items = chapters
    .map(
      (c) =>
        `<li><a href="${chapterUrl(c.code)}"><strong>Chapter ${c.code}</strong> — ${esc(tidy(c.description))}</a></li>`,
    )
    .join("");

  const body = `
<article>
  <nav class="crumbs"><a href="/">Home</a> › <span>Chapters</span></nav>
  <h1>All chapters</h1>
  <ul class="code-list">${items}</ul>
</article>`;
  return layout({ title, description, canonical, bodyHtml: body });
}

// ————— Sections index —————
export function sectionsIndexPage(sections) {
  const title = `All Sections — HSN Codes India — ${SITE.name}`;
  const description = `All 21 sections of India's Customs Tariff (HS 2022).`;
  const canonical = SITE.origin + "/sections/";
  const items = sections
    .map(
      (s) =>
        `<li><a href="${sectionUrl(s.section)}"><strong>Section ${s.section}</strong> — ${esc(tidy(s.name))}</a></li>`,
    )
    .join("");
  const body = `
<article>
  <nav class="crumbs"><a href="/">Home</a> › <span>Sections</span></nav>
  <h1>All sections</h1>
  <ul class="code-list">${items}</ul>
</article>`;
  return layout({ title, description, canonical, bodyHtml: body });
}

export function sitemapXml(urls) {
  const items = urls
    .map(
      (u) =>
        `<url><loc>${SITE.origin}${u}</loc><changefreq>weekly</changefreq></url>`,
    )
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</urlset>`;
}

export function robotsTxt() {
  return `User-agent: *\nAllow: /\nSitemap: ${SITE.origin}/sitemap.xml\n`;
}
