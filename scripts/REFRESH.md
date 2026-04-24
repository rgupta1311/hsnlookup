# Tariff data refresh process

This document is the runbook for keeping `data/seed/hsn.json` in sync with the current Indian customs tariff. It is the authoritative description of what "fresh data" means on hsnlookup.in.

## When to refresh

Trigger a refresh whenever any of the following happens:

1. CBIC publishes a new consolidated exemption notification that supersedes 45/2025-Customs. (Historically: 50/2017 → 45/2025.)
2. CBIC publishes an amendment notification to the currently-active consolidated notification. (Example: 02/2026-Customs amending 45/2025.)
3. Union Budget (1 February each year) — the TRU D.O. Letter and any post-Budget customs notifications are the definitive change list.
4. A trade remedy notification affects a chapter we cover (ADD / CVD / safeguard duty).
5. Quarterly audit, even without a known trigger.

## Sources

| File | URL pattern | Role |
| --- | --- | --- |
| `data/sources/cst45_2025.pdf` | Gazette via abcaus.in or CBIC Tax Portal | Consolidated effective-rate notification |
| `data/sources/cus0226.pdf` | `indiabudget.gov.in/doc/cen/cus0226.pdf` | Budget 2026-27 amendment to 45/2025 |
| `data/sources/dojstru1.pdf` | `indiabudget.gov.in/doc/cen/dojstru1.pdf` | TRU chapter-wise rate-change narrative |

When a new consolidated or amendment notification drops, download it from `taxinformation.cbic.gov.in` (primary) or the abcaus.in Gazette mirror (reliable fallback). Name the new PDF with the notification number + year in `data/sources/` and commit.

## Steps

1. `cd` into the repo.
2. Download the new PDF(s) into `data/sources/`.
3. `pdftotext -layout data/sources/<new>.pdf data/sources/<new>.txt`
4. For each existing HSN in `data/seed/hsn.json`, re-verify by running `node scripts/verifySeedAgainstNotification.js` — the output identifies which seed HSNs appear in the new notification and with what rate.
5. Manually review the output and update the seed JSON where rates have changed. Every changed row gets its `asOf` updated and, if moved to confirmed status, `verificationStatus` updated to `confirmed-<notif-number>`.
6. If the Finance Act introduces new tariff slabs or renumbers HSNs, extend the seed accordingly.
7. Run `npm run build` — verify the changed HSN pages render the updated rate.
8. Commit with a message of the form `Refresh tariff against Notification NN/YYYY-Customs`.
9. Deploy: `npm run deploy`.
10. Push to GitHub + `npm run notify` (IndexNow pings Bing/Yandex/etc. about the refreshed pages).

## Future automation

This process should eventually be automated. The bottleneck is that the CBIC does not publish the full First Schedule as a bulk machine-readable file; only the exemption-notification overlay is free and parsable. Once revenue exceeds rent, one path forward is to buy a commercial Customs Tariff dataset (Taxmann / Seair / R.K. Jain) and integrate it as an additional data source. Another is to parse the Customs Tariff Act amendments chapter-by-chapter from the Finance Acts, building up a First Schedule mirror over time.

Until then, each HSN page honestly surfaces its `verificationStatus` — the user sees at a glance whether the rate came from the confirmed notification or is the statutory base rate subject to per-shipment verification.

## Parser quickstart (for future expansion)

`scripts/parseTariff.js` contains a work-in-progress PDF-to-JSON parser for the 45/2025 notification. Current state: extracts ~445 rows from the 168-page PDF but column-boundary detection is fragile for wrapped descriptions and multi-HSN rows. Revisit when expanding beyond the hand-curated 40-HSN seed. Best next step: switch from regex-based column extraction to absolute character-position slicing after detecting column offsets from the table header row of each page.
