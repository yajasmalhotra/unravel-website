import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const EMAIL = 'theekshitha@unravelcounselling.com';
const BOOKING_URL = `mailto:${EMAIL}?subject=Free%20consultation%20request%20for%20Unravel%20Counselling`;
const serviceLinks = [
  ['Trauma Therapy', '/trauma-therapy-bc/'],
  ['Sex Therapy', '/sex-therapy-bc/'],
  ['Couples Therapy', '/couples-therapy-bc/'],
  ['EMDR Therapy', '/emdr-therapy-bc/'],
  ['Low Cost Counselling', '/low-cost-counselling-bc/'],
  ['Depression Counselling', '/depression-counselling-bc/'],
  ['Anxiety Counselling', '/anxiety-counselling-bc/']
];

function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold });
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function Reveal({ children, className = '', threshold = 0.12 }) {
  const { ref, visible } = useReveal(threshold);
  return <div ref={ref} className={`reveal ${visible ? 'reveal--visible' : ''} ${className}`}>{children}</div>;
}

function Ghost({ children, align = 'left' }) {
  return <span className={`ghost ghost--${align}`} aria-hidden="true">{children}</span>;
}

function Nav() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const closeMenus = () => { setOpen(false); setServicesOpen(false); };
  return <nav className="nav"><div className="nav__bar"><a className="nav__logo" href="#home">Unravel Counselling</a><div className="nav__links nav__links--desktop"><a href="/philosophy/">Philosophy</a><div className="nav__services"><button className="nav__services-toggle" type="button" onClick={() => setServicesOpen(!servicesOpen)} aria-expanded={servicesOpen} aria-controls="services-menu">Services <span aria-hidden="true">⌄</span></button>{servicesOpen && <div className="nav__services-menu" id="services-menu">{serviceLinks.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</div>}</div><a href="#about">About</a><a className="nav__book" href={BOOKING_URL}>Book</a></div><div className="nav__mobile-actions"><a className="nav__book" href={BOOKING_URL}>Book</a><button className="menu-button" type="button" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}><span /><span /><span /></button></div></div>{open && <div className="nav__links nav__links--mobile"><a href="/philosophy/" onClick={closeMenus}>Philosophy</a><button className="nav__services-toggle" type="button" onClick={() => setServicesOpen(!servicesOpen)} aria-expanded={servicesOpen}>Services <span aria-hidden="true">⌄</span></button>{servicesOpen && <div className="nav__services-menu">{serviceLinks.map(([label, href]) => <a key={href} href={href} onClick={closeMenus}>{label}</a>)}</div>}<a href="#about" onClick={closeMenus}>About</a></div>}</nav>;
}

const focusAreas = [
  ['Eldest Daughter & Parentification', 'Parentified daughter counselling in Vancouver for women who are exhausted from translating, caretaking, and holding the family together.', '/eldest-daughter-burnout-counselling/'],
  ['First-Gen Identity & Success Guilt', 'Therapy for first-generation professionals carrying the guilt of success while building a life their family could not model.', '/south-asian-counselling-bc/'],
  ['Cultural Boundaries & Family Conflict', 'Culturally attuned support for differentiation without detonation—more emotional space without going no contact.', '/family-boundaries-counselling-bc/'],
  ['Emotional Estrangement & Ambiguous Loss', 'A place to grieve relationships, belonging, or the version of family you hoped for when there is no clean ending.', '/vancouver-loneliness-counselling/'],
  ['The “Strong Friend” & Relational Loneliness', 'Support for high-achieving women who show up for everyone else but feel unseen, disconnected, or alone in Vancouver.', '/vancouver-loneliness-counselling/'],
  ['High-Achiever & Corporate Burnout', 'Therapy for professionals running on fumes behind a polished exterior, with no room left to rest, feel, or want.', '/virtual-counselling-bc/'],
  ['Intergenerational Trauma & Nervous System Care', 'Practical ACT, EMDR, somatic, and relational therapy to help your body feel safer in the life you are creating.', '/virtual-counselling-bc/']
];

