// Questions shown in the homepage "Practical details" section, and the source for
// the matching FAQPage structured data. Text is copied from the visible page so
// the markup describes what a visitor actually reads; `answer` stays plain text
// for the schema and `link` is rendered only in the HTML.
// Keep this file and the visible section in step — tests/site-structure.test.mjs
// asserts the rendered cards match these entries exactly.
export const FAQ = Object.freeze([
  Object.freeze({
    question: 'Who are sessions for?',
    answer: 'Unravel offers virtual counselling to adults aged 18 and over who are located in British Columbia at the time of care, including Vancouver.',
    link: null
  }),
  Object.freeze({
    question: 'What does counselling cost?',
    answer: 'Individual sessions are CAD $145 for 50 minutes; extended sessions are CAD $190 for 90 minutes. Limited reduced-fee places may be available.',
    link: Object.freeze(['Explore fees.', '/low-cost-counselling-bc/'])
  }),
  Object.freeze({
    question: 'What happens in the consultation?',
    answer: 'We talk for 20 minutes by phone or video about what you want help with, how I might work with you and practical questions. The consultation is free.',
    link: null
  })
]);
