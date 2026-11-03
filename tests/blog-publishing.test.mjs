import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { POSTS } from '../content/blog/posts.js';
import { PAGE_PATHS, publishedPosts, SITE_ORIGIN } from '../site-routes.js';
import { validatePosts } from '../scripts/build-site-content.mjs';
import { articleCollection, articleHtml, COLLECTION_START, COLLECTION_END } from '../scripts/blog-layout.mjs';
import { addLocalDraftPreview } from '../scripts/local-draft-preview.mjs';

const root = new URL('../', import.meta.url);
const drafts = POSTS.filter(post => post.status === 'draft');
const draftFixture = {
  slug: 'draft-example', status: 'draft', clinicalReviewConfirmed: false,
  title: 'A draft for review', seoTitle: 'Draft example | Unravel Counselling',
  description: 'A draft description', excerpt: 'A draft excerpt',
  sections: [{ heading: 'A section', paragraphs: ['Original text.'], sourceIndexes: [1], links: [['Explore ERP', '/erp-therapy-bc/']] }],
  sources: [{ title: 'A primary source', url: 'https://iocdf.org/about-ocd/' }],
  relatedPaths: ['/erp-therapy-bc/']
};

test('draft articles stay outside production discovery as the collection changes', () => {
  assert.doesNotThrow(() => validatePosts(POSTS));
  const discovery = ['public/sitemap.xml', 'public/blog/feed.xml', 'public/llms.txt', 'public/llms-full.txt', 'vercel.json'].map(file => readFileSync(new URL(file, root), 'utf8')).join('\n');
  for (const post of drafts) {
    assert.ok(!publishedPosts.includes(post));
    assert.ok(!PAGE_PATHS.includes(`/blog/${post.slug}/`));
    assert.ok(!existsSync(new URL(`public/blog/${post.slug}/index.html`, root)));
    assert.ok(!discovery.includes(`/blog/${post.slug}/`));
  }
  assert.ok(!existsSync(new URL('public/review/', root)));
});

test('drafts cannot acquire a published rendering or invalid source/link references', () => {
  assert.throws(() => articleHtml(draftFixture), /reviewed publication/);
  assert.throws(() => validatePosts([{ ...draftFixture, sections: [{ heading: 'Example', paragraphs: ['Text'], sourceIndexes: [99] }] }]), /citation/);
  assert.throws(() => validatePosts([{ ...draftFixture, relatedPaths: ['/missing/'] }]), /does not exist/);
  assert.throws(() => validatePosts([{ ...draftFixture, status: 'published', clinicalReviewConfirmed: true, publishedAt: '2026-10-01', relatedPaths: ['/blog/still-draft/'] }, { ...draftFixture, slug: 'still-draft' }]), /not published/);
});

test('review pages have honest attribution, no dates/schema, and safe linked content', () => {
  for (const post of [draftFixture, ...drafts]) {
    const html = articleHtml(post, { review: true });
    assert.match(html, /name="robots" content="noindex, nofollow"/);
    assert.match(html, /Clinical review pending/);
    assert.doesNotMatch(html, /<time\b|datePublished|dateModified|"@type":"BlogPosting"|By <a/);
    assert.equal((html.match(/<h1\b/g) || []).length, 1);
    assert.ok(html.includes(`href="${SITE_ORIGIN}/review/blog/${post.slug}/"`));
    assert.ok(!html.includes('undefined'));
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const fragment of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(fragment[1]), fragment[1]);
    for (const other of drafts) assert.ok(!html.includes(`href="/blog/${other.slug}/"`));
  }
  const html = articleHtml({ ...draftFixture, title: 'A <draft>', sections: [{ heading: 'A <heading>', paragraphs: ['Text <script> & a symbol.'] }], relatedPaths: [] }, { review: true });
  assert.match(html, /A &lt;draft&gt;/);
  assert.match(html, /Text &lt;script&gt; &amp; a symbol/);
});

