# Adding an article with Codex

Give Codex the topic or draft. The research queue is in `outputs/seo-phase-1-2026-11-02/ahrefs/weekly-blog-editorial-plan.csv` in the parent workspace.

1. Prepare original text and verify clinical statements against appropriate primary sources. Use one article for close query variants.
2. Add an article object to `posts.js`, following `POST-TEMPLATE.json`. Keep it as `draft` while preparing it. The template itself is never published.
3. Set a descriptive slug, one search title and description, excerpt, sections, sources and related pages. A section can use `sourceIndexes: [1, 2]` to cite the corresponding one-based source entries nearby, and `links: [["Read about ERP", "/erp-therapy-bc/"]]` for contextual links. Drafts may link to the other real drafts; published articles must link only to published destinations.
4. Confirm the owner has reviewed the clinical content, then set `clinicalReviewConfirmed: true` and `status: 'published'`, with the genuine `publishedAt: 'YYYY-MM-DD'` date at publication. Optional `modifiedAt` is for a substantive revision, not every rebuild. Do not invent an author approval, reviewer, review date, credentials or outcome claims. The published byline links to the existing counsellor page. Follow any explicit owner instructions about the review workflow.
5. Run `npm run build` and `npm test`; preview the article on desktop and a narrow viewport. Check source links, related links, headings, readable layout and sharing metadata.

The normal build creates reviewed published articles and updates `/blog/`, RSS, sitemap, route configuration and page summaries. Draft articles do not appear in its output. No separate publishing platform is required. Deployments remain a separate step in the agreed workflow.

## Review a draft locally

Run `node scripts/build.mjs --review-drafts` for an explicit local review build. This first creates the normal production stage, then adds a clearly labelled draft collection to `/blog/` and `/ocd-types/` **in that local build only**. The actual draft pages are under `/review/blog/<slug>/`.

Review pages have noindex/nofollow, a review-pending label and no publication date or BlogPosting schema. They do not appear in RSS, the sitemap, canonical production routes or generated page summaries. Draft-to-draft links resolve within the local preview. Their byline says prepared for Unravel rather than claiming the owner authored or clinically reviewed them.

Before deployment, run the ordinary `npm run build` again. It starts with a clean stage and excludes all local review pages and cards. The local review artifact is for review and should not be deployed. When an article is approved for release, Codex can set its real publication details, remove links to any still-unpublished destinations and verify the release build.

The practice owner approved the first three articles on 3 November 2026. They are included in the release build with that date, canonical article routes, author details and BlogPosting data. Deployment remains a separate step in the agreed workflow. The remaining weekly queue is planning material.

The themes hub is rendered by `scripts/theme-hub.mjs` from `content/ocd-themes.js`. Detailed care pages are rendered from `content/care-pages.js`; other retained page bodies remain in their HTML files. Shared metadata/navigation use `scripts/build-site-content.mjs`, `scripts/site-layout.mjs` and `content/site-pages.js`. Keep these sources current rather than hand-editing generated sections.
