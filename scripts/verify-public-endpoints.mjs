import { createServer, request as httpRequest } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  normalizePagePath,
  PUBLIC_PAGE_PATHS,
  VARY_HEADER
} from '../agent-readiness.js';
import { routingMiddleware } from './preview-routing.mjs';
import { REDIRECTS, RETIRED_PATHS } from '../site-routes.js';

const projectRoot = path.resolve(import.meta.dirname, '..');
const distRoot = path.join(projectRoot, 'dist');
const machineFiles = ['/robots.txt', '/sitemap.xml', '/llms.txt', '/llms-full.txt', '/blog/feed.xml'];
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

async function staticResponse(pathname) {
  const normalized = normalizePagePath(pathname);
  let filePath;
  if (pathname === '/') filePath = path.join(distRoot, 'index.html');
  else if (machineFiles.includes(pathname)) filePath = path.join(distRoot, pathname.slice(1));
  else filePath = path.join(distRoot, normalized.slice(1), 'index.html');

  try {
    return { status: 200, filePath, body: await readFile(filePath) };
  } catch {
    const notFoundPath = path.join(distRoot, '404.html');
    return { status: 404, filePath: notFoundPath, body: await readFile(notFoundPath) };
  }
}

const middleware = routingMiddleware({ publicRoot: distRoot });
const server = createServer((request, response) => middleware(request, response, async () => {
  const pathname = new URL(request.url, 'http://127.0.0.1').pathname;
  const result = await staticResponse(pathname);
  const type = contentTypes[path.extname(result.filePath)] || 'application/octet-stream';
  response.writeHead(result.status, { 'Content-Type': type, Vary: VARY_HEADER });
  return response.end(request.method === 'HEAD' ? '' : result.body);
}));

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const { port } = server.address();
const origin = `http://127.0.0.1:${port}`;

