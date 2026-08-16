import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const EMAIL = 'theekshitha@unravelcounselling.com';
const BOOKING_URL = `mailto:${EMAIL}`;

function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold });
    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function Reveal({ children, className = '', delay = 0, threshold = 0.12 }) {
  const { ref, visible } = useReveal(threshold);
  return <div ref={ref} className={`reveal ${visible ? 'reveal--visible' : ''} ${className}`} style={{ '--reveal-delay': `${delay}s` }}>{children}</div>;
}

function Ghost({ children, align = 'left' }) {
  return <span className={`ghost ghost--${align}`} aria-hidden="true">{children}</span>;
}

function Nav() {
  const [open, setOpen] = useState(false);
  const links = [['Approach', 'approach'], ['About', 'about'], ['Practice', 'practice']];
  return <nav className="nav"><div className="nav__bar"><a className="nav__logo" href="#home">Unravel Counselling</a><div className="nav__links nav__links--desktop">{links.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}<a className="nav__book" href={BOOKING_URL}>Book</a></div><div className="nav__mobile-actions"><a className="nav__book" href={BOOKING_URL}>Book</a><button className="menu-button" type="button" onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open}><span /><span /><span /></button></div></div>{open && <div className="nav__links nav__links--mobile">{links.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}</div>}</nav>;
}

function Direction03() {
  const [training, setTraining] = useState(0);
  const trainings = ['EMDR Basic Trained', 'ACT Immersion', 'Gottman Level 1'];
  return <div className="site">
    <Nav />
    <section className="hero" id="home"><div className="hero__photo"><img src="/hero-texture.jpg" alt="Textured abstract artwork in moss, ochre, and earth tones" /></div><Ghost>UNRAVEL</Ghost><Reveal className="hero__content" threshold={0.01}><h1>Begin with<br />what is here.<br /><span className="hero__discover-line"><em>Discover</em> what</span><br />is possible.</h1><a className="button button--dark" href={BOOKING_URL}>Book a free consultation <span>↗</span></a></Reveal><div className="marquee"><div className="marquee-track"><span>NOTICE · UNDERSTAND · ACCEPT · CHOOSE · UNRAVEL · BEGIN ·</span><span aria-hidden="true">NOTICE · UNDERSTAND · ACCEPT · CHOOSE · UNRAVEL · BEGIN ·</span></div></div></section>
    <section className="approach" id="approach"><Ghost>THREAD</Ghost><Reveal className="approach__reveal"><div className="section-kicker light"><span className="spin-slow">✦</span> &nbsp; 02 — How we work</div><div className="approach__cards">{[['Listen inward', 'We begin with curiosity about the different parts of you—including the ones that feel anxious, critical, overwhelmed, or protective. Nothing needs to be pushed away.'], ['Understand what repeats', 'Together, we notice the thoughts, emotions, and relationship patterns that keep drawing you into familiar places. Understanding the pattern can create room for a different response.'], ['Move at your pace', 'When past experiences are still shaping the present, we work gently and collaboratively. EMDR may be used when it fits, always with attention to safety, choice, and readiness.']].map(([title, text]) => <article className="approach__card" key={title}><i /><h3>{title}</h3><p>{text}</p></article>)}</div><p className="approach__note">An integrative approach drawing from IFS, ACT, EFT, person-centred and existential therapy, trauma-informed care, EMDR, and practical CBT tools.</p></Reveal></section>
    <section className="about" id="about"><Ghost align="right">SELF</Ghost><Reveal className="about__reveal"><div className="section-kicker"><span className="spin-slow">✦</span> &nbsp; 03 — About</div><div className="about__grid"><div className="portrait"><div className="portrait__image"><img src="/therapist-headshot.png" alt="Theekshitha Vadladi, counsellor" /></div><h2>Theekshitha Vadladi</h2><p>she/her</p></div><div className="about__copy"><h2>Your counsellor</h2><div className="credential">CCC-Qualifying · Masters of Counselling Psychology</div><p>I work with individuals navigating anxiety, trauma, relationship patterns, self-worth, and experiences that can be hard to name. Therapy is a place to meet yourself with more honesty and less judgment—including the parts that protect, please, avoid, or shut down.</p><p>Together, we gently unravel what no longer fits, deepen trust in yourself, and make room for choices guided by your values.</p><div className="trainings"><h3>Trainings</h3><div className="training-row"><span key={training} className="training-value">{trainings[training]}</span><button onClick={() => setTraining((training + 1) % 3)} aria-label="Next training">→</button></div><div className="training-dots" role="tablist" aria-label="Training slides">{trainings.map((_, index) => <button key={index} className={index === training ? 'training-dot training-dot--active' : 'training-dot'} onClick={() => setTraining(index)} role="tab" aria-label={`Show training ${index + 1}`} aria-selected={index === training} />)}</div></div></div></div></Reveal></section>
    <section className="practice" id="practice"><Ghost align="center">SPACE</Ghost><Reveal className="practice__reveal"><div className="practice__inner"><blockquote>Change does not begin with fixing who you are. It begins when what you carry is met with curiosity, compassion, and enough safety to be understood.</blockquote><div className="practice__copy"><div className="section-kicker"><span className="spin-slow">✦</span> &nbsp; Practice</div><h3>Based in Vancouver, BC.<br />Available online.</h3><p>Meet by secure video anywhere in British Columbia. Sessions are low cost, and on a sliding scale.</p><a href={BOOKING_URL}>See availability →</a></div></div></Reveal></section>
    <section className="cta" id="book"><Ghost align="center"><span>ARRIVE</span></Ghost><Reveal><div><h2>Ready when<br /><em>you are.</em></h2><a className="button button--dark" href={BOOKING_URL}>Book a free consultation</a></div></Reveal></section>
    <footer><span>Unravel Counselling</span><span>Vancouver, BC · Canadian Certified Counsellor - Qualifying · CCPA · {EMAIL}</span></footer>
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><Direction03 /></React.StrictMode>);
