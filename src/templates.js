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

// Short chapter-context paragraph. Surfaces on every HSN page for
// on-topic relevance and to lift thin pages over the ~500-word bar
// that Google and AdSense look for. Covers all 97 chapters with a
// one-paragraph description of what the chapter covers and the
// typical tariff pattern for it.
function chapterContextBlurb(chapterNum) {
  const map = {
    1: "Chapter 1 covers live animals. Imports are tightly regulated with a 30% statutory BCD; genuine imports are usually for zoos, research or specific breeding stock under end-use notifications.",
    2: "Chapter 2 covers meat and edible meat offal. BCD is 30% statutory; imports require FSSAI registration and sanitary certification from the exporting country.",
    3: "Chapter 3 covers fish, crustaceans and molluscs. Rates vary by species; live seafood for aquaculture often gets concessional rates under end-use notifications.",
    4: "Chapter 4 covers dairy, eggs, honey and edible products of animal origin. BCD on dairy imports is among the highest in the tariff (often 30-60%) to protect domestic dairy.",
    5: "Chapter 5 covers unlisted products of animal origin — bones, horns, feathers, insect extracts. Rates typically 2.5%-10%.",
    6: "Chapter 6 covers live trees, plants, bulbs and cut flowers. Typically 10%-30% BCD; phytosanitary certification required.",
    7: "Chapter 7 covers edible vegetables and certain roots. Pulses and specific vegetables often have nil BCD under special notifications to manage food security.",
    8: "Chapter 8 covers edible fruits and nuts. BCD ranges from 30% to 100%+ depending on the item; walnuts and areca nuts are among the highest-tariffed.",
    9: "Chapter 9 covers coffee, tea, spices. BCD on tea and spices is often 100% to protect India's own plantation economy.",
    10: "Chapter 10 covers cereals. Most have 0% BCD; a few have state-trading restrictions under DGFT.",
    11: "Chapter 11 covers milling products — flour, starch, wheat gluten. BCD typically 30%.",
    12: "Chapter 12 covers oilseeds, grains, industrial plants, fodder. Mixed rates; crude oils for processing often get concessions.",
    13: "Chapter 13 covers gums, resins and vegetable saps. Low BCD (usually 5-15%) as most are industrial inputs.",
    14: "Chapter 14 covers other vegetable products — coir, bamboo, straws. BCD usually 10%-30%.",
    15: "Chapter 15 covers animal and vegetable fats and oils. BCD on refined edible oils is among the highest (up to 45%) to protect domestic refining.",
    16: "Chapter 16 covers meat and fish preparations. BCD typically 30%; shelf-stable products attract FSSAI approval.",
    17: "Chapter 17 covers sugars and sugar confectionery. BCD typically 30%-60%; white sugar has import management measures.",
    18: "Chapter 18 covers cocoa and chocolate. BCD 30% on finished chocolate, lower on cocoa inputs.",
    19: "Chapter 19 covers cereal, flour and milk preparations. BCD typically 30% on finished food products.",
    20: "Chapter 20 covers prepared vegetables, fruits and nuts. BCD typically 30%.",
    21: "Chapter 21 covers miscellaneous edible preparations — instant coffee, yeast, ice cream. BCD typically 30%.",
    22: "Chapter 22 covers beverages, spirits and vinegar. BCD on alcoholic beverages is among the highest in any tariff schedule in the world — 100% on beer, 150% on wine and spirits. No IGST applies (state excise instead).",
    23: "Chapter 23 covers residues and animal feed. BCD typically 30% on finished feed, lower on industrial residues.",
    24: "Chapter 24 covers tobacco products. BCD 30%, plus high IGST (28%) and specific per-stick cess on cigarettes.",
    25: "Chapter 25 covers salt, sulphur, earths, stones and cement. BCD typically 5%.",
    26: "Chapter 26 covers ores, slag and ash. BCD 2.5%-5%; India exports many of these rather than imports.",
    27: "Chapter 27 covers mineral fuels, oils and distillation products. Crude petroleum attracts specific-duty structures outside the normal stack; petroleum products are outside GST.",
    28: "Chapter 28 covers inorganic chemicals. BCD typically 7.5%.",
    29: "Chapter 29 covers organic chemicals. BCD typically 7.5%; active pharmaceutical ingredients get concessional rates under pharma notifications.",
    30: "Chapter 30 covers pharmaceutical products. BCD 10% on finished formulations; specific life-saving drugs get nil BCD under notification.",
    31: "Chapter 31 covers fertilizers. BCD typically 5%-7.5%; potash and urea import is often under state-trading regime.",
    32: "Chapter 32 covers tanning and dyeing extracts, pigments, paints. BCD typically 10%.",
    33: "Chapter 33 covers essential oils, perfumes, cosmetics. BCD 20%; IGST 18%-28%; CDSCO registration required for cosmetics.",
    34: "Chapter 34 covers soap, washing preparations, candles, waxes. BCD typically 10%.",
    35: "Chapter 35 covers albuminoidal substances, glues and enzymes. BCD typically 10%.",
    36: "Chapter 36 covers explosives and matches. BCD typically 10%; import licences required for explosives.",
    37: "Chapter 37 covers photographic and cinematographic goods. BCD typically 10%.",
    38: "Chapter 38 covers miscellaneous chemical products — lubricants, additives, pesticides. BCD typically 7.5%.",
    39: "Chapter 39 covers plastics and articles thereof. BCD typically 10% on resins, higher on finished products.",
    40: "Chapter 40 covers rubber and articles. Natural rubber attracts specific duty; finished rubber products typically 10% BCD.",
    41: "Chapter 41 covers hides and skins (other than fur). BCD typically 10% on raw, higher on finished leather.",
    42: "Chapter 42 covers articles of leather — handbags, wallets, luggage. BCD 20% on finished goods.",
    43: "Chapter 43 covers furskins and artificial fur. BCD typically 10%-20%.",
    44: "Chapter 44 covers wood and articles of wood. BCD typically 10%; teak and specific hardwoods have CITES-regulated origin rules.",
    45: "Chapter 45 covers cork and articles thereof. BCD typically 25%.",
    46: "Chapter 46 covers basketware and wickerwork. BCD typically 25%.",
    47: "Chapter 47 covers pulp of wood and cellulosic fibrous material. BCD typically 5% (industry input).",
    48: "Chapter 48 covers paper and paperboard. Newsprint attracts concessional 5% BCD; other paper 10%.",
    49: "Chapter 49 covers printed books, newspapers and pictures. Printed books are nil-rated for both BCD and IGST to keep education materials affordable.",
    50: "Chapter 50 covers silk. BCD typically 10% on raw silk; higher on finished silk fabrics.",
    51: "Chapter 51 covers wool, fine or coarse animal hair, horsehair. BCD typically 10%.",
    52: "Chapter 52 covers cotton and cotton fabrics. BCD typically 10%; cotton is strategically protected.",
    53: "Chapter 53 covers other vegetable textile fibres — jute, flax, hemp. BCD typically 10%.",
    54: "Chapter 54 covers man-made filaments — polyester, nylon, viscose. BCD typically 10% on fibre, higher on finished fabric.",
    55: "Chapter 55 covers man-made staple fibres. BCD typically 10%.",
    56: "Chapter 56 covers wadding, felt, nonwovens, cordage. BCD typically 10%.",
    57: "Chapter 57 covers carpets and floor coverings. BCD 20%.",
    58: "Chapter 58 covers special woven fabrics, lace, embroidery. BCD typically 10%.",
    59: "Chapter 59 covers impregnated, coated or laminated textiles. BCD typically 10%.",
    60: "Chapter 60 covers knitted or crocheted fabrics. BCD typically 10%.",
    61: "Chapter 61 covers apparel, knitted or crocheted. BCD 20% to protect domestic garment manufacturing; FTA origins (SAARC, ASEAN, UK) have preferential rates.",
    62: "Chapter 62 covers apparel, not knitted or crocheted. BCD 20% same as Chapter 61.",
    63: "Chapter 63 covers other made-up textile articles — bed linen, curtains, rags. BCD 20%.",
    64: "Chapter 64 covers footwear. BCD 35% — high to protect the Indian footwear industry (Agra, Kanpur clusters).",
    65: "Chapter 65 covers headgear. BCD 20%.",
    66: "Chapter 66 covers umbrellas, walking sticks, whips. BCD 20%.",
    67: "Chapter 67 covers prepared feathers, artificial flowers. BCD 20%.",
    68: "Chapter 68 covers articles of stone, plaster, cement. BCD 10%.",
    69: "Chapter 69 covers ceramic products. BCD 10%.",
    70: "Chapter 70 covers glass and glassware. BCD 10%.",
    71: "Chapter 71 covers pearls, precious stones, precious metals. Gold and silver have specific concessional rates (15% on gold, 10% on silver bars) that are politically sensitive and change frequently.",
    72: "Chapter 72 covers iron and steel. BCD typically 7.5%; many specific steel grades have anti-dumping duties on imports from China, Korea, Vietnam.",
    73: "Chapter 73 covers articles of iron and steel. BCD typically 10%.",
    74: "Chapter 74 covers copper and articles. BCD typically 7.5% on raw, 10% on finished.",
    75: "Chapter 75 covers nickel and articles. BCD typically 5%.",
    76: "Chapter 76 covers aluminium and articles. BCD typically 7.5% on primary, 10% on finished.",
    78: "Chapter 78 covers lead and articles. BCD typically 5%.",
    79: "Chapter 79 covers zinc and articles. BCD typically 5%.",
    80: "Chapter 80 covers tin and articles. BCD typically 5%.",
    81: "Chapter 81 covers other base metals, cermets. BCD typically 5%.",
    82: "Chapter 82 covers tools, implements, cutlery. BCD 10%.",
    83: "Chapter 83 covers miscellaneous articles of base metal. BCD 10%.",
    84: "Chapter 84 covers nuclear reactors, boilers, machinery and mechanical appliances. Most industrial machinery is at 7.5% BCD; specific items under project-import notifications get lower rates. Consumer appliances (fridges, washing machines) are at 20%.",
    85: "Chapter 85 covers electrical machinery and equipment. Consumer electronics (smartphones, routers) are at 20% BCD; ITA-1 goods (laptops, components) are at 0%; displays, Li-ion batteries and solar equipment have specific rates.",
    86: "Chapter 86 covers railway and tramway equipment. BCD 10%-25% depending on item.",
    87: "Chapter 87 covers vehicles other than railway. CBU cars attract 70% BCD + 22% cess + 28% IGST — one of the highest auto tariffs globally. SKD/CKD units get lower BCD.",
    88: "Chapter 88 covers aircraft and spacecraft. BCD typically 2.5% — kept low because India imports most commercial aviation.",
    89: "Chapter 89 covers ships, boats and floating structures. BCD typically 5%.",
    90: "Chapter 90 covers optical, photographic, measuring and medical instruments. BCD 10%; medical devices often have end-use concessions.",
    91: "Chapter 91 covers clocks and watches. BCD 20%.",
    92: "Chapter 92 covers musical instruments. BCD 10%.",
    93: "Chapter 93 covers arms and ammunition. BCD 10% but imports require home-ministry licence.",
    94: "Chapter 94 covers furniture, bedding, lamps. BCD 25% on finished furniture.",
    95: "Chapter 95 covers toys, games and sports requisites. BCD 70% on toys since 2023 (protective tariff); game consoles at 20%.",
    96: "Chapter 96 covers miscellaneous manufactured articles — pens, lighters, brushes. BCD 20%.",
    97: "Chapter 97 covers works of art, collectors' pieces and antiques. BCD 10%; antiques over 100 years old are exempt.",
  };
  return map[chapterNum] || `Chapter ${pad2(chapterNum)} of India's Customs Tariff Act Schedule I.`;
}

