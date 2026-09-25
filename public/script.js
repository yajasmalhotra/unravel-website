const menuButton = document.getElementById('menu-toggle');
const menuClose = document.getElementById('menu-close');
const menu = document.getElementById('site-menu');
const header = document.getElementById('site-header');
let menuReturnFocus = null;

function setMenu(open) {
  if (open === !menu.hidden) return;
  if (open) menuReturnFocus = document.activeElement;
  menu.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.classList.toggle('menu-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) menuClose.focus();
  else if (menuReturnFocus instanceof HTMLElement) menuReturnFocus.focus();
}

menuButton.addEventListener('click', () => setMenu(menu.hidden));
menuClose.addEventListener('click', () => setMenu(false));
menu.addEventListener('click', event => {
  if (event.target === menu) setMenu(false);
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
header.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  if (!menu.hidden) setMenu(false);
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !menu.hidden) setMenu(false);
});

const syncHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
window.addEventListener('scroll', syncHeader, { passive: true });
syncHeader();

const questions = document.querySelector('.faq-cards');
if (questions) {
  document.querySelectorAll('.carousel-arrow').forEach(button => button.addEventListener('click', () => {
    const width = questions.querySelector('article').getBoundingClientRect().width + 14;
    questions.scrollBy({ left: (button.dataset.scroll === 'next' ? 1 : -1) * width, behavior: 'smooth' });
  }));
}
