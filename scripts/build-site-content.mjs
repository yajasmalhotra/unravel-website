import { mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { PAGES } from '../content/site-pages.js';
import { POSTS } from '../content/blog/posts.js';
import { CARE_PAGES } from '../content/care-pages.js';
import { FAQ } from '../content/faq.js';
import { TRAINING } from '../content/training.js';
import { carePageMain } from './care-page-layout.mjs';
import { BOOKING_URL, PAGE_PATHS, PRACTICE, REDIRECTS, RETIRED_PATHS, SITE_ORIGIN, publishedPosts, vercelRedirects, vercelMarkdownRoutes, vercelCanonicalHostRoute } from '../site-routes.js';
import { documentHead, escapeHtml as esc, siteFooter, siteHeader } from './site-layout.mjs';
import { articleCollection, articleHtml, COLLECTION_START, COLLECTION_END } from './blog-layout.mjs';
import { themeHubHtml } from './theme-hub.mjs';
import { artwork, ART_BY_PATH } from './artwork.mjs';
export { articleHtml } from './blog-layout.mjs';

const root = new URL('../', import.meta.url);
const jsonLd = value => `<script type="application/ld+json">${JSON.stringify(value).replace(/</g, '\\u003c')}</script>`;
const pageFor = path => PAGES.find(page => page.path === path);
const dateLabel = value => new Intl.DateTimeFormat('en-CA', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${value}T12:00:00Z`));
const writeIfChanged = async (path, content) => {
  const url = new URL(path, root);
  const previous = await readFile(url, 'utf8').catch(() => null);
  if (previous !== content) await writeFile(url, content);
};

export function validatePosts(posts) {
  const slugs = new Set();
  const corePaths = PAGES.map(page => page.path);
  const allPaths = new Set([...corePaths, ...posts.map(post => `/blog/${post.slug}/`)]);
  const livePaths = new Set([...corePaths, ...posts.filter(post => post.status === 'published').map(post => `/blog/${post.slug}/`)]);
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Vancouver', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
  for (const post of posts) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug || '') || slugs.has(post.slug)) throw new Error(`Invalid or repeated article slug: ${post.slug}`);
    slugs.add(post.slug);
    if (!['draft', 'published'].includes(post.status)) throw new Error(`${post.slug}: choose draft or published`);
    const isPublished = post.status === 'published';
    for (const field of ['title', 'seoTitle', 'description', 'excerpt', ...(isPublished ? ['publishedAt'] : [])]) {
      if (!post[field]?.trim()) throw new Error(`${post.slug}: ${field} is required`);
    }
    if (isPublished && !post.clinicalReviewConfirmed) throw new Error(`${post.slug}: confirm the owner reviewed the clinical content before publishing`);
    for (const date of (isPublished ? [post.publishedAt, post.modifiedAt] : []).filter(Boolean)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date || date > today) throw new Error(`${post.slug}: use a real publication/revision date, not a future date`);
    }
    if (isPublished && post.modifiedAt && post.modifiedAt < post.publishedAt) throw new Error(`${post.slug}: revision date precedes publication`);
    if (!post.sections?.length || post.sections.some(section => !section.heading || !section.paragraphs?.length)) throw new Error(`${post.slug}: provide headed article sections and paragraphs`);
    for (const source of post.sources || []) {
      if (!source.title || new URL(source.url).protocol !== 'https:') throw new Error(`${post.slug}: source links need a title and HTTPS URL`);
    }
    const validPaths = isPublished ? livePaths : allPaths;
    const checkLink = href => {
      if (href.startsWith('/')) {
        if (!validPaths.has(href)) throw new Error(`${post.slug}: related page does not exist or is not published: ${href}`);
      } else if (new URL(href).protocol !== 'https:') throw new Error(`${post.slug}: use HTTPS for external links`);
    };
    for (const related of post.relatedPaths || []) checkLink(related);
    for (const section of post.sections) {
      for (const index of section.sourceIndexes || []) if (!Number.isInteger(index) || index < 1 || index > (post.sources?.length || 0)) throw new Error(`${post.slug}: source citation does not exist: ${index}`);
      for (const [title, href] of section.links || []) { if (!title?.trim()) throw new Error(`${post.slug}: link title is required`); checkLink(href); }
    }
  }
}

function blogIndex() {
  const page = pageFor('/blog/');
  const articles = [...publishedPosts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return `<!doctype html><html lang="en-CA"><head>${documentHead(page)}<link rel="alternate" type="application/rss+xml" title="Unravel Counselling blog" href="/blog/feed.xml"></head>
  <body class="detail-page uc-art-page brand-inner-page" style="--detail-start:#435c65;--detail-end:#91a8ad;--detail-glow:rgba(240,196,174,.3)"><a class="skip-link" href="#main">Skip to content</a>${siteHeader()}
  <main id="main"><section class="detail-hero blog-hero">${artwork('reading-space', { hero: true })}<div class="wrap detail-hero-grid"><p class="eyebrow">UNDERSTAND · QUESTION · CONNECT</p><div><h1>OCD and anxiety resources.</h1><p class="detail-lead">Clear explanations of intrusive thoughts, compulsions, worry and approaches to care. A starting point for understanding the pattern and asking informed questions about therapy.</p><a class="detail-button" href="#care-guides">Explore the guides <span aria-hidden="true">↓</span></a></div></div></section>
  ${COLLECTION_START}${articleCollection(articles)}${COLLECTION_END}
  <section class="detail-section" id="care-guides"><div class="wrap detail-section-grid"><p class="eyebrow">A PLACE TO START</p><div class="detail-prose"><h2>Start with the question you are trying to understand.</h2><p>OCD can be difficult to recognise when most of the rituals happen in thought. Anxiety can be exhausting even when you keep meeting your responsibilities. These guides put words to those experiences and explain the approaches used at Unravel.</p><p>The service guides cover what counselling involves, the online format, fees and next steps. The themes guide explains common OCD language and why the pattern matters more than choosing a perfect label. The articles explore mental compulsions, rumination and the differences between OCD and anxiety.</p><p>Resources provide general education. Your circumstances, needs and goals belong in an individual conversation about care.</p></div></div>
  <div class="wrap"><a class="blog-feature" href="/ocd-types/"><span>UNDERSTANDING OCD</span><h3>OCD types, themes and intrusive thoughts</h3><p>Contamination, harm, relationships, scrupulosity and other themes: understand the language and the visible or mental rituals that may accompany it.</p><b aria-hidden="true">↗</b></a></div>
  <div class="wrap blog-guide-grid"><a href="/ocd-therapy-vancouver/"><span>OCD CARE</span><h3>Online OCD counselling</h3><p>Understand the OCD cycle, the role of ERP and how virtual care works for adults in Vancouver and BC.</p><b aria-hidden="true">↗</b></a><a href="/anxiety-counselling-bc/"><span>ANXIETY CARE</span><h3>Anxiety, worry and avoidance</h3><p>How ACT-based counselling connects responses to anxiety with the choices and activities that matter to you.</p><b aria-hidden="true">↗</b></a><a href="/erp-therapy-bc/"><span>ERP</span><h3>Exposure and response prevention</h3><p>What both parts of ERP involve, including mental rituals, collaborative planning and review of practice.</p><b aria-hidden="true">↗</b></a><a href="/act-therapy-bc/"><span>ACT</span><h3>Psychological flexibility in practice</h3><p>The six ACT processes, values in context, and how the approach informs anxiety and OCD care.</p><b aria-hidden="true">↗</b></a></div></section>
  <section class="detail-closing"><div class="wrap detail-section-grid"><p class="eyebrow">FROM READING TO CARE</p><div><h2>Ask how the approach would fit your needs.</h2><p>Unravel offers virtual individual counselling for adults aged 18+ physically located in BC. A free 15-minute phone or video consultation covers the approach, fees and availability.</p><a class="detail-button" href="${BOOKING_URL}">Book a free consultation <span aria-hidden="true">↗</span></a></div></div></section></main>${siteFooter()}</body></html>\n`;
}

function pageSchema(page) {
  const organization = { '@type': 'Organization', '@id': `${SITE_ORIGIN}/#organization`, name: PRACTICE.name, url: `${SITE_ORIGIN}/`, email: PRACTICE.email, areaServed: { '@type': 'AdministrativeArea', name: PRACTICE.areaServed }, founder: { '@id': `${SITE_ORIGIN}/counsellor/#person` } };
  // A telephone is asserted only once it exists in site-routes.js. LocalBusiness
  // is deliberately not emitted: Google requires a published physical address for
  // those results, and a half-populated local entity is worse than none.
  if (PRACTICE.telephone) {
    organization.telephone = PRACTICE.telephone;
    organization.contactPoint = { '@type': 'ContactPoint', contactType: 'customer support', telephone: PRACTICE.telephone, email: PRACTICE.email, availableLanguage: 'en', areaServed: 'CA' };
  }
  const person = { '@type': 'Person', '@id': `${SITE_ORIGIN}/counsellor/#person`, name: 'Theekshitha Vadladi', jobTitle: 'Mental health counsellor', url: `${SITE_ORIGIN}/counsellor/`, worksFor: { '@id': organization['@id'] }, knowsAbout: ['Obsessive-compulsive disorder', 'Exposure and Response Prevention', 'Anxiety disorders', 'Acceptance and Commitment Therapy', 'EMDR'] };
  const type = page.path === '/about/' ? 'AboutPage' : page.path === '/contact/' ? 'ContactPage' : page.path === '/counsellor/' ? 'ProfilePage' : page.path === '/blog/' ? 'CollectionPage' : 'WebPage';
  const webpage = { '@type': type, '@id': `${SITE_ORIGIN}${page.path}#webpage`, name: page.title, description: page.description, url: `${SITE_ORIGIN}${page.path}`, inLanguage: 'en-CA', isPartOf: { '@id': `${SITE_ORIGIN}/#website` }, about: { '@id': organization['@id'] }, ...(type === 'ProfilePage' ? { mainEntity: { '@id': person['@id'] } } : {}) };
  if (type === 'CollectionPage' && publishedPosts.length) webpage.hasPart = publishedPosts.map(post => ({ '@type': 'BlogPosting', headline: post.title, url: `${SITE_ORIGIN}/blog/${post.slug}/` }));
  const graph = [organization, person, { '@type': 'WebSite', '@id': `${SITE_ORIGIN}/#website`, name: PRACTICE.name, url: `${SITE_ORIGIN}/`, publisher: { '@id': organization['@id'] } }, webpage];

  // Service markup for the pages that describe bookable care. Fees come from the
  // same PRACTICE constant the visible copy is checked against, so the markup
  // cannot quote a price the page does not.
  if (page.serviceType) {
    const service = {
      '@type': 'Service',
      '@id': `${SITE_ORIGIN}${page.path}#service`,
      name: page.h1.replace(/\.$/, ''),
      serviceType: page.serviceType,
      description: page.description,
      url: `${SITE_ORIGIN}${page.path}`,
      provider: { '@id': organization['@id'] },
      areaServed: { '@type': 'AdministrativeArea', name: PRACTICE.areaServed },
      audience: { '@type': 'PeopleAudience', suggestedMinAge: PRACTICE.minimumAge },
      availableChannel: { '@type': 'ServiceChannel', serviceLocation: { '@type': 'Place', name: 'Online' }, availableLanguage: 'en' },
      offers: PRACTICE.sessions.map(session => ({ '@type': 'Offer', name: `${session.name} · ${session.minutes} minutes`, price: session.price, priceCurrency: PRACTICE.currency }))
    };
    graph.push(service);
    webpage.mainEntity = { '@id': service['@id'] };
  }

  // Marks up the questions already visible on the home page. This no longer earns
  // a FAQ rich result for most sites, but it keeps the answers machine-readable
  // for AI Overviews and assistants quoting the practice.
  if (page.path === '/' && FAQ.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${SITE_ORIGIN}/#faq`,
      mainEntity: FAQ.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } }))
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}

