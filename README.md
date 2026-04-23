# hsnlookup.in

Static programmatic SEO site: Indian HSN code + customs duty lookup.

## Build

```bash
npm run build      # generates public/
npm run preview    # serves public/ at localhost:8000
```

## Structure

- `data/seed/` — hand-verified HSN codes (launch set)
- `data/cache/` — scraped data from DGFT/CBIC (gitignored)
- `src/build.js` — static site generator
- `templates/` — Mustache-style page templates
- `public/` — build output, deployed to Cloudflare Pages

## Data sources

HSN codes, descriptions, and duty rates are derived from publicly published
Indian government documents (CBIC Customs Tariff Act schedules, DGFT ITC(HS)
2022). Rates change — regenerated weekly from CBIC notifications.
