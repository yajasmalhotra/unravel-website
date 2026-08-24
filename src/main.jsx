import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const EMAIL = 'theekshitha@unravelcounselling.com';
const JANE_BOOKING_URL = 'https://unravelcounselling.janeapp.com/#staff_member/1';
const serviceLinks = [
  ['Individual Therapy', '/trauma-therapy-bc/'],
  ['Sex and Couples Therapy', '/sex-therapy-bc/'],
  ['EMDR Therapy', '/emdr-therapy-bc/'],
  ['Low Cost Counselling', '/low-cost-counselling-bc/']
];
const aboutLinks = [
  ['About Unravel', '/about/'],
  ['Philosophy', '/philosophy/'],
  ['Counsellor', '/counsellor/']
];
const focusAreaLinks = [
  ['Career Burnout', '/burnout-therapy-vancouver/'],
  ['Career Transitions', '/career-transition-counselling-vancouver/'],
  ['Dating Fatigue', '/couples-therapy-bc/'],
  ['Anxiety', '/anxiety-counselling-bc/'],
  ['Depression and Low Mood', '/depression-counselling-bc/'],
  ['Cultural Adjustment', '/philosophy/'],
  ['Isolation and Loneliness', '/depression-counselling-bc/']
];

const serviceOfferings = [
  {
    title: 'Individual Therapy',
    description: 'For anxiety, burnout, identity, grief, and patterns that keep taking more than they give.',
    href: '/trauma-therapy-bc/',
    cue: 'A private place to hear yourself again'
  },
  {
    title: 'EMDR Therapy',
    description: 'Paced support for experiences that still feel present in your body, emotions, or relationships.',
    href: '/emdr-therapy-bc/',
    cue: 'When the past keeps arriving in the present'
  },
  {
    title: 'Sex and Couples Therapy',
    description: 'Honest, collaborative conversations about intimacy, desire, communication, conflict, and trust.',
    href: '/sex-therapy-bc/',
    cue: 'For the conversations that keep getting stuck'
  },
  {
    title: 'Affordable Low-Cost Therapy',
    description: 'Lower-cost counselling options for when finances are part of the stress.',
    href: '/low-cost-counselling-bc/',
    cue: 'Care should be possible to return to'
  }
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
  const [openMenu, setOpenMenu] = useState(null);
  const navRef = useRef(null);
  useEffect(() => {
    if (!openMenu) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!navRef.current?.contains(event.target)) setOpenMenu(null);
    };
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('pointerdown', closeOnOutsideClick);
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [openMenu]);
  const menus = [
    ['focus-areas', 'Focus Areas', focusAreaLinks],
    ['services', 'Services', serviceLinks],
    ['about', 'About', aboutLinks]
  ];
  const closeMenus = () => { setOpen(false); setOpenMenu(null); };
  const renderMenu = ([id, label, links], mobile = false) => {
    const isOpen = openMenu === id;
    const menuId = `${mobile ? 'mobile-' : ''}${id}-menu`;
    return <div className="nav__dropdown" key={`${mobile ? 'mobile-' : ''}${id}`}><button className="nav__dropdown-toggle" type="button" onClick={() => setOpenMenu(isOpen ? null : id)} aria-expanded={isOpen} aria-controls={menuId}>{label} <span aria-hidden="true">⌄</span></button>{isOpen && <div className="nav__dropdown-menu" id={menuId}>{links.map(([linkLabel, href]) => <a key={`${linkLabel}-${href}`} href={href} onClick={mobile ? closeMenus : undefined}>{linkLabel}</a>)}</div>}</div>;
  };
  return <nav className="nav" ref={navRef}><div className="nav__bar"><a className="nav__logo" href="#home"><img src="/favicon.png" width="36" height="36" alt="" />Unravel Counselling</a><div className="nav__links nav__links--desktop">{menus.map((menu) => renderMenu(menu))}<a className="nav__book" href={JANE_BOOKING_URL}>Book</a></div><div className="nav__mobile-actions"><a className="nav__book" href={JANE_BOOKING_URL}>Book</a><button className="menu-button" type="button" onClick={() => { setOpen(!open); setOpenMenu(null); }} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}><span /><span /><span /></button></div></div>{open && <div className="nav__links nav__links--mobile">{menus.map((menu) => renderMenu(menu, true))}</div>}</nav>;
}

