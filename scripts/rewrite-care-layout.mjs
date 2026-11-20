import { BOOKING_URL } from '../site-routes.js';
import { escapeHtml as esc } from './site-layout.mjs';
import { artwork, ART_BY_PATH } from './artwork.mjs';
import { practicalFacts, closingSection } from './rewrite-layout.mjs';

const sectionLabel = label => label.toLowerCase().replace(/^\w/, c => c.toUpperCase()).replace(/\b(act|erp|ocd|emdr)\b/gi, c => c.toUpperCase());

export function carePageMain(page, path) {
  const sections = page.sections.map(s => `<section class="rw-section" id="${esc(s.id)}" aria-labelledby="${esc(s.id)}-title"><div class="rw-wrap rw-editorial"><p class="rw-kicker">${esc(s.label)}</p><div class="rw-prose"><h2 id="${esc(s.id)}-title">${esc(s.heading)}</h2>${s.paragraphs.map(p=>`<p>${p}</p>`).join('')}${s.items?.length ? `<ul class="rw-list">${s.items.map(p=>`<li>${p}</li>`).join('')}</ul>` : ''}</div></div></section>`).join('');
  return `<main id="main" class="rw-page rw-care care-guide">
    <section class="rw-hero"><div class="rw-wrap rw-hero-grid"><div><p class="rw-kicker">${esc(page.eyebrow)}</p><h1>${esc(page.heading)}</h1><p class="rw-lead">${esc(page.lead)}</p><p class="rw-provider">Counselling with <a href="/counsellor/">Theekshitha Vadladi</a></p><div class="rw-actions"><a class="rw-button" href="${BOOKING_URL}">Book a free 20-minute consultation</a><a class="rw-text-link" href="/about/">What to expect</a></div></div><div class="rw-hero-art" aria-hidden="true">${artwork(ART_BY_PATH[path], { hero: true })}</div></div></section>
    ${practicalFacts()}
    <section class="rw-section rw-intro"><div class="rw-wrap rw-editorial"><p class="rw-kicker">A PLACE TO START</p><div class="rw-prose"><h2>${esc(page.intro)}</h2>${page.introParagraphs.map(p=>`<p>${p}</p>`).join('')}<nav class="rw-jump" aria-label="On this page">${page.sections.map(s=>`<a href="#${esc(s.id)}">${esc(sectionLabel(s.label))}</a>`).join('')}<a href="#care-questions">Common questions</a></nav></div></div></section>
    ${sections}
    <section class="rw-section rw-tint" id="getting-started"><div class="rw-wrap"><div class="rw-section-heading"><p class="rw-kicker">YOUR FIRST APPOINTMENTS</p><h2>${esc(page.stepsHeading)}</h2><a class="rw-text-link" href="/about/">Read what to expect</a></div><div class="rw-step-grid">${page.steps.map(([h,p])=>`<article><h3>${esc(h)}</h3><p>${esc(p)}</p></article>`).join('')}</div></div></section>
    <section class="rw-section" id="care-questions"><div class="rw-wrap rw-editorial"><p class="rw-kicker">COMMON QUESTIONS</p><div class="rw-prose"><h2>Questions before you begin.</h2><div class="rw-faq">${page.faqs.map(([q,a])=>`<details><summary>${esc(q)}</summary><div><p>${a}</p></div></details>`).join('')}</div></div></div></section>
    <section class="rw-section rw-related"><div class="rw-wrap"><div class="rw-section-heading"><p class="rw-kicker">READ FURTHER</p><h2>More about the work.</h2></div><div class="rw-link-grid">${page.related.map(([label,title,url])=>`<a href="${url}"><span class="rw-kicker">${esc(label)}</span><h3>${esc(title)}</h3></a>`).join('')}</div><details class="rw-sources"><summary>Clinical information and sources</summary><ul>${(page.sources||[]).map(([t,u])=>`<li><a href="${esc(u)}">${esc(t)}</a></li>`).join('')}</ul><p>These sources explain the approaches. An individual plan depends on your needs and the scope of the practice.</p></details></div></section>
    ${closingSection(page.closing,page.closingText)}
  </main>`;
}
