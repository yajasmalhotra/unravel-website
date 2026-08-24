import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { setupDropdownNavigation } from '../public/navigation.js';

const JANE_BOOKING_URL = 'https://unravelcounselling.janeapp.com/#staff_member/1';
const PROJECT_ROOT = fileURLToPath(new URL('..', import.meta.url));

function findHtmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? findHtmlFiles(entryPath) : entry.name.endsWith('.html') ? [entryPath] : [];
  });
}

class FakeEventTarget {
  constructor() { this.listeners = new Map(); }
  addEventListener(type, listener) { this.listeners.set(type, listener); }
  removeEventListener(type, listener) {
    if (this.listeners.get(type) === listener) this.listeners.delete(type);
  }
  dispatch(type, event = {}) { this.listeners.get(type)?.({ currentTarget: this, ...event }); }
}

class FakeDropdown extends FakeEventTarget {
  constructor() {
    super();
    this.open = false;
    this.insideTarget = {};
    this.summary = { focused: false, focus() { this.focused = true; } };
  }
  contains(target) { return target === this.insideTarget; }
  querySelector(selector) { return selector === 'summary' ? this.summary : null; }
}

class FakeDocument extends FakeEventTarget {
  constructor(dropdowns) { super(); this.dropdowns = dropdowns; }
  querySelectorAll() { return this.dropdowns; }
}

test('static navigation keeps one dropdown open and supports dismissal', () => {
  const first = new FakeDropdown();
  const second = new FakeDropdown();
  const root = new FakeDocument([first, second]);
  const cleanup = setupDropdownNavigation(root);

  first.open = true;
  first.dispatch('toggle');
  assert.equal(first.open, true);

  second.open = true;
  second.dispatch('toggle');
  assert.equal(first.open, false);
  assert.equal(second.open, true);

  root.dispatch('pointerdown', { target: {} });
  assert.equal(second.open, false);

  first.open = true;
  root.dispatch('keydown', { key: 'Escape' });
  assert.equal(first.open, false);
  assert.equal(first.summary.focused, true);

  cleanup();
  assert.equal(root.listeners.size, 0);
  assert.equal(first.listeners.size, 0);
  assert.equal(second.listeners.size, 0);
});

test('site-wide booking actions use Jane and navbar labels say Book', () => {
  const publicPages = findHtmlFiles(path.join(PROJECT_ROOT, 'public'))
    .filter((file) => !file.includes(`${path.sep}templates${path.sep}`));
  let navbarBookingLinkCount = 0;
  let consultationButtonCount = 0;

  for (const file of publicPages) {
    const html = readFileSync(file, 'utf8');
    for (const match of html.matchAll(/<a class="(?:page-book|nav-book)" href="([^"]+)">([^<]+)<\/a>/g)) {
      navbarBookingLinkCount += 1;
      assert.equal(match[1], JANE_BOOKING_URL, `${file} navbar booking link`);
      assert.equal(match[2], 'Book', `${file} navbar booking label`);
    }
    for (const match of html.matchAll(/<a class="button" href="([^"]+)">(Book[^<]*)/g)) {
      consultationButtonCount += 1;
      assert.equal(match[1], JANE_BOOKING_URL, `${file} consultation button`);
    }
  }

  const mainSource = readFileSync(path.join(PROJECT_ROOT, 'src/main.jsx'), 'utf8');
  assert.match(mainSource, new RegExp(`const JANE_BOOKING_URL = '${JANE_BOOKING_URL.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'`));
  assert.doesNotMatch(mainSource, /Start here/i);
  assert.ok(navbarBookingLinkCount >= 15, 'expected booking links across public page navbars');
  assert.ok(consultationButtonCount >= 10, 'expected consultation booking buttons across public pages');
});