function verificationBlock(code) {
  // Support both the old flat schema and the new per-field schema.
  const v = code.verification || {};
  const igstSource = v.igst || (code.verificationStatus === "confirmed-45-2025" ? "notif-45-2025" : "inherited");
  const bcdSource = v.bcd || (code.verificationStatus === "confirmed-45-2025" ? "notif-45-2025" : "statutory");
  const asOf = v.asOf || code.asOf || "2026-04-24";

  const igstBadge =
    igstSource === "cleartax-cbic-gst"
      ? `<span class="verify-badge verify-confirmed">IGST verified against CBIC GST rate schedule</span>`
      : igstSource === "notif-45-2025"
        ? `<span class="verify-badge verify-confirmed">IGST confirmed via Notification 45/2025-Customs</span>`
        : `<span class="verify-badge verify-statutory">IGST — inherited</span>`;

  const bcdBadge =
    bcdSource === "manual"
      ? `<span class="verify-badge verify-confirmed">BCD hand-reviewed</span>`
      : bcdSource === "notif-45-2025"
        ? `<span class="verify-badge verify-confirmed">BCD confirmed via Notification 45/2025-Customs</span>`
        : `<span class="verify-badge verify-statutory">BCD — chapter-default statutory estimate</span>`;

  const igstExplainer =
    igstSource === "cleartax-cbic-gst"
      ? `<p>IGST rate is cross-checked against CBIC's GST rate schedule for Chapter ${pad2(code.chapter)}, via the Cleartax HSN compilation (which maintains CBIC notifications current).</p>`
      : "";

  const bcdExplainer =
    bcdSource === "chapter-default"
      ? `<p>BCD shown is the commonly-cited First Schedule statutory rate for Chapter ${pad2(code.chapter)}. The Customs Tariff Act First Schedule is not freely machine-readable; specific tariff lines can attract lower rates via CBIC notifications or higher rates via trade-remedy duties. Before filing a Bill of Entry, <a href="https://www.cbic.gov.in/" rel="nofollow noopener">verify BCD against the current CBIC notification</a> for this HSN.</p>`
      : bcdSource === "manual"
        ? `<p>BCD rate for this HSN is hand-curated from CBIC notifications, the First Schedule of the Customs Tariff Act, and recent Finance Act amendments. Last hand-review: ${asOf}.</p>`
        : "";

  const specific = code.notes_verification
    ? `<p class="note">${esc(code.notes_verification)}</p>`
    : "";

  return `<div class="verify-badges">${igstBadge} ${bcdBadge}</div><div class="verify-body">${igstExplainer}${bcdExplainer}${specific}<p class="verify-asof">Rates as last reviewed: <time datetime="${asOf}">${asOf}</time>. See the <a href="/about/">About page</a> for full source list and refresh process.</p></div>`;
}

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

function layout({ title, description, canonical, bodyHtml, jsonLd, includeSearch = true, extraHeadHtml = "" }) {
  const ldArr = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];
  const ld = ldArr
    .map((l) => `<script type="application/ld+json">${JSON.stringify(l)}</script>`)
    .join("\n");
  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${esc(canonical)}">
<link rel="alternate" hreflang="en-IN" href="${esc(canonical)}">
<link rel="alternate" hreflang="en" href="${esc(canonical)}">
<link rel="alternate" hreflang="x-default" href="${esc(canonical)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large">
<meta name="theme-color" content="#2563eb">
<link rel="preconnect" href="https://rsms.me/" crossorigin>
<link rel="stylesheet" href="https://rsms.me/inter/inter.css">
<link rel="stylesheet" href="/assets/style.css">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7399885309804978" crossorigin="anonymous"></script>
${ld}
${extraHeadHtml}
</head>
<body>
<header class="site-header">
  <div class="site-header-inner">
    <a href="/" class="logo"><span class="logo-mark">हS</span>${SITE.name}</a>
    <nav>
      <a href="/calculator/">Calculator</a>
      <a href="/duty/">Duty by product</a>
      <a href="/guide/customs-duty/">Guide</a>
      <a href="/chapters/">Chapters</a>
      <a href="/about/">About</a>
    </nav>
  </div>
</header>
<main>${bodyHtml}</main>
<footer class="site-footer">
  <p>© ${SITE.copyrightYear} ${SITE.name} · Informational use only · <a href="/about/">About</a> · <a href="/contact/">Contact</a> · <a href="/privacy/">Privacy</a></p>
  <p>${esc(DISCLAIMER)}</p>
</footer>
${includeSearch ? '<script src="/assets/search.js" defer></script>' : ""}
</body>
</html>`;
}

// ————— 8-digit HSN page —————
export function hsnPage(code, parent6, productSlug = null, siblings = []) {
  const example = computeDuty(100000, code);
  const ch = pad2(code.chapter);
  const heading4 = code.hsn.slice(0, 4);
  const shortDesc = code.description.length > 50 ? code.description.slice(0, 47) + "…" : code.description;
  const title = `HSN ${code.hsn} ${shortDesc} — ${example.effectiveRate}% Customs Duty India`;
  const description = `Customs duty on HSN ${code.hsn} (${code.description}) in India: ${example.effectiveRate}% effective rate. BCD ${code.bcd}%, IGST ${code.igst}%, SWS ${code.sws}% of BCD${code.cess ? `, Cess ${code.cess}%` : ""}. Landed cost on ₹1,00,000 CIF = ${inr(example.landed)}.`;
  const canonical = `${SITE.origin}${hsnUrl(code.hsn)}`;

  const faqJsonLd = {
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

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.origin + "/" },
      { "@type": "ListItem", position: 2, name: `Chapter ${ch}`, item: `${SITE.origin}${chapterUrl(ch)}` },
      { "@type": "ListItem", position: 3, name: `Heading ${heading4}`, item: `${SITE.origin}${headingUrl(heading4)}` },
      { "@type": "ListItem", position: 4, name: `HSN ${code.hsn}`, item: canonical },
    ],
  };

  const jsonLd = [faqJsonLd, breadcrumbJsonLd];

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

  // Landed-cost tiers at 5 realistic CIF values. Gives users a quick
  // read on what duty looks like at different import sizes without
  // forcing them into the calculator. Also bulks up the page with
  // genuinely useful numeric content.
  const tiers = [10000, 50000, 100000, 500000, 1000000];
  const tiersTableRows = tiers
    .map((cif) => {
      const ex = computeDuty(cif, code);
      return `<tr><td class="num">${inr(cif)}</td><td class="num">${inr(ex.totalDuty)}</td><td class="num">${inr(ex.landed)}</td><td class="num">${ex.effectiveRate}%</td></tr>`;
    })
    .join("");
  const tiersTable = `
