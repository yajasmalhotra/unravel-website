import { escapeHtml as esc } from './site-layout.mjs';

// All artwork is decorative. The page headings and copy carry the meaning.
export const ART_BY_PATH = {
  '/about/':'woven-context',
  '/ocd-therapy-vancouver/':'open-thread', '/erp-therapy-bc/':'small-steps',
  '/anxiety-counselling-bc/':'quiet-water', '/emdr-therapy-bc/':'gentle-layers',
  '/act-therapy-bc/':'open-path', '/blog/':'reading-space',

};
export function artwork(name, { hero = false, className = 'brand-art', sizes = '(max-width:700px) calc(100vw - 40px), 42vw' } = {}) {
  const base = `/assets/art/${name}`;
  const srcset = type => [640,1024,1200].map(width => `${base}-${width}.${type} ${width}w`).join(', ');
  return `<picture class="${esc(className)} art-${esc(name)}" aria-hidden="true"><source type="image/avif" srcset="${srcset('avif')}" sizes="${esc(sizes)}"><source type="image/webp" srcset="${srcset('webp')}" sizes="${esc(sizes)}"><img src="${base}-1024.webp" width="1200" height="800" alt="" loading="${hero ? 'eager' : 'lazy'}" decoding="async"${hero ? ' fetchpriority="high"' : ''}></picture>`;
}
export const ARTICLE_ART = { 'mental-compulsions-ocd':'quiet-loops', 'rumination-ocd':'cloud-loop', 'ocd-vs-anxiety':'two-patterns' };
export const articleArtwork = slug => ARTICLE_ART[slug];
