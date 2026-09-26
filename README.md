# Unravel Counselling Website

A Vite + React website for Unravel Counselling, a virtual counselling practice serving adults across British Columbia. It includes the visual homepage, crawlable service pages, brand-first structured data, sitemap, robots file, and an `llms.txt` summary.

## Homepage design preview

The branch homepage is the static Unravel preview in `index.html`. Its styles, menu behavior, artwork, and art credits live in `public/styles.css`, `public/script.js`, `public/assets/`, and `public/art-sources.html`. The `Book` button currently leads to the getting-started section; replace its `href` with the confirmed booking URL when provided. The earlier React homepage source remains in `src/` but is not loaded by this preview.

## Agent-readable responses

Canonical page URLs support `Accept: text/markdown` through a Vercel header-conditional rewrite to `api/markdown.js`. Browser requests continue to use the existing static HTML files. Negotiated responses return `Content-Type: text/markdown; charset=utf-8` and `Vary: Accept, Accept-Encoding`; unknown Markdown requests return a real `404` with recovery links.

Run `npm run verify:agent` to build the site, execute the readiness contract tests, and verify every HTML route, Markdown representation, machine-readable file, and 404 response locally.

## Run locally

```bash
bun install
bun run dev
```

## Headshot

Place the provided headshot at:

```text
public/headshot.jpg
```

The site will use that image automatically in the hero section.

### Agent-readable content

`/llms.txt` lists the practice facts and public pages. `/llms-full.txt` provides their combined Markdown summaries without requiring custom headers. Each public page also supports `Accept: text/markdown` through the Vercel content-negotiation route; normal browser requests receive HTML.

Maintain summaries and links in `agent-readiness.js`. `npm run build` regenerates `public/llms-full.txt` before building the site. When adding a public page, update the summary map, sitemap, and `/llms.txt` together. Run `node --test tests/agent-guide.test.mjs` and, after building, `node scripts/verify-public-endpoints.mjs` to check coverage, booking URLs, response headers, and local endpoints. Verify the deployed Vercel routing separately after publishing.
