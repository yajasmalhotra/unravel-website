export const VARY_HEADER = 'Accept, Accept-Encoding';

const PAGE_CONTENT = Object.freeze({
  '/': {
    title: 'Unravel Counselling',
    summary: 'Unravel Counselling is a virtual counselling practice serving adults located across British Columbia. The practice offers culturally attuned therapy for South Asian and first-generation adults navigating anxiety, burnout, identity, relationships, intimacy, life transitions, low mood, trauma, and the pressure of living between expectations.',
    heading: 'How therapy is offered',
    detail: "Sessions are collaborative and adapted to each client's goals, pace, culture, family context, and present circumstances. Theekshitha Vadladi draws from person-centred, Acceptance and Commitment Therapy (ACT), EMDR, somatic, relational, and trauma-informed approaches. All appointments are virtual, and clients must be located in British Columbia at the time of care.",
    links: [['About Unravel Counselling', '/about/'], ['Meet Theekshitha Vadladi', '/counsellor/'], ['View consultation and contact details', '/contact/']]
  },
  '/about/': {
    title: 'About Unravel Counselling',
    summary: 'Unravel Counselling is a Vancouver-based virtual counselling practice for adults located throughout British Columbia. It was founded by Theekshitha Vadladi to offer a warm, collaborative space where culture, identity, family, relationships, work, and the realities of daily life can be discussed together rather than separated from mental health.',
    heading: 'Who the practice supports',
    detail: 'The practice has a particular understanding of South Asian and first-generation experiences, including family obligation, cultural adjustment, guilt around success, eldest-daughter pressure, belonging, boundaries, burnout, and the tension between caring for others and making room for your own life. Adults from all backgrounds who connect with the approach are welcome to enquire. Sessions are virtual for clients located in British Columbia.',
    links: [['Meet the counsellor', '/counsellor/'], ['Read the philosophy', '/philosophy/'], ['Contact Unravel Counselling', '/contact/']]
  },
  '/counsellor/': {
    title: 'Theekshitha Vadladi, counsellor at Unravel Counselling',
    summary: 'Theekshitha Vadladi offers culturally attuned virtual therapy for adults across British Columbia. As a South Asian woman and first-generation immigrant, she understands how family love, obligation, identity, success, and guilt can become tangled. Her approach is collaborative, practical, and attentive to the whole context of a client’s life.',
    heading: 'Approach to therapy',
    detail: 'The work may integrate person-centred therapy, Acceptance and Commitment Therapy (ACT), EMDR, somatic, relational, and trauma-informed approaches. Clients help shape the goals, direction, and pace of therapy.',
    links: [['About Unravel Counselling', '/about/'], ['Book a consultation', '/contact/']]
  },
  '/philosophy/': {
    title: 'The Unravel Counselling philosophy',
    summary: 'Unravel Counselling begins from the belief that healing does not require leaving your culture, family, values, or identity behind. Therapy can make room for both connection and change. The goal is not to undo who you are, but to loosen patterns that no longer fit while keeping what matters.',
    heading: 'Collaborative and culturally attentive care',
    detail: 'Advice is not imposed as a universal answer. The work considers relationships, culture, identity, systems, safety, consent, and the practical realities shaping life now.',
    links: [['About the practice', '/about/'], ['Meet Theekshitha', '/counsellor/'], ['Start a conversation', '/contact/']]
  },
  '/contact/': {
    title: 'Contact Unravel Counselling',
    summary: 'Use this page to ask about a free 15-minute consultation, current availability, fees, low-cost options, virtual sessions, or whether Unravel Counselling may be a fit. You do not need to include private clinical details in an initial message.',
    heading: 'Contact and service area',
    detail: 'Email: theekshitha@unravelcounselling.com. Unravel Counselling provides virtual therapy to adults who are located in British Columbia at the time of care. Email is not monitored as an emergency or crisis service. If you are in immediate danger, call 911 or use an appropriate local crisis service.',
    links: [['About Unravel Counselling', '/about/'], ['Privacy notice', '/privacy/']]
  },
  '/privacy/': {
    title: 'Unravel Counselling privacy notice',
    summary: 'When you email Unravel Counselling, you may choose to provide your name, email address, and message. This information is used to reply, answer practical questions, and arrange a consultation when appropriate. Do not include urgent or highly sensitive health information in an initial email.',
    heading: 'Use of information',
    detail: 'Unravel Counselling does not sell personal information. Information from an initial enquiry is used for the purpose for which it was provided, except where disclosure is required or permitted by law. Clients receive additional privacy, consent, and record-handling information through the intake process. Privacy questions can be sent to theekshitha@unravelcounselling.com.',
    links: [['Contact Unravel Counselling', '/contact/']]
  },
  '/anxiety-counselling-bc/': {
    title: 'Anxiety counselling in British Columbia',
    summary: 'Anxiety can affect rest, decisions, relationships, and ordinary days. Virtual counselling at Unravel Counselling offers a collaborative place to understand racing thoughts, body responses, expectations, and relationship patterns without treating the client as the problem.',
    heading: 'How counselling can help',
    detail: 'The work may draw from ACT, trauma-informed, somatic, relational, and practical CBT-informed tools. Family expectations, culture, work, identity, and relationship stress can all be part of the conversation.',
    links: [['Contact Unravel Counselling', '/contact/']]
  },
  '/depression-counselling-bc/': {
    title: 'Depression and low mood counselling in British Columbia',
    summary: 'Low mood, numbness, exhaustion, self-criticism, hopelessness, or loss of motivation can change how someone relates to themselves and others. Counselling at Unravel Counselling begins with curiosity rather than pressure and makes room for the parts of the experience that may be difficult to explain elsewhere.',
    heading: 'Support at your pace',
    detail: 'The work can explore what has been weighing on you, patterns that keep you isolated or depleted, and small ways to reconnect with needs, values, relationships, and support.',
    links: [['Contact Unravel Counselling', '/contact/']]
  },
  '/trauma-therapy-bc/': {
    title: 'Trauma therapy in British Columbia',
    summary: 'Trauma can shape how safe, close, alert, or exhausted life feels. Trauma therapy at Unravel Counselling is paced and collaborative. It does not require retelling every detail before you are ready. Work begins with enough steadiness and choice to notice what is present now.',
    heading: 'A paced approach',
    detail: 'Sessions may be informed by trauma-sensitive, person-centred, ACT, somatic, relational, and EMDR approaches. Goals, consent, context, and pace guide the work.',
    links: [['Contact Unravel Counselling', '/contact/']]
  },
  '/emdr-therapy-bc/': {
    title: 'EMDR therapy in British Columbia',
    summary: 'Eye Movement Desensitization and Reprocessing (EMDR) is a structured therapy approach that may help with distressing memories and the beliefs, sensations, or responses connected to them. Whether it is a fit depends on what a client is carrying, their current capacity and support, and what feels safe enough to explore.',
    heading: 'Preparation comes first',
    detail: 'If EMDR is appropriate, it is integrated thoughtfully and collaboratively rather than rushed. A consultation is a place to ask questions and decide whether the approach makes sense for you.',
    links: [['Ask about EMDR', '/contact/']]
  },
  '/sex-therapy-bc/': {
    title: 'Sex therapy in British Columbia',
    summary: 'Sex therapy at Unravel Counselling offers a nonjudgmental space to discuss desire, intimacy, communication, shame, identity, cultural messages, and the ways life affects connection. There is no expectation to arrive with the right language or to share more than feels right.',
    heading: 'Individual and relationship support',
    detail: 'Support is available for individuals and couples. The work is collaborative and affirming, with attention to values, consent, relationship context, and pace.',
    links: [['Contact Unravel Counselling', '/contact/']]
  },
  '/couples-therapy-bc/': {
    title: 'Couples therapy in British Columbia',
    summary: 'Couples therapy can help partners slow recurring patterns, hear what sits beneath conflict, and make room for each person’s needs and history. Work can explore communication, repair, intimacy, trust, family expectations, cultural differences, and changes that have put pressure on a relationship.',
    heading: 'A shared space for repair',
    detail: 'The goal is not perfect agreement. It is a more honest and respectful way to notice the cycle, practise repair, and decide how to move forward together.',
    links: [['Contact Unravel Counselling', '/contact/']]
  },
  '/low-cost-counselling-bc/': {
    title: 'Low-cost counselling in British Columbia',
    summary: 'Cost can be a real barrier to beginning therapy. Unravel Counselling welcomes questions about current low-cost options, fees, and availability. Availability can change, so practical details are shared directly rather than promised on the website.',
    heading: 'Ask about current options',
    detail: 'An initial enquiry can be brief and does not need to include private clinical details. Sessions are virtual for adults located in British Columbia.',
    links: [['Contact Unravel Counselling', '/contact/']]
  },
  '/burnout-therapy-vancouver/': {
    title: 'Career burnout therapy in Vancouver and across British Columbia',
    summary: 'Burnout can make every week feel like recovery from the one before. Counselling can address the practical mechanics of the workday, boundaries, workload, leave or accommodations, and the possibility of an exit plan.',
    heading: 'Beyond temporary relief',
    detail: 'Therapy can also explore perfectionism, productivity-based self-worth, and experiences that keep current stress activated. Unravel Counselling offers virtual sessions to adults located throughout British Columbia.',
    links: [['Contact Unravel Counselling', '/contact/']]
  },
  '/career-transition-counselling-vancouver/': {
    title: 'Career transition and job loss counselling in Vancouver',
    summary: 'A layoff, firing, or major career change can affect identity, routine, confidence, relationships, and financial security. Counselling can make room for both the practical transition and the shock, grief, anger, or embarrassment that may accompany it.',
    heading: 'A practical and psychological transition',
    detail: 'The work can support a sustainable job-search routine, processing a difficult workplace experience, unhooking worth from productivity, and clarifying a values-led next step. Sessions are virtual for adults across British Columbia.',
    links: [['Contact Unravel Counselling', '/contact/']]
  }
});

export const PUBLIC_PAGE_PATHS = Object.freeze(Object.keys(PAGE_CONTENT));

export function normalizePagePath(pathname) {
  if (!pathname || pathname === '/') return '/';
  return `${pathname.replace(/\/+$/, '')}/`;
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
  const page = PAGE_CONTENT[normalizePagePath(pathname)];
  if (!page) return null;

  const links = page.links.map(([label, path]) => `- [${label}](https://unravelcounselling.com${path})`).join('\n');
  return `# ${page.title}\n\n${page.summary}\n\n## ${page.heading}\n\n${page.detail}\n\n## Where to next\n\n${links}\n`;
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
