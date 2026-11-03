import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { PAGES } from '../content/site-pages.js';
import { PAGE_PATHS, REDIRECTS, RETIRED_PATHS, redirectFor, SITE_ORIGIN } from '../site-routes.js';
import { validatePosts, articleHtml } from '../scripts/build-site-content.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const fileFor = path => path === '/' ? `${root}index.html` : `${root}public${path}index.html`;
const read = path => readFileSync(fileFor(path), 'utf8');
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");

test('retained pages have unique, accurate search metadata and one primary heading', () => {
  const titles = new Set();
  for (const page of PAGES) {
    const html = read(page.path);
    const titlesOnPage = [...html.matchAll(/<title>(.*?)<\/title>/g)];
    assert.equal(titlesOnPage.length, 1, page.path);
    const title = decode(titlesOnPage[0][1]);
    assert.equal(title, page.title);
    assert.ok(!titles.has(title), `unique title for ${page.path}`);
    titles.add(title);
    assert.equal((html.match(/<meta name="description" /g) || []).length, 1, page.path);
    assert.ok(html.includes(`href="${SITE_ORIGIN}${page.path}"`), page.path);
    assert.equal((html.match(/<h1\b/g) || []).length, 1, page.path);
    assert.doesNotMatch(html, /EMDR[- ]certified|licensed counsellor|Registered Clinical Counsellor/);
    assert.ok(html.includes('og:description'));
    for (const json of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(json[1]);
  }
});

test('every internal navigation, content, asset and fragment target exists without a redirect', () => {
  const pages = [...PAGE_PATHS.map(path => [path, read(path)]), ...['/404.html', '/art-sources.html'].map(path => [path, readFileSync(`${root}public${path}`, 'utf8')])];
  const ids = new Map(pages.map(([path, html]) => [path, new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]))]));
  for (const [source, html] of pages) {
    for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      const raw = decode(match[1]);
      if (/^(mailto:|tel:|data:)/.test(raw)) continue;
      const target = new URL(raw, `${SITE_ORIGIN}${source}`);
      if (target.origin !== SITE_ORIGIN) continue;
      assert.equal(redirectFor(target.pathname), null, `${source}: link directly to ${target.pathname}`);
      const exists = PAGE_PATHS.includes(target.pathname) || existsSync(`${root}public${target.pathname}`);
      assert.ok(exists, `${source}: missing ${target.pathname}`);
      if (target.hash && ids.has(target.pathname)) assert.ok(ids.get(target.pathname).has(decodeURIComponent(target.hash.slice(1))), `${source}: missing anchor ${target.href}`);
    }
    const sourceIds = ids.get(source);
    assert.equal(sourceIds.size, [...html.matchAll(/\bid="([^"]+)"/g)].length, `${source}: duplicate IDs`);
    for (const label of html.matchAll(/aria-labelledby="([^"]+)"/g)) for (const id of label[1].split(/\s+/)) assert.ok(sourceIds.has(id), `${source}: missing accessible label ${id}`);
  }
});

test('consolidations lead to relevant final pages and retired services are absent', () => {
  assert.equal(redirectFor('/ocd-therapy-bc/'), `${SITE_ORIGIN}/ocd-therapy-vancouver/`);
  assert.equal(redirectFor('/trauma-therapy-bc/index.html'), `${SITE_ORIGIN}/emdr-therapy-bc/`);
  assert.equal(redirectFor('/philosophy'), `${SITE_ORIGIN}/about/`);
  for (const [source, destination] of Object.entries(REDIRECTS)) {
    for (const variant of [source, `${source}/`, `${source}/index.html`]) assert.equal(redirectFor(variant), `${SITE_ORIGIN}${destination}`);
    assert.equal(redirectFor(new URL(destination, SITE_ORIGIN).pathname), null);
  }
  for (const path of RETIRED_PATHS) assert.ok(!existsSync(`${root}public${path}/index.html`), path);
  assert.ok(!existsSync(`${root}public/templates`));
  const emdr = read('/emdr-therapy-bc/');
  assert.match(emdr, /anxiety and trauma/i);
  assert.match(emdr, /preparation, collaboration/i);
  const home = read('/');
  assert.doesNotMatch(home, /Client reflections|Explore depression|Explore relationship|Low-cost care/i);
  assert.match(home, /CAD \$145 for 50 minutes/);
  assert.match(read('/low-cost-counselling-bc/'), /90 minutes<\/td><td>CAD \$190/);
});

test('article publishing requires reviewed content, honest dates and working related pages', () => {
  const post = { slug: 'test-article', status: 'published', clinicalReviewConfirmed: true, title: 'Example <heading>', seoTitle: 'Example | Unravel Counselling', description: 'Example description', excerpt: 'Example excerpt', publishedAt: '2026-10-01', sections: [{ heading: 'Section', paragraphs: ['A paragraph with <text> & a symbol.'] }], sources: [{ title: 'Source', url: 'https://iocdf.org/' }], relatedPaths: ['/erp-therapy-bc/'] };
  assert.doesNotThrow(() => validatePosts([post]));
  assert.throws(() => validatePosts([{ ...post, clinicalReviewConfirmed: false }]), /review/);
  assert.throws(() => validatePosts([{ ...post, publishedAt: '2026-02-31' }]), /real publication/);
  assert.throws(() => validatePosts([{ ...post, publishedAt: '2099-01-01' }]), /future date/);
  assert.throws(() => validatePosts([{ ...post, relatedPaths: ['/missing/'] }]), /does not exist/);
  const html = articleHtml(post);
  assert.ok(html.includes('Example &lt;heading&gt;'));
  assert.ok(html.includes('A paragraph with &lt;text&gt; &amp; a symbol.'));
  assert.ok(html.includes('"@type":"BlogPosting"'));
  assert.ok(html.includes('href="/erp-therapy-bc/"'));
});
