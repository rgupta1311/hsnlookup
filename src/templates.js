import { SITE, DISCLAIMER } from "./site.js";
import { computeDuty, inr } from "./duty.js";
import { pad2 } from "./loadHS.js";

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

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

const searchIcon = `<svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 3.362 9.848l3.145 3.146a.75.75 0 1 0 1.06-1.06l-3.145-3.146A5.5 5.5 0 0 0 9 3.5ZM5 9a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z" clip-rule="evenodd"/></svg>`;

function searchBarHtml({ placeholder = "Search HSN code or product (e.g. 8517, smartphone, laptop)…", autofocus = false } = {}) {
  return `
<div class="search-wrap">
  ${searchIcon}
  <input type="search" class="search-input" id="hsn-search"
    placeholder="${esc(placeholder)}"
    autocomplete="off" spellcheck="false"${autofocus ? " autofocus" : ""}>
  <span class="search-hint">↵</span>
  <div class="search-results" id="hsn-search-results" role="listbox"></div>
</div>`;
}

function layout({ title, description, canonical, bodyHtml, jsonLd, includeSearch = true }) {
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
<meta name="theme-color" content="#2563eb">
<link rel="preconnect" href="https://rsms.me/" crossorigin>
<link rel="stylesheet" href="https://rsms.me/inter/inter.css">
<link rel="stylesheet" href="/assets/style.css">
${ld}
</head>
<body>
<header class="site-header">
  <div class="site-header-inner">
    <a href="/" class="logo"><span class="logo-mark">हS</span>${SITE.name}</a>
    <nav>
      <a href="/chapters/">Chapters</a>
      <a href="/sections/">Sections</a>
      <a href="/about/">About</a>
    </nav>
  </div>
</header>
<main>${bodyHtml}</main>
<footer class="site-footer">
  <p>© ${SITE.copyrightYear} ${SITE.name} · Informational use only</p>
  <p>${esc(DISCLAIMER)}</p>
</footer>
${includeSearch ? '<script src="/assets/search.js" defer></script>' : ""}
</body>
</html>`;
}

// ————— 8-digit HSN page —————
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

  const rateCards = `
<div class="rates-grid">
  <div class="rate-card"><div class="rate-card-label">BCD</div><div class="rate-card-val">${code.bcd}%</div><div class="rate-card-sub">Basic Customs Duty</div></div>
  <div class="rate-card"><div class="rate-card-label">IGST</div><div class="rate-card-val">${code.igst}%</div><div class="rate-card-sub">Integrated GST</div></div>
  <div class="rate-card"><div class="rate-card-label">SWS</div><div class="rate-card-val">${code.sws}%</div><div class="rate-card-sub">of BCD</div></div>
  ${code.cess ? `<div class="rate-card"><div class="rate-card-label">Cess</div><div class="rate-card-val">${code.cess}%</div><div class="rate-card-sub">Comp. Cess</div></div>` : ""}
  <div class="rate-card" style="background:var(--brand-soft); border-color:var(--brand);"><div class="rate-card-label" style="color:var(--brand-dark)">Effective</div><div class="rate-card-val" style="color:var(--brand-dark)">${example.effectiveRate}%</div><div class="rate-card-sub">All-in duty rate</div></div>
</div>`;

  const body = `
<article class="hsn">
  <nav class="crumbs"><a href="/">Home</a><span class="sep">›</span><a href="${chapterUrl(ch)}">Ch ${ch}</a><span class="sep">›</span><a href="${headingUrl(heading4)}">${heading4}</a><span class="sep">›</span>${parentLink}<span class="sep">›</span><span>${esc(code.hsn)}</span></nav>
  <div class="hsn-hero">
    <span class="hsn-code">${esc(code.hsn)}</span>
    <h1>${esc(code.description)}</h1>
    <p class="lead">Customs duty and landed-cost breakdown for Indian imports under HSN ${esc(code.hsn)}.</p>
  </div>

  <section>
    <h2>Duty rates at a glance</h2>
    ${rateCards}
    ${code.notes ? `<p class="note">${esc(code.notes)}</p>` : ""}
  </section>

  <section class="example-block">
    <h2>Worked example · ₹1,00,000 assessable value</h2>
    <table>
      <tr><td>Assessable Value (CIF + 1% landing)</td><td class="num">${inr(example.av)}</td></tr>
      <tr><td>BCD @ ${code.bcd}%</td><td class="num">${inr(example.bcd)}</td></tr>
      <tr><td>SWS @ ${code.sws}% of BCD</td><td class="num">${inr(example.sws)}</td></tr>
      ${code.cess ? `<tr><td>Compensation Cess @ ${code.cess}%</td><td class="num">${inr(example.cess)}</td></tr>` : ""}
      <tr><td>IGST @ ${code.igst}%</td><td class="num">${inr(example.igst)}</td></tr>
      <tr class="total"><td>Total Duty</td><td class="num">${inr(example.totalDuty)}</td></tr>
      <tr class="total"><td>Landed Cost</td><td class="num">${inr(example.landed)}</td></tr>
    </table>
  </section>

  ${productsHtml ? `<section class="products"><h2>Common products</h2><ul>${productsHtml}</ul></section>` : ""}

  <section>
    <h2>About HSN ${esc(code.hsn)}</h2>
    <p>HSN (Harmonised System of Nomenclature) code ${esc(code.hsn)} falls under Chapter ${ch} of India's Customs Tariff Act. The first six digits (${esc(code.hsn.slice(0, 6))}) follow the World Customs Organization's global HS 2022 classification; the last two digits are India's national extension.</p>
    <p>For import, declare this 8-digit code on the Bill of Entry in ICEGATE. For GST-registered taxpayers with turnover above ₹5 crore, the 8-digit HSN is also mandatory on B2B invoices.</p>
  </section>
</article>`;

  return layout({ title, description, canonical, bodyHtml: body, jsonLd });
}

// ————— 6-digit subheading page —————
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
        `<tr><td><a href="${hsnUrl(c.hsn)}">${c.hsn}</a></td><td>${esc(c.description)}</td><td class="num">${c.bcd}%</td><td class="num">${c.igst}%</td></tr>`,
    )
    .join("");

  const india8Block = india8s.length
    ? `<div class="table-wrap"><h2>India 8-digit HSN codes with duty rates</h2>
      <table class="listing"><thead><tr><th>HSN</th><th>Description</th><th class="num">BCD</th><th class="num">IGST</th></tr></thead><tbody>${rows8}</tbody></table></div>`
    : `<section><h2>India 8-digit HSN codes</h2>
      <p>India extends this 6-digit HS subheading to 8 digits under the Customs Tariff Act Schedule I. A worked 8-digit lookup for this subheading is not yet on ${SITE.name} — check <a href="https://old.cbic.gov.in/htdocs-cbec/customs/custom-tariff" rel="nofollow noopener">CBIC Customs Tariff</a> for the current 8-digit breakdown under ${entry.code}.</p></section>`;

  const body = `
<article>
  <nav class="crumbs"><a href="/">Home</a><span class="sep">›</span><a href="${sectionUrl(entry.section)}">Section ${entry.section}</a><span class="sep">›</span><a href="${chapterUrl(ch)}">Ch ${ch}</a><span class="sep">›</span><a href="${headingUrl(h4)}">${h4}</a><span class="sep">›</span><span>${entry.code}</span></nav>
  <div class="hsn-hero">
    <span class="hsn-code">${esc(entry.code)}</span>
    <h1>${esc(desc)}</h1>
    <p class="lead">6-digit HS subheading · WCO Harmonized System 2022</p>
  </div>

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
  <nav class="crumbs"><a href="/">Home</a><span class="sep">›</span><a href="${sectionUrl(entry.section)}">Section ${entry.section}</a><span class="sep">›</span><a href="${chapterUrl(ch)}">Ch ${ch}</a><span class="sep">›</span><span>${entry.code}</span></nav>
  <div class="hsn-hero">
    <span class="hsn-code">${esc(entry.code)}</span>
    <h1>${esc(desc)}</h1>
    <p class="lead">${children6.length} subheadings · HS heading under Chapter ${ch}</p>
  </div>

  <div class="table-wrap">
    <h2>Subheadings (6-digit)</h2>
    <table class="listing"><thead><tr><th>Code</th><th>Description</th></tr></thead><tbody>${rows}</tbody></table>
  </div>

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
        `<tr><td><a href="${hsnUrl(c.hsn)}">${c.hsn}</a></td><td>${esc(c.description)}</td><td class="num">${c.bcd}%</td><td class="num">${c.igst}%</td></tr>`,
    )
    .join("");

  const eightDigitBlock = eightDigitInChapter.length
    ? `<div class="table-wrap"><h2>8-digit HSN codes with duty rates (in this chapter)</h2>
      <table class="listing"><thead><tr><th>HSN</th><th>Description</th><th class="num">BCD</th><th class="num">IGST</th></tr></thead><tbody>${rows8}</tbody></table></div>`
    : "";

  const body = `
<article>
  <nav class="crumbs"><a href="/">Home</a><span class="sep">›</span><a href="${sectionUrl(chapterEntry.section)}">Section ${chapterEntry.section}</a><span class="sep">›</span><span>Chapter ${ch}</span></nav>
  <div class="hsn-hero">
    <span class="hsn-code">Ch ${esc(ch)}</span>
    <h1>${esc(desc)}</h1>
    <p class="lead">${children4.length} headings · ${eightDigitInChapter.length} India 8-digit HSN codes with duty rates</p>
  </div>

  ${eightDigitBlock}

  <div class="table-wrap">
    <h2>Headings (4-digit)</h2>
    <table class="listing"><thead><tr><th>Code</th><th>Description</th></tr></thead><tbody>${rows}</tbody></table>
  </div>

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
  <nav class="crumbs"><a href="/">Home</a><span class="sep">›</span><a href="/sections/">Sections</a><span class="sep">›</span><span>Section ${sec}</span></nav>
  <div class="hsn-hero">
    <span class="hsn-code">Sec ${esc(sec)}</span>
    <h1>${esc(tidy(sectionName))}</h1>
    <p class="lead">${chaptersInSection.length} chapters in this section</p>
  </div>
  <div class="table-wrap">
    <h2>Chapters in this section</h2>
    <table class="listing"><thead><tr><th>Chapter</th><th>Description</th></tr></thead><tbody>${rows}</tbody></table>
  </div>
</article>`;
  return layout({ title, description, canonical, bodyHtml: body });
}