// Renders the home-page question cards from the same entries as FAQPage, so the
// visible copy and the markup cannot drift apart.
function faqCards() {
  return `<div class="wrap faq-cards">${FAQ.map(item => `<article><h3>${esc(item.question)}</h3><p>${esc(item.answer)}${item.link ? ` <a href="${esc(item.link[1])}">${esc(item.link[0])}</a>` : ''}</p></article>`).join('')}</div>`;
}

function setElement(html, expression, element) {
  return html.replace(expression, '') .replace(/<\/head>/i, `  ${element}\n</head>`);
}

export function syncPage(html, page) {
  // The shared shell is rendered at build time; every link is present without JavaScript.
  html = html.replace(/<!-- shared-header:start -->[\s\S]*?<!-- shared-header:end -->/, siteHeader());
  html = html.replace(/<!-- shared-footer:start -->[\s\S]*?<!-- shared-footer:end -->/, siteFooter());
  if (!html.includes('/shared-layout.css')) html = html.replace(/<\/head>/i, '<link rel="stylesheet" href="/shared-layout.css">\n</head>');
  html = html.replace(/sizes=["']512x512["']/g, 'sizes="96x96"');
  if (!html.includes('href="/favicon.png"')) html = html.replace(/<\/head>/i, '<link rel="icon" href="/favicon.png">\n</head>');
  if (!html.includes('src="/navigation.js"')) html = html.replace(/<\/head>/i, '<script type="module" src="/navigation.js"></script>\n</head>');
  if (!html.includes('fonts.googleapis.com/css2?family=Kufam')) html = html.replace(/<\/head>/i, '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Kufam:wght@400;500;600&amp;family=Overpass:wght@400;500;600&amp;display=swap" rel="stylesheet">\n</head>');
  html = html.replace(/<link\b[^>]*href=["']\/brand-theme.css["'][^>]*>\s*/gi, '').replace(/<\/head>/i, '<link rel="stylesheet" href="/brand-theme.css">\n</head>');
  if (page?.path !== '/' && !/class="[^"]*brand-inner-page/.test(html)) html = html.replace(/<body(?: class="([^"]*)")?/, (_, classes = '') => `<body class="${classes} brand-inner-page"`);
  if (page) { const kind = ({ '/about/':'about-page', '/counsellor/':'profile-page', '/low-cost-counselling-bc/':'fees-page', '/privacy/':'privacy-page' })[page.path]; if (kind && !html.includes(kind)) html = html.replace(/<body class="([^"]*)"/, (_, classes) => `<body class="${classes} ${kind}"`); }
  if (page?.path !== '/') html = html.replace(/<link\b[^>]*href=["']\/(?:styles|ocd-page)\.css(?:\?[^"']*)?["'][^>]*>\s*/gi, '');
  if (!page) return html;
  html = setElement(html, /<title\b[^>]*>[\s\S]*?<\/title>\s*/gi, `<title>${esc(page.title)}</title>`);
  for (const [name, content, property] of [
    ['description', page.description], ['robots', 'index, follow, max-image-preview:large'],
    ['og:type', 'website', true], ['og:site_name', 'Unravel Counselling', true], ['og:title', page.title, true],
    ['og:description', page.description, true], ['og:url', `${SITE_ORIGIN}${page.path}`, true],
    ['og:image', `${SITE_ORIGIN}/assets/unravel-social.jpg`, true], ['og:image:alt', 'Blue sky artwork for Unravel Counselling', true],
    ['og:image:width', '1200', true], ['og:image:height', '630', true], ['og:image:type', 'image/jpeg', true], ['twitter:card', 'summary_large_image']
  ]) html = setElement(html, new RegExp(`<meta\\b[^>]*(?:name|property)=["']${name}["'][^>]*>\\s*`, 'gi'), `<meta ${property ? 'property' : 'name'}="${name}" content="${esc(content)}">`);
  html = setElement(html, /<link\b[^>]*rel=["']canonical["'][^>]*>\s*/gi, `<link rel="canonical" href="${SITE_ORIGIN}${page.path}">`);
  html = setElement(html, /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi, jsonLd(pageSchema(page)));
  return html;
}

export async function buildSiteContent() {
  validatePosts(POSTS);
  for (const removed of [...RETIRED_PATHS, ...Object.keys(REDIRECTS), '/templates']) {
    if (await stat(new URL(`public${removed}/`, root)).then(() => true).catch(() => false)) throw new Error(`Move retired/redirected source ${removed} outside public before building`);
  }
  await mkdir(new URL('public/blog/', root), { recursive: true });
  const keepSlugs = new Set(publishedPosts.map(post => post.slug));
  for (const entry of await readdir(new URL('public/blog/', root), { withFileTypes: true })) {
    if (!entry.isDirectory() || keepSlugs.has(entry.name)) continue;
    const file = new URL(`public/blog/${entry.name}/index.html`, root);
    if ((await readFile(file, 'utf8').catch(() => '')).includes('data-generated-blog="true"')) await rm(new URL(`public/blog/${entry.name}/`, root), { recursive: true });
  }
  await writeIfChanged('public/blog/index.html', blogIndex());
  await mkdir(new URL('public/ocd-types/', root), { recursive: true });
  await writeIfChanged('public/ocd-types/index.html', themeHubHtml());
  for (const post of publishedPosts) {
    await mkdir(new URL(`public/blog/${post.slug}/`, root), { recursive: true });
    await writeIfChanged(`public/blog/${post.slug}/index.html`, articleHtml(post));
  }
  for (const page of PAGES) {
    const file = page.path === '/' ? 'index.html' : `public${page.path}index.html`;
    let html = await readFile(new URL(file, root), 'utf8');
    if (CARE_PAGES[page.path]) {
      html = html.replace(/<main\b[^>]*>[\s\S]*?<\/main>/i, carePageMain(CARE_PAGES[page.path], page.path));
      if (!html.includes('/care-guide.css')) html = html.replace(/<\/head>/i, '<link rel="stylesheet" href="/care-guide.css">\n</head>');
    }
    if (page.path === '/') html = html.replace(/<ul class="credentials-list"[^>]*>[\s\S]*?<\/ul>/, `<ul class="credentials-list">${Object.values(TRAINING).map(training => `<li>${esc(training.short)}</li>`).join('')}</ul>`);
    if (page.path === '/') html = html.replace(/<!-- faq:start -->[\s\S]*?<!-- faq:end -->/, `<!-- faq:start -->${faqCards()}<!-- faq:end -->`);
    if (page.path === '/counsellor/') html = html.replace(/<!-- training-details:start -->[\s\S]*?<!-- training-details:end -->/, `<!-- training-details:start --><div class="training-list">${Object.values(TRAINING).map(training => `<article><h3>${esc(training.title)}</h3><p><a href="${esc(training.source)}">${esc(training.provider)}</a> · ${esc(training.trainers)}</p><p>${esc(training.detail)}</p></article>`).join('')}</div><!-- training-details:end -->`);
    await writeIfChanged(file, syncPage(html, page));
  }
  for (const file of ['public/404.html', 'public/art-sources.html']) await writeIfChanged(file, syncPage(await readFile(new URL(file, root), 'utf8')));
  // An article reports its own revision date; a core page reports the
  // lastModified its maintainer declared. A path with neither emits no lastmod
  // rather than a fabricated one, so the dates stay trustworthy to crawlers.
  const lastModifiedFor = path => {
    const post = publishedPosts.find(entry => `/blog/${entry.slug}/` === path);
    if (post) return post.modifiedAt || post.publishedAt;
    return pageFor(path)?.lastModified;
  };
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${PAGE_PATHS.map(path => {
    const lastmod = lastModifiedFor(path);
    return `  <url><loc>${SITE_ORIGIN}${path}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`;
  }).join('\n')}\n</urlset>\n`;
  await writeIfChanged('public/sitemap.xml', sitemap);
  await writeIfChanged('public/llms.txt', `# Unravel Counselling\n\nVirtual OCD and anxiety counselling for adults aged 18+ in British Columbia. ACT is the main modality, with ERP for OCD and EMDR for anxiety and trauma where appropriate.\n\nRequest a page representation with Accept: text/markdown. Care guides include their explanatory sections and questions; other core pages provide concise summaries.\n\n${PAGES.map(page => `- [${page.h1}](${SITE_ORIGIN}${page.path})`).join('\n')}\n${publishedPosts.map(post => `- [${post.title}](${SITE_ORIGIN}/blog/${post.slug}/)`).join('\n')}\n- [Care guides and page summaries](${SITE_ORIGIN}/llms-full.txt)\n`);
  const config = JSON.parse(await readFile(new URL('vercel.json', root), 'utf8'));
  config.redirects = vercelRedirects();
  config.routes = [vercelCanonicalHostRoute(), ...vercelMarkdownRoutes(), ...(config.routes || []).filter(route => !route.dest?.startsWith('/api/markdown') && !(route.status === 308 && route.headers?.Location === `${SITE_ORIGIN}/$1` && route.has?.some(condition => condition.type === 'host' && condition.value === 'www.unravelcounselling.com')))];
  config.rewrites = PAGE_PATHS.filter(path => path !== '/').map(path => ({ source: path, destination: `${path}index.html` }));
  await writeIfChanged('vercel.json', `${JSON.stringify(config, null, 2)}\n`);
  const xml = value => esc(value);
  await writeIfChanged('public/blog/feed.xml', `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Unravel Counselling: OCD and anxiety resources</title><link>${SITE_ORIGIN}/blog/</link><description>Articles from Unravel Counselling.</description><language>en-ca</language>${publishedPosts.map(post => `<item><title>${xml(post.title)}</title><link>${SITE_ORIGIN}/blog/${post.slug}/</link><guid>${SITE_ORIGIN}/blog/${post.slug}/</guid><description>${xml(post.excerpt)}</description><pubDate>${new Date(`${post.publishedAt}T12:00:00Z`).toUTCString()}</pubDate></item>`).join('')}</channel></rss>\n`);
  console.log(`Prepared ${PAGES.length} core pages and ${publishedPosts.length} published articles.`);
}

if (process.argv[1] && new URL(process.argv[1], 'file:').href === import.meta.url) await buildSiteContent();
