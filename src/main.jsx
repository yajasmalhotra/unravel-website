import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  CalendarHeart,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  HeartHandshake,
  Languages,
  MapPin,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import './styles.css';

const BOOKING_LINKS = {
  noFear:
    'https://app.acuityscheduling.com/schedule.php?owner=11580739&appointmentType=category:Theekshitha',
  elegantMind: 'https://anelegantmindcounselling.janeapp.com/#/staff_member/41',
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

function Reveal({ children, className = '', delay = 0 }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial={reduceMotion ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function JsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': 'https://theekshithav.com/#person',
        name: 'Theekshitha Vadladi',
        givenName: 'Theekshitha',
        familyName: 'Vadladi',
        jobTitle: 'Master Level Counselling Intern',
        description:
          'Vancouver-based counselling intern offering person-centered, trauma-informed and Acceptance and Commitment Therapy-informed support through No Fear Counselling and An Elegant Mind Counselling Clinic.',
        url: 'https://theekshithav.com/',
        sameAs: [
          'https://www.linkedin.com/in/theekshithav/',
          'https://www.psychologytoday.com/ca/therapists/theekshitha-vadladi-vancouver-bc/1667166',
          'https://anelegantmind.com/our-therapists',
        ],
        alumniOf: [
          { '@type': 'CollegeOrUniversity', name: 'University of British Columbia' },
          { '@type': 'CollegeOrUniversity', name: 'Adler University' },
        ],
        knowsLanguage: ['English', 'Hindi', 'Telugu', 'Tamil'],
        knowsAbout: [
          'Acceptance and Commitment Therapy',
          'Person-Centered Therapy',
          'Trauma-informed counselling',
          'Anxiety counselling',
          'Life transitions',
          'Racial identity',
          'Relationship issues',
          'Sex therapy',
        ],
        worksFor: [
          { '@type': 'Organization', name: 'No Fear Counselling', url: 'https://www.nofearcounselling.com/' },
          { '@type': 'Organization', name: 'An Elegant Mind Counselling Clinic', url: 'https://anelegantmind.com/' },
        ],
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://theekshithav.com/#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Where does Theekshitha Vadladi offer counselling?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Theekshitha offers counselling in person and online through No Fear Counselling and An Elegant Mind Counselling Clinic. No Fear options include Burrard Park Place, Burnaby Square, and remote sessions. An Elegant Mind options include 1090 Homer Street and remote sessions.',
            },
          },
          {
            '@type': 'Question',
            name: 'Who supervises Theekshitha Vadladi?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Theekshitha is supervised by Angela Leong, RCC (#16727), at An Elegant Mind Counselling Clinic, and by Ofir Vaisman, RCC (#11281), and Lindsay Brown, RCC (#15854), at No Fear Counselling.',
            },
          },
          {
            '@type': 'Question',
            name: 'What languages does Theekshitha Vadladi speak?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Theekshitha offers support in English, Hindi, Telugu, and Tamil.',
            },
          },
        ],
      },
    ],
  };

  return <script type="application/ld+json">{JSON.stringify(schema)}</script>;
}

