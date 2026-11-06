import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { PAGES } from '../content/site-pages.js';
import { FAQ } from '../content/faq.js';
import { PAGE_PATHS, PRACTICE, SITE_ORIGIN, publishedPosts } from '../site-routes.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const fileFor = path => path === '/' ? `${root}index.html` : `${root}public${path}index.html`;
const read = path => readFileSync(fileFor(path), 'utf8');
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");
const jsonLd = path => {
  const match = read(path).match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(match, `${path}: carries structured data`);
  return JSON.parse(match[1].replace(/\\u003c/g, '<'));
};
// Blog articles use a standalone BlogPosting block rather than the page graph,
// so graph assertions cover the core pages only.
const nodeOfType = (path, type) => jsonLd(path)['@graph'].find(node => node['@type'] === type);
const CORE_PATHS = PAGES.map(page => page.path);

test('home page questions are marked up from the same source as the visible copy', () => {
  const html = read('/');
  const faq = nodeOfType('/', 'FAQPage');
  assert.ok(faq, 'the home page exposes FAQPage');
  assert.equal(faq.mainEntity.length, FAQ.length);

  const cards = html.match(/<!-- faq:start -->([\s\S]*?)<!-- faq:end -->/);
  assert.ok(cards, 'the visible question cards are rendered from content, not hand-maintained');
  assert.equal((cards[1].match(/<article>/g) || []).length, FAQ.length, 'every visible card is described by the markup');

  FAQ.forEach((item, index) => {
    const question = faq.mainEntity[index];
    assert.equal(question['@type'], 'Question');
    assert.equal(question.name, item.question);
    assert.equal(question.acceptedAnswer['@type'], 'Answer');
    assert.equal(question.acceptedAnswer.text, item.answer);
    assert.ok(cards[1].includes(`<h3>${item.question}</h3>`), `${item.question}: question is visible on the page`);
    assert.ok(decode(cards[1]).includes(item.answer), `${item.question}: answer text matches what a visitor reads`);
    if (item.link) assert.ok(cards[1].includes(`href="${item.link[1]}"`), `${item.question}: links to ${item.link[1]}`);
  });
});

test('pages describing bookable care expose Service markup quoting the published fees', () => {
  for (const page of PAGES) {
    const service = nodeOfType(page.path, 'Service');
    if (!page.serviceType) {
      assert.equal(service, undefined, `${page.path}: a page that is not a service carries no Service markup`);
      continue;
    }
    assert.ok(service, `${page.path}: exposes Service`);
    assert.equal(service.serviceType, page.serviceType);
    assert.equal(service.url, `${SITE_ORIGIN}${page.path}`);
    assert.equal(service.provider['@id'], `${SITE_ORIGIN}/#organization`);
    assert.equal(service.areaServed.name, PRACTICE.areaServed);
    assert.equal(service.audience.suggestedMinAge, PRACTICE.minimumAge);
    assert.equal(service.availableChannel.serviceLocation.name, 'Online');
    // The markup may only quote what the practice actually charges.
    assert.deepEqual(
      service.offers.map(offer => [offer.price, offer.priceCurrency]),
      PRACTICE.sessions.map(session => [session.price, PRACTICE.currency]),
      `${page.path}: offers match the published session fees`
    );
    const webpage = jsonLd(page.path)['@graph'].find(node => node['@id'] === `${SITE_ORIGIN}${page.path}#webpage`);
    assert.deepEqual(webpage.mainEntity, { '@id': service['@id'] }, `${page.path}: the page is about its service`);
  }
});

test('contact details are published consistently, or omitted entirely when unconfirmed', () => {
  for (const path of CORE_PATHS) {
    const organization = nodeOfType(path, 'Organization');
    assert.equal(organization.email, PRACTICE.email, `${path}: practice email`);
    if (PRACTICE.telephone) {
      assert.equal(organization.telephone, PRACTICE.telephone, `${path}: telephone in structured data`);
      assert.equal(organization.contactPoint.telephone, PRACTICE.telephone, `${path}: contact point telephone`);
      assert.ok(read(path).includes(`href="tel:${PRACTICE.telephone}"`), `${path}: telephone is visible and callable`);
    } else {
      assert.equal(organization.telephone, undefined, `${path}: no telephone asserted while unconfirmed`);
      assert.equal(organization.contactPoint, undefined, `${path}: no contact point asserted while unconfirmed`);
      assert.ok(!read(path).includes('tel:'), `${path}: no telephone rendered while unconfirmed`);
    }
  }
  // The footer is shared, so articles must carry the same contact route.
  for (const path of PAGE_PATHS) assert.ok(read(path).includes(`mailto:${PRACTICE.email}`), `${path}: practice email in the footer`);
});

test('the OCD themes guide is reachable from primary navigation on every page', () => {
  for (const path of PAGE_PATHS) {
    const html = read(path);
    const nav = html.match(/<nav class="uc-desktop-nav"[\s\S]*?<\/nav>/);
    assert.ok(nav, `${path}: has primary navigation`);
    assert.ok(nav[0].includes('href="/ocd-types/"'), `${path}: desktop navigation links the themes guide`);
    const fallback = html.match(/<noscript>[\s\S]*?<\/noscript>/);
    assert.ok(fallback?.[0].includes('href="/ocd-types/'), `${path}: the no-JavaScript navigation keeps it reachable`);
    const footer = html.match(/<nav aria-label="Footer navigation">[\s\S]*?<\/nav>/);
    assert.ok(footer?.[0].includes('href="/ocd-types/"'), `${path}: footer navigation links the themes guide`);
  }
});

test('the sitemap reports a real modification date for every listed page', () => {
  const sitemap = readFileSync(`${root}public/sitemap.xml`, 'utf8');
  const entries = [...sitemap.matchAll(/<url><loc>(.*?)<\/loc>(?:<lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod>)?<\/url>/g)];
  assert.equal(entries.length, PAGE_PATHS.length, 'every listed page is parsed');
  const today = new Date().toISOString().slice(0, 10);
  for (const [, loc, lastmod] of entries) {
    const path = loc.replace(SITE_ORIGIN, '');
    assert.ok(PAGE_PATHS.includes(path), `${path}: sitemap lists a live page`);
    assert.ok(lastmod, `${path}: has a lastmod`);
    assert.ok(lastmod <= today, `${path}: lastmod is not in the future`);
    const post = publishedPosts.find(entry => `/blog/${entry.slug}/` === path);
    // Articles must report their own date rather than the day the build ran.
    if (post) assert.equal(lastmod, post.modifiedAt || post.publishedAt, `${path}: date comes from the article`);
    else assert.equal(lastmod, PAGES.find(page => page.path === path).lastModified, `${path}: date is declared by its maintainer`);
  }
});

// The practice does not yet hold a registration, and the existing page guard
// forbids claiming one in copy. This extends the same rule to the markup: no
// credential may be asserted in structured data before it is actually held.
// Delete the pattern for a credential once the owner confirms it.
test('structured data claims no registration or certification the practice does not hold', () => {
  const forbidden = /EMDR[- ]certified|licensed counsellor|Registered Clinical Counsellor|\bRCC\b|hasCredential|alumniOf/i;
  for (const path of CORE_PATHS) {
    const raw = decode(read(path).match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    assert.doesNotMatch(raw, forbidden, `${path}: no unheld credential in structured data`);
  }
});