// ————— Home —————
export function homePage(india8s, chapters, sections, stats) {
  const title = `${SITE.name} — ${SITE.tagline}`;
  const description = SITE.description;
  const canonical = SITE.origin + "/";

  const popular = india8s
    .slice(0, 12)
    .map(
      (c) =>
        `<li><a href="${hsnUrl(c.hsn)}"><strong>${c.hsn}</strong> <span>${esc(c.description)}</span></a></li>`,
    )
    .join("");

  const sectionsList = sections
    .map(
      (s) =>
        `<li><a href="${sectionUrl(s.section)}"><strong>Sec ${s.section}</strong> <span>${esc(tidy(s.name))}</span></a></li>`,
    )
    .join("");

  const body = `
<section class="hero">
  <span class="eyebrow">Indian Customs Tariff · HS 2022</span>
  <h1>Find any HSN code. See the real duty.</h1>
  <p class="lead">BCD, IGST, SWS and cess for Indian imports — plus a worked landed-cost calculator on ₹1,00,000, for every 8-digit code.</p>
  ${searchBarHtml({ autofocus: false })}
  <div class="stats">
    <div class="stat"><div class="stat-val">${stats.sections}</div><div class="stat-label">Sections</div></div>
    <div class="stat"><div class="stat-val">${stats.chapters}</div><div class="stat-label">Chapters</div></div>
    <div class="stat"><div class="stat-val">${stats.subheadings.toLocaleString("en-IN")}</div><div class="stat-label">HS subheadings</div></div>
    <div class="stat"><div class="stat-val">${stats.india8}</div><div class="stat-label">With duty rates</div></div>
  </div>
</section>
<section>
  <h2>Popular 8-digit HSN codes</h2>
  <ul class="code-list">${popular}</ul>
</section>
<section>
  <h2>Browse all 21 sections</h2>
  <ul class="code-list">${sectionsList}</ul>
  <p style="margin-top:14px;"><a href="/chapters/">See all ${stats.chapters} chapters →</a></p>
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
  <p class="lead">A free, fast reference for Indian HSN codes and customs duty. Built for importers, customs brokers, CAs, and freight forwarders.</p>
  <section>
    <h2>What's on this site</h2>
    <p>The full WCO Harmonized System 2022 classification tree — 21 sections, 97 chapters, ~1,200 4-digit headings, ~5,600 6-digit subheadings — with India-specific 8-digit HSN codes and duty rates layered on top, and a worked landed-cost calculator on every code page.</p>
  </section>
  <section>
    <h2>Data sources</h2>
    <ul>
      <li>HS 2-/4-/6-digit nomenclature: <strong>World Customs Organization (WCO) Harmonized System 2022</strong>, via <a href="https://github.com/datasets/harmonized-system" rel="nofollow noopener">datasets/harmonized-system</a> (ODC-PDDL public domain).</li>
      <li>8-digit HSN classifications: <strong>ITC(HS) 2022 Schedule 1</strong>, published by the Directorate General of Foreign Trade (DGFT).</li>
      <li>Rate structure: <strong>Customs Tariff Act Schedule I</strong>, as amended by the Finance Act and CBIC notifications.</li>
      <li>GST rate: <strong>CBIC GST Rate Schedule</strong>.</li>
    </ul>
  </section>
  <section>
    <h2>Update cadence</h2>
    <p>Rates are reviewed after every CBIC rate-change notification and on each Finance Act.</p>
  </section>
  <section>
    <h2>Disclaimer</h2>
    <p>${DISCLAIMER}</p>
  </section>
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
        `<li><a href="${chapterUrl(c.code)}"><strong>Ch ${c.code}</strong> <span>${esc(tidy(c.description))}</span></a></li>`,
    )
    .join("");

  const body = `
<article>
  <nav class="crumbs"><a href="/">Home</a><span class="sep">›</span><span>Chapters</span></nav>
  <h1>All chapters</h1>
  <p class="lead">${chapters.length} chapters of India's Customs Tariff.</p>
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
        `<li><a href="${sectionUrl(s.section)}"><strong>Sec ${s.section}</strong> <span>${esc(tidy(s.name))}</span></a></li>`,
    )
    .join("");
  const body = `
<article>
  <nav class="crumbs"><a href="/">Home</a><span class="sep">›</span><span>Sections</span></nav>
  <h1>All sections</h1>
  <p class="lead">21 sections of the HS 2022 classification.</p>
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