<div class="table-wrap">
  <h2>Landed cost at common CIF values</h2>
  <table class="listing">
    <thead><tr><th>CIF value</th><th>Total duty</th><th>Landed cost</th><th>Effective rate</th></tr></thead>
    <tbody>${tiersTableRows}</tbody>
  </table>
</div>`;

  const chapterContext = chapterContextBlurb(code.chapter);

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

  ${tiersTable}

  ${siblings.length > 0 ? `<div class="table-wrap"><h2>Other 8-digit HSNs under subheading ${esc(code.hsn.slice(0, 6))}</h2>
    <table class="listing">
      <thead><tr><th>HSN</th><th>Description</th><th class="num">BCD</th><th class="num">IGST</th></tr></thead>
      <tbody>${siblings.map((s) => `<tr><td><a href="${hsnUrl(s.hsn)}">${s.hsn}</a></td><td>${esc(s.description)}</td><td class="num">${s.bcd}%</td><td class="num">${s.igst}%</td></tr>`).join("")}</tbody>
    </table>
  </div>` : ""}

  ${productsHtml ? `<section class="products"><h2>Common products</h2><ul>${productsHtml}</ul></section>` : ""}

  <section>
    <h2>About HSN ${esc(code.hsn)}</h2>
    <p>HSN (Harmonised System of Nomenclature) code ${esc(code.hsn)} falls under Chapter ${ch} of India's Customs Tariff Act. The first six digits (${esc(code.hsn.slice(0, 6))}) follow the World Customs Organization's global HS 2022 classification; the last two digits are India's national extension under the ITC(HS) 2022 schedule published by DGFT.</p>
    <p>For import, declare this 8-digit code on the Bill of Entry in ICEGATE. For GST-registered taxpayers with turnover above ₹5 crore, the 8-digit HSN is also mandatory on B2B invoices under Notification 78/2020-Central Tax.</p>
    <p><strong>Chapter ${ch} context:</strong> ${esc(chapterContext)}</p>
    <p>Not sure how the four duty components stack on top of each other? Read <a href="/guide/customs-duty/">India customs duty, explained — with two worked examples</a>.</p>
    ${productSlug ? `<p>Importing this specifically as an individual? See the product-focused walkthrough: <a href="/duty/${productSlug}/">Customs duty on ${esc(productSlug.replace(/-india$/, "").replace(/-/g, " "))} in India</a>.</p>` : ""}
    <p>To run your own scenario: plug HSN <strong>${esc(code.hsn)}</strong> and any CIF value into the <a href="/calculator/?hsn=${esc(code.hsn)}">duty calculator</a> — it pre-fills the BCD, SWS, IGST and cess for this code.</p>
  </section>

  <section class="verification">
    <h2>Rate verification</h2>
    ${verificationBlock(code)}
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

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.origin + "/" },
      { "@type": "ListItem", position: 2, name: `Chapter ${ch}`, item: `${SITE.origin}${chapterUrl(ch)}` },
      { "@type": "ListItem", position: 3, name: `Heading ${h4}`, item: `${SITE.origin}${headingUrl(h4)}` },
      { "@type": "ListItem", position: 4, name: `Subheading ${entry.code}`, item: canonical },
    ],
  };

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
  return layout({ title, description, canonical, bodyHtml: body, jsonLd: breadcrumbJsonLd });
}

// ————— 4-digit heading page —————
export function headingPage(entry, children6, chapterDesc, sectionName) {
  const ch = entry.code.slice(0, 2);
  const desc = tidy(entry.description);
  const title = `HS Heading ${entry.code} — ${desc} — HSN India`;
  const description = `HS heading ${entry.code}: ${desc}. ${children6.length} subheadings under Chapter ${ch} of India's Customs Tariff.`;
  const canonical = `${SITE.origin}${headingUrl(entry.code)}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.origin + "/" },
      { "@type": "ListItem", position: 2, name: `Chapter ${ch}`, item: `${SITE.origin}${chapterUrl(ch)}` },
      { "@type": "ListItem", position: 3, name: `Heading ${entry.code}`, item: canonical },
    ],
  };

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
  return layout({ title, description, canonical, bodyHtml: body, jsonLd: breadcrumbJsonLd });
}

// ————— Chapter page —————
export function chapterPage(chapterEntry, children4, sectionName, eightDigitInChapter) {
  const ch = chapterEntry.code;
  const desc = tidy(chapterEntry.description);
  const title = `Chapter ${ch} — ${desc} — HSN Codes India`;
  const description = `All HS headings under Chapter ${ch} of India's Customs Tariff — ${desc}. With links to 6-digit subheadings and 8-digit HSN codes.`;
  const canonical = `${SITE.origin}${chapterUrl(ch)}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.origin + "/" },
      { "@type": "ListItem", position: 2, name: "Chapters", item: SITE.origin + "/chapters/" },
      { "@type": "ListItem", position: 3, name: `Chapter ${ch}`, item: canonical },
    ],
  };

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
  return layout({ title, description, canonical, bodyHtml: body, jsonLd: breadcrumbJsonLd });
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

  const homeJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.origin + "/",
      description,
      inLanguage: "en-IN",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE.origin}/?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE.name,
      url: SITE.origin + "/",
      description:
        "Free Indian customs duty and HSN code reference. BCD, IGST, SWS, cess and worked landed-cost examples for Indian imports.",
      areaServed: "IN",
    },
  ];
  const homeJsonLdScript = homeJsonLd
    .map((ld) => `<script type="application/ld+json">${JSON.stringify(ld)}</script>`)
    .join("\n");

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
  <h1>Find any HSN code. See the real duty on any Indian import.</h1>
  <p class="lead">BCD, IGST, SWS and cess for Indian imports — plus a worked landed-cost calculator on ₹1,00,000, for every 8-digit code.</p>
  ${searchBarHtml({ autofocus: false })}
  <div class="stats">
    <div class="stat"><div class="stat-val">${stats.sections}</div><div class="stat-label">Sections</div></div>
    <div class="stat"><div class="stat-val">${stats.chapters}</div><div class="stat-label">Chapters</div></div>
    <div class="stat"><div class="stat-val">${stats.subheadings.toLocaleString("en-IN")}</div><div class="stat-label">HS subheadings</div></div>
    <div class="stat"><div class="stat-val">${stats.india8.toLocaleString("en-IN")}</div><div class="stat-label">8-digit HSN with verified IGST</div></div>
  </div>
</section>
<section>
  <h2>Popular 8-digit HSN codes</h2>
  <ul class="code-list">${popular}</ul>
</section>
<section class="home-guide-cta">
  <h2>New to Indian customs?</h2>
  <p>Read the full walkthrough: <a href="/guide/customs-duty/"><strong>India customs duty, explained — with two worked examples</strong></a>. BCD, SWS, cess, IGST; the stacking formula; FTA exemptions; anti-dumping; and the HSN classification rules importers actually get caught on.</p>
</section>
<section>
  <h2>Customs duty by product</h2>
  <p>Want the direct answer for what you're importing? Per-product walkthroughs with HSN, rate stack and a worked landed-cost example:</p>
  <ul class="code-list">
    <li><a href="/duty/iphone-india/"><strong>iPhone</strong> <span>HSN 8517.13.00 — 44.35% effective</span></a></li>
    <li><a href="/duty/laptop-india/"><strong>Laptop</strong> <span>HSN 8471.30.10 — 18% effective</span></a></li>
    <li><a href="/duty/gold-india/"><strong>Gold</strong> <span>HSN 7108.13.00 — 19.6% effective</span></a></li>
    <li><a href="/duty/whisky-india/"><strong>Whisky</strong> <span>HSN 2208.30.00 — 165% effective</span></a></li>
    <li><a href="/duty/car-india/"><strong>Car (CBU)</strong> <span>HSN 8703.23.91 — ~166% effective</span></a></li>
    <li><a href="/duty/playstation-india/"><strong>PlayStation</strong> <span>HSN 9504.50.00 — 57.85% effective</span></a></li>
    <li><a href="/duty/solar-panel-india/"><strong>Solar panel</strong> <span>HSN 8541.43.00 — ~59.5% effective</span></a></li>
    <li><a href="/duty/watch-india/"><strong>Wrist watch</strong> <span>HSN 9102.29.00 — 44.35% effective</span></a></li>
    <li><a href="/duty/perfume-india/"><strong>Perfume</strong> <span>HSN 3303.00.10 — 44.35% effective</span></a></li>
    <li><a href="/duty/sunglasses-india/"><strong>Sunglasses</strong> <span>HSN 9004.10.00 — 44.35% effective</span></a></li>
    <li><a href="/duty/refrigerator-india/"><strong>Refrigerator</strong> <span>HSN 8418.21.00 — 44.35% effective</span></a></li>
    <li><a href="/duty/washing-machine-india/"><strong>Washing machine</strong> <span>HSN 8450.11.00 — 44.35% effective</span></a></li>
    <li><a href="/duty/air-conditioner-india/"><strong>Air conditioner</strong> <span>HSN 8415.81.10 — 56.25% effective</span></a></li>
    <li><a href="/duty/smart-tv-india/"><strong>Smart TV</strong> <span>HSN 8528.72.19 — 47.25% effective</span></a></li>
    <li><a href="/duty/wine-india/"><strong>Wine</strong> <span>HSN 2204.21.10 — ~165% effective</span></a></li>
    <li><a href="/duty/beer-india/"><strong>Beer</strong> <span>HSN 2203.00.00 — ~110% effective</span></a></li>
    <li><a href="/duty/chocolate-india/"><strong>Chocolate</strong> <span>HSN 1806.90.10 — 54.12% effective</span></a></li>
    <li><a href="/duty/coffee-india/"><strong>Coffee (green)</strong> <span>HSN 0901.11.11 — ~115% effective</span></a></li>
    <li><a href="/duty/camera-india/"><strong>Camera</strong> <span>HSN 9006.10.00 — 30.98% effective</span></a></li>
    <li><a href="/duty/cosmetics-india/"><strong>Cosmetics / skincare</strong> <span>HSN 3304.99.90 — 56.25% effective</span></a></li>
  </ul>
  <p><a href="/duty/">See all product-duty pages →</a></p>
</section>
<section>
  <h2>Browse all 21 sections</h2>
  <ul class="code-list">${sectionsList}</ul>
  <p style="margin-top:14px;"><a href="/chapters/">See all ${stats.chapters} chapters →</a></p>
</section>`;

  return layout({ title, description, canonical, bodyHtml: body, extraHeadHtml: homeJsonLdScript });
}