test('local draft augmentation changes only an isolated output and connects draft pages', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'unravel-draft-test-'));
  const published = { ...draftFixture, status: 'published', clinicalReviewConfirmed: true, publishedAt: '2026-10-01' };
  const collection = `${COLLECTION_START}${articleCollection([published])}${COLLECTION_END}`;
  try {
    for (const name of ['blog', 'ocd-types']) {
      await mkdir(path.join(directory, name));
      await writeFile(path.join(directory, name, 'index.html'), collection);
    }
    const manifest = await addLocalDraftPreview(directory, [draftFixture]);
    assert.equal(manifest.localOnly, true);
    assert.equal(manifest.paths.length, 1);
    const index = await readFile(path.join(directory, 'blog/index.html'), 'utf8');
    assert.match(index, /Article drafts for review/);
    const ids = [...index.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, 'published and draft collections have distinct heading IDs');
    for (const pathname of manifest.paths) {
      const html = await readFile(path.join(directory, pathname.slice(1), 'index.html'), 'utf8');
      for (const href of html.matchAll(/href="(\/review\/blog\/[^"#]+)"/g)) assert.ok(existsSync(path.join(directory, href[1].slice(1), 'index.html')));
    }
    await assert.rejects(addLocalDraftPreview(directory), /clean build/);
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('a reviewed article requires its real date and resolves published related content', () => {
  const post = { ...draftFixture, status: 'published', clinicalReviewConfirmed: true, publishedAt: '2026-10-01', relatedPaths: ['/ocd-types/', '/erp-therapy-bc/'] };
  assert.doesNotThrow(() => validatePosts([post]));
  const html = articleHtml(post);
  assert.match(html, /"@type":"BlogPosting"/);
  assert.match(html, /"datePublished":"2026-10-01"/);
  assert.match(html, /<time datetime="2026-10-01">/);
  assert.doesNotMatch(html, /data-review-article|Clinical review pending|noindex, nofollow/);
});

test('released articles are indexable and connected across the actual site output', () => {
  const blog = readFileSync(new URL('public/blog/index.html', root), 'utf8');
  const themes = readFileSync(new URL('public/ocd-types/index.html', root), 'utf8');
  const sitemap = readFileSync(new URL('public/sitemap.xml', root), 'utf8');
  const feed = readFileSync(new URL('public/blog/feed.xml', root), 'utf8');
  const guide = readFileSync(new URL('public/llms-full.txt', root), 'utf8');
  for (const post of publishedPosts) {
    const pathname = `/blog/${post.slug}/`;
    const url = `${SITE_ORIGIN}${pathname}`;
    const html = readFileSync(new URL(`public${pathname}index.html`, root), 'utf8');
    assert.ok(PAGE_PATHS.includes(pathname), pathname);
    assert.match(html, /name="robots" content="index, follow/);
    assert.doesNotMatch(html, /data-review-article|Clinical review pending|noindex|\/review\/blog\//);
    assert.ok(html.includes(`rel="canonical" href="${url}"`), pathname);
    assert.ok(html.includes(`<time datetime="${post.publishedAt}">`), pathname);
    const schema = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1])).find(item => item['@type'] === 'BlogPosting');
    assert.equal(schema?.datePublished, post.publishedAt, pathname);
    assert.equal(schema?.mainEntityOfPage, url, pathname);
    assert.equal(schema?.author?.name, 'Theekshitha Vadladi', pathname);
    for (const collection of [blog, themes]) assert.ok(collection.includes(`href="${pathname}"`), pathname);
    assert.ok(sitemap.includes(`<loc>${url}</loc>`), pathname);
    assert.ok(feed.includes(`<guid>${url}</guid>`), pathname);
    assert.ok(guide.includes(`Source: ${url}`), pathname);
    for (const section of post.sections) for (const item of section.items || []) assert.ok(guide.includes(item), `${pathname}: readable list content`);
  }
});
