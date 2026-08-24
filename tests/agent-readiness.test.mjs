import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import markdownHandler from '../api/markdown.js';
import {
  getMarkdownNotFound,
  getMarkdownPage,
  negotiateRepresentation,
  PUBLIC_PAGE_PATHS,
  VARY_HEADER
} from '../agent-readiness.js';

const projectRoot = path.resolve(import.meta.dirname, '..');

function visibleText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function readProjectFile(relativePath) {
  return readFile(path.join(projectRoot, relativePath), 'utf8');
}

function invokeMarkdownHandler({ accept = 'text/markdown', pathname = '/', method = 'GET' } = {}) {
  const headers = new Map();
  let statusCode = 200;
  let body = '';
  const request = {
    method,
    headers: { accept, host: 'unravelcounselling.com' },
    query: { path: pathname }
  };
  const response = {
    setHeader(name, value) { headers.set(name.toLowerCase(), value); },
    status(value) { statusCode = value; return this; },
    send(value) { body = value; return this; },
    end() { return this; }
  };

  return Promise.resolve(markdownHandler(request, response)).then(() => ({ statusCode, headers, body }));
}

test('Accept negotiation honors q-values, wildcards, and unsupported types', () => {
  assert.equal(negotiateRepresentation('text/markdown'), 'markdown');
  assert.equal(negotiateRepresentation('text/markdown, text/html;q=0.8'), 'markdown');
  assert.equal(negotiateRepresentation('text/html, text/markdown;q=0.5'), 'html');
  assert.equal(negotiateRepresentation('text/*'), 'html');
  assert.equal(negotiateRepresentation('*/*'), 'html');
  assert.equal(negotiateRepresentation('application/json'), null);
  assert.equal(negotiateRepresentation('text/markdown;q=0, text/html;q=0'), null);
});