// ————— Calculator —————
export function calculatorPage() {
  const title = `India Customs Duty Calculator — BCD, IGST, SWS, Cess — ${SITE.name}`;
  const description = `Free India customs duty calculator. Enter HSN and CIF value; get BCD, IGST, SWS, cess and landed cost instantly. Works offline after first load.`;
  const canonical = SITE.origin + "/calculator/";

  const body = `
<article>
  <nav class="crumbs"><a href="/">Home</a><span class="sep">›</span><span>Duty calculator</span></nav>
  <div class="hero" style="padding:32px 24px 24px;">
    <span class="eyebrow">Free · No sign-up · Offline-capable</span>
    <h1>India import duty calculator</h1>
    <p class="lead">Enter an HSN code and CIF value. Get BCD, IGST, SWS, compensation cess and landed cost in one screen.</p>
  </div>

  <form id="calc-form" onsubmit="event.preventDefault();" class="calc-form">
    <div class="calc-row">
      <label for="calc-hsn">HSN code</label>
      <input id="calc-hsn" name="hsn" type="text" inputmode="numeric" placeholder="e.g. 85171300" autocomplete="off" />
      <span id="calc-hsn-desc" class="calc-hsn-desc"></span>
    </div>
    <p id="calc-hsn-help" class="calc-hint">Start typing an HSN number, or <a href="/">browse codes on the home page</a>.</p>

    <div class="calc-grid">
      <div class="calc-field">
        <label for="calc-bcd">BCD %</label>
        <input id="calc-bcd" type="number" step="0.01" min="0" value="0" />
      </div>
      <div class="calc-field">
        <label for="calc-igst">IGST %</label>
        <input id="calc-igst" type="number" step="0.01" min="0" value="18" />
      </div>
      <div class="calc-field">
        <label for="calc-sws">SWS % (of BCD)</label>
        <input id="calc-sws" type="number" step="0.01" min="0" value="10" />
      </div>
      <div class="calc-field">
        <label for="calc-cess">Cess %</label>
        <input id="calc-cess" type="number" step="0.01" min="0" value="0" />
      </div>
    </div>

    <div class="calc-row">
      <label for="calc-av">Assessable value (CIF + 1% landing, ₹)</label>
      <input id="calc-av" type="number" step="1" min="0" value="100000" />
    </div>
  </form>

  <div class="example-block" id="calc-out">
    <p class="calc-hint">Enter an assessable value to see the landed-cost breakdown.</p>
  </div>

  <section>
    <h2>How Indian customs duty is calculated</h2>
    <p>Total duty on an Indian import is the sum of four components applied in order:</p>
    <ol>
      <li><strong>Basic Customs Duty (BCD)</strong> — applied to the assessable value (CIF + 1% landing charges).</li>
      <li><strong>Social Welfare Surcharge (SWS)</strong> — 10% of BCD on most goods (0% on some exempted items).</li>
      <li><strong>Compensation Cess</strong> — applied on (AV + BCD) for certain goods (tobacco, luxury cars, aerated beverages, coal, etc.).</li>
      <li><strong>IGST</strong> — applied on (AV + BCD + SWS + Cess).</li>
    </ol>
    <p>Total duty = BCD + SWS + Cess + IGST. Landed cost = AV + Total duty.</p>
    <p class="note">This calculator covers the standard duty formula. Some goods attract additional Safeguard, Anti-Dumping or Countervailing duties — consult the <a href="https://www.cbic.gov.in/" rel="nofollow noopener">CBIC tariff</a> for the exact notification applicable to your Bill of Entry.</p>
    <p>For the full walkthrough including FTA exemptions and common Bill of Entry mistakes, read <a href="/guide/customs-duty/">India customs duty, explained</a>.</p>
  </section>
</article>`;

  return layout({
    title, description, canonical, bodyHtml: body,
    extraHeadHtml: '<script src="/assets/calculator.js" defer></script>',
  });
}

