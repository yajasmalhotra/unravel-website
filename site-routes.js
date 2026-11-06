import { PAGES } from './content/site-pages.js';
import { POSTS } from './content/blog/posts.js';

export const SITE_ORIGIN = 'https://unravelcounselling.com';
export const BOOKING_URL = 'https://unravelcounselling.janeapp.com/#staff_member/1';

// Verified practice facts. Contact details and fees published on the site or in
// structured data come from here, so a claim cannot be asserted in one place and
// contradicted in another.
// `telephone` is the number published on the owner's Psychology Today listing,
// confirmed for sitewide use on 5 Nov 2026. Setting it to null omits the field
// everywhere rather than emitting an unverified one.
export const PRACTICE = Object.freeze({
  name: 'Unravel Counselling',
  email: 'theekshitha@unravelcounselling.com',
  telephone: '+18254357577',
  areaServed: 'British Columbia',
  currency: 'CAD',
  minimumAge: 18,
  // Google's Knowledge Graph identifier for the Business Profile, plus the public
  // presences describing the same practice. `sameAs` lets a search engine merge
  // these into one entity instead of treating each as separate. `social` is also
  // rendered in the footer, so the markup is corroborated by a visible link.
  knowledgeGraphMid: '/g/11zfk17mm1',
  // Professional association memberships as stated on the counsellor page. These
  // are memberships, not certifications; the copy and the markup must keep that
  // distinction, and no certification may be claimed before it is granted.
  memberships: Object.freeze([
    'British Columbia Association of Clinical Counsellors (BCACC)',
    'Canadian Counselling and Psychotherapy Association (CCPA)'
  ]),
  social: Object.freeze({
    Instagram: 'https://www.instagram.com/unravelcounselling/'
  }),
  directories: Object.freeze([
    'https://www.psychologytoday.com/ca/therapists/theekshitha-vadladi-vancouver-bc/1667166'
  ]),
  sessions: Object.freeze([
    Object.freeze({ name: 'Individual session', minutes: 50, price: 145 }),
    Object.freeze({ name: 'Extended session', minutes: 90, price: 190 })
  ])
});
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

export function telephoneLabel(number) {
  if (!number) return null;
  const match = /^\+1(\d{3})(\d{3})(\d{4})$/.exec(number);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : number;
}

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

// Header negotiation must run before Vercel's static-file lookup. High-level
// rewrites are skipped when a real index.html already matches the request.
export function vercelMarkdownRoutes() {
  const has = [{ type: 'header', key: 'accept', value: '.*[tT][eE][xX][tT]/[mM][aA][rR][kK][dD][oO][wW][nN].*' }];
  return [
    { src: '/', has, dest: '/api/markdown?path=/' },
    { src: '/((?!api(?:/|$)).+)', has, dest: '/api/markdown?path=/$1' }
  ];
}

export function vercelCanonicalHostRoute() {
  return {
    src: '^/(.*)$',
    has: [{ type: 'host', value: 'www.unravelcounselling.com' }],
    status: 308,
    headers: { Location: `${SITE_ORIGIN}/$1` }
  };
}