const focusGroups = [
  {
    title: 'Work and identity',
    areas: [
      ['Burnout in High-Performing Careers', "You are the person others rely on, and no one has noticed that you are running on empty. We look at what is driving the pace and what a sustainable working life could feel like.", '/burnout-therapy-vancouver/'],
      ['Career Transition and Job Loss', "A career change can unsettle identity, routine, confidence, and security. This is space for the parts that never make it into the LinkedIn post.", '/career-transition-counselling-vancouver/']
    ]
  },
  {
    title: 'Relationships and belonging',
    areas: [
      ['Dating Fatigue and Relationship Burnout', "Dating can begin to feel like a second job. We look at recurring patterns and how to stay open without losing yourself in the search.", '/couples-therapy-bc/'],
      ['Immigrant Experiences and Cultural Adjustment', 'Navigating two worlds can mean translating your identity while carrying family expectation. We make room for guilt, pressure, and your own definition of belonging.', '/philosophy/'],
      ['Isolation and Loneliness', 'You can be busy, successful, and surrounded by people while still feeling outside of it all. We work toward genuine connection without the performance.', '/depression-counselling-bc/']
    ]
  },
  {
    title: 'Mood and steadiness',
    areas: [
      ['Anxiety', "Racing thoughts, a tight chest, and the constant scan for what could go wrong can crowd out the rest of life. We work on lowering the volume.", '/anxiety-counselling-bc/'],
      ['Depression and Low Mood', "Flatness, exhaustion, and a harsh inner voice can make hope feel inaccessible. You do not have to arrive motivated; we start where you are.", '/depression-counselling-bc/']
    ]
  }
];

