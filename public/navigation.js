const DROPDOWN_SELECTOR = '.page-dropdown, .site-dropdown';

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

if (typeof document !== 'undefined') setupDropdownNavigation();
