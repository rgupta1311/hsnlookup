hsnlookup.in — India HSN + Customs Duty Database 2026

What's in this file
14,416 India 8-digit ITC(HS) tariff items with BCD, SWS, IGST and cess rates, plus live landed-cost formulas.

How to use
1. Change the CIF value in column H for any row. The AV, BCD, SWS, Cess, IGST, Total Duty, Landed Cost and Effective % columns update automatically.
2. Columns D-G (BCD/SWS/IGST/Cess percentages) are the source rates. Edit them to model alternate scenarios (FTA concessional rates, anti-dumping overlays, etc).
3. Column P (Effective %) = (Total Duty / AV) × 100. The all-in duty rate after the four components stack together.

Data sources
• IGST: CBIC GST rate schedule (notifications under the IGST Act, 2017), compiled via Cleartax's public HSN lookup API.
• BCD: hand-reviewed for 36 high-interest codes; chapter-default First Schedule statutory rate for the rest (verify against current CBIC notification before filing Bill of Entry).
• SWS: 10% of BCD, Finance Act 2018 Section 110.
• Cess: Compensation Cess under GST Compensation Act 2017 for specific goods.

Licence
CC-BY-4.0. You may use this in commercial tools, ERPs, dashboards. You must attribute hsnlookup.in with a visible link back.

Support
hello@hsnlookup.in — rate corrections, bulk-licence enquiries, custom formats.

Generated
2026-04-24 • hsnlookup.in
