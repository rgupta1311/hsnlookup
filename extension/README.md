# HSN Lookup India — Chrome Extension

Companion extension for [hsnlookup.in](https://hsnlookup.in). Instantly search 12,136 Indian HSN codes + GST / customs duty rates from any browser tab, offline after the first load.

## Chrome Web Store listing copy

### Short description (≤132 chars)

Instantly look up any Indian HSN code, GST rate, and customs duty. 12,136 tariff items. Offline after first load.

### Detailed description

Indian HSN code + customs duty lookup, one click from your toolbar.

**Features**
• Search 12,136 India 8-digit HSN (ITC(HS)) tariff items by code or product name.
• Shows BCD (Basic Customs Duty), IGST, SWS, Compensation Cess, and the effective all-in rate.
• Loads the full dataset once, then works offline. Refreshes every 7 days automatically.
• No account, no tracking, no ads. Free forever.
• Opens the full page on hsnlookup.in with a worked landed-cost example on any result.

**For whom**
• Importers, Customs House Agents (CHAs), freight forwarders — look up rates without leaving the tab you're in.
• GST-filing teams — verify the HSN for invoice lines.
• Accountants, CAs — quick rate confirmation.
• Developers building Indian ERP / accounting tools — same data powers our public API at hsnlookup.in/api/hsn.json.

**Data sources**
• IGST rates: CBIC GST rate schedule (compiled via Cleartax HSN index, which tracks CBIC notifications).
• BCD rates: hand-reviewed for 36 high-volume codes; chapter-default First Schedule statutory rate for the rest. Always verify BCD against the current CBIC notification before filing a Bill of Entry.
• Last refresh: April 2026, against Notification 45/2025-Customs + 02/2026-Customs.

**Privacy**
This extension does not collect, transmit, or share any browsing data. It fetches the HSN dataset from hsnlookup.in once per week and stores it in your browser's local storage. Search runs entirely offline on your device. No analytics, no telemetry.

**Source & support**
Site: https://hsnlookup.in  ·  Source: github.com/rgupta1311/hsnlookup  ·  Support: hello@hsnlookup.in

### Category
Productivity

### Primary language
English (United Kingdom)

### Screenshot copy (for 1280×800 screenshots)

1. "Search any HSN — 12,136 codes, instant results"
2. "BCD, IGST, SWS, cess — all in one view"
3. "Works offline after first load"
4. "One click to the full page on hsnlookup.in"

### Single purpose statement (required)

Look up Indian HSN codes and their associated customs duty and GST rates.

### Permissions justification

- `storage` — cache the public HSN dataset from hsnlookup.in/api/hsn.json in the user's local browser storage so the extension works offline and doesn't re-download on every popup open. No personal data is stored.
- `host_permissions: https://hsnlookup.in/*` — fetch the public HSN dataset from hsnlookup.in. The fetch is a plain HTTP GET with no credentials or user-identifying headers.

## Local dev / testing

1. Clone repo, `cd extension/`.
2. Open chrome://extensions → Developer mode → Load unpacked → select this folder.
3. Click the extension icon in the toolbar.

## Package for upload

```
cd extension
zip -r ../hsn-lookup-india-extension.zip . -x '*.py' -x 'README.md' -x '*.DS_Store'
```

The resulting zip is what you upload to Chrome Web Store.