try {
  for (const pathname of PUBLIC_PAGE_PATHS) {
    const html = await fetch(`${origin}${pathname}`, { headers: { Accept: 'text/html' } });
    if (html.status !== 200 || !html.headers.get('content-type')?.startsWith('text/html')) {
      throw new Error(`${pathname} failed HTML verification`);
    }

    const markdown = await fetch(`${origin}${pathname}`, { headers: { Accept: 'text/markdown, text/html;q=0.8' } });
    if (markdown.status !== 200 || !markdown.headers.get('content-type')?.startsWith('text/markdown')) {
      throw new Error(`${pathname} failed Markdown verification`);
    }
    if (!markdown.headers.get('vary')?.includes('Accept') || !(await markdown.text()).startsWith('# ')) {
      throw new Error(`${pathname} failed Markdown body or Vary verification`);
    }
  }

  for (const pathname of machineFiles) {
    const response = await fetch(`${origin}${pathname}`);
    if (response.status !== 200 || (await response.text()).length < 20) {
      throw new Error(`${pathname} failed machine-readable file verification`);
    }
  }

  const html404 = await fetch(`${origin}/this-page-does-not-exist`, { headers: { Accept: 'text/html' } });
  const markdown404 = await fetch(`${origin}/this-page-does-not-exist`, { headers: { Accept: 'text/markdown' } });
  const unacceptable = await fetch(`${origin}/`, { headers: { Accept: 'text/markdown;q=0, text/html;q=0' } });
  if (html404.status !== 404 || markdown404.status !== 404 || unacceptable.status !== 406) {
    throw new Error('404 or 406 status verification failed');
  }

  let redirectChecks = 0;
  for (const [alias, destination] of Object.entries(REDIRECTS)) {
    for (const variant of [alias, `${alias}/`, `${alias}/index.html`]) {
      const response = await fetch(`${origin}${variant}?ref=route-check`, { redirect: 'manual' });
      const expected = new URL(destination, origin);
      expected.search = '?ref=route-check';
      if (response.status !== 308 || new URL(response.headers.get('location'), origin).href !== expected.href) throw new Error(`Incorrect redirect: ${variant}`);
      redirectChecks++;
    }
  }
  for (const pathname of PUBLIC_PAGE_PATHS.filter(path => path !== '/')) {
    for (const variant of [pathname.slice(0, -1), `${pathname}index.html`]) {
      const response = await fetch(`${origin}${variant}`, { redirect: 'manual' });
      if (response.status !== 308 || new URL(response.headers.get('location'), origin).pathname !== pathname) throw new Error(`Non-canonical route: ${variant}`);
      redirectChecks++;
    }
    const head = await fetch(`${origin}${pathname}`, { method: 'HEAD' });
    if (head.status !== 200 || await head.text()) throw new Error(`Invalid HEAD response: ${pathname}`);
  }
  const indexAlias = await fetch(`${origin}/index.html`, { redirect: 'manual' });
  if (indexAlias.status !== 308 || new URL(indexAlias.headers.get('location'), origin).pathname !== '/') throw new Error('Homepage index alias must redirect');
  redirectChecks++;
  // Fetch implementations can discard a caller-supplied Host header. Use the
  // HTTP transport to exercise the actual host-based rule against loopback.
  for (const [source, destination] of [
    ['/anxiety-counselling-vancouver?ref=host-check', 'https://unravelcounselling.com/anxiety-counselling-bc/?ref=host-check'],
    ['/about/?ref=host-check', 'https://unravelcounselling.com/about/?ref=host-check']
  ]) {
    const hosted = await new Promise((resolve, reject) => {
      const request = httpRequest(`${origin}${source}`, { headers: { Host: 'www.unravelcounselling.com' } }, response => {
        response.resume();
        response.on('end', () => resolve({ status: response.statusCode, location: response.headers.location }));
      });
      request.on('error', reject);
      request.end();
    });
    if (hosted.status !== 308 || hosted.location !== destination) throw new Error(`www address must reach its final destination: ${JSON.stringify(hosted)}`);
    redirectChecks++;
  }
  const retiredVariants = [...RETIRED_PATHS.flatMap(path => [path, `${path}/`, `${path}/index.html`]), '/templates/', '/templates/index.html', '/templates/modern-clinic.html'];
  for (const pathname of retiredVariants) {
    const response = await fetch(`${origin}${pathname}`, { redirect: 'manual' });
    if (response.status !== 404) throw new Error(`Retired route must be a real 404: ${pathname}`);
  }
  const reviewManifest = await readFile(path.join(distRoot, 'review/manifest.json'), 'utf8').then(JSON.parse).catch(() => null);
  if (reviewManifest) {
    const discovery = await Promise.all(machineFiles.map(file => readFile(path.join(distRoot, file.slice(1)), 'utf8')));
    for (const pathname of reviewManifest.paths) {
      const response = await fetch(`${origin}${pathname}`);
      const html = await response.text();
      if (response.status !== 200 || !response.headers.get('x-robots-tag')?.includes('noindex') || !html.includes('name="robots" content="noindex, nofollow"') || html.includes('"@type":"BlogPosting"') || /<time\b/.test(html)) throw new Error(`Invalid local-only draft response: ${pathname}`);
      const publicationPath = pathname.replace('/review/blog/', '/blog/');
      const publication = await fetch(`${origin}${publicationPath}`);
      if (publication.status !== 404 || discovery.some(file => file.includes(publicationPath) || file.includes(pathname))) throw new Error(`Unreviewed draft leaked into publication: ${pathname}`);
      await publication.arrayBuffer();
    }
    console.log(`Verified ${reviewManifest.paths.length} local-only draft pages, noindex headers and exclusion from public routes/discovery.`);
  }
  console.log(`Verified ${PUBLIC_PAGE_PATHS.length} HTML routes, Markdown variants, machine files, HEAD and error responses, ${redirectChecks} canonical/legacy redirects, and ${retiredVariants.length} retired routes.`);
} finally {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}
