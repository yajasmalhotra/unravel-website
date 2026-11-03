const DROPDOWN_SELECTOR = '.page-dropdown, .site-dropdown, .uc-dropdown';

export function setupDropdownNavigation(root = document) {
  const dropdowns = [...root.querySelectorAll(DROPDOWN_SELECTOR)];
  if (!dropdowns.length) return () => {};

  const closeAll = (except = null) => {
    for (const dropdown of dropdowns) {
      if (dropdown !== except) dropdown.open = false;
    }
  };

  const toggleHandlers = new Map();
  for (const dropdown of dropdowns) {
    const handleToggle = () => {
      if (dropdown.open) closeAll(dropdown);
    };
    toggleHandlers.set(dropdown, handleToggle);
    dropdown.addEventListener('toggle', handleToggle);
  }

  const handlePointerDown = (event) => {
    if (!dropdowns.some((dropdown) => dropdown.contains(event.target))) closeAll();
  };
  const handleKeyDown = (event) => {
    if (event.key !== 'Escape') return;
    const activeDropdown = dropdowns.find((dropdown) => dropdown.open);
    if (!activeDropdown) return;
    closeAll();
    activeDropdown.querySelector('summary')?.focus();
  };

  root.addEventListener('pointerdown', handlePointerDown);
  root.addEventListener('keydown', handleKeyDown);

  return () => {
    for (const [dropdown, handler] of toggleHandlers) dropdown.removeEventListener('toggle', handler);
    root.removeEventListener('pointerdown', handlePointerDown);
    root.removeEventListener('keydown', handleKeyDown);
  };
}

export function setupSiteMenu(root = document) {
  const menu = root.querySelector('dialog.uc-menu');
  const toggle = root.querySelector('.uc-menu-toggle');
  const close = root.querySelector('.uc-menu-close');
  const header = root.querySelector('.uc-header');
  if (!menu || !toggle || !close) return;
  toggle.addEventListener('click', () => {
    menu.showModal();
    toggle.setAttribute('aria-expanded', 'true');
  });
  close.addEventListener('click', () => menu.close());
  menu.addEventListener('close', () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus({ preventScroll: true });
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => menu.close()));
  const syncHeader = () => header?.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', syncHeader, { passive: true });
  syncHeader();
}

if (typeof document !== 'undefined') {
  setupDropdownNavigation();
  setupSiteMenu();
}