// ————— Product duty pages: /duty/[slug]/ —————
export function productDutyPage(product, hsnEntry) {
  const example = computeDuty(product.typicalCifInr, hsnEntry);
  const ch = pad2(hsnEntry.chapter);
  const title = `Customs duty on ${product.name} in India — ${example.effectiveRate}% all-in — ${SITE.name}`;
  const description = `${product.name} imported into India: BCD ${hsnEntry.bcd}%, SWS ${hsnEntry.sws}% of BCD, IGST ${hsnEntry.igst}%${hsnEntry.cess ? `, Cess ${hsnEntry.cess}%` : ""}. Worked example on a CIF of ${inr(product.typicalCifInr)} → landed ${inr(example.landed)}. HSN ${hsnEntry.hsn}.`;
  const canonical = `${SITE.origin}/duty/${product.slug}/`;

  const personaHtml = product.personaHooks
    .map((h) => `<li>${esc(h)}</li>`)
    .join("");

  const faqHtml = product.faqs
    .map(
      (f) => `
  <div class="faq-item">
    <h3>${esc(f.q)}</h3>
    <p>${esc(f.a)}</p>
  </div>`,
    )
    .join("");

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: product.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: product.h1,
    description,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
    datePublished: "2026-04-24",
    dateModified: "2026-04-24",
    mainEntityOfPage: canonical,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.origin + "/" },
      { "@type": "ListItem", position: 2, name: "Duty by product", item: SITE.origin + "/duty/" },
      { "@type": "ListItem", position: 3, name: product.name, item: canonical },
    ],
  };

  const body = `
<article class="guide">
  <nav class="crumbs"><a href="/">Home</a><span class="sep">›</span><a href="/duty/">Duty by product</a><span class="sep">›</span><span>${esc(product.name)}</span></nav>

  <header class="guide-header">
    <span class="eyebrow">Duty on ${esc(product.name)} · Updated April 2026</span>
    <h1>${esc(product.h1)}</h1>
    <p class="lead">HSN <a href="${hsnUrl(hsnEntry.hsn)}">${hsnEntry.hsn}</a> · ${esc(hsnEntry.description)} · Chapter <a href="${chapterUrl(ch)}">${ch}</a>. Worked example on ${esc(product.typicalScenario)}, CIF ${inr(product.typicalCifInr)}.</p>
  </header>

  <aside class="tldr">
    <strong>TL;DR.</strong> ${esc(product.keyInsight)}
  </aside>

  <section>
    <h2>Duty rates at a glance</h2>
    <div class="rates-grid">
      <div class="rate-card"><div class="rate-card-label">BCD</div><div class="rate-card-val">${hsnEntry.bcd}%</div><div class="rate-card-sub">Basic Customs Duty</div></div>
      <div class="rate-card"><div class="rate-card-label">SWS</div><div class="rate-card-val">${hsnEntry.sws}%</div><div class="rate-card-sub">of BCD</div></div>
      ${hsnEntry.cess ? `<div class="rate-card"><div class="rate-card-label">Cess</div><div class="rate-card-val">${hsnEntry.cess}%</div><div class="rate-card-sub">Comp. Cess</div></div>` : ""}
      <div class="rate-card"><div class="rate-card-label">IGST</div><div class="rate-card-val">${hsnEntry.igst}%</div><div class="rate-card-sub">Integrated GST</div></div>
      <div class="rate-card" style="background:var(--brand-soft); border-color:var(--brand);"><div class="rate-card-label" style="color:var(--brand-dark)">Effective</div><div class="rate-card-val" style="color:var(--brand-dark)">${example.effectiveRate}%</div><div class="rate-card-sub">All-in on AV</div></div>
    </div>
    ${hsnEntry.notes ? `<p class="note">${esc(hsnEntry.notes)}</p>` : ""}
  </section>

  <section>
    <h2>Who's asking this question</h2>
    <p>This page gets searched by three kinds of people:</p>
    <ul>${personaHtml}</ul>
    <p>The duty calculation is the same for everyone — what differs is whether you can claim IGST as input credit (GST-registered businesses can; individuals can't) and whether baggage rules let you bring it in personally.</p>
  </section>

  <section>
    <h2>Worked example · CIF ${inr(product.typicalCifInr)}</h2>
    <p>${esc(product.typicalScenario.charAt(0).toUpperCase() + product.typicalScenario.slice(1))}. CIF (cost + insurance + freight) in INR: <strong>${inr(product.typicalCifInr)}</strong>. The assessable value is CIF + 1% landing charges.</p>
    <table>
      <tr><td>CIF value</td><td class="num">${inr(product.typicalCifInr)}</td></tr>
      <tr><td>+ 1% landing charges</td><td class="num">${inr(product.typicalCifInr * 0.01)}</td></tr>
      <tr><td><strong>Assessable Value</strong></td><td class="num"><strong>${inr(example.av)}</strong></td></tr>
      <tr><td>BCD @ ${hsnEntry.bcd}%</td><td class="num">${inr(example.bcd)}</td></tr>
      <tr><td>SWS @ ${hsnEntry.sws}% of BCD</td><td class="num">${inr(example.sws)}</td></tr>
      ${hsnEntry.cess ? `<tr><td>Compensation Cess @ ${hsnEntry.cess}%</td><td class="num">${inr(example.cess)}</td></tr>` : ""}
      <tr><td>IGST @ ${hsnEntry.igst}% of (AV + BCD + SWS${hsnEntry.cess ? " + Cess" : ""})</td><td class="num">${inr(example.igst)}</td></tr>
      <tr class="total"><td>Total duty</td><td class="num">${inr(example.totalDuty)}</td></tr>
      <tr class="total"><td>Landed cost</td><td class="num">${inr(example.landed)}</td></tr>
    </table>
    <p><strong>Effective duty rate: ${example.effectiveRate}%</strong> on the assessable value. Want to run your own numbers? Use the <a href="/calculator/?hsn=${hsnEntry.hsn}">duty calculator</a> — it pre-loads the rates for HSN ${hsnEntry.hsn}.</p>
  </section>

  <section id="faq">
    <h2>Frequently asked questions</h2>
    ${faqHtml}
  </section>

  <section>
    <h2>Related</h2>
    <ul>
      <li><a href="${hsnUrl(hsnEntry.hsn)}">HSN ${hsnEntry.hsn} — ${esc(hsnEntry.description)}</a> — the underlying classification.</li>
      <li><a href="/guide/customs-duty/">India customs duty, explained</a> — the full walkthrough of how the four-part duty stack works.</li>
      <li><a href="/calculator/">Duty calculator</a> — plug in any HSN and CIF value to get the full breakdown.</li>
      <li><a href="${chapterUrl(ch)}">Chapter ${ch} — ${esc(tidy(hsnEntry.description))}</a> — other HSNs in the same chapter.</li>
    </ul>
  </section>

  <section class="verification">
    <h2>Rate verification</h2>
    ${verificationBlock(hsnEntry)}
  </section>
</article>`;

  const jsonLdScripts = [articleJsonLd, breadcrumbJsonLd, faqJsonLd]
    .map((ld) => `<script type="application/ld+json">${JSON.stringify(ld)}</script>`)
    .join("\n");

  return layout({ title, description, canonical, bodyHtml: body, extraHeadHtml: jsonLdScripts });
}

// ————— /duty/ index —————
export function dutyIndexPage(products, byHsn) {
  const title = `Customs duty on imported goods in India — by product — ${SITE.name}`;
  const description = `Customs duty on imported products in India: iPhone, laptop, gold, whisky, perfume, watch, solar panel, car, PlayStation and more. Each with HSN, duty breakdown and worked example.`;
  const canonical = SITE.origin + "/duty/";

  const rows = products
    .map((p) => {
      const h = byHsn.get(p.hsn);
      const example = computeDuty(p.typicalCifInr, h);
      return `<tr><td><a href="/duty/${p.slug}/">${esc(p.name)}</a></td><td>${esc(h.description)}</td><td class="num">${h.bcd}%</td><td class="num">${h.igst}%</td><td class="num">${example.effectiveRate}%</td></tr>`;
    })
    .join("");

  const body = `
<article>
  <nav class="crumbs"><a href="/">Home</a><span class="sep">›</span><span>Duty by product</span></nav>
  <div class="hsn-hero">
    <span class="hsn-code">Duty · by product</span>
    <h1>Customs duty on imported goods in India</h1>
    <p class="lead">How much you actually pay when you import a specific product — HSN, rate stack and a worked example on every page.</p>
  </div>
  <div class="table-wrap">
    <h2>Products</h2>
    <table class="listing">
      <thead><tr><th>Product</th><th>Classified as</th><th class="num">BCD</th><th class="num">IGST</th><th class="num">Effective</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
  <p>Don't see what you're importing? Use the <a href="/">search bar</a> to find the HSN, or plug your rates into the <a href="/calculator/">calculator</a>.</p>
</article>`;
  return layout({ title, description, canonical, bodyHtml: body });
}

