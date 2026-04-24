// High-intent "customs duty on [product] in India" SEO pages.
// Each entry maps a product slug to the verified 8-digit HSN in the seed,
// plus product-specific context (typical price, scenario, FAQs) the generic
// HSN page can't carry. Updated 2026-04-24; rates as reviewed against the
// Finance Act 2025 and CBIC notifications current at that date.

export const PRODUCTS = [
  {
    slug: "iphone-india",
    name: "iPhone",
    h1: "Customs duty on iPhone imports into India",
    hsn: "85171300",
    hsnDescription: "Smartphones",
    typicalCifInr: 85000,
    typicalScenario: "an iPhone 15 (128GB) bought on the US Apple Store and couriered to India",
    personaHooks: [
      "People buying an iPhone from the US Apple Store because it's ₹20–30k cheaper before duty",
      "NRIs bringing iPhones back for family",
      "Small resellers trying to arbitrage the India/US price gap",
    ],
    keyInsight:
      "iPhone imports attract 20% BCD, 10% SWS on BCD, and 18% IGST stacked on top — an effective rate of 44.35%. The US sticker price needs to be ~31% below the India price just to break even after duty and FX, and most currently aren't. Gifts up to ₹5,000 CIF are exempt but a single iPhone blows that limit on day one.",
    faqs: [
      {
        q: "Is there any way to import an iPhone into India without paying duty?",
        a: "No legal way for a commercial purchase. The two exceptions are (1) a bona fide gift up to ₹5,000 CIF value — which will not cover any current iPhone — and (2) the Transfer of Residence rules for returning NRIs, which allow one mobile phone duty-free under specific conditions (returning after a year abroad, phone was in personal use).",
      },
      {
        q: "What's the duty if I buy an iPhone in Dubai and bring it in my luggage?",
        a: "Indian passengers from outside India are entitled to a duty-free allowance of ₹50,000 for general goods (₹15,000 if coming from Nepal/Bhutan/Myanmar by land). Mobile phones are specifically included. One new iPhone typically exceeds this — the officer will assess duty on the value above ₹50,000 at the baggage rate (currently 38.5% all-in).",
      },
      {
        q: "Can I claim GST input credit on an imported iPhone?",
        a: "Only if you are GST-registered and the iPhone is used in the course of business (e.g., bought by a GST-registered company for an employee). Personal imports by unregistered individuals cannot claim IGST credit; the 18% IGST is a sunk cost.",
      },
      {
        q: "What if Apple declares a lower value on the invoice to reduce my duty?",
        a: "Customs can reassess using their own valuation rules (Rule 12 of the Customs Valuation Rules 2007). Undervaluation is the single most common reason for a courier shipment to get held at customs. Declaring the actual retail value paid is the safe path.",
      },
    ],
  },
  {
    slug: "laptop-india",
    name: "laptop",
    h1: "Customs duty on laptops imported into India",
    hsn: "84713010",
    hsnDescription: "Portable automatic data processing machines (laptops)",
    typicalCifInr: 120000,
    typicalScenario: "a MacBook Air M3 bought from the US Apple Store",
    personaHooks: [
      "Professionals buying a MacBook from the US for a ₹15–25k saving after FX",
      "Freelancers who want the US keyboard layout or a spec not sold in India",
      "Students returning from studies abroad with a laptop bought on campus",
    ],
    keyInsight:
      "Laptops imported into India attract 0% BCD but 18% IGST — an effective 18% on the assessable value. That's the same rate whether you import a ₹50,000 Chromebook or a ₹3,00,000 MacBook Pro. Because BCD is zero, the duty stack collapses to a flat 18% — much simpler than most electronics.",
    faqs: [
      {
        q: "Why is BCD 0% on laptops when smartphones are 20%?",
        a: "India's tariff strategy has been to keep information-technology agreement (ITA-1) goods at 0% BCD — this includes laptops, monitors, computer peripherals and networking equipment. Smartphones were moved out of that band in 2018 to protect domestic manufacturing under the PLI scheme.",
      },
      {
        q: "Does the free baggage allowance cover a laptop from abroad?",
        a: "Yes. A laptop for personal use carried by an Indian passenger returning from abroad is exempt under the baggage rules, over and above the general ₹50,000 allowance — provided it is one unit for personal use.",
      },
      {
        q: "What if I'm importing a laptop for a business?",
        a: "Same 18% IGST applies, but if you're GST-registered, it is input credit. Net cost to the business is the CIF + SWS (0 since BCD is 0) + any courier/clearance fees. This is why many startups import MacBooks for developers — the effective duty is close to zero for a registered buyer.",
      },
      {
        q: "Do tablets count as laptops?",
        a: "No. iPads and Android tablets fall under a different 8-digit HSN (8471.30 subfamilies vary; many tablets classify as 8471.30.90). Rates are often similar but verify on the Bill of Entry — tablets with SIM / telephony functionality can be reclassified under 8517 with 20% BCD.",
      },
    ],
  },
  {
    slug: "gold-india",
    name: "gold",
    h1: "Customs duty on gold imports into India",
    hsn: "71081300",
    hsnDescription: "Gold in semi-manufactured forms (bars, biscuits)",
    typicalCifInr: 600000, // 10g at prevailing India price
    typicalScenario: "10g of 24-carat gold bought overseas and brought back by an Indian passenger",
    personaHooks: [
      "Returning NRIs bringing gold as a store of value",
      "Jewellery wholesalers re-importing after an exhibition",
      "Individuals testing the NRI-specific duty structure",
    ],
    keyInsight:
      "Gold imported into India attracts 15% BCD + 10% SWS on BCD + 3% IGST — effective duty of ~19.6% on the assessable value. This is why domestic gold prices in India track international prices plus a ~20% premium. The import structure has changed repeatedly since 2013 and is politically sensitive — check the current notification before any large import.",
    faqs: [
      {
        q: "How much gold can I bring to India duty-free?",
        a: "For an Indian passenger abroad for more than six months: up to 20g (or ₹50,000) for male passengers, 40g (or ₹1,00,000) for female passengers and children — free under baggage rules. Beyond that, duty is ~13.25% (a special concessional rate) up to 1 kg. Above 1 kg, the full 19.6% applies plus heightened scrutiny.",
      },
      {
        q: "Is gold jewellery treated the same as gold bars?",
        a: "No. Gold jewellery falls under HSN 7113, with 20% BCD + 10% SWS + 3% IGST (higher than bars). Customs distinguishes between investment-grade gold (bars, coins, biscuits) and ornamental gold (jewellery) — bring in the right form based on your intent.",
      },
      {
        q: "Do I need to declare gold at the airport?",
        a: "Yes, if you exceed the free allowance. Walking through the Green Channel with undeclared gold above the threshold is a smuggling offence — you lose the gold and face prosecution. The Red Channel duty assessment is a formality if paperwork is in order.",
      },
      {
        q: "Can I ship gold through courier or post?",
        a: "No. Gold, like currency, cannot be imported via courier or post by an individual. It must be carried in person or cleared through a bank under the AD Category-I scheme.",
      },
    ],
  },
  {
    slug: "whisky-india",
    name: "whisky",
    h1: "Customs duty on imported whisky and spirits in India",
    hsn: "22083012",
    hsnDescription: "Whiskies — Scotch",
    typicalCifInr: 5000, // a bottle of Scotch CIF
    typicalScenario: "a bottle of single-malt Scotch ordered from a UK retailer",
    personaHooks: [
      "Importers of premium Scotch brands for distribution",
      "Hotels and restaurants stocking imported spirits for F&B",
      "Curious enthusiasts wondering why imported whisky is so expensive in India",
    ],
    keyInsight:
      "Imported whisky attracts 150% BCD. That's the statutory rate — but there is no IGST on alcoholic beverages for human consumption (alcohol is outside GST; state excise applies instead). State-level excise typically adds another 100–300% on the import-landed cost, which is why a bottle that costs ₹5,000 CIF retails at ₹15,000–₹25,000 in an Indian store.",
    faqs: [
      {
        q: "Can an individual import whisky into India?",
        a: "Only in limited quantities under the duty-free allowance at international airports (2 litres total of alcoholic beverages, for passengers 18+). Personal courier imports of alcohol are not permitted — you need an importer's licence issued by the state excise authority.",
      },
      {
        q: "Why is there no IGST on whisky?",
        a: "Alcoholic liquor for human consumption was constitutionally kept outside GST when GST launched in 2017 — it remains under state excise control. Customs still levies BCD and SWS, but no central-level GST/IGST applies.",
      },
      {
        q: "Is there any FTA that reduces BCD on whisky?",
        a: "No blanket FTA reduces whisky BCD. The India-UK FTA (signed 2024) includes a phased reduction of BCD on Scotch from 150% to 75% over ten years — the first tranche (150% → 110%) took effect in 2025. Check the current tranche before planning an import.",
      },
      {
        q: "What's the duty on wine and beer by comparison?",
        a: "Wine (HSN 2204) attracts 150% BCD like whisky. Beer (HSN 2203) is 100% BCD. Neither attracts IGST — both are subject to state excise.",
      },
    ],
  },
  {
    slug: "perfume-india",
    name: "perfume",
    h1: "Customs duty on imported perfume in India",
    hsn: "33030010",
    hsnDescription: "Perfumes containing spirit",
    typicalCifInr: 8000,
    typicalScenario: "a 100ml bottle of designer perfume bought from a European online retailer",
    personaHooks: [
      "Individuals buying niche or full-size perfumes unavailable in India",
      "Small resellers running online storefronts",
      "Travellers stocking up at duty-free then shipping from abroad",
    ],
    keyInsight:
      "Imported perfume attracts 20% BCD, 10% SWS on BCD, and 18% IGST — an effective 44.35% on the assessable value. A ₹8,000 CIF bottle lands at around ₹11,500 before courier fees. The duty-free allowance for an arriving passenger is ₹50,000 of general goods, which typically covers one personal bottle — but personal courier shipments do not get the baggage allowance.",
    faqs: [
      {
        q: "Does perfume classify as a liquid for shipping purposes?",
        a: "Yes. Perfume is classified as flammable liquid under IATA dangerous-goods rules. Most courier carriers have explicit restrictions on shipping perfume internationally — some refuse it entirely, others require a hazmat surcharge. Factor this in before placing an online order.",
      },
      {
        q: "Are testers or sample sizes treated differently?",
        a: "No. Customs assesses on the declared value regardless of whether it's a full bottle or a 10ml sample. However, samples with negligible value may qualify for the gift exemption up to ₹5,000 CIF if unsolicited.",
      },
      {
        q: "Why do some perfumes cost more in India even after duty?",
        a: "Beyond the 44.35% customs duty, authorized distributors apply their own margin (typically 30–50%). Full-value parallel imports by individuals can actually be cheaper than buying from Indian retail — but only if courier fees and the occasional customs hold don't eat the saving.",
      },
    ],
  },
  {
    slug: "sunglasses-india",
    name: "sunglasses",
    h1: "Customs duty on imported sunglasses in India",
    hsn: "90041000",
    hsnDescription: "Sunglasses",
    typicalCifInr: 12000,
    typicalScenario: "a pair of Ray-Ban Aviators bought from the US or a European retailer",
    personaHooks: [
      "Individuals buying premium sunglasses cheaper abroad",
      "Optical retailers sourcing stock not available from Indian distributors",
    ],
    keyInsight:
      "Sunglasses attract 20% BCD + 10% SWS + 18% IGST — effective 44.35%. A ₹12,000 CIF pair of Ray-Bans lands at ~₹17,300 after duty. Prescription sunglasses classify under a different HSN (9004.90) with the same rates.",
    faqs: [
      {
        q: "Does the baggage allowance cover sunglasses?",
        a: "Yes, they fall under the general ₹50,000 allowance for a passenger arriving from outside India. A single pair of premium sunglasses rarely crosses that threshold by itself unless combined with other goods.",
      },
      {
        q: "Are polarized or prescription sunglasses classified differently?",
        a: "Polarized sunglasses without prescription still fall under 9004.10. Prescription sunglasses (corrective lenses) fall under 9004.90 — BCD/IGST rates are the same, but some notifications treat them as medical goods with partial concessions. Check the notification current on the date of filing.",
      },
    ],
  },
  {
    slug: "watch-india",
    name: "wrist watch",
    h1: "Customs duty on imported wrist watches in India",
    hsn: "91022900",
    hsnDescription: "Wrist-watches (non-automatic)",
    typicalCifInr: 40000,
    typicalScenario: "an automatic Swiss watch bought from a European authorized dealer",
    personaHooks: [
      "Individuals buying entry-level Swiss watches (Tissot, Longines)",
      "Enthusiasts importing micro-brand watches from Kickstarter or direct",
      "Returning travellers with a watch purchased abroad",
    ],
    keyInsight:
      "Imported watches attract 20% BCD + 10% SWS + 18% IGST — effective 44.35%. Automatic mechanical watches (HSN 9101/9102) and smartwatches (HSN 9102.12.00) are in the same band. A ₹40,000 CIF watch lands at ~₹57,740 before courier fees.",
    faqs: [
      {
        q: "Is a smartwatch like an Apple Watch classified the same?",
        a: "Apple Watch and similar cellular smartwatches are often classified under HSN 8517 (telephones for cellular networks) by customs — which attracts 20% BCD + 18% IGST, same effective 44.35%. GPS-only wearables without cellular may classify under 9102.12.00.",
      },
      {
        q: "Do watch straps and accessories attract the same duty?",
        a: "Watch straps alone classify under HSN 9113 (watch bands). BCD on leather straps is 20%, metal bracelets 15% — close to but not identical to the complete watch rate.",
      },
    ],
  },
  {
    slug: "solar-panel-india",
    name: "solar panel",
    h1: "Customs duty on imported solar panels in India",
    hsn: "85414300",
    hsnDescription: "Photovoltaic cells assembled in modules or panels",
    typicalCifInr: 25000, // ~1 kW module CIF
    typicalScenario: "a 1 kW residential solar module imported from a Chinese manufacturer",
    personaHooks: [
      "Homeowners installing rooftop solar looking at direct-import pricing",
      "Small EPC contractors sourcing panels outside Indian distributor chains",
      "Commercial solar developers running CAPEX models",
    ],
    keyInsight:
      "Solar modules carry a 40% BCD — one of the highest in the electronics tariff — plus 10% SWS on BCD and 12% IGST. Effective rate: ~59.5% on assessable value. This is deliberate protection for the domestic solar module industry under PLI. Solar cells (HSN 8541.42) are at 25% BCD, so importing cells for module assembly in India gets a ~13 percentage-point tariff advantage over importing finished modules.",
    faqs: [
      {
        q: "Are there exemptions for large solar projects?",
        a: "Yes — projects approved under specific schemes (e.g., PM-KUSUM, CPSU Scheme) may claim concessional BCD via end-use-based notifications. These require an IGCR bond and project-level certification. Retail/residential imports don't qualify.",
      },
      {
        q: "Can I import used solar panels?",
        a: "Second-hand capital goods import is restricted. You need a specific licence from DGFT. The duty structure for used modules is identical to new, plus the import is subject to pre-shipment inspection.",
      },
      {
        q: "What about solar inverters and batteries?",
        a: "Solar inverters (HSN 8504.40) are at 20% BCD + 18% IGST. Lithium-ion batteries (HSN 8507.60) at 15% BCD + 18% IGST. A full rooftop solar system therefore has different duty rates per component — don't assume the 40% solar-module rate applies to the whole kit.",
      },
    ],
  },
  {
    slug: "car-india",
    name: "car (CBU)",
    h1: "Customs duty on imported cars (CBU) in India",
    hsn: "87032391",
    hsnDescription: "Motor cars with spark-ignition engine 1500–3000cc, new, CBU",
    typicalCifInr: 4500000, // mid-range CBU import
    typicalScenario: "a 2.0L petrol sedan imported fully-built (CBU) from Germany or Japan",
    personaHooks: [
      "Enthusiasts importing performance cars not sold in India",
      "Luxury car dealerships operating under an importer's code",
      "Diplomats and Transfer-of-Residence cases",
    ],
    keyInsight:
      "Importing a CBU petrol car in the 1500–3000cc band attracts 70% BCD + 10% SWS + 22% Compensation Cess + 28% IGST, stacked. Effective duty is ~166% of the assessable value — so a ₹45 lakh CIF car lands at ~₹1.2 crore before registration and RTO charges. This is among the highest tariffs in the world for passenger vehicles. Small cars (below 1500cc) are at the same BCD but lower cess. Electric CBUs are at 70% BCD but 5% IGST and no cess.",
    faqs: [
      {
        q: "Can an individual import a car into India?",
        a: "Yes, but only new cars (registered less than 3 years) through an authorized dealer OR under Transfer of Residence for a returning Indian who owned the car abroad for at least one year. Used-car imports by non-TR individuals are restricted to specific exemptions.",
      },
      {
        q: "What's the duty on electric vehicle CBUs?",
        a: "Electric CBUs above ₹30 lakh CIF: 70% BCD + 5% IGST. Below ₹30 lakh: 70% BCD still applies post-2024 (earlier concession withdrawn). Hybrid and plug-in hybrid vehicles are treated as petrol/diesel — 70% BCD plus compensation cess.",
      },
      {
        q: "Is SKD/CKD import cheaper?",
        a: "Semi-Knocked-Down (SKD) units attract 30% BCD, Completely-Knocked-Down (CKD) units attract 15–30% depending on engine, transmission and assembly specifics. Most luxury OEMs (Mercedes, BMW, Audi India) use CKD assembly to land cars at roughly 40–50% effective duty instead of 166%.",
      },
    ],
  },
  {
    slug: "playstation-india",
    name: "PlayStation",
    h1: "Customs duty on PlayStation, Xbox and other gaming consoles in India",
    hsn: "95045000",
    hsnDescription: "Video game consoles and machines",
    typicalCifInr: 45000,
    typicalScenario: "a PlayStation 5 or Xbox Series X bought from the US or Japan",
    personaHooks: [
      "Gamers buying the US edition to get region-unlocked discs",
      "People importing retro or collectors' consoles not sold in India",
      "Returning travellers bringing a console back in luggage",
    ],
    keyInsight:
      "Game consoles attract 20% BCD + 10% SWS + 28% IGST — one of the few HSNs where IGST is at the top 28% slab. Effective duty: ~57.85%. A ₹45,000 CIF console lands at ~₹71,000 before courier fees. Games on disc are classified under the 28% IGST slab too; digital game downloads over the internet are not subject to customs.",
    faqs: [
      {
        q: "Why is IGST on consoles 28%?",
        a: "Video game consoles and accessories are in the GST 28% slab as a luxury/entertainment good — the same slab as casino gambling and some motor vehicles. Contrast with laptops (18% IGST) which are in the standard slab.",
      },
      {
        q: "Can I bring a PlayStation in my check-in baggage?",
        a: "Yes, but the ₹50,000 duty-free baggage allowance applies. A PS5 Pro and accessories can exceed ₹50,000; the excess is assessed at the 38.5% baggage rate, often cheaper than courier-cleared duty of 57.85%.",
      },
      {
        q: "Are PC gaming handhelds (Steam Deck, ROG Ally) classified the same?",
        a: "No — they classify as portable automatic data processing machines under HSN 8471.30.10, same as laptops. That's 0% BCD + 18% IGST — a much lower effective rate than console HSN 9504.50.00.",
      },
    ],
  },
];
