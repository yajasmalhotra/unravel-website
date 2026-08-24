import assert from 'node:assert/strict';
import test from 'node:test';
import { setupDropdownNavigation } from '../public/navigation.js';

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
