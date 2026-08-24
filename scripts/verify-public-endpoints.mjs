import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
  getMarkdownNotFound,
  getMarkdownPage,
  negotiateRepresentation,
  normalizePagePath,
  PUBLIC_PAGE_PATHS,
  VARY_HEADER
} from '../agent-readiness.js';

const projectRoot = path.resolve(import.meta.dirname, '..');
const distRoot = path.join(projectRoot, 'dist');
const machineFiles = ['/robots.txt', '/sitemap.xml', '/llms.txt'];
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

const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://127.0.0.1').pathname;
  const accept = request.headers.accept || '';
  const representation = negotiateRepresentation(accept);

  if (!machineFiles.includes(pathname) && accept.toLowerCase().includes('text/markdown')) {
    if (!representation) {
      response.writeHead(406, { 'Content-Type': 'text/plain; charset=utf-8', Vary: VARY_HEADER });
      return response.end('Not Acceptable\n');
    }
    if (representation === 'markdown') {
      const markdown = getMarkdownPage(pathname);
      response.writeHead(markdown ? 200 : 404, { 'Content-Type': 'text/markdown; charset=utf-8', Vary: VARY_HEADER });
      return response.end(markdown || getMarkdownNotFound());
    }
  }

  const result = await staticResponse(pathname);
  const type = contentTypes[path.extname(result.filePath)] || 'application/octet-stream';
  response.writeHead(result.status, { 'Content-Type': type, Vary: VARY_HEADER });
  return response.end(result.body);
});

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

  console.log(`Verified ${PUBLIC_PAGE_PATHS.length} HTML endpoints, ${PUBLIC_PAGE_PATHS.length} Markdown variants, ${machineFiles.length} machine-readable files, and both 404 representations.`);
} finally {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}