function App() {
  const [openFocus, setOpenFocus] = useState(null);
  return <div className="site">
    <Nav />
    <main>
      <section className="hero" id="home"><div className="hero__photo"><picture><source type="image/avif" srcSet="/hero-texture-640.avif 640w, /hero-texture-1024.avif 1024w, /hero-texture-1600.avif 1600w" sizes="(max-width: 760px) 100vw, 52vw" /><source type="image/webp" srcSet="/hero-texture-640.webp 640w, /hero-texture-1024.webp 1024w, /hero-texture-1600.webp 1600w" sizes="(max-width: 760px) 100vw, 52vw" /><img src="/hero-texture.jpg" width="1600" height="2400" fetchPriority="high" alt="Textured abstract artwork in moss, ochre, and earth tones" /></picture></div><Ghost>UNRAVEL</Ghost><Reveal className="hero__content" threshold={0.01}><h1><em>Unravel</em> what<br />you inherited.<br /><span className="hero__discover-line">Keep what is<br />yours.</span></h1><p className="hero__lead">Culturally attuned virtual therapy across British Columbia for South Asian and first-generation adults.</p><a className="button button--dark" href={JANE_BOOKING_URL}>Start with a free consultation <span className="arrow" aria-hidden="true" /></a></Reveal><div className="marquee"><div className="marquee-track"><span>ROOTS · BOUNDARIES · BELONGING · SELF-TRUST · UNRAVEL · BEGIN ·</span><span aria-hidden="true">ROOTS · BOUNDARIES · BELONGING · SELF-TRUST · UNRAVEL · BEGIN ·</span></div></div></section>

      <section className="about" id="about"><Reveal className="about__reveal"><div className="about__grid"><div className="portrait"><div className="portrait__image"><picture><source type="image/avif" srcSet="/therapist-headshot-480.avif 480w, /therapist-headshot-840.avif 840w" sizes="(max-width: 520px) calc(100vw - 48px), 420px" /><source type="image/webp" srcSet="/therapist-headshot-480.webp 480w, /therapist-headshot-840.webp 840w" sizes="(max-width: 520px) calc(100vw - 48px), 420px" /><img src="/therapist-headshot.png" width="1122" height="1402" loading="eager" decoding="async" alt="Theekshitha Vadladi, South Asian counsellor" /></picture></div><div className="portrait__caption"><h2>Theekshitha Vadladi</h2><p>she/her · counsellor</p></div></div><div className="about__copy"><h2>You're allowed to want <em>your own life.</em></h2><p className="about__opening">For a lot of people, that sentence lands somewhere between relief and betrayal. Both make sense.</p><p>As a South Asian woman and a first-generation immigrant, I understand the pressure to be impressive, grateful, available, and okay. You will not need to explain why family love and family obligation can feel tangled, or why success can come with guilt.</p><p>Our work is about reclaiming your energy, trusting your own voice, and making choices that belong to you.</p><a className="text-link" href="/counsellor/">Meet Theekshitha <span aria-hidden="true">→</span></a></div></div></Reveal></section>

      <section className="approach" id="resonance"><Ghost>THREAD</Ghost><Reveal className="approach__reveal"><header className="section-heading"><h2>Different knots need different kinds of care.</h2><p>Start with the place that feels most familiar. Each path is collaborative, culturally attentive, and shaped around your pace.</p></header><div className="service-map">{serviceOfferings.map((service, index) => <a className={`service-card service-card--${index + 1}`} href={service.href} key={service.title}><span className="service-card__cue">{service.cue}</span><h3>{service.title}</h3><p>{service.description}</p><span className="service-card__action">Explore this service <span className="arrow" aria-hidden="true" /></span></a>)}</div><p className="approach__note">All sessions are offered virtually to clients across British Columbia.</p></Reveal></section>

      <section className="practice" id="philosophy"><Ghost align="center">SPACE</Ghost><Reveal className="practice__reveal"><div className="practice__inner"><blockquote>“Unravelling isn't coming apart. It's coming loose, a little at a time, without losing anything you want to keep.”</blockquote><div className="practice__copy"><h2>Healing shouldn't mean leaving everything behind.</h2><p>For many South Asian and first-generation clients, therapy can feel like a choice between feeling better and keeping the people, values, and culture that made them who they are.</p><p>Unravel begins somewhere else: nothing about you needs undoing. Some of what you carry can be worked loose.</p><a className="text-link" href="/philosophy/">Read our philosophy <span aria-hidden="true">→</span></a></div></div></Reveal></section>

      <section className="focus" id="focus"><Reveal><header className="section-heading"><h2>Start with what feels closest.</h2><p>You do not need the perfect name for what is happening. Choose the part of life that is asking for the most attention right now.</p></header><div className="focus-groups">{focusGroups.map((group, groupIndex) => <section className="focus-group" key={group.title}><h3>{group.title}</h3><div className="focus-accordion">{group.areas.map(([title, description, href], areaIndex) => { const focusKey = `${groupIndex}-${areaIndex}`; const isOpen = openFocus === focusKey; const panelId = `focus-panel-${focusKey}`; return <article className={`focus-accordion__item ${isOpen ? 'focus-accordion__item--open' : ''}`} key={title}><button className="focus-accordion__trigger" type="button" aria-expanded={isOpen} aria-controls={panelId} onClick={() => setOpenFocus(isOpen ? null : focusKey)}><span className="focus-accordion__title">{title}</span><span className="focus-accordion__icon" aria-hidden="true">{isOpen ? '−' : '+'}</span></button><div className="focus-accordion__panel" id={panelId} hidden={!isOpen}><p>{description}</p><a href={href}>Explore this focus area →</a></div></article>; })}</div></section>)}</div></Reveal></section>

      <section className="begin" aria-labelledby="begin-title"><Reveal><div className="begin__intro"><h2 id="begin-title">The first step should feel clear.</h2><p>A free consultation is a practical conversation about what you are looking for, current availability, and whether working together may be a fit.</p></div><ol className="begin__steps"><li><span>01</span><h3>Send a short note</h3><p>You do not need to share private clinical details in your first message.</p></li><li><span>02</span><h3>Meet for 15 minutes</h3><p>Ask practical questions and get a feel for the conversation, with no obligation.</p></li><li><span>03</span><h3>Choose what comes next</h3><p>If it feels like a fit, you can discuss availability and the next step together.</p></li></ol><a className="button button--dark" href={JANE_BOOKING_URL}>Book a free consultation <span className="arrow" aria-hidden="true" /></a></Reveal></section>

      <section className="cta" id="book"><Ghost align="center"><span>ARRIVE</span></Ghost><Reveal><div><h2>Ready to stop<br /><em>holding it all?</em></h2><p>You can begin with a question. You do not have to arrive with the whole story figured out.</p><a className="button button--dark" href={JANE_BOOKING_URL}>Start with a free consultation</a></div></Reveal></section>
    </main>
    <footer><span>Unravel Counselling</span><nav aria-label="Footer navigation"><a href="/contact/">Contact</a><a href="/privacy/">Privacy</a><a href={`mailto:${EMAIL}`}>{EMAIL}</a></nav></footer>
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
