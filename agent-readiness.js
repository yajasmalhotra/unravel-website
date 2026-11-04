import { PAGES } from './content/site-pages.js';
import { CARE_PAGES } from './content/care-pages.js';
import { TRAINING } from './content/training.js';
import { publishedPosts, pagePath } from './site-routes.js';

export const VARY_HEADER = 'Accept, Accept-Encoding';
const PAGE_CONTENT = Object.fromEntries([
  ...PAGES.map(page => [page.path, { ...page, title: page.path === '/about/' ? 'About Unravel Counselling' : page.title, heading: 'Care and practical details' }]),
  ...publishedPosts.map(post => [`/blog/${post.slug}/`, {
    title: post.title, summary: post.excerpt, heading: 'About this article',
    detail: post.sections.map(section => `${section.heading}: ${section.paragraphs.join(' ')}`).join('\n\n'),
    links: [['Blog and resources', '/blog/'], ['Meet the author', '/counsellor/'], ...(post.sources || []).map(source => [source.title, source.url])]
  }])
]);
export const PUBLIC_PAGE_PATHS = Object.freeze(Object.keys(PAGE_CONTENT));
export const normalizePagePath = pagePath;

// Reuse the visible editorial source so the text representation stays current.
const textFromHtml = value => value
  .replace(/<a href="([^"]+)">([\s\S]*?)<\/a>/g, (_, href, label) => `[${label}](${new URL(href, 'https://unravelcounselling.com').href})`)
  .replace(/<[^>]+>/g, '')
  .replaceAll('&amp;', '&');

function careGuideMarkdown(care) {
  const sections = care.sections.map(section => {
    const training = TRAINING[section.trainingKey];
    const completed = training ? `\n\nCompleted training: ${training.title}, ${training.provider}, with ${training.trainers}.${section.trainingKey === 'emdr' ? ' Both training parts and required consultation are complete.' : ''}` : '';
    return `## ${section.heading}\n\n${section.paragraphs.map(textFromHtml).join('\n\n')}${completed}${section.items?.length ? `\n\n${section.items.map(item => `- ${textFromHtml(item)}`).join('\n')}` : ''}`;
  });
  return `## ${care.intro}\n\n${care.introParagraphs.map(textFromHtml).join('\n\n')}\n\n${sections.join('\n\n')}\n\n## ${care.stepsHeading}\n\n${care.steps.map(([heading, text]) => `### ${heading}\n\n${text}`).join('\n\n')}\n\n## Fees and format\n\nFree consultation: 15 minutes, phone or video. Individual session: CAD $145 for 50 minutes. Extended individual session: CAD $190 for 90 minutes. Limited reduced-fee places depend on availability. Adults 18+, virtual, physically located in BC during sessions.\n\n## Common questions\n\n${care.faqs.map(([question, answer]) => `### ${question}\n\n${textFromHtml(answer)}`).join('\n\n')}`;
}

function articleMarkdown(post) {
  const absolute = href => new URL(href, 'https://unravelcounselling.com').href;
  const sections = post.sections.map(section => {
    const items = section.items?.length ? `\n\n${section.items.map(item => `- ${item}`).join('\n')}` : '';
    const sources = section.sourceIndexes?.length ? `\n\nSources: ${section.sourceIndexes.map(index => { const source = post.sources[index - 1]; return `[${source.title}](${source.url})`; }).join('; ')}.` : '';
    const links = section.links?.length ? `\n\n${section.links.map(([label, href]) => `- [${label}](${absolute(href)})`).join('\n')}` : '';
    return `## ${section.heading}\n\n${section.paragraphs.join('\n\n')}${items}${sources}${links}`;
  });
  return `By [Theekshitha Vadladi](https://unravelcounselling.com/counsellor/)\n\nPublished: ${post.publishedAt}${post.modifiedAt ? `\nUpdated: ${post.modifiedAt}` : ''}\n\nGeneral information to support a conversation about care. This article does not diagnose your experience or provide an individual treatment plan.\n\n${sections.join('\n\n')}`;
}

function parseAcceptHeader(value) {
  return value.split(',').map((part, index) => {
    const [rawType, ...rawParameters] = part.trim().toLowerCase().split(';');
    const [type, subtype] = rawType.split('/');
    if (!type || !subtype) return null;

    let quality = 1;
    for (const parameter of rawParameters) {
      const [name, rawValue] = parameter.trim().split('=');
      if (name === 'q') {
        const parsed = Number(rawValue);
        quality = Number.isFinite(parsed) && parsed >= 0 && parsed <= 1 ? parsed : 0;
      }
    }

    const specificity = type === '*' ? 0 : subtype === '*' ? 1 : 2;
    return { type, subtype, quality, specificity, index };
  }).filter((entry) => entry && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality || b.specificity - a.specificity || a.index - b.index);
}

export function negotiateRepresentation(acceptHeader) {
  if (!acceptHeader?.trim()) return 'html';

  for (const range of parseAcceptHeader(acceptHeader)) {
    if (range.type === 'text' && range.subtype === 'markdown') return 'markdown';
    if (range.type === 'text' && range.subtype === 'html') return 'html';
    if ((range.type === 'text' && range.subtype === '*') || (range.type === '*' && range.subtype === '*')) return 'html';
  }

  return null;
}

export function getMarkdownPage(pathname) {
  const path = normalizePagePath(pathname);
  const page = PAGE_CONTENT[path];
  if (!page) return null;

  const links = page.links.map(([label, path]) => `- [${label}](${new URL(path, 'https://unravelcounselling.com').href})`).join('\n');
  const article = publishedPosts.find(post => path === `/blog/${post.slug}/`);
  const content = CARE_PAGES[path] ? careGuideMarkdown(CARE_PAGES[path]) : article ? articleMarkdown(article) : `## ${page.heading}\n\n${page.detail}`;
  return `# ${page.title}\n\n${page.summary}\n\n${content}\n\n## Where to next\n\n${links}\n`;
}

export function getMarkdownNotFound() {
  return `# Page not found

The requested page does not exist on Unravel Counselling.

## Try one of these paths

- [Unravel Counselling home](https://unravelcounselling.com/)
- [About Unravel Counselling](https://unravelcounselling.com/about/)
- [Contact and consultation details](https://unravelcounselling.com/contact/)
- [Agent-readable site guide](https://unravelcounselling.com/llms.txt)
- [XML sitemap](https://unravelcounselling.com/sitemap.xml)
`;
}
