import {
  getMarkdownNotFound,
  getMarkdownPage,
  negotiateRepresentation,
  normalizePagePath,
  VARY_HEADER
} from '../agent-readiness.js';

const MARKDOWN_CONTENT_TYPE = 'text/markdown; charset=utf-8';

function requestedPath(request) {
  const value = Array.isArray(request.query?.path) ? request.query.path[0] : request.query?.path;
  if (!value || value === '/') return '/';
  return new URL(value.startsWith('/') ? value : `/${value}`, 'https://unravelcounselling.com').pathname;
}

function setNegotiatedHeaders(response, contentType) {
  response.setHeader('Content-Type', contentType);
  response.setHeader('Vary', VARY_HEADER);
  response.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
}

async function proxyHtml(request, response, pathname) {
  const host = request.headers['x-forwarded-host'] || request.headers.host;
  const protocol = request.headers['x-forwarded-proto'] || 'https';
  const normalized = normalizePagePath(pathname);
  const filePath = normalized === '/' ? '/index.html' : `${normalized}index.html`;
  const upstream = await fetch(`${protocol}://${host}${filePath}`, {
    method: request.method,
    headers: {
      Accept: 'text/html',
      'User-Agent': request.headers['user-agent'] || 'Unravel content negotiator'
    },
    redirect: 'manual'
  });

  response.status(upstream.status);
  setNegotiatedHeaders(response, upstream.headers.get('content-type') || 'text/html; charset=utf-8');
  for (const header of ['etag', 'last-modified', 'location']) {
    const value = upstream.headers.get(header);
    if (value) response.setHeader(header, value);
  }

  if (request.method === 'HEAD') return response.end();
  return response.send(Buffer.from(await upstream.arrayBuffer()));
}

export default async function handler(request, response) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.setHeader('Allow', 'GET, HEAD');
    return response.status(405).send('Method Not Allowed\n');
  }

  const representation = negotiateRepresentation(request.headers.accept);
  if (representation === 'html') {
    return proxyHtml(request, response, requestedPath(request));
  }

  if (!representation) {
    setNegotiatedHeaders(response, 'text/plain; charset=utf-8');
    return response.status(406).send('Not Acceptable. This resource is available as text/html or text/markdown.\n');
  }

  const markdown = getMarkdownPage(requestedPath(request));
  setNegotiatedHeaders(response, MARKDOWN_CONTENT_TYPE);

  if (!markdown) {
    return response.status(404).send(request.method === 'HEAD' ? '' : getMarkdownNotFound());
  }

  return response.status(200).send(request.method === 'HEAD' ? '' : markdown);
}
