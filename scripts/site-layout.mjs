import { BOOKING_URL, PRACTICE, SITE_ORIGIN, telephoneLabel } from '../site-routes.js';

export const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

export function siteHeader() {
  return `<!-- shared-header:start -->
  <header class="uc-header" id="site-header">
    <a class="uc-brand" href="/" aria-label="Unravel Counselling home">unravel<span>.</span></a>
    <nav class="uc-desktop-nav" aria-label="Primary navigation">
      <a href="/ocd-therapy-vancouver/">OCD Therapy</a><a href="/anxiety-counselling-bc/">Anxiety Counselling</a>
      <details class="uc-dropdown"><summary>Approaches</summary><div class="uc-subnav"><a href="/act-therapy-bc/">ACT therapy</a><a href="/erp-therapy-bc/">ERP therapy</a><a href="/emdr-therapy-bc/">EMDR therapy</a></div></details>
      <details class="uc-dropdown"><summary>About</summary><div class="uc-subnav"><a href="/about/">About Unravel</a><a href="/counsellor/">Meet Theekshitha</a></div></details>
      <a href="/low-cost-counselling-bc/">Fees</a><a href="/ocd-types/">OCD types</a><a href="/blog/">Blog</a>
    </nav>
    <div class="uc-header-actions"><a class="uc-book" href="${BOOKING_URL}">Book a consultation <span aria-hidden="true">↗</span></a><button class="uc-menu-toggle" type="button" aria-controls="site-menu" aria-expanded="false">Menu <span aria-hidden="true">+</span></button></div>
  </header>
  <dialog class="uc-menu" id="site-menu" aria-labelledby="menu-title">
    <div class="uc-menu-top"><a class="uc-brand" href="/" aria-label="Unravel Counselling home">unravel<span>.</span></a><button class="uc-menu-close" type="button" autofocus>Close <span aria-hidden="true">×</span></button></div>
    <h2 class="uc-sr-only" id="menu-title">Explore Unravel Counselling</h2>
    <nav class="uc-menu-links" aria-label="Menu navigation">
      <a href="/ocd-therapy-vancouver/">OCD Therapy</a><a href="/anxiety-counselling-bc/">Anxiety Counselling</a>
      <div class="uc-menu-group"><span>Approaches</span><a href="/act-therapy-bc/">ACT therapy</a><a href="/erp-therapy-bc/">ERP therapy</a><a href="/emdr-therapy-bc/">EMDR therapy</a></div>
      <div class="uc-menu-group"><span>About</span><a href="/about/">About Unravel</a><a href="/counsellor/">Meet Theekshitha</a></div>
      <a href="/low-cost-counselling-bc/">Fees</a><a href="/ocd-types/">OCD types</a><a href="/blog/">Blog &amp; resources</a><a href="${BOOKING_URL}">Book a free consultation ↗</a>
    </nav><p class="uc-menu-note">Virtual care for adults in Vancouver and across British Columbia.</p>
  </dialog>
  <noscript><nav class="uc-noscript" aria-label="Explore Unravel"><a href="/ocd-therapy-vancouver/">OCD</a><a href="/anxiety-counselling-bc/">Anxiety</a><a href="/act-therapy-bc/">ACT</a><a href="/erp-therapy-bc/">ERP</a><a href="/emdr-therapy-bc/">EMDR</a><a href="/about/">About</a><a href="/counsellor/">Counsellor</a><a href="/low-cost-counselling-bc/">Fees</a><a href="/ocd-types/">OCD types</a><a href="/blog/">Blog</a></nav></noscript>
  <!-- shared-header:end -->`;
}

// Published contact details. The phone number is omitted entirely until
// PRACTICE.telephone is confirmed, so the site never asserts an unverified one.
function footerTelephone() {
  if (!PRACTICE.telephone) return '';
  return `<a href="tel:${PRACTICE.telephone}">${telephoneLabel(PRACTICE.telephone)}</a>`;
}

export function siteFooter() {
  return `<!-- shared-footer:start -->
  <footer class="uc-footer"><div class="uc-footer-intro"><a class="uc-brand" href="/" aria-label="Unravel Counselling home">unravel<span>.</span></a><p>OCD and anxiety counselling.<br>Online, for adults across British Columbia.</p></div>
    <nav aria-label="Footer navigation"><a href="/ocd-therapy-vancouver/">OCD Therapy</a><a href="/anxiety-counselling-bc/">Anxiety Counselling</a><a href="/act-therapy-bc/">ACT</a><a href="/erp-therapy-bc/">ERP</a><a href="/emdr-therapy-bc/">EMDR</a><a href="/about/">About Unravel</a><a href="/counsellor/">Counsellor</a><a href="/low-cost-counselling-bc/">Fees</a><a href="/ocd-types/">OCD types</a><a href="/blog/">Blog</a></nav>
    <div class="uc-footer-contact"><a href="${BOOKING_URL}">Book a free consultation ↗</a>${footerTelephone()}<a href="/contact/">Contact</a><a href="mailto:${PRACTICE.email}">${PRACTICE.email}</a></div>
    <div class="uc-footer-bottom"><span>© ${new Date().getUTCFullYear()} Unravel Counselling</span>${Object.entries(PRACTICE.social).map(([label, href]) => `<a href="${href}" rel="me">${label}</a>`).join('')}<a href="/privacy/">Privacy</a><a href="/art-sources.html">Artwork credits</a></div>
  </footer><!-- shared-footer:end -->`;
}

export function documentHead({ title, description, path, article = false, noindex = false }) {
  return `<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}"><meta name="robots" content="${noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}"><link rel="canonical" href="${SITE_ORIGIN}${path}">
  <meta property="og:type" content="${article ? 'article' : 'website'}"><meta property="og:site_name" content="Unravel Counselling"><meta property="og:title" content="${escapeHtml(title)}"><meta property="og:description" content="${escapeHtml(description)}"><meta property="og:url" content="${SITE_ORIGIN}${path}"><meta property="og:image" content="${SITE_ORIGIN}/assets/unravel-social.jpg"><meta property="og:image:alt" content="Blue sky artwork for Unravel Counselling"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:type" content="image/jpeg"><meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/favicon.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Kufam:wght@400;500;600&amp;family=Overpass:wght@400;500;600&amp;display=swap" rel="stylesheet"><link rel="stylesheet" href="/detail.css"><link rel="stylesheet" href="/shared-layout.css"><link rel="stylesheet" href="/blog.css"><link rel="stylesheet" href="/brand-theme.css"><script type="module" src="/navigation.js"></script>`;
}