function App() {
  return <div className="site">
    <Nav />
    <section className="hero" id="home"><div className="hero__photo"><img src="/hero-texture.jpg" alt="Textured abstract artwork in moss, ochre, and earth tones" /></div><Ghost>UNRAVEL</Ghost><Reveal className="hero__content" threshold={0.01}><h1><em>Unravel</em> what<br />you inherited.<br /><span className="hero__discover-line">Keep what is<br />yours.</span></h1><div className="practice__copy"><p style={{ margin: '0 0 30px', textAlign: 'left' }}>Culturally attuned virtual therapy across British Columbia for South Asian and first-generation professionals.</p></div><a className="button button--dark" href={BOOKING_URL}>Let's Unravel This Together | Book a Free Consultation <span>↗</span></a></Reveal><div className="marquee"><div className="marquee-track"><span>ROOTS · BOUNDARIES · BELONGING · SELF-TRUST · UNRAVEL · BEGIN ·</span><span aria-hidden="true">ROOTS · BOUNDARIES · BELONGING · SELF-TRUST · UNRAVEL · BEGIN ·</span></div></div></section>
    <section className="approach" id="resonance"><Ghost>THREAD</Ghost><Reveal className="approach__reveal"><div className="section-kicker light"><span className="spin-slow">✦</span> &nbsp; 02 — SOME OF THIS MAY SOUND FAMILIAR</div><div className="approach__cards"><article className="approach__card"><i /><h3>Fine, by every measure</h3><p>The promotion came through. The family group chat is proud. And you still brace for Sunday evening. Competence has turned into its own kind of trap: the better you carry things, the less anyone thinks to ask how heavy they are.</p></article><article className="approach__card"><i /><h3>Fluent in every room</h3><p>There's the version of you in meetings, with friends, and the version on the phone with your parents. You code-switch between them without dropping a thing. You learned this fluency to keep people close, not to keep them out. But the translating never stops, and you've lost track of who you are underneath it.</p></article><article className="approach__card"><i /><h3>Surrounded, but still alone</h3><p>Everyone loves you in the ways they know how. But when something goes wrong, you notice yourself editing it first — smaller, tidier, easier to hear — because you'd rather hold it than hand anyone one more thing. So the people closest to you know only the version you knew they'd approve.</p></article></div><p className="approach__note" style={{ fontFamily: 'Fraunces, serif', fontSize: '13px', fontStyle: 'italic' }}>There's a version of you that doesn't need editing. You're allowed to bring it all here.</p></Reveal></section>
    <section className="practice" id="philosophy"><Ghost align="center">SPACE</Ghost><Reveal className="practice__reveal"><div className="practice__inner"><blockquote><span style={{ fontSize: 'calc(1em + 2pt)' }}>Unravelling isn't coming apart. It's coming loose, a little at a time, without losing anything you want to keep.</span></blockquote><div className="practice__copy"><div className="section-kicker"><span className="spin-slow">✦</span> &nbsp; Core philosophy</div><h3>Healing shouldn't mean leaving everything behind.</h3><p style={{ marginBottom: '12px', textAlign: 'left' }}>For a lot of South Asian and first-generation clients, therapy has come down to a choice: get better, or keep everything that made you who you are. Your family. Your culture. The expectations you were raised with, and the ones you set for yourself. Loosen any of it and something feels at risk. Hold all of it and nothing gets lighter.</p><p style={{ marginBottom: '12px', textAlign: 'left' }}>Unravel exists because that isn't the only option. What's tangled can be worked loose — slowly, and without cutting anything you want to keep.</p><p style={{ textAlign: 'left' }}>Nothing about you needs undoing. Some of what you might carry does.</p><a href={BOOKING_URL}>Let's Unravel This Together →</a></div></div></Reveal></section>
    <section className="approach" id="focus"><Ghost>ROOTS</Ghost><Reveal className="approach__reveal"><div className="section-kicker light"><span className="spin-slow">✦</span> &nbsp; 04 — Focus areas</div><div className="approach__cards">{focusAreas.map(([title, text, href]) => <article className="approach__card" key={title}><i /><h3><a href={href}>{title}</a></h3><p>{text}</p></article>)}</div><p className="approach__note">Virtual therapy for South Asian and first-generation immigrant women across British Columbia.</p></Reveal></section>
    <section className="about" id="about"><Ghost align="right">SELF</Ghost><Reveal className="about__reveal"><div className="section-kicker"><span className="spin-slow">✦</span> &nbsp; 05 — About me</div><div className="about__grid"><div className="portrait"><div className="portrait__image"><img src="/therapist-headshot.png" alt="Theekshitha Vadladi, South Asian counsellor" /></div><h2>Theekshitha Vadladi</h2><p>she/her</p></div><div className="about__copy"><h2>No translation needed.</h2><div className="credential">South Asian counsellor · Online across British Columbia</div><p>As a South Asian woman in my late 20s, I understand the pressure to be impressive, grateful, available, and okay. You will not need to explain why family love and family obligation can feel tangled, or why success can come with guilt. I bring peer-to-peer relatability alongside clinical training in ACT, EMDR, and somatic and relational approaches.</p><p>Our work is about more than insight. It is about reclaiming your energy, trusting your own voice, and making choices that belong to you.</p><div className="trainings"><h3>How it works</h3><div className="training-row"><span className="training-value">01 · Consultation — Tell me what is bringing you here.</span><button type="button" aria-label="How therapy works">→</button></div><div className="training-dots" role="list" aria-label="Three steps to begin"><span className="training-dot training-dot--active" role="listitem" /><span className="training-dot" role="listitem" /><span className="training-dot" role="listitem" /></div><p>02 · Tailored plan — We choose practical tools for your story, pace, and nervous system.</p><p>03 · Reclaiming your energy — You build a life that has room for your needs, values, and joy.</p></div></div></div></Reveal></section>
    <section className="cta" id="book"><Ghost align="center"><span>ARRIVE</span></Ghost><Reveal><div><h2>Ready to stop<br /><em>holding it all?</em></h2><a className="button button--dark" href={BOOKING_URL}>Let's Unravel This Together | Book a Free Consultation</a></div></Reveal></section>
    <footer><span>Unravel Counselling</span><span>Virtual therapy for South Asian and first-generation immigrant women across BC · {EMAIL}</span></footer>
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
