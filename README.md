# Unravel Counselling website

A static, crawlable website served and built with Vite. The active homepage is `index.html`; retained pages are in `public/`. The earlier React source in `src/` is not loaded by the current site and has been preserved.

## Current structure

OCD and anxiety lead the site. ACT is the main approach; ERP is used for OCD; EMDR covers anxiety and trauma. Sessions are virtual for adults aged 18+ in British Columbia. Confirmed fees, education and completed training are displayed on the site. Use “mental health counsellor” for the public role; reserve “pre-licensed counsellor” for the profile and insurance information, without a post-nominal designation. The existing Jane booking link is used throughout.

`content/site-pages.js` owns core search metadata and concise summaries. `site-routes.js` owns the canonical page set and legacy redirects. The build applies the shared static navigation/footer, metadata, sitemap and discovery files. Header/footer links are available in HTML without JavaScript; the mobile menu uses a native modal dialog.

`content/care-pages.js` owns the detailed OCD, anxiety, ERP, ACT and EMDR copy. `scripts/care-page-layout.mjs` renders their readable sections, jump links, practical details and native FAQ disclosures during the build. Edit this content source rather than the generated `<main>` in those five HTML files. Existing page heads, artwork and shared navigation remain in the retained templates.

`content/training.js` is the shared record of owner-confirmed course names, providers and trainers. It supplies homepage highlights, counsellor details, approach-page training attribution and relevant summaries. Completion dates and credit hours are omitted unless actually confirmed. ACT reading remains separate from formal training.

## Develop and verify

```bash
npm install
npm run dev
npm run build
npm test
node scripts/verify-public-endpoints.mjs
```

Existing dependencies can also be used by invoking `node scripts/build.mjs` directly. The endpoint check binds a temporary loopback server, verifies built page/status responses and closes it afterward. It exercises the same routing middleware used by Vite's development and preview servers. Vercel configuration must also be verified on the actual hosting platform when publication is authorized.

## Weekly articles

Send Codex a topic or draft. See `content/blog/README.md` and `POST-TEMPLATE.json`. Article objects live in `content/blog/posts.js`; drafts stay outside the normal production output. A reviewed published article automatically gets a page, metadata, author/date, BlogPosting data, blog-index entry, RSS item, sitemap entry and route. The owner approved the first three original articles on 3 November 2026; they now appear in the release build with author details, dates and article metadata.

The OCD themes hub at `/ocd-types/` is rendered from `content/ocd-themes.js` and `scripts/theme-hub.mjs`, and is linked from OCD care and the blog. To inspect article drafts in the local website, run `node scripts/build.mjs --review-drafts`. This adds labelled, noindex review pages under `/review/blog/` and local draft cards after the clean production stage is built. Run the ordinary build before any deployment; it excludes the review pages, cards and manifest. See the blog README for the publication process.

## Existing agent-readable feature

Canonical pages support `Accept: text/markdown` through Vercel header routes to `api/markdown.js`, evaluated before static files. HTML remains the browser default. The existing Accept negotiation, HEAD and error behavior are preserved. The build refreshes `llms.txt` and `llms-full.txt` from the retained page catalogue and published articles.

## Local implementation handoff

Phases 2 and 3 prepared the structure and main-page copy. Phase 4 adds the OCD themes hub, first three article drafts and local clinical-review preview. The owner approved the three articles on 3 November 2026, and the release is deployed through the repository’s `master` branch to the existing Vercel project. Future articles retain the review requirement. Jane consultation/extended-session duration settings and external professional profiles have not been changed. Preserve the intended artwork and credits. Source snapshots and implementation records are in the parent workspace's `outputs/seo-phase-2-2026-11-02/`, `outputs/seo-phase-3-2026-11-02/` and `outputs/seo-phase-4-2026-11-02/` folders.


## Visual design and image budgets

The homepage is the visual reference for the ivory, sage, blue and peach palette and Kufam/Overpass typography. `public/brand-theme.css` develops that direction for the different page layouts. The About page uses contextual artwork within its body, the counsellor page uses the real portrait, and fees/contact/privacy/the OCD themes guide stay free of decorative images. Service and article illustrations are assigned once through `scripts/artwork.mjs`; article cards use type and colour rather than repeating their illustrations. New articles may omit images.

`content/artwork-assets.json` records actual image dimensions, sizes and hashes. `scripts/check-artwork.mjs` runs during every build and checks missing image/CSS/font references, responsive width declarations, distinct page assignments, a 250 KiB public-image limit and a 1920-pixel dimension budget for recorded assets. Generate correctly sized AVIF/WebP versions, update the size record, and keep raw Midjourney downloads and unused alternatives outside `public`.

Original artwork, source snapshots, Midjourney job records, size reports and review screenshots for this update are preserved in the parent workspace's `outputs/design-unification-2026-11-02/` folder. This visual update is included in the 3 November 2026 production release.

## Current content and search research

The 2 November competitor-led rewrite is documented in the parent workspace’s `outputs/seo-content-rewrite-2026-11-02/`. Its final CSV maps each retained route to its intent, title, description and visible heading. The site was released at https://unravelcounselling.com on 3 November 2026. Content is original and uses the owner-confirmed practice facts; the three educational articles were reviewed and approved on 3 November 2026 and are included in the release build.

Care-guide Markdown now reuses the same detailed editorial sections, FAQs and training record as the visible HTML. Other core pages have aligned summaries. Preserve this shared-source arrangement when updating copy so readers and search tools receive consistent facts.
