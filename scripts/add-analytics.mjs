import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { PAGE_PATHS } from '../site-routes.js';

const sections = new Map(Object.entries({
  '/': 'home', '/about/': 'approach', '/counsellor/': 'counsellor',
  '/low-cost-counselling-bc/': 'fees', '/blog/': 'articles',
  '/contact/': 'contact', '/privacy/': 'privacy', '/art-sources.html': 'credits'
}));

export async function addAnalytics(directory, id) {
  if (!id) return;
  if (!/^G-[A-Z0-9]+$/.test(id)) throw new Error('Expected a GA4 measurement ID in GA4_MEASUREMENT_ID');
  for (const route of new Set([...PAGE_PATHS, '/art-sources.html'])) {
    const section = sections.get(route) ?? (route.startsWith('/blog/') ? 'article' : 'care');
    const file = path.join(directory, route, route.endsWith('/') ? 'index.html' : '');
    const html = await readFile(file, 'utf8');
    const tag = `<script defer src="/traffic.js" data-id="${id}" data-section="${section}"></script>`;
    await writeFile(file, html.replace('</body>', tag + '</body>'));
  }
}
