import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { getMarkdownPage, PUBLIC_PAGE_PATHS } from '../agent-readiness.js';
import handler from '../api/markdown.js';

const read = file => readFile(new URL(`../${file}`, import.meta.url), 'utf8');

test('every sitemap page has a discoverable, current agent summary', async () => {
  const sitemap = await read('public/sitemap.xml');
  const guide = await read('public/llms-full.txt');
  const discovery = await read('public/llms.txt');
  const paths = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => new URL(match[1]).pathname);
  assert.deepEqual([...PUBLIC_PAGE_PATHS].sort(), paths.sort());
  assert.match(discovery, /Accept: text\/markdown/);
  assert.match(discovery, /https:\/\/unravelcounselling\.com\/llms-full\.txt/);
  for (const path of paths) {
    const markdown = getMarkdownPage(path);
    assert.ok(markdown, path);
    assert.ok(guide.includes(markdown), `${path} full guide must match the endpoint`);
    assert.ok(discovery.includes(`https://unravelcounselling.com${path}`), path);
    for (const match of markdown.matchAll(/\]\((.*?)\)/g)) {
      const url = new URL(match[1]);
      assert.ok(['unravelcounselling.com', 'unravelcounselling.janeapp.com'].includes(url.hostname));
    }
  }
  assert.doesNotMatch(getMarkdownPage('/'), /Booking details will be added/);
  assert.match(getMarkdownPage('/'), /free 15-minute consultation/);
  assert.ok(getMarkdownPage('/counsellor/').includes('](https://unravelcounselling.janeapp.com/#staff_member/1)'));
});

test('every agent route supports GET and bodyless HEAD with correct headers', async () => {
  for (const path of PUBLIC_PAGE_PATHS) {
    for (const method of ['GET', 'HEAD']) {
      const headers = {};
      let status, body;
      const response = {
        setHeader(name, value) { headers[name] = value; },
        status(value) { status = value; return this; },
        send(value) { body = value; },
        end() { body = ''; }
      };
      await handler({ method, headers: { accept: 'text/markdown' }, query: { path } }, response);
      assert.equal(status, 200, path);
      assert.equal(headers['Content-Type'], 'text/markdown; charset=utf-8');
      assert.match(headers.Vary, /Accept/);
      assert.equal(body, method === 'HEAD' ? '' : getMarkdownPage(path));
    }
  }
});