// ————— Pillar guide: /guide/customs-duty/ —————
export function customsDutyGuidePage() {
  const title = `India Customs Duty: How It's Calculated, With Worked Examples — ${SITE.name}`;
  const description = `The practical guide to Indian customs duty. The four components (BCD, SWS, cess, IGST), the exact formula, two worked examples, exemption notifications, anti-dumping, and the HSN classification rules importers actually get wrong.`;
  const canonical = SITE.origin + "/guide/customs-duty/";

  const faqs = [
    {
      q: "How is customs duty calculated in India?",
      a: "Customs duty on an Indian import is the sum of four components applied in a specific order: Basic Customs Duty (BCD) on the assessable value, Social Welfare Surcharge (SWS) at 10% of BCD, Compensation Cess on (AV + BCD) for specific goods, and IGST on (AV + BCD + SWS + Cess). The order matters because IGST is charged on a base that already includes BCD, SWS and cess — IGST is not simply applied to the invoice value.",
    },
    {
      q: "What is the difference between BCD and IGST?",
      a: "BCD is the tariff paid at the border for the right to import goods into India, set in the Customs Tariff Act Schedule I and amended by Finance Acts and CBIC notifications. IGST is the GST levy on the import, equivalent to the GST the good would attract domestically, and is creditable against your output GST if you are GST-registered. BCD is a cost; IGST is usually a cash-flow item for registered importers.",
    },
    {
      q: "What is the assessable value for customs duty?",
      a: "Assessable value (AV) is CIF (Cost + Insurance + Freight) plus 1% landing charges. Indian customs computes duty on AV, not on the invoice value alone. If the seller's invoice is FOB, you add the actual insurance and freight before adding the 1% landing charge.",
    },
    {
      q: "Is Social Welfare Surcharge always 10%?",
      a: "SWS is 10% of BCD for most goods, but a small set of items (notably gold, silver, certain motor vehicles, and some specified healthcare goods) are either exempt from SWS or have it at a different rate via notification. Always check the current notification for your HSN before assuming 10%.",
    },
    {
      q: "When does compensation cess apply on an import?",
      a: "Compensation cess applies on imports of the same goods that attract it domestically under GST: tobacco products, aerated waters with added sugar, coal, specified motor cars, and a handful of other items. For most imports, cess is zero.",
    },
    {
      q: "What is the difference between HSN and ITC(HS)?",
      a: "HSN is the 6-digit WCO Harmonized System classification used globally. ITC(HS) is India's 8-digit extension, published by DGFT, used on Shipping Bills and Bills of Entry. The first 6 digits match the global HS; the last two are India-specific sub-classifications.",
    },
    {
      q: "Do I pay customs duty on personal imports under ₹1,000?",
      a: "Courier shipments of bona fide gifts up to ₹5,000 CIF are exempt from BCD and IGST (Notification 171/93-Cus, amended). Commercial imports of any value attract full duty. Value thresholds are checked by customs against the invoice and airway bill — undervaluation can trigger a reassessment.",
    },
    {
      q: "Can I import without a GST registration?",
      a: "Yes for personal use; no for commercial use. Commercial importers need an IEC (Importer Exporter Code) from DGFT and should register for GST to claim IGST as input credit. Without GST registration the IGST paid at import becomes a sunk cost, not a credit.",
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "India Customs Duty: How It's Calculated, With Worked Examples",
    description,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
    datePublished: "2026-04-24",
    dateModified: "2026-04-24",
    mainEntityOfPage: canonical,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.origin + "/" },
      { "@type": "ListItem", position: 2, name: "Guides", item: SITE.origin + "/guide/" },
      { "@type": "ListItem", position: 3, name: "India customs duty", item: canonical },
    ],
  };

  const faqHtml = faqs
    .map(
      (f) => `
  <div class="faq-item">
    <h3>${esc(f.q)}</h3>
    <p>${esc(f.a)}</p>
  </div>`,
    )
    .join("");

  const body = `
<article class="guide">
  <nav class="crumbs"><a href="/">Home</a><span class="sep">›</span><span>Guide</span><span class="sep">›</span><span>India customs duty</span></nav>

  <header class="guide-header">
    <span class="eyebrow">Guide · Updated April 2026</span>
    <h1>India customs duty, explained — with two worked examples</h1>
    <p class="lead">The four components, the order they stack in, and the classification mistakes importers actually get caught on. No jargon, no fluff, just the formula and two real invoices run through it end-to-end.</p>
  </header>

  <aside class="tldr">
    <strong>TL;DR.</strong> Customs duty on an Indian import is BCD + SWS + Cess + IGST, applied in that order. IGST is charged on a base that <em>already includes</em> BCD, SWS, and cess — not on the invoice value. For a ₹1,00,000 laptop at 0% BCD + 18% IGST + 10% SWS + 0% cess, you pay ₹18,000 IGST and nothing else — effective rate 18%. For the same value at 10% BCD, you pay ₹30,980 — effective rate 30.98%. Use the <a href="/calculator/">calculator</a> to run your own numbers. Rates change by notification; always verify against the current CBIC notification before filing.
  </aside>

  <nav class="toc">
    <strong>On this page</strong>
    <ol>
      <li><a href="#components">The four components of Indian customs duty</a></li>
      <li><a href="#formula">The exact formula (and the stacking trick)</a></li>
      <li><a href="#example-personal">Worked example 1 — personal laptop import</a></li>
      <li><a href="#example-commercial">Worked example 2 — commercial apparel container</a></li>
      <li><a href="#exemptions">Exemption notifications — why the tariff rate isn't always what you pay</a></li>
      <li><a href="#extra-duties">Anti-dumping, safeguard and countervailing duties</a></li>
      <li><a href="#classification">Finding the right HSN — the classification rules</a></li>
      <li><a href="#mistakes">Common Bill of Entry mistakes</a></li>
      <li><a href="#faq">FAQ</a></li>
    </ol>
  </nav>

  <section id="components">
    <h2>1. The four components of Indian customs duty</h2>
    <p>A commercial import into India attracts up to four separate levies at the border. They are set by different statutes, collected together on the Bill of Entry, and appear as distinct line items in ICEGATE's duty assessment.</p>

    <h3>Basic Customs Duty (BCD)</h3>
    <p>BCD is the tariff rate set in the <strong>First Schedule to the Customs Tariff Act, 1975</strong>, amended annually by the Finance Act and updated between budgets by CBIC notifications. For most finished goods the statutory BCD is in the 10%–20% band; for inputs into manufacturing it is often 0%–7.5%; for protected categories (motor cars CBU, alcoholic beverages, gold jewellery) it can be 35%–150%. BCD is a cost — you cannot take input credit against it.</p>

    <h3>Social Welfare Surcharge (SWS)</h3>
    <p>SWS is levied under Section 110 of the Finance Act, 2018 at <strong>10% of the aggregate customs duties</strong> (in practice, 10% of BCD). It funds education and health. A small set of goods are exempt from SWS — notably gold and silver (exempt under Notification 11/2018-Cus), certain specified life-saving drugs, and some healthcare equipment. For everything else, assume 10% of BCD.</p>

    <h3>Compensation Cess</h3>
    <p>GST Compensation Cess applies on imports of the same goods that attract it domestically: tobacco and tobacco products, aerated waters with added sugar, coal, motor cars above specified engine capacities, and a handful of other items. It is levied on <strong>(AV + BCD)</strong>, not on AV alone. For most imports, cess is zero — but for a luxury car import, cess alone can exceed BCD.</p>

    <h3>Integrated GST (IGST)</h3>
    <p>IGST is the GST levy on the import, equivalent to the GST the same good would attract if supplied domestically. Rates are 0%, 5%, 12%, 18% or 28%. IGST is charged on a <strong>base that already includes BCD, SWS, and cess</strong> — this is the stacking rule in §3 of the IGST Act and §5 of the Customs Tariff Act. If you are GST-registered, IGST paid at import is available as input tax credit against your output GST; if you are not, it is a sunk cost.</p>
  </section>

  <section id="formula">
    <h2>2. The exact formula (and the stacking trick)</h2>
    <p>Let:</p>
    <ul>
      <li><code>AV</code> = assessable value = CIF + 1% landing charges</li>
      <li><code>b</code>, <code>s</code>, <code>c</code>, <code>g</code> = BCD rate, SWS rate, Cess rate, IGST rate (as decimals)</li>
    </ul>
    <p>Then the four components are computed <strong>in order</strong>:</p>
    <pre class="formula"><code>BCD  = AV × b
SWS  = BCD × s
Cess = (AV + BCD) × c
IGST = (AV + BCD + SWS + Cess) × g

Total duty  = BCD + SWS + Cess + IGST
Landed cost = AV + Total duty</code></pre>
    <p>The order isn't cosmetic. IGST is computed on a base that <em>already includes</em> BCD, SWS, and cess — so each prior component raises the IGST liability. A naive estimate that multiplies the invoice value by "BCD% + IGST%" will always understate duty, often by 3%–8% of invoice value on goods with non-zero BCD.</p>
    <p>Worked the other way: if someone quotes you an "effective duty rate" of 42% on a 28% IGST, 20% BCD item, they probably computed <code>(1 + 0.20) × (1 + 0.10×0.20) × (1 + 0.28) − 1 ≈ 53.8%</code> — not the sum of the stated rates.</p>
    <p class="note">The formula lives in <a href="/calculator/">the calculator</a>. Plug in an HSN and a CIF value and you'll see every line of the stack, live, without leaving the page.</p>
  </section>

  <section id="example-personal">
    <h2>3. Worked example 1 — personal laptop import from the US</h2>
    <p>A working professional in Bengaluru orders a MacBook Pro from the US. The invoice is USD 2,400. Shipping via DHL is USD 180. Insurance on the shipment is USD 20. The exchange rate on the day the Bill of Entry is filed is ₹83.50 per USD.</p>

    <h3>Step 1 — Assessable value</h3>
    <table>
      <tr><td>Invoice (FOB)</td><td class="num">USD 2,400</td></tr>
      <tr><td>Insurance</td><td class="num">USD 20</td></tr>
      <tr><td>Freight</td><td class="num">USD 180</td></tr>
      <tr><td>CIF (USD)</td><td class="num">USD 2,600</td></tr>
      <tr><td>CIF (INR @ 83.50)</td><td class="num">₹2,17,100</td></tr>
      <tr><td>+ 1% landing charges</td><td class="num">₹2,171</td></tr>
      <tr class="total"><td>Assessable Value</td><td class="num">₹2,19,271</td></tr>
    </table>

    <h3>Step 2 — Duty stack at HSN 8471.30.10</h3>
    <p>The MacBook falls under HSN <a href="/hsn/84713010/">84713010</a> — portable automatic data processing machines. At the time of writing, BCD on this heading is 0%, SWS is 10% (of BCD), IGST is 18%, and there is no compensation cess.</p>
    <table>
      <tr><td>Assessable Value</td><td class="num">₹2,19,271</td></tr>
      <tr><td>BCD @ 0%</td><td class="num">₹0</td></tr>
      <tr><td>SWS @ 10% of BCD</td><td class="num">₹0</td></tr>
      <tr><td>Cess @ 0%</td><td class="num">₹0</td></tr>
      <tr><td>IGST @ 18% of (AV + 0 + 0 + 0)</td><td class="num">₹39,469</td></tr>
      <tr class="total"><td>Total duty</td><td class="num">₹39,469</td></tr>
      <tr class="total"><td>Landed cost</td><td class="num">₹2,58,740</td></tr>
    </table>
    <p>Effective rate: <strong>18.0%</strong> of assessable value, all of it IGST. Because the buyer is a salaried individual, the IGST is a real cost — there's no output tax to set it off against. The total out-of-pocket is ₹2,58,740 plus the courier's handling fee and any customs agent charges.</p>
    <p class="note">If the same user imports under an IEC as a sole proprietor registered for GST, the ₹39,469 IGST becomes input credit — the economic cost of the import drops by exactly that amount over the subsequent GST returns. For any importer doing more than ₹5 lakh/year, getting GST-registered pays for itself within a single shipment.</p>
  </section>

  <section id="example-commercial">
    <h2>4. Worked example 2 — commercial apparel container</h2>
    <p>A Surat-based garments wholesaler imports a full container of cotton T-shirts from Bangladesh. Invoice is USD 60,000 CIF. Exchange rate is ₹83.00 per USD.</p>

    <h3>Step 1 — Assessable value</h3>
    <table>
      <tr><td>CIF (USD)</td><td class="num">USD 60,000</td></tr>
      <tr><td>CIF (INR @ 83.00)</td><td class="num">₹49,80,000</td></tr>
      <tr><td>+ 1% landing charges</td><td class="num">₹49,800</td></tr>
      <tr class="total"><td>Assessable Value</td><td class="num">₹50,29,800</td></tr>
    </table>

    <h3>Step 2 — Duty stack at HSN 6109.10.00</h3>
    <p>Cotton knitted T-shirts fall under HSN <a href="/hsn/61091000/">61091000</a>. BCD on finished apparel imports is 20%, SWS is 10% of BCD, IGST is 12% (apparel under ₹1,000/piece; 12% IGST slab), no cess.</p>
    <table>
      <tr><td>Assessable Value</td><td class="num">₹50,29,800</td></tr>
      <tr><td>BCD @ 20%</td><td class="num">₹10,05,960</td></tr>
      <tr><td>SWS @ 10% of BCD</td><td class="num">₹1,00,596</td></tr>
      <tr><td>Cess @ 0%</td><td class="num">₹0</td></tr>
      <tr><td>IGST @ 12% of (AV + BCD + SWS + Cess)</td><td class="num">₹7,36,363</td></tr>
      <tr class="total"><td>Total duty</td><td class="num">₹18,42,919</td></tr>
      <tr class="total"><td>Landed cost</td><td class="num">₹68,72,719</td></tr>
    </table>
    <p>Effective rate: <strong>36.64%</strong> of assessable value. BCD alone is ₹10.06 lakh; SWS adds ₹1 lakh; IGST on the grossed-up base adds ₹7.36 lakh. The IGST is creditable — so the real economic cost to a GST-registered wholesaler is ₹11,06,556 of BCD + SWS, or ~22% of AV. The gap between the 36.64% sticker rate and the 22% economic rate is the single most important number for any commercial importer to understand.</p>
    <p class="note">Bangladesh is a SAFTA partner. With a valid Certificate of Origin, this consignment qualifies for preferential BCD under Notification 99/2011-Cus — often reducing BCD to 0%–5% on qualifying textiles. The CoO must accompany the Bill of Entry; retroactive claims are not accepted. See <a href="#exemptions">exemption notifications</a> below.</p>
  </section>

  <section id="exemptions">
    <h2>5. Exemption notifications — why the tariff rate isn't always what you pay</h2>
    <p>The BCD in Schedule I of the Customs Tariff Act is the <em>statutory</em> rate. The rate you actually pay is usually lower, because of a separate CBIC notification exempting or reducing duty for specific HSN + end-use + origin combinations.</p>
    <p>Three categories matter:</p>
    <ul>
      <li><strong>Unconditional exemptions (e.g., Notification 50/2017-Cus).</strong> Reduce BCD across entire HSN ranges — the single most-cited customs notification. If your HSN is in the schedule, the lower rate applies automatically.</li>
      <li><strong>End-use based exemptions.</strong> Capital goods for a specific project, inputs for manufacturing finished goods that are themselves exported, solar power equipment — these require an end-use bond or IGCR (Import of Goods at Concessional Rate) compliance.</li>
      <li><strong>Free Trade Agreement (FTA) exemptions.</strong> SAFTA, ASEAN-India, Japan-India CEPA, Korea-India CEPA, UAE-India CEPA, Australia-India ECTA and others. Qualifying goods get preferential BCD if a valid Certificate of Origin accompanies the Bill of Entry. Rules of Origin are strict; mis-declared CoOs are a common cause of post-clearance reassessment.</li>
    </ul>
    <p>Finding the right notification: start at <a href="https://taxinformation.cbic.gov.in/" rel="nofollow noopener">taxinformation.cbic.gov.in</a>, search by HSN or by notification number. Read the notification in full — the <em>Conditions</em> column on the right is usually what determines whether you qualify. A rate shown on any third-party site, including this one, is a reference; the notification is the law.</p>
  </section>

  <section id="extra-duties">
    <h2>6. Anti-dumping, safeguard and countervailing duties</h2>
    <p>Beyond BCD/SWS/Cess/IGST, a specific HSN from a specific country of origin may attract <strong>trade remedy duties</strong>. These are imposed for a fixed period (usually 5 years, extendable) and published as numbered notifications.</p>
    <ul>
      <li><strong>Anti-dumping duty (ADD)</strong> — levied when DGTR (Directorate General of Trade Remedies) has determined that goods are being exported to India at below-home-market prices. Examples in force in 2026 include ADD on certain stainless steel from China/Korea, certain tyres from Thailand/Vietnam, and specified chemicals from the EU.</li>
      <li><strong>Countervailing duty (CVD)</strong> — levied to offset subsidies granted by the exporting country's government.</li>
      <li><strong>Safeguard duty</strong> — levied when a sudden import surge threatens a domestic industry. Rare; applied to broad HSN ranges for limited periods.</li>
    </ul>
    <p>Trade remedy duties are added <em>after</em> BCD but before IGST in the stacking order. They are non-creditable. Check DGTR's <a href="https://www.dgtr.gov.in/" rel="nofollow noopener">notifications page</a> and the CBIC tariff headnotes for your HSN before finalising a landed-cost estimate on any import from China, South Korea, Thailand, Vietnam, or Taiwan — these are the origins most frequently hit.</p>
  </section>

  <section id="classification">
    <h2>7. Finding the right HSN — the classification rules</h2>
    <p>HSN classification is governed by the <strong>General Rules of Interpretation (GRI) 1–6</strong>, printed as the preamble to the Customs Tariff. They are global (WCO) and binding in every Customs administration worldwide. In practice, five patterns account for most classification disputes:</p>
    <ol>
      <li><strong>Specific beats general.</strong> A heading that names the article by name (e.g., 8517 — telephones for cellular networks) beats a general heading (e.g., 8525 — transmission apparatus). Smartphones go under 8517, not 8525, even though a smartphone is technically "transmission apparatus".</li>
      <li><strong>Essential character for composite goods.</strong> A set retailed together — a camera with a tripod and memory card — classifies under the heading of the item that gives the set its essential character (the camera).</li>
      <li><strong>Parts and accessories.</strong> Parts of HSN X usually classify under a specific "parts" subheading of X — not under their own material heading. A lens filter for a camera is under 9006, not under 7015 (glass).</li>
      <li><strong>"Other" is the last resort.</strong> Every chapter ends in an "Other" heading (XXXX 99 / XXXX 90). Use it only after confirming no specific heading fits — customs officers routinely reclassify "other" entries upward to a more specific (and usually higher-duty) heading.</li>
      <li><strong>6-digit global vs 8-digit national.</strong> The first 6 digits are globally uniform (WCO HS 2022). The last two are India's national extension under ITC(HS). A shipment sent from Germany under HS 851713 must be filed in India under the matching 8-digit ITC(HS) code — often 8517 13 10 (smartphones).</li>
    </ol>
    <p>Tools on this site: start from the <a href="/sections/">section index</a> to drill down, or use the <a href="/">search bar</a> on any page — it indexes all ~7,000 HS subheadings and India's 8-digit codes. For contentious classifications, file a <a href="https://www.cbic.gov.in/" rel="nofollow noopener">CAAR (Customs Authority for Advance Rulings)</a> application before your first consignment lands; the ruling is binding for 3 years.</p>
  </section>

  <section id="mistakes">
    <h2>8. Common Bill of Entry mistakes</h2>
    <ul>
      <li><strong>Multiplying AV by (BCD% + IGST%).</strong> Understates duty by the IGST-on-BCD compounding. Always stack the components.</li>
      <li><strong>Using FOB instead of CIF for AV.</strong> Actual insurance and freight must be added when the invoice is FOB. Customs adds deemed freight (20% of FOB) and insurance (1.125%) if actuals aren't declared — usually higher than your actuals.</li>
      <li><strong>Forgetting the 1% landing charge.</strong> Missing ₹500 on a ₹50,000 shipment, missing ₹50,000 on a ₹50 lakh shipment. Always add.</li>
      <li><strong>Filing the 6-digit HS instead of the 8-digit ITC(HS).</strong> Bill of Entry requires 8 digits. A 6-digit declaration will be rejected by EDI.</li>
      <li><strong>Claiming FTA preference without a valid CoO.</strong> The CoO must be in the correct format (e.g., SAARC CoO for SAFTA) and must be uploaded with the Bill of Entry. Retroactive claims are not accepted.</li>
      <li><strong>Missing an anti-dumping notification.</strong> ADD isn't auto-populated in every broker's system; check DGTR notifications for your HSN + country before finalising landed cost.</li>
      <li><strong>Assuming IGST = input credit regardless.</strong> IGST paid at import is creditable only if you're GST-registered <em>and</em> the goods are used in the course of business. Personal imports, imports by unregistered persons, and imports of goods used for exempt supplies don't qualify.</li>
    </ul>
  </section>

  <section id="faq">
    <h2>Frequently asked questions</h2>
    ${faqHtml}
  </section>

  <section class="guide-cta">
    <h2>Run your own numbers</h2>
    <p>The formula is implemented, to the rupee, in the <a href="/calculator/">free duty calculator</a>. Enter an HSN and a CIF value; get BCD, SWS, cess, IGST, and landed cost instantly. Or browse the full <a href="/chapters/">97-chapter tariff</a> to find the right classification.</p>
    <p class="note">The rates and notifications cited on this page are accurate as of April 2026. Always verify against the current CBIC notification before filing a Bill of Entry — rates change without warning by gazette notification.</p>
  </section>
</article>`;

  const jsonLdCombined = [articleJsonLd, breadcrumbJsonLd, faqJsonLd];
  const jsonLdScripts = jsonLdCombined
    .map((ld) => `<script type="application/ld+json">${JSON.stringify(ld)}</script>`)
    .join("\n");

  return layout({
    title,
    description,
    canonical,
    bodyHtml: body,
    extraHeadHtml: jsonLdScripts,
  });
}

