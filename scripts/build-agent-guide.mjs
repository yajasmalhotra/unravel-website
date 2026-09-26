import { writeFile } from 'node:fs/promises';
import { getMarkdownPage, PUBLIC_PAGE_PATHS } from '../agent-readiness.js';

const guide = '# Unravel Counselling — full agent guide\n\nConcise summaries of the public pages. See each source page for full details.\n\n' +
  PUBLIC_PAGE_PATHS.map(path => `Source: https://unravelcounselling.com${path}\n\n${getMarkdownPage(path)}`).join('\n---\n\n');
await writeFile(new URL('../public/llms-full.txt', import.meta.url), guide);
console.log(`Generated agent guide for ${PUBLIC_PAGE_PATHS.length} pages.`);
