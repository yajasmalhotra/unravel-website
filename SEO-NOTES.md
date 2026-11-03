# Unravel: SEO structure and main-page content

Implemented in the local draft on 2 November 2026:

- OCD/anxiety-led navigation and footer across retained pages, with ACT, ERP and EMDR approaches.
- One canonical OCD service page at `/ocd-therapy-vancouver/`; the BC variant redirects there.
- Philosophy material merged into About; trauma content merged into EMDR before removing the old pages.
- Withdrawn service pages and concept templates excluded from the public source/output; removed content returns a real 404.
- Relevant legacy redirects, direct canonical links, slash/index normalization and a non-www host redirect in Vercel configuration.
- The approved core search titles/descriptions, current designation, accurate session rates, virtual format and adult/BC eligibility.
- Blog/resources hub and a reusable, reviewed-article publishing system. No invented articles, testimonials or review dates.
- Updated sitemap, robots discovery and summaries; retained Accept: text/markdown functionality.

The Phase 1 foundation and Ahrefs research in the parent workspace remain the strategic references. Character counts are editorial aids, not fixed Google display limits. Tool difficulty, health and AI scores are not ranking guarantees.

Phase 3 expands the five care/approach pages with distinct original content, provider attribution, contextual links, consultation details, transparent fees and relevant questions. Home, About, counsellor, fees and contact copy now connect that care pathway. Training names and trainers are centralized in `content/training.js`; the owner confirmed the CBI ERP course with Alissa Jerud, EMDR basic training and consultation with Alivia Maric and Eve Wilensky, and PESI’s two-day ACT course with Daniel J. Moran. No cohort dates, credit totals or additional certifications were inferred.

Titles remain aligned with the Phase 1 Ahrefs brief. Each care page has one primary heading, a descriptive introduction, crawlable section links and native FAQ disclosures. The questions are human-facing content; no FAQ rich-result eligibility is claimed. Sources support the relevant clinical explanations. No clinical-review badge or review date is fabricated.

Phase 4 adds `/ocd-types/` as a substantive educational guide linked from OCD care and the blog, with seven theme introductions and primary-source reading. The first three articles on mental compulsions, rumination and OCD versus anxiety are original **unreviewed drafts**. Their SEO metadata follows the Ahrefs brief. An explicit `--review-drafts` build adds local noindex previews under `/review/blog/`; the normal production build, route catalogue, sitemap, RSS and summaries exclude them. Publication requires the owner’s clinical review and genuine publication dates. Published and still-draft articles can coexist in a local review collection without duplicate heading IDs or broken draft links.

Later work: owner review of clinical copy before publication, booking/profile alignment, final image/performance checks, article publication and real-domain route/indexing verification after an authorized release. Do not treat local preview checks as evidence that public URLs have changed.

## Competitor-led content rewrite — 2 November 2026

Fresh Safari/Ahrefs research now informs the copy and search metadata: all 313 captured HTML metadata records from New Heights, ARC and Vancouver CBT, 62 selected page-body reviews, and a new 38-query Canadian keyword/SERP export. The body-review scope and vendor/data limitations are documented in the parent workspace’s `outputs/seo-content-rewrite-2026-11-02/Research-Synthesis.md`. Canadian estimates for Vancouver-worded queries are not city-resident search counts, and overlapping variants are not additive.

All 13 core routes have updated, distinct titles, descriptions and aligned summaries. The five clinical care pages now explain different concerns and methods; the homepage, About, profile, fees, contact, themes guide and blog collection have original revised copy. Exact training details remain centralized. The three article drafts have been rewritten around mental compulsions, rumination and OCD versus anxiety; they remain unpublished, without invented authorship review or publication dates.

Vancouver intent is strongest on the OCD and anxiety pathways; BC remains the virtual eligibility boundary. Existing canonical URLs and useful redirects are retained. No extra city clones, archive pages, ratings, office address or unsupported credentials were added. Existing metadata, Open Graph and factual structured data are kept consistent with the visible copy. Machine-readable care guides now reuse the same full explanatory sections, questions and training source as HTML; other core pages retain aligned summaries. This is a convenience for readers and tools, not a promise of AI citations or rankings.

The existing visual design, distinct artwork and publishing controls are preserved. Source backups, final metadata/intent map, research exports and validation evidence are kept with the rewrite report. Local validation does not establish public-domain indexation or deployed behaviour. Owner clinical review, booking/directory alignment and an authorized release remain separate steps.


## Approved article release — 3 November 2026

The owner explicitly reviewed and approved all three educational articles. Their review flags are confirmed and their publication date is 2026-11-03. The ordinary release build includes canonical article pages, bylines, BlogPosting metadata, blog and themes-hub cards, RSS, sitemap and machine-readable content. Relevant OCD, ERP and anxiety pages link to the articles. The release build excludes the old local review area. Historical reports describing unreviewed drafts remain records of the earlier stage. No hosting or external-profile settings have been changed.


## Production release — 3 November 2026

Release PR #2 was merged into master and deployed by the existing Vercel project to https://unravelcounselling.com. The live audit found that static-file precedence bypassed the old Accept-header rewrites. Header-based Markdown negotiation now uses explicit Vercel routes before file lookup, with the API excluded to prevent recursive routing. Ordinary page rewrites and canonical redirects remain in their existing configuration. The route test covers each canonical page and API exclusion; live checks cover the deployed representations. See Vercel’s current configuration documentation: https://vercel.com/docs/project-configuration/vercel-json .