// ————— Privacy Policy —————
export function privacyPage() {
  const title = `Privacy Policy — ${SITE.name}`;
  const description = `Privacy policy for ${SITE.name}: what data we collect, how Google AdSense and analytics cookies work on this site, and how to opt out.`;
  const canonical = SITE.origin + "/privacy/";
  const body = `
<article>
  <nav class="crumbs"><a href="/">Home</a><span class="sep">›</span><span>Privacy</span></nav>
  <h1>Privacy Policy</h1>
  <p class="lead">Last updated: 24 April 2026.</p>

  <section>
    <h2>What ${SITE.name} does</h2>
    <p>${SITE.name} is a free reference site for Indian HSN codes and customs duty. It does not require you to create an account, log in, or submit any personal information to use the HSN lookup, the duty calculator, or any page on the site. We don't sell user data and we don't run a mailing list off this domain.</p>
  </section>

  <section>
    <h2>Cookies on this site</h2>
    <p>The site does not set first-party tracking cookies. Third-party scripts served by this site may set their own cookies:</p>
    <ul>
      <li><strong>Google AdSense</strong> — if and when AdSense is approved on this site, Google will serve ads. Google uses cookies to serve ads based on a user's prior visits to this website and other websites on the internet. You can opt out of personalised advertising by visiting <a href="https://www.google.com/settings/ads" rel="nofollow noopener">Google Ads Settings</a>. See <a href="https://policies.google.com/technologies/ads" rel="nofollow noopener">How Google uses information from sites or apps that use our services</a>.</li>
      <li><strong>Third-party vendors and ad networks</strong> that are AdSense partners may also set cookies. Users may opt out of cookie use by some third-party vendors at <a href="https://www.aboutads.info/" rel="nofollow noopener">aboutads.info</a>.</li>
      <li><strong>Google Search Console / Bing Webmaster Tools</strong> — these are webmaster-facing services and do not set cookies on visitor browsers; they observe aggregate crawl and search-impression data server-side.</li>
    </ul>
  </section>

  <section>
    <h2>What we log</h2>
    <p>The site is served through Cloudflare. Cloudflare logs HTTP requests (IP address, user-agent, URL, timestamp) for rate-limiting, caching and abuse prevention. These logs are not read or retained by us beyond what Cloudflare retains by default under their standard policies.</p>
  </section>

  <section>
    <h2>Children</h2>
    <p>This site is not directed at children under 13. We do not knowingly collect personal information from children.</p>
  </section>

  <section>
    <h2>Changes to this policy</h2>
    <p>If this policy is updated, the "Last updated" date at the top of the page will reflect the change. Material changes will also be noted in the site's change log.</p>
  </section>

  <section>
    <h2>Contact</h2>
    <p>Questions or concerns about this policy can be sent through the <a href="/contact/">contact page</a>.</p>
  </section>
</article>`;
  return layout({ title, description, canonical, bodyHtml: body });
}

