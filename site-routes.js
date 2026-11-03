import { PAGES } from './content/site-pages.js';
import { POSTS } from './content/blog/posts.js';

export const SITE_ORIGIN = 'https://unravelcounselling.com';
export const BOOKING_URL = 'https://unravelcounselling.janeapp.com/#staff_member/1';
export const publishedPosts = POSTS.filter(post => post.status === 'published');
export const PAGE_PATHS = [...PAGES.map(page => page.path), ...publishedPosts.map(post => `/blog/${post.slug}/`)];

export const REDIRECTS = Object.freeze({
  '/ocd-therapy-bc': '/ocd-therapy-vancouver/',
  '/philosophy': '/about/',
  '/trauma-therapy-bc': '/emdr-therapy-bc/',
  '/south-asian-therapist-vancouver': '/counsellor/',
  '/anxiety-counselling-vancouver': '/anxiety-counselling-bc/',
  '/low-cost-counselling-vancouver': '/low-cost-counselling-bc/',
  '/services': '/#possibilities',
  '/virtual-counselling-bc': '/',
  '/south-asian-counselling-bc': '/about/',
  '/frequently-asked-questions': '/#questions',
  '/about-theekshitha-vadladi': '/counsellor/',
  '/fees-and-booking': '/low-cost-counselling-bc/'
});

export const RETIRED_PATHS = Object.freeze([
  '/depression-counselling-bc', '/sex-therapy-bc', '/couples-therapy-bc',
  '/relationships-intimacy-counselling-bc', '/burnout-therapy-vancouver',
  '/career-transition-counselling-vancouver', '/vancouver-loneliness-counselling',
  '/eldest-daughter-burnout-counselling', '/family-boundaries-counselling-bc'
]);

export function pagePath(pathname) {
  if (!pathname || pathname === '/' || pathname === '/index.html') return '/';
  const withoutIndex = pathname.replace(/\/index\.html$/, '/');
  return `${withoutIndex.replace(/\/+$/, '')}/`;
}

export function redirectFor(pathname, hostname = '') {
  const base = pathname.replace(/\/index\.html$/, '').replace(/\/+$/, '') || '/';
  if (REDIRECTS[base]) return `${SITE_ORIGIN}${REDIRECTS[base]}`;
  const canonical = pagePath(pathname);
  if (PAGE_PATHS.includes(canonical) && pathname !== canonical) return `${SITE_ORIGIN}${canonical}`;
  if (hostname === 'www.unravelcounselling.com') return `${SITE_ORIGIN}${pathname}`;
  return null;
}

export function vercelRedirects() {
  const aliases = Object.entries(REDIRECTS).flatMap(([source, destination]) =>
    [source, `${source}/`, `${source}/index.html`].map(variant => ({ source: variant, destination: `${SITE_ORIGIN}${destination}`, permanent: true })));
  const canonical = PAGE_PATHS.flatMap(path => path === '/'
    ? [{ source: '/index.html', destination: `${SITE_ORIGIN}/`, permanent: true }]
    : [path.slice(0, -1), `${path}index.html`].map(source => ({ source, destination: `${SITE_ORIGIN}${path}`, permanent: true })));
  return [...aliases, ...canonical, {
    source: '/:path*', has: [{ type: 'host', value: 'www.unravelcounselling.com' }],
    destination: `${SITE_ORIGIN}/:path*`, permanent: true
  }];
}
