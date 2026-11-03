import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { PAGE_PATHS, redirectFor } from '../site-routes.js';
import { getMarkdownNotFound, getMarkdownPage, negotiateRepresentation, VARY_HEADER } from '../agent-readiness.js';

export function routingMiddleware({ publicRoot }) {
  return async (request, response, next) => {
    const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);
    const pathname = url.pathname;
    if (pathname.startsWith('/@') || pathname.startsWith('/__vite') || pathname.startsWith('/node_modules/') || pathname.startsWith('/src/')) return next();
    const redirect = redirectFor(pathname, url.hostname);
    if (redirect) {
      const destination = new URL(redirect);
      destination.search = url.search;
      const local = ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname);
      response.writeHead(308, { Location: local ? `${destination.pathname}${destination.search}${destination.hash}` : destination.href });
      return response.end();
    }
    response.setHeader('Vary', VARY_HEADER);
    if (pathname.startsWith('/review/blog/')) {
      const reviewPath = path.resolve(publicRoot, `.${pathname}`, pathname.endsWith('/') ? 'index.html' : '');
      if (reviewPath.startsWith(`${publicRoot}${path.sep}review${path.sep}`) && await stat(reviewPath).then(file => file.isFile()).catch(() => false)) {
        response.setHeader('X-Robots-Tag', 'noindex, nofollow');
        request.url = `${pathname}${pathname.endsWith('/') ? 'index.html' : ''}${url.search}`;
        return next();
      }
    }
    const accept = request.headers.accept || '';
    const representation = negotiateRepresentation(accept);
    if (accept.toLowerCase().includes('text/markdown') && representation !== 'html') {
      if (!['GET', 'HEAD'].includes(request.method)) {
        response.writeHead(405, { Allow: 'GET, HEAD' });
        return response.end('Method Not Allowed');
      }
      if (!representation) {
        response.writeHead(406, { 'Content-Type': 'text/plain; charset=utf-8' });
        return response.end(request.method === 'HEAD' ? '' : 'Not Acceptable');
      }
      const markdown = getMarkdownPage(pathname);
      response.writeHead(markdown ? 200 : 404, { 'Content-Type': 'text/markdown; charset=utf-8' });
      return response.end(request.method === 'HEAD' ? '' : markdown || getMarkdownNotFound());
    }
    if (PAGE_PATHS.includes(pathname)) {
      if (pathname !== '/') request.url = `${pathname}index.html${url.search}`;
      return next();
    }
    // Removed pages must not fall back to a homepage with status 200.
    let candidate;
    try { candidate = path.resolve(publicRoot, `.${decodeURIComponent(pathname)}`); } catch { candidate = ''; }
    if (candidate.startsWith(`${publicRoot}${path.sep}`) && await stat(candidate).then(file => file.isFile()).catch(() => false)) return next();
    const html = await readFile(path.join(publicRoot, '404.html'));
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex' });
    return response.end(request.method === 'HEAD' ? '' : html);
  };
}
