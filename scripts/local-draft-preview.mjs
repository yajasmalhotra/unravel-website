import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { POSTS } from '../content/blog/posts.js';
import { articleCollection, articleHtml, COLLECTION_START, COLLECTION_END } from './blog-layout.mjs';

// Only called after Vite has built a clean production stage. Draft previews are
// never written to public/, the sitemap, RSS or deployment configuration.
export async function addLocalDraftPreview(directory, drafts = POSTS.filter(post => post.status === 'draft')) {
  const reviewRoot = path.join(directory, 'review');
  if (await stat(reviewRoot).then(() => true).catch(() => false)) throw new Error('Draft preview output already exists; start from a clean build.');
  for (const post of drafts) {
    if (post.status !== 'draft') throw new Error('Local draft preview accepts drafts only.');
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug || '')) throw new Error('Invalid draft slug.');
    const destination = path.join(reviewRoot, 'blog', post.slug);
    await mkdir(destination, { recursive: true });
    await writeFile(path.join(destination, 'index.html'), articleHtml(post, { review: true }));
  }
  const collection = articleCollection(drafts, { review: true });
  for (const file of ['blog/index.html', 'ocd-types/index.html']) {
    const destination = path.join(directory, file);
    const html = await readFile(destination, 'utf8');
    if (!html.includes(COLLECTION_START) || !html.includes(COLLECTION_END)) throw new Error(`Missing article collection marker: ${file}`);
    await writeFile(destination, html.replace(COLLECTION_END, `${COLLECTION_END}\n${collection}`));
  }
  await mkdir(reviewRoot, { recursive: true });
  const manifest = { localOnly: true, publicationRequiresClinicalReview: true, paths: drafts.map(post => `/review/blog/${post.slug}/`) };
  await writeFile(path.join(reviewRoot, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}
