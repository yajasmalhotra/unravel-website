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

test('every published page exposes the same direct consultation booking action', () => {
  const publicPages = findHtmlFiles(path.join(PROJECT_ROOT, 'public'))
    .filter((file) => !file.includes(`${path.sep}templates${path.sep}`));
  const pages = [path.join(PROJECT_ROOT, 'index.html'), ...publicPages];
  for (const file of pages) {
    const html = readFileSync(file, 'utf8');
    const booking = [...html.matchAll(/<a class="uc-book" href="([^"]+)">([^<]+)/g)];
    assert.equal(booking.length, 1, `${file} has one header booking action`);
    assert.equal(booking[0][1], JANE_BOOKING_URL, `${file} booking destination`);
    assert.match(booking[0][2], /Book a consultation/, file);
    assert.ok(html.includes('<dialog class="uc-menu"'), `${file} has the mobile menu`);
  }
});