// ————— Contact —————
export function contactPage() {
  const title = `Contact — ${SITE.name}`;
  const description = `How to reach ${SITE.name} — corrections, feedback, partnership enquiries, data-licensing questions.`;
  const canonical = SITE.origin + "/contact/";
  const body = `
<article>
  <nav class="crumbs"><a href="/">Home</a><span class="sep">›</span><span>Contact</span></nav>
  <h1>Contact</h1>
  <p class="lead">Rate correction, data-licensing enquiry, or press question? Drop a note via any of the channels below.</p>

  <section>
    <h2>Rate corrections</h2>
    <p>If a rate on this site doesn't match the current CBIC notification for your HSN, we want to know. Include the HSN code, the rate you're seeing on our page, the correct rate, and a link to the notification that establishes it. We re-verify every reported correction against CBIC sources before pushing the fix.</p>
  </section>

  <section>
    <h2>Email</h2>
    <p>General enquiries: <a href="mailto:hello@hsnlookup.in">hello@hsnlookup.in</a>. We read everything, reply to most within a few working days.</p>
  </section>

  <section>
    <h2>Data licensing</h2>
    <p>If you're building a tool and want a structured feed of HSN + IGST + BCD data, we can discuss a licensed bulk export. Indicate your use case in the first message.</p>
  </section>

  <section>
    <h2>Press and partnerships</h2>
    <p>Happy to contribute or be quoted on Indian customs, HSN classification, or tariff structure. Same inbox.</p>
  </section>

  <section>
    <h2>What we can't help with</h2>
    <p>We aren't a customs broker and can't file Bills of Entry or advise on specific shipments. For that, please engage a licensed Customs House Agent (CHA).</p>
  </section>
</article>`;
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
      <li>Consolidated effective rates: <strong>CBIC Notification No. 45/2025-Customs</strong> dated 24-Oct-2025 — the master exemption notification superseding 29 prior notifications including 50/2017-Customs. We parse this PDF locally and apply it on top of the statutory First Schedule rates.</li>
      <li>Amendments: <strong>CBIC Notification No. 02/2026-Customs</strong> dated 1-Feb-2026 — Budget 2026-27 deletions and date-limit extensions to 45/2025.</li>
      <li>Rate-change narrative: <strong>TRU D.O. Letter (Annexure I)</strong> — the Tax Research Unit's chapter-wise explainer released with Budget 2026-27.</li>
      <li>Statutory base rates: <strong>First Schedule to the Customs Tariff Act, 1975</strong> (not currently published as a single free machine-readable file by the Government of India; where we use it, every such page carries a "statutory First Schedule rate" disclaimer).</li>
    </ul>
  </section>
  <section>
    <h2>How this is refreshed</h2>
    <p>Rates flagged <strong>Confirmed against Notification 45/2025-Customs</strong> are cross-checked against the parsed text of the CBIC notification. Rates flagged <strong>Statutory First Schedule rate</strong> are the commonly-cited base rate from the Customs Tariff Act, subject to verification against the current notification for each specific shipment. Whenever CBIC publishes a new consolidated exemption notification (typically after the Union Budget), the source PDFs in this repo are re-downloaded, the seed dataset re-verified, and any changed rates are flagged in the commit history. The process is documented in <code>scripts/REFRESH.md</code> of the source repository.</p>
  </section>
  <section>
    <h2>Honesty</h2>
    <p>We currently publish verified rates for a curated set of high-interest HSNs. The full 8-digit tariff (≈21,000 lines) is not publicly available as a bulk machine-readable file from any Government of India source. Commercial providers (Taxmann, R.K. Jain, Seair) publish it as an annual book or API. Expanding our coverage is a planned reinvestment of future revenue. Until then, pages for HSNs not in our verified set show the global 6-digit WCO classification only, and link out to the CBIC tariff for rate verification.</p>
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
  const today = new Date().toISOString().slice(0, 10);
  const items = urls
    .map(
      (u) =>
        `<url><loc>${SITE.origin}${u}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq></url>`,
    )
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${items}</urlset>`;
}

export function robotsTxt() {
  return `User-agent: *\nAllow: /\nSitemap: ${SITE.origin}/sitemap.xml\n`;
}