test('every public page has a useful Markdown representation', () => {
  for (const pathname of PUBLIC_PAGE_PATHS) {
    const markdown = getMarkdownPage(pathname);
    assert.ok(markdown?.startsWith('# '), `${pathname} needs an H1`);
    assert.match(markdown, /\n## /, `${pathname} needs a section heading`);
    assert.ok(markdown.length >= 300, `${pathname} Markdown is too thin`);
    assert.match(markdown, /https:\/\/unravelcounselling\.com\//, `${pathname} needs a recovery link`);
  }
});

test('Markdown responses include the correct media type and cache variance', async () => {
  const response = await invokeMarkdownHandler({ pathname: '/about/' });
  assert.equal(response.statusCode, 200);
  assert.equal(response.headers.get('content-type'), 'text/markdown; charset=utf-8');
  assert.equal(response.headers.get('vary'), VARY_HEADER);
  assert.match(String(response.body), /^# About Unravel Counselling/);
});

test('agent 404 and 406 responses use real error statuses', async () => {
  const notFound = await invokeMarkdownHandler({ pathname: '/this-page-does-not-exist/' });
  assert.equal(notFound.statusCode, 404);
  assert.match(String(notFound.body), /llms\.txt/);
  assert.match(String(notFound.body), /sitemap\.xml/);

  const unacceptable = await invokeMarkdownHandler({ pathname: '/', accept: 'text/markdown;q=0, text/html;q=0' });
  assert.equal(unacceptable.statusCode, 406);
  assert.equal(unacceptable.headers.get('vary'), VARY_HEADER);
});

test('raw homepage HTML has meaningful, hierarchical no-JavaScript content', async () => {
  const html = await readProjectFile('index.html');
  const root = html.match(/<div id="root">([\s\S]*?)<script type="module"/i)?.[1] || '';
  assert.equal((root.match(/<h1\b/gi) || []).length, 1);
  assert.ok((root.match(/<h2\b/gi) || []).length >= 3);
  assert.ok((root.match(/<h3\b/gi) || []).length >= 3);
  assert.ok(visibleText(root).length >= 1500);
  assert.match(root, /href="\/about\/"/);
});

test('Organization schema includes contact details and a factual regional address', async () => {
  const html = await readProjectFile('index.html');
  const jsonLd = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i)?.[1];
  assert.ok(jsonLd);
  const data = JSON.parse(jsonLd);
  const organization = data['@graph'].find((item) => item['@type'] === 'Organization');
  assert.equal(organization.name, 'Unravel Counselling');
  assert.equal(organization.contactPoint[0].email, 'theekshitha@unravelcounselling.com');
  assert.equal(organization.address['@type'], 'PostalAddress');
  assert.equal(organization.address.addressRegion, 'British Columbia');
  assert.equal(organization.address.addressCountry, 'CA');
});

test('About, Contact, and Privacy are substantial trust anchors', async () => {
  for (const route of ['about', 'contact', 'privacy']) {
    const html = await readProjectFile(`public/${route}/index.html`);
    assert.match(html, /<h1\b/i);
    assert.ok(visibleText(html).length >= 500, `/${route}/ needs at least 500 visible characters`);
    assert.match(html, new RegExp(`https://unravelcounselling\\.com/${route}/`));
  }
});

test('Vercel routes Markdown requests without changing ordinary browser routing', async () => {
  const config = JSON.parse(await readProjectFile('vercel.json'));
  const markdownRewrites = config.rewrites.filter((rewrite) => rewrite.destination.startsWith('/api/markdown'));
  assert.equal(markdownRewrites.length, 2);
  assert.ok(markdownRewrites.every((rewrite) => rewrite.has?.some((condition) => condition.key === 'Accept')));
  assert.ok(config.headers.some((entry) => entry.headers?.some((header) => header.key === 'Vary' && header.value.includes('Accept'))));
  assert.ok(!config.redirects.some((redirect) => redirect.source === '/about' || redirect.source === '/about/'));
  assert.ok(config.rewrites.some((rewrite) => rewrite.source === '/about/' && rewrite.destination === '/about/index.html'));
});

test('all public page routes resolve to static HTML and are listed for agents', async () => {
  const sitemap = await readProjectFile('public/sitemap.xml');
  const llms = await readProjectFile('public/llms.txt');

  for (const pathname of PUBLIC_PAGE_PATHS) {
    const sourcePath = pathname === '/' ? 'index.html' : `public${pathname}index.html`;
    assert.ok((await readProjectFile(sourcePath)).includes('<html'));
    assert.match(sitemap, new RegExp(`<loc>https://unravelcounselling\\.com${pathname.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</loc>`));
  }

  assert.match(llms, /https:\/\/unravelcounselling\.com\/about\//);
  assert.match(llms, /https:\/\/unravelcounselling\.com\/contact\//);
});

test('dedicated-page navigation exposes About and keeps the required footer', async () => {
  for (const pathname of PUBLIC_PAGE_PATHS.filter((value) => value !== '/')) {
    const html = await readProjectFile(`public${pathname}index.html`);
    assert.match(html, /href="\/about\/">About Unravel<\/a>/);
    const footer = html.match(/<footer[\s\S]*?<\/footer>/i)?.[0] || '';
    assert.match(footer, />Unravel Counselling</);
    assert.match(footer, /href="\/contact\/">Contact</);
    assert.match(footer, /href="\/privacy\/">Privacy</);
    assert.match(footer, /theekshitha@unravelcounselling\.com/);
  }
});

test('the HTML 404 contains recovery links and is not masked by an app-shell rewrite', async () => {
  const html = await readProjectFile('public/404.html');
  const config = JSON.parse(await readProjectFile('vercel.json'));
  assert.match(html, /href="\/llms\.txt"/);
  assert.match(html, /href="\/sitemap\.xml"/);
  assert.match(getMarkdownNotFound(), /^# Page not found/);
  assert.ok(!config.rewrites.some((rewrite) => rewrite.source === '/:path*' && !rewrite.has));
});
