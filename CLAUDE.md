# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js + Turbopack) at localhost:3000
npm run build    # Production build
npm run start    # Serve the production build
npm run lint     # next lint
```

There is no test suite configured in this repo. `next.config.mjs` sets `eslint.ignoreDuringBuilds: true` and `typescript.ignoreBuildErrors: true`, so `npm run build` will succeed even with lint/type errors — run `npx tsc --noEmit` explicitly to actually check types before considering work done.

Deployment is on Vercel, auto-triggered by pushes to `main`. Pull real secrets locally with `npx vercel login && npx vercel link && npx vercel env pull .env.local` (defaults to the **Development**-scoped env vars in Vercel, not Production — check the Vercel dashboard if a value seems stale).

## Architecture

Next.js 16 App Router, React 19, Tailwind v4, shadcn/ui (`components/ui/*`, "new-york" style, configured in `components.json`). Path alias `@/*` maps to repo root.

`app/page.tsx` composes the one-page marketing site out of section components in `app/components/` (Hero, About, Products, Services, Testimonials, Contact, Newsletter, Footer, etc.). `/products` and `/quote` are the only other real routes.

### Forms & lead delivery (dual-hit: Zoho email + GoHighLevel)

This is the part most likely to need touching and the least discoverable from file names alone:

- **Contact form** (`app/components/ContactSection.tsx`) → `app/api/send-email/route.ts`
- **Quote form** (`app/components/QuoteRequestForm.tsx`) → `app/api/quote-email/route.ts`

Both routes do two things per submission:
1. **Send a well-organized HTML email via Zoho SMTP (Nodemailer) to `info@biogexpharma.com`.** This is the primary, must-succeed path — if it throws, the route returns a 500 and the user sees an error.
2. **Sync the lead into GoHighLevel** using shared helpers in `lib/ghl.ts` (`syncContactFormToGHL`, `syncQuoteRequestToGHL` — contact upsert, plus opportunity creation + custom fields for quotes). This is **best-effort**: wrapped in try/catch, failures are logged to console and never block the email or the response. Do not change this ordering/priority without confirming with whoever owns the GHL account — email was made primary because a customer thinking their message never sent is worse than a missed CRM sync.

`app/api/quote/route.ts` is the original GHL-only quote endpoint from before the Zoho migration. It's no longer called by the frontend (superseded by `/api/quote-email`) but is kept working — it now just calls `syncQuoteRequestToGHL` from `lib/ghl.ts`, the same helper the dual-hit path uses.

`app/components/ContactSection.tsx`'s phone field uses `react-phone-number-input` with a country picker (`defaultCountry="KE"`), validated via `isValidPhoneNumber`. Its visual styling is custom CSS in `app/globals.css` (`.biogex-phone-input` and descendants) rather than the library's own stylesheet, because the library's default `style.css` and Tailwind's generated CSS both being unlayered can otherwise fight over precedence — keep any further phone-input styling in that same globals.css block rather than trying to override via the library's own classes inline.

Required env vars: `SMTP_HOST`/`SMTP_PORT`/`SMTP_USER`/`SMTP_PASSWORD` (Zoho Mail) and `GHL_ACCESS_TOKEN`/`GHL_LOCATION_ID`/`GHL_FIELD_ID_PRODUCTS`/`GHL_OPP_FIELD_ID_PRODUCTS`/`GHL_OPP_FIELD_ID_ORDER_LINE_ITEMS`/`GHL_OPP_FIELD_ID_QUOTE_MESSAGE`/`GHL_PIPELINE_ID`/`GHL_STAGE_ID`. See `example.env` for the full list (GHL vars are commented there as "legacy" from before the dual-hit change — they're actually live again now).

`app/components/NewsletterSection.tsx` → `app/api/subscribe-newsletter/route.ts` is a separate, simpler Nodemailer-only flow (no GHL) — it was never part of the GHL migration.

### Product catalog (Google Sheets)

`app/api/products/route.ts` reads a Google Sheet via a service account (`GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `SPREADSHEET_ID`, `SHEET_NAME` env vars) and parses it into product rows for `app/components/ProductsCatalog.tsx` (rendered at `/products`). The sheet's first column is expected to be blank/offset — see the comment in that route for the exact column-mapping logic. Setup/troubleshooting notes are in `GOOGLE_SHEETS_SETUP.md`.

`app/data/products.ts` is a separate, static flat list of product names (unrelated to the Sheets-backed catalog) used to populate the product combobox in the Quote form.

The `scripts/*.js` files (`ghlproducts.js`, `fetch_pipelines.js`, `list_custom_fields.js`, `test_opp_payload.js`, `verify_products.js`) are standalone dev/ops tools for inspecting or syncing GHL pipelines, stages, custom fields, and products — not part of the app runtime, run manually with `node scripts/<file>.js`.

### Other notes

- `E-COMMERCE-INTEGRATION-PLAN.md` is a forward-looking proposal (cart, checkout, M-Pesa, Postgres/Prisma) — none of it is implemented yet; the current site has no cart or payment flow.
- Local dev on machines with clock drift will see Google Sheets API calls fail with `invalid_grant: Invalid JWT` — that's an OS clock/NTP issue, not a code or env var bug.
