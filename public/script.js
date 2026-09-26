const menuButton = document.getElementById('menu-toggle');
const menuClose = document.getElementById('menu-close');
const menu = document.getElementById('site-menu');
const header = document.getElementById('site-header');
const menuPanel = menu.querySelector('.menu-panel');
const menuReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let menuReturnFocus = null;
let menuOpen = !menu.hidden;
let menuAnimations = [];

function finishMenuTransition() {
  menuAnimations.forEach(animation => animation.cancel());
  menuAnimations = [];
  menu.hidden = !menuOpen;
}

function setMenu(open) {
  if (open === menuOpen) return;
  const fromOpacity = menu.hidden ? '0' : getComputedStyle(menu).opacity;
  const fromTransform = menu.hidden ? 'translateX(18px)' : getComputedStyle(menuPanel).transform;
  menuAnimations.forEach(animation => animation.cancel());
  menuAnimations = [];
  menuOpen = open;
  if (open) menuReturnFocus = document.activeElement;
  menu.hidden = false;
  // Closing remains visible briefly, but immediately releases keyboard and pointer input.
  menu.inert = !open;
  menu.style.pointerEvents = open ? '' : 'none';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  document.body.classList.toggle('menu-open', open);
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) menuClose.focus({ preventScroll: true });
  else if (menuReturnFocus instanceof HTMLElement) menuReturnFocus.focus({ preventScroll: true });

  if (menuReducedMotion.matches || typeof menu.animate !== 'function') {
    finishMenuTransition();
    return;
  }
  const timing = { duration: open ? 220 : 180, easing: 'cubic-bezier(.22, 1, .36, 1)' };
  const fade = menu.animate([{ opacity: fromOpacity }, { opacity: open ? '1' : '0' }], timing);
  const slide = menuPanel.animate([{ transform: fromTransform }, { transform: open ? 'translateX(0)' : 'translateX(18px)' }], timing);
  menuAnimations = [fade, slide];
  fade.onfinish = () => {
    if (menuAnimations[0] === fade) finishMenuTransition();
  };
}

menuReducedMotion.addEventListener('change', () => {
  if (menuReducedMotion.matches) finishMenuTransition();
});
menuButton.addEventListener('click', () => setMenu(!menuOpen));
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

// Prepare homepage artwork before a scroll or accordion reveal needs to paint it.
// Preloads discover the files early; decoding also warms images in closed details.
for (const image of document.querySelectorAll('#main img')) {
  if (typeof image.decode === 'function') {
    // A failed image must never prevent navigation or accordion interaction.
    image.decode().catch(() => {});
  }
}

const conditionList = document.querySelector('.possibility-list');
if (conditionList && typeof Element.prototype.animate === 'function') {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const conditions = [...conditionList.querySelectorAll('details')];
  const states = new Map(conditions.map(detail => [detail, { open: detail.open, animation: null }]));
  conditionList.classList.add('conditions-animated');

  function setCondition(detail, open) {
    const state = states.get(detail);
    const panel = detail.querySelector('.possibility-detail');
    const wasVisible = detail.open;
    const current = getComputedStyle(panel);
    const from = {
      height: wasVisible ? `${panel.getBoundingClientRect().height}px` : '0px',
      opacity: wasVisible ? current.opacity : '0',
      marginBottom: wasVisible ? current.marginBottom : '0px'
    };
    state.animation?.cancel();
    state.animation = null;
    state.open = open;
    if (reducedMotion.matches) {
      detail.open = open;
      panel.style.removeProperty('overflow');
      return;
    }
    // Keep the panel rendered until its closing animation finishes.
    detail.open = true;
    const expanded = {
      height: `${panel.getBoundingClientRect().height}px`,
      opacity: '1',
      marginBottom: getComputedStyle(panel).marginBottom
    };
    panel.style.overflow = 'hidden';
    const animation = panel.animate([
      from,
      open ? expanded : { height: '0px', opacity: '0', marginBottom: '0px' }
    ], { duration: 240, easing: 'cubic-bezier(.22, 1, .36, 1)' });
    state.animation = animation;
    animation.onfinish = () => {
      if (state.animation !== animation) return;
      detail.open = state.open;
      panel.style.removeProperty('overflow');
      state.animation = null;
    };
  }

  for (const detail of conditions) {
    // JS coordinates closing animations; native exclusivity remains the no-JS fallback.
    detail.removeAttribute('name');
    detail.querySelector('summary').addEventListener('click', event => {
      event.preventDefault();
      const open = !states.get(detail).open;
      if (open) {
        for (const other of conditions) {
          if (other !== detail && states.get(other).open) setCondition(other, false);
        }
      }
      setCondition(detail, open);
    });
  }
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) {
      for (const detail of conditions) setCondition(detail, states.get(detail).open);
    }
  });
}