function App() {
  const [headshotLoaded, setHeadshotLoaded] = useState(true);

  return (
    <>
      <JsonLd />
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Theekshitha Vadladi home">
          <span className="brand-mark">TV</span>
          <span>Theekshitha Vadladi</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#about">About</a>
          <a href="#qualifications">Qualifications</a>
          <a href="#book">Book</a>
        </nav>
      </header>

      <main id="home">
        <section className="hero">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow">Vancouver counselling intern | In-person and online</p>
            <h1>Therapy at a pace that lets you feel safe, heard, and more like yourself.</h1>
            <p className="hero-text">
              Theekshitha Vadladi offers warm, collaborative counselling for people navigating anxiety,
              life transitions, cultural expectations, identity, relationships, emotional overwhelm, and
              the long work of reconnecting with themselves.
            </p>
            <div className="hero-actions" aria-label="Booking options">
              <a className="button primary" href="#book">
                Book with me <ArrowRight aria-hidden="true" />
              </a>
              <a className="button secondary" href="#about">
                Learn more
              </a>
            </div>
          </motion.div>

          <motion.aside
            className="portrait-panel"
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            aria-label="Theekshitha Vadladi profile summary"
          >
            <div className="portrait">
              {headshotLoaded && (
                <img
                  src="/headshot.jpg"
                  alt="Theekshitha Vadladi, Vancouver counselling intern"
                  onError={() => setHeadshotLoaded(false)}
                />
              )}
              {!headshotLoaded && <div className="portrait-fallback" aria-hidden="true">TV</div>}
            </div>
            <div className="profile-card">
              <p className="card-label">Currently welcoming new clients</p>
              <h2>Theekshitha Vadladi, BA, MA in progress</h2>
              <p>
                Master Level Counselling Intern supervised by Angela Leong, RCC (#16727),
                Ofir Vaisman, RCC (#11281), and Lindsay Brown, RCC (#15854).
              </p>
            </div>
          </motion.aside>
        </section>

        <motion.section
          className="trust-band"
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            ['Modalities', 'ACT, person-centered, trauma-informed', ShieldCheck],
            ['Languages', 'English, Hindi, Telugu, Tamil', Languages],
            ['Focus', 'Anxiety, identity, intimacy, life transitions', Sparkles],
          ].map(([label, text, Icon]) => (
            <motion.div className="trust-item" variants={fadeUp} key={label}>
              <Icon aria-hidden="true" />
              <div>
                <p>{label}</p>
                <span>{text}</span>
              </div>
            </motion.div>
          ))}
        </motion.section>

        <section className="section split" id="about">
          <Reveal className="section-kicker">
            <p className="eyebrow">About me</p>
            <h2>Collaborative, culturally sensitive support for becoming less alone with what you carry.</h2>
          </Reveal>
          <Reveal className="prose" delay={0.05}>
            <p>
              Theekshitha’s work is rooted in the belief that therapy is not about fixing a broken
              version of you. It is a restoration process: gently making room for the parts of you
              that learned to survive, and helping you move toward the life and relationships that
              feel more honest.
            </p>
            <p>
              Her approach integrates Person-Centered Therapy and Acceptance and Commitment Therapy
              with a trauma-informed lens. Sessions prioritize safety, self-compassion, curiosity,
              and values-based change so clients can move from surviving and performing into deeper
              emotional regulation, clarity, and self-trust.
            </p>
            <p>
              She is especially passionate about relational intimacy and connection, sexual wellness
              and agency, trauma integration, cultural and systemic impacts, anxiety regulation, and
              identity exploration.
            </p>
          </Reveal>
        </section>

        <section className="section qualifications" id="qualifications">
          <Reveal className="centered">
            <p className="eyebrow">Qualifications and trainings</p>
            <h2>Education, supervision, and clinical training</h2>
          </Reveal>
          <div className="qualification-grid">
            <Reveal className="qualification-card">
              <GraduationCap aria-hidden="true" />
              <h3>Master of Arts in Counselling Psychology</h3>
              <p>Currently completing graduate training at Adler University.</p>
            </Reveal>
            <Reveal className="qualification-card" delay={0.04}>
              <BookOpen aria-hidden="true" />
              <h3>Bachelor of Arts in Psychology</h3>
              <p>University of British Columbia, graduated 2024.</p>
            </Reveal>
            <Reveal className="qualification-card" delay={0.08}>
              <ShieldCheck aria-hidden="true" />
              <h3>Clinical supervision</h3>
              <p>
                Supervised by Angela Leong, RCC (#16727), at An Elegant Mind, and by Ofir
                Vaisman, RCC (#11281), and Lindsay Brown, RCC (#15854), at No Fear Counselling.
              </p>
            </Reveal>
            <Reveal className="qualification-card" delay={0.12}>
              <CheckCircle2 aria-hidden="true" />
              <h3>Additional trainings</h3>
              <p>APT Level 2 CBT and Applied Suicide Intervention Skills Training (ASIST).</p>
            </Reveal>
          </div>
        </section>

        <section className="section book-section" id="book">
          <Reveal className="centered">
            <p className="eyebrow">Book with me</p>
            <h2>Choose the clinic that fits your needs.</h2>
            <p className="section-intro">
              Theekshitha practices through No Fear Counselling and An Elegant Mind Counselling Clinic.
              Use the links below to view appointment availability and clinic-specific details.
            </p>
          </Reveal>
          <div className="booking-grid">
            <Reveal className="booking-card">
              <div className="booking-icon"><HeartHandshake aria-hidden="true" /></div>
              <p className="card-label">No Fear Counselling</p>
              <h3>Low-cost practicum counselling</h3>
              <p>
                Book lower-cost individual, couples, family, or extended couples/family sessions.
                The booking page shows availability at Burrard Park Place, Burnaby Square, and
                remote sessions.
              </p>
              <ul className="booking-details" aria-label="No Fear Counselling locations">
                <li><MapPin aria-hidden="true" /> Burrard Park Place: #655 - 666 Burrard St, Vancouver</li>
                <li><MapPin aria-hidden="true" /> Burnaby Square: 211 - 7885 6th St, Burnaby</li>
                <li><MapPin aria-hidden="true" /> Remote counselling by video or phone</li>
              </ul>
              <a className="button primary full" href={BOOKING_LINKS.noFear} target="_blank" rel="noreferrer">
                Book at No Fear <ExternalLink aria-hidden="true" />
              </a>
            </Reveal>
            <Reveal className="booking-card" delay={0.06}>
              <div className="booking-icon"><CalendarHeart aria-hidden="true" /></div>
              <p className="card-label">An Elegant Mind</p>
              <h3>Vancouver, remote, and pro-bono options</h3>
              <div className="promo-badge">Current AEM promo: pro-bono sessions may be available</div>
              <p>
                Book individual or couples counselling through An Elegant Mind Counselling Clinic.
                Theekshitha works from the Homer Street clinic and can also offer remote sessions.
              </p>
              <ul className="booking-details" aria-label="An Elegant Mind Counselling Clinic locations">
                <li><MapPin aria-hidden="true" /> 1090 Homer St, #300, Vancouver</li>
                <li><MapPin aria-hidden="true" /> Remote counselling options through AEM</li>
              </ul>
              <a className="button primary full" href={BOOKING_LINKS.elegantMind} target="_blank" rel="noreferrer">
                Book at An Elegant Mind <ExternalLink aria-hidden="true" />
              </a>
            </Reveal>
          </div>
        </section>

        <section className="section location-section" aria-labelledby="location-title">
          <Reveal className="location-card">
            <MapPin aria-hidden="true" />
            <div>
              <p className="eyebrow">Vancouver, BC</p>
              <h2 id="location-title">Available in person and online</h2>
              <p>
                Practice locations include No Fear Counselling at Burrard Park Place and Burnaby
                Square, plus An Elegant Mind Counselling Clinic at 1090 Homer Street. Remote
                counselling is available through both clinics. For urgent mental health support,
                call 911 or contact a local crisis line immediately.
              </p>
            </div>
          </Reveal>
        </section>
      </main>

      <footer>
        <p>© 2026 Theekshitha Vadladi. Counselling services are provided through affiliated clinics.</p>
        <a href="https://www.linkedin.com/in/theekshithav/" target="_blank" rel="noreferrer">
          LinkedIn <ExternalLink aria-hidden="true" />
        </a>
      </footer>
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
