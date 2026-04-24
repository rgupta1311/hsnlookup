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
    slug: "cement-india",
    name: "cement",
    h1: "Customs duty on imported cement in India",
    hsn: "25232910",
    hsnDescription: "Ordinary portland cement, dry",
    typicalCifInr: 500000,
    typicalScenario: "a bulk cement shipment (~50 tonnes) imported for a construction project",
    personaHooks: [
      "Builders importing premium cement for specialised construction",
      "Traders arbitraging cross-border cement price gaps (common on Sri Lanka / Bangladesh routes)",
      "Project-based EPC contractors when domestic supply is constrained",
    ],
    keyInsight:
      "Cement imports attract 5% BCD + 10% SWS on BCD + 28% IGST — effective ~34.9% on assessable value. On a ₹5 lakh CIF shipment, landed cost is around ₹6.75 lakh before inland freight and handling. The 28% IGST slab is because cement falls in GST's highest 'demerit goods' bucket alongside tobacco and luxury cars — a long-running policy anomaly importers complain about.",
    faqs: [
      {
        q: "What's the HSN code for cement?",
        a: "The main 4-digit heading is HSN 2523. Specific 8-digit codes: 25231000 (Portland blends), 25232100 (white cement), 25232910 (ordinary Portland, dry), 25232920 (coloured Portland), 25232930 (Portland pozzolana / PPC), 25232940 (Portland slag), 25233000 (aluminous), 25239020 (high-alumina refractory). Each has the same 5% BCD + 28% IGST duty structure; choose the 8-digit that matches your product's formulation.",
      },
      {
        q: "Can GST-registered buyers claim IGST as input credit on cement imports?",
        a: "Yes. IGST on imports of inputs used for taxable supplies is creditable. The economic cost to a registered contractor drops from the 34.9% sticker rate to roughly 5%-6% of AV — BCD + SWS only. This is why institutional buyers import cement at scale despite the high headline IGST.",
      },
      {
        q: "Are there anti-dumping duties on cement from specific countries?",
        a: "As of April 2026 there is no in-force anti-dumping duty on ordinary Portland cement. DGTR has periodically investigated Pakistani and Sri Lankan cement but has not levied ADD. Always check the current DGTR notifications for your specific origin before finalising a landed-cost estimate.",
      },
      {
        q: "Does cement import require BIS certification?",
        a: "Yes. Portland cement is under the Compulsory Registration Scheme (CRS) — imports require a BIS licence (IS 269 for OPC, IS 1489 for PPC, IS 455 for PSC etc). Non-compliant shipments are refused clearance regardless of duty paid. The licensing process takes months and must be in place before the shipment arrives.",
      },
    ],
  },
  {
    slug: "refrigerator-india",
    name: "refrigerator",
    h1: "Customs duty on imported refrigerators in India",
    hsn: "84182100",
    hsnDescription: "Household refrigerators, compression-type",
    typicalCifInr: 80000,
    typicalScenario: "a 400L side-by-side refrigerator from a US or European retailer",
    personaHooks: [
      "Homeowners importing a specific appliance not sold in India",
      "Returning NRIs bringing appliances in their household shipment",
      "Hotels/resorts sourcing commercial-grade equipment directly",
    ],
    keyInsight:
      "Refrigerators attract 20% BCD + 10% SWS on BCD + 18% IGST (recently moved down from 28% slab). Effective duty on assessable value: ~44.35%. On a ₹80,000 CIF fridge, landed cost is around ₹1,15,740 before inland freight and installation.",
    faqs: [
      {
        q: "Can I import a refrigerator in my household goods shipment?",
        a: "Yes, under Transfer of Residence rules a returning Indian with at least two years' residence abroad can bring home appliances at concessional duty (currently 15% all-in on the aggregate value). The TR allowance works differently from the general import duty stack.",
      },
      {
        q: "Are commercial refrigerators classified differently?",
        a: "Yes. Commercial/industrial refrigeration units (display cabinets, walk-in chillers) fall under HSN 8418.50 or 8418.61 — BCD typically 7.5% lower than household 8418.21. Check your specific unit's classification before filing.",
      },
      {
        q: "Does BIS certification apply?",
        a: "Yes. Imported refrigerators require a BIS (Bureau of Indian Standards) registration mark under the Compulsory Registration Scheme. Imports without BIS registration are refused clearance regardless of duty paid.",
      },
    ],
  },
  {
    slug: "washing-machine-india",
    name: "washing machine",
    h1: "Customs duty on imported washing machines in India",
    hsn: "84501100",
    hsnDescription: "Fully-automatic washing machines, dry linen capacity ≤ 10 kg",
    typicalCifInr: 60000,
    typicalScenario: "a front-load washer-dryer combo from a European manufacturer",
    personaHooks: [
      "Homeowners looking at models not available locally",
      "Returning NRIs shipping household appliances",
      "Industrial laundries importing commercial-grade equipment",
    ],
    keyInsight:
      "Washing machines under 10 kg capacity attract 20% BCD + 10% SWS + 18% IGST — an effective 44.35% on assessable value. Machines above 10 kg capacity fall under HSN 8450.20 with the same rate structure. Industrial laundry machines (HSN 8451) are at 7.5% BCD with partial concessions.",
    faqs: [
      {
        q: "Is there any duty concession on energy-efficient imports?",
        a: "Not at the BCD level. India's energy-efficiency push works via the BEE (Bureau of Energy Efficiency) star-rating system on domestic sales — it affects what can be sold, not import duty.",
      },
      {
        q: "Do combined washer-dryers classify the same?",
        a: "Yes. Machines that wash and dry in the same drum classify under 8450.11 or 8450.12 (same rate as washing-only machines). Separate dryers classify under 8451.21 with a slightly different structure.",
      },
    ],
  },
  {
    slug: "air-conditioner-india",
    name: "air conditioner",
    h1: "Customs duty on imported air conditioners in India",
    hsn: "84158110",
    hsnDescription: "Split air conditioners incorporating a refrigerating unit with a reversing valve",
    typicalCifInr: 45000,
    typicalScenario: "a 1.5 ton inverter split AC from an international brand",
    personaHooks: [
      "Builders importing centralized HVAC units for commercial projects",
      "Homeowners sourcing specific models not sold domestically",
      "Hotel chains standardizing equipment across properties",
    ],
    keyInsight:
      "Split ACs attract 20% BCD + 10% SWS + 28% IGST (AC units are in the 28% GST slab). Effective duty: ~56.25% on assessable value. On a ₹45,000 CIF AC, landed cost is around ₹70,310 before dealer margin and installation. The 28% IGST slab is why imported ACs are dramatically more expensive than domestically-assembled units sold at Indian retail.",
    faqs: [
      {
        q: "Are window ACs duty-treated the same?",
        a: "Yes, both split and window AC units under 2 tonne fall under HSN 8415.10 with the same duty structure. Larger central-plant AC systems (HSN 8415.81/82) have a different rate structure, often with concessions for HVAC used in manufacturing facilities.",
      },
      {
        q: "What about refrigerant considerations?",
        a: "Import of HCFC-22 refrigerant (found in older split ACs) is progressively restricted under India's Montreal Protocol commitments. New-gen R-32/R-410A units clear customs normally; legacy R-22 units need additional ODS import authorization.",
      },
    ],
  },
  {
    slug: "smart-tv-india",
    name: "smart TV",
    h1: "Customs duty on imported televisions in India",
    hsn: "85287219",
    hsnDescription: "LCD/LED television sets, colour",
    typicalCifInr: 70000,
    typicalScenario: "a 55-inch 4K OLED TV from an international retailer",
    personaHooks: [
      "Home theatre enthusiasts buying premium models",
      "Hotels sourcing in-room TVs in bulk",
      "Returning NRIs importing household electronics",
    ],
    keyInsight:
      "TVs attract 15% BCD + 10% SWS + 28% IGST — effective 47.25% on assessable value. On a ₹70,000 CIF TV, landed cost is around ₹1,03,100. The 28% IGST slab applies to all display devices above 32\" diagonal; smaller sets historically had concessional rates but those have been rationalized.",
    faqs: [
      {
        q: "Is 4K / 8K or HDR-capability treated differently?",
        a: "No. The duty structure depends on screen size, not resolution or HDR. Anything under HSN 8528.72 (colour television sets) gets 15% BCD regardless of feature set.",
      },
      {
        q: "Do I need BIS registration?",
        a: "Yes. All TVs imported into India require BIS Compulsory Registration Scheme (CRS) mark. Non-compliant imports are refused clearance.",
      },
      {
        q: "What about TVs imported as display monitors for commercial use?",
        a: "Large displays (60\"+) used for digital signage may classify under HSN 8528.52 (monitors for ADP) with 0% BCD — but this is only valid if the display is genuinely used with a computer and not for broadcast reception. Customs disputes on this classification are common.",
      },
    ],
  },
  {
    slug: "wine-india",
    name: "imported wine",
    h1: "Customs duty on imported wine in India",
    hsn: "22042110",
    hsnDescription: "Wine of fresh grapes — Port and other red wines",
    typicalCifInr: 3000,
    typicalScenario: "a bottle of mid-tier French Bordeaux from a European importer",
    personaHooks: [
      "Restaurants and hotels importing for their wine lists",
      "Licensed retailers building a premium wine catalogue",
      "Wine enthusiasts exploring import legality",
    ],
    keyInsight:
      "Wine attracts 150% BCD + 10% SWS on BCD — no IGST (alcoholic liquor is outside GST, state excise applies). On a ₹3,000 CIF bottle, BCD + SWS land at ~₹4,954, so duty alone roughly doubles the imported price before state excise piles on another 100–300%.",
    faqs: [
      {
        q: "Can an individual import wine for personal use?",
        a: "Only within the ₹50,000 baggage allowance at an international airport (total 2 litres of alcohol for passengers 18+). Personal courier imports of wine require a state excise licence — there's no exception.",
      },
      {
        q: "Does the India-Australia ECTA reduce wine BCD?",
        a: "Yes, the ECTA introduced phased BCD reductions on Australian wines starting at ₹5,000+/case ($375 FOB) — dropping from 150% towards 25% over ten years. Rules of origin require the wine to be substantially Australian (grapes grown there, vinified there).",
      },
      {
        q: "What about sparkling wine and champagne?",
        a: "Sparkling wine (HSN 2204.10) is at 150% BCD like still wine. Champagne specifically classifies under 2204.10 — appellation is irrelevant to customs, it's a sparkling wine.",
      },
    ],
  },
  {
    slug: "beer-india",
    name: "imported beer",
    h1: "Customs duty on imported beer in India",
    hsn: "22030000",
    hsnDescription: "Beer made from malt",
    typicalCifInr: 500,
    typicalScenario: "a case of Belgian craft beer from a specialist importer",
    personaHooks: [
      "Craft-beer bars and restaurants building imported taplists",
      "Licensed specialty retailers",
      "Consumers curious about duty on premium imported beer",
    ],
    keyInsight:
      "Beer attracts 100% BCD + 10% SWS on BCD — no IGST. On a ₹500 CIF bottle, BCD + SWS add ~₹551, so duty more than doubles the bottle before state excise. This is why even mass-market imported beer lands at 3-5× the home-country price in Indian specialty stores.",
    faqs: [
      {
        q: "What's the difference between lager, ale, stout for duty?",
        a: "None — all beers made from malt classify under HSN 2203.00 with the same 100% BCD. Non-alcoholic beer falls under 2202.91 with a lower 30% BCD and IGST applies as it's not alcoholic liquor.",
      },
      {
        q: "Can breweries import bulk beer for local packaging?",
        a: "Yes, under a state excise-licensed arrangement. Bulk beer imports still attract 100% BCD — there's no processing concession.",
      },
    ],
  },
  {
    slug: "chocolate-india",
    name: "chocolate",
    h1: "Customs duty on imported chocolate in India",
    hsn: "18069010",
    hsnDescription: "Chocolate and chocolate products",
    typicalCifInr: 800,
    typicalScenario: "a box of Swiss premium chocolate from a European online retailer",
    personaHooks: [
      "Individuals buying premium chocolate not sold in India",
      "Gift retailers importing luxury confectionery",
      "HoReCa buyers sourcing specialty ingredients",
    ],
    keyInsight:
      "Chocolate attracts 30% BCD + 10% SWS + 18% IGST — effective 54.12% on assessable value. On a ₹800 CIF box, landed cost is around ₹1,233. Chocolate is one of the few sweet goods with 30% BCD specifically — protecting domestic confectionery manufacturing.",
    faqs: [
      {
        q: "Is cocoa powder treated the same?",
        a: "Raw cocoa powder (HSN 1805) gets 30% BCD + 5% IGST. Chocolate liquor/paste (HSN 1803) gets 30% BCD + 18% IGST. The finished-chocolate rate (HSN 1806) applies to anything packaged for consumption.",
      },
      {
        q: "Are FSSAI requirements strict?",
        a: "Yes. All imported food products including chocolate require FSSAI registration and labelling compliance before customs clearance. A non-compliant shipment gets held by FSSAI even if duty is paid.",
      },
    ],
  },
  {
    slug: "coffee-india",
    name: "coffee",
    h1: "Customs duty on imported coffee in India",
    hsn: "09011111",
    hsnDescription: "Coffee, not roasted, not decaffeinated — Arabica plantation A grade",
    typicalCifInr: 15000,
    typicalScenario: "200 kg of Ethiopian specialty-grade green coffee for a roastery",
    personaHooks: [
      "Specialty coffee roasters sourcing green beans from origin",
      "Café chains importing signature blends",
      "Traders competing with domestic plantation output",
    ],
    keyInsight:
      "Green coffee attracts 100% BCD + 10% SWS + 5% IGST — effective ~115.5% on assessable value. Roasted coffee (HSN 0901.21) is at a similar rate. India is a net coffee exporter so imports are protected to keep domestic plantation prices defended. Most specialty roasters doing imports source via green-coffee traders who aggregate under SAARC / FTA concessional notifications where applicable.",
    faqs: [
      {
        q: "Are FTA concessions available on coffee?",
        a: "Yes. India-ASEAN and India-Sri Lanka FTAs offer concessional BCD (typically 50% off, subject to rules of origin). Specialty beans from Ethiopia / Kenya / Colombia don't have an FTA — they pay the full 100%.",
      },
      {
        q: "Does instant coffee attract the same rate?",
        a: "Instant coffee (HSN 2101.11) is at 30% BCD + 18% IGST — a significantly lower-BCD path often used to import high-value coffee extracts for re-blending.",
      },
    ],
  },
  {
    slug: "camera-india",
    name: "camera",
    h1: "Customs duty on imported cameras in India",
    hsn: "90061000",
    hsnDescription: "Photographic cameras",
    typicalCifInr: 120000,
    typicalScenario: "a full-frame mirrorless camera body bought from the US",
    personaHooks: [
      "Professional photographers sourcing gear cheaper abroad",
      "Content creators buying specialty lenses or cinema cameras",
      "Returning travellers with a camera purchased abroad",
    ],
    keyInsight:
      "Photographic cameras attract 10% BCD + 10% SWS + 18% IGST — effective 30.98% on assessable value. On a ₹1,20,000 CIF camera, landed cost is around ₹1,57,180. Notably lower than the 44.35% on most consumer electronics because photographic equipment historically had industrial/creative-goods carve-outs in the tariff.",
    faqs: [
      {
        q: "Are lenses and accessories treated the same?",
        a: "Camera lenses (HSN 9002) are at 10% BCD + 18% IGST — same as camera bodies. Memory cards (HSN 8523) are at 0% BCD + 18% IGST. Flash units (HSN 9006.61) are at 10% BCD + 18% IGST.",
      },
      {
        q: "What about cinema/professional video cameras?",
        a: "Broadcast and cinema cameras (HSN 8525.80) attract 10% BCD + 18% IGST. Some cinema cameras used by registered production companies can claim end-use-based concessions under 45/2025-Customs.",
      },
      {
        q: "Can I bring a camera in baggage duty-free?",
        a: "The ₹50,000 baggage allowance covers a camera for personal use. Professional gear worth more than the allowance is assessed at the 38.5% baggage duty rate — often cheaper than commercial courier clearance.",
      },
    ],
  },
  {
    slug: "cosmetics-india",
    name: "cosmetics and skincare",
    h1: "Customs duty on imported cosmetics and skincare in India",
    hsn: "33049990",
    hsnDescription: "Beauty, make-up and skin-care preparations",
    typicalCifInr: 5000,
    typicalScenario: "a haul of Korean or Japanese skincare products from an international e-commerce site",
    personaHooks: [
      "Individuals buying K-beauty or J-beauty products not sold in India",
      "Small resellers running Instagram storefronts",
      "Salons and spas importing professional-grade products",
    ],
    keyInsight:
      "Cosmetics attract 20% BCD + 10% SWS + 28% IGST (cosmetics are in the 28% GST slab as a luxury good). Effective duty: ~56.25% on assessable value. On a ₹5,000 CIF haul, landed cost is around ₹7,815 before courier fees.",
    faqs: [
      {
        q: "Is cosmetic import regulated beyond customs?",
        a: "Yes. Cosmetic imports require CDSCO (Central Drugs Standard Control Organisation) registration under the Drugs and Cosmetics Rules. Unregistered cosmetic imports are refused even if duty is paid. The registration process is product-by-product and takes weeks to months.",
      },
      {
        q: "Do mini sizes or travel samples qualify for the gift exemption?",
        a: "Unsolicited gifts up to ₹5,000 CIF may qualify for nil duty under Notification 171/93-Cus. A commercial order of \"samples\" doesn't qualify even if individually small — customs looks at the total shipment value and commercial intent.",
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
