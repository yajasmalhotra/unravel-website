# Unravel Counselling Website

A Vite + React website for Unravel Counselling, a virtual counselling practice serving adults across British Columbia. It includes the visual homepage, crawlable service pages, brand-first structured data, sitemap, robots file, and an `llms.txt` summary.

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
