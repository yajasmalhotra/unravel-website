import { artwork, articleArtwork } from './artwork.mjs';
import { PAGES } from '../content/site-pages.js';
import { POSTS } from '../content/blog/posts.js';
import { BOOKING_URL, SITE_ORIGIN } from '../site-routes.js';
import { documentHead, escapeHtml as esc, siteFooter, siteHeader } from './site-layout.mjs';

const dateLabel = value => new Intl.DateTimeFormat('en-CA', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${value}T12:00:00Z`));
const pathFor = (post, review) => `${review && post.status === 'draft' ? '/review/blog/' : '/blog/'}${post.slug}/`;
export const COLLECTION_START = '<!-- article-collection:start -->';
export const COLLECTION_END = '<!-- article-collection:end -->';

export function articleCollection(posts, { review = false } = {}) {
  if (!posts.length) return '';
  const headingId = review ? 'draft-collection-title' : 'article-collection-title';
  const cards = posts.map(post => `<article class="blog-card"><p class="blog-date">${review ? 'DRAFT · FOR CLINICAL REVIEW' : `<time datetime="${post.publishedAt}">${dateLabel(post.publishedAt)}</time>`}</p><h3><a href="${pathFor(post, review)}">${esc(post.title)}</a></h3><p>${esc(post.excerpt)}</p><a class="blog-read" href="${pathFor(post, review)}">${review ? 'Review draft' : 'Read article'} <span aria-hidden="true">↗</span></a></article>`).join('\n');
  return `<section class="detail-section article-collection" aria-labelledby="${headingId}"><div class="wrap"><p class="eyebrow">${review ? 'LOCAL DRAFTS' : 'FROM UNRAVEL'}</p><h2 id="${headingId}">${review ? 'Article drafts for review.' : 'Articles and perspectives.'}</h2>${review ? '<p class="review-note">These drafts are awaiting the practice owner’s clinical review. They have no publication date and are excluded from the public sitemap and feed.</p>' : ''}<div class="blog-grid">${cards}</div></div></section>`;
}

export function articleHtml(post, { review = false } = {}) {
  if (!review && (post.status !== 'published' || !post.clinicalReviewConfirmed || !post.publishedAt)) throw new Error(`${post.slug}: reviewed publication details are required`);
  const path = pathFor(post, review);
  const localHref = href => {
    const target = POSTS.find(item => `/blog/${item.slug}/` === href);
    return target ? pathFor(target, review) : href;
  };
  const sourceHtml = index => {
    const source = post.sources[index - 1];
    return `<a href="${esc(source.url)}">${esc(source.title)}</a>`;
  };
  const sections = post.sections.map((section, index) => `<section id="section-${index + 1}" aria-labelledby="section-${index + 1}-title"><h2 id="section-${index + 1}-title">${esc(section.heading)}</h2>${section.paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}${section.items?.length ? `<ul>${section.items.map(item => `<li>${esc(item)}</li>`).join('')}</ul>` : ''}${section.sourceIndexes?.length ? `<p class="article-citations">Sources: ${section.sourceIndexes.map(sourceHtml).join('; ')}.</p>` : ''}${section.links?.length ? `<ul class="article-section-links">${section.links.map(([title, href]) => `<li><a href="${esc(localHref(href))}">${esc(title)}</a></li>`).join('')}</ul>` : ''}</section>`).join('\n');
  const sources = post.sources?.length ? `<section id="sources"><h2>Sources and further reading</h2><ol>${post.sources.map(source => `<li><a href="${esc(source.url)}">${esc(source.title)}</a></li>`).join('')}</ol></section>` : '';
  const related = (post.relatedPaths || []).map(href => `<li><a href="${esc(localHref(href))}">${esc(PAGES.find(page => page.path === href)?.h1 || POSTS.find(item => `/blog/${item.slug}/` === href)?.title || href)}</a></li>`).join('');
  const schema = { '@context': 'https://schema.org', '@type': 'BlogPosting', '@id': `${SITE_ORIGIN}${path}#article`, headline: post.title, description: post.description, datePublished: post.publishedAt, ...(post.modifiedAt ? { dateModified: post.modifiedAt } : {}), author: { '@type': 'Person', name: 'Theekshitha Vadladi', url: `${SITE_ORIGIN}/counsellor/` }, publisher: { '@type': 'Organization', '@id': `${SITE_ORIGIN}/#organization`, name: 'Unravel Counselling', url: `${SITE_ORIGIN}/` }, mainEntityOfPage: `${SITE_ORIGIN}${path}` };
  const byline = review ? 'Prepared for Unravel Counselling · Clinical review pending' : `By <a href="/counsellor/">Theekshitha Vadladi</a> · <time datetime="${post.publishedAt}">${dateLabel(post.publishedAt)}</time>${post.modifiedAt ? ` · Updated <time datetime="${post.modifiedAt}">${dateLabel(post.modifiedAt)}</time>` : ''}`;
  return `<!doctype html><html lang="en-CA"><head>${documentHead({ title: post.seoTitle, description: post.description, path, article: !review, noindex: review })}${review ? '' : `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`}</head><body class="detail-page uc-art-page brand-inner-page blog-article" style="--detail-start:#435c65;--detail-end:#91a8ad;--detail-glow:rgba(240,196,174,.3)" data-generated-blog="true"${review ? ' data-review-article="true"' : ''}><a class="skip-link" href="#main">Skip to content</a>${siteHeader()}
  <main id="main"><article><header class="article-header">${articleArtwork(post.slug) ? artwork(articleArtwork(post.slug), { hero: true, sizes: '(max-width:700px) calc(100vw - 40px), 660px' }) : ''}<div class="article-width"><a href="/blog/">← Blog &amp; resources</a>${review ? '<p class="draft-label">DRAFT · AWAITING CLINICAL REVIEW</p>' : ''}<h1>${esc(post.title)}</h1><p>${byline}</p><p class="article-excerpt">${esc(post.excerpt)}</p><details class="article-contents"><summary>In this article</summary><nav aria-label="Article sections">${post.sections.map((section, index) => `<a href="#section-${index + 1}">${esc(section.heading)}</a>`).join('')}<a href="#sources">Sources</a></nav></details></div></header><div class="article-width article-prose"><p class="article-scope">General information to support a conversation about care. This article does not diagnose your experience or provide an individual treatment plan.</p>${sections}${sources}<aside><h2>Explore care at Unravel</h2><p>Unravel offers virtual OCD and anxiety counselling for adults in British Columbia. Individual needs and fit can be discussed in a free 15-minute phone or video consultation.</p><ul>${related}<li><a href="${BOOKING_URL}">Book a free consultation</a></li></ul></aside></div></article></main>${siteFooter()}</body></html>\n`;
}
