import { spawnSync } from 'node:child_process';
import { mkdtemp, rename, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSiteContent } from './build-site-content.mjs';
import { addLocalDraftPreview } from './local-draft-preview.mjs';
import { checkArtwork } from './check-artwork.mjs';

await buildSiteContent();
await checkArtwork();
await import('./build-agent-guide.mjs');
const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const stage = await mkdtemp(path.join(projectRoot, '.build-stage-'));
const previous = `${stage}-previous`;
const destination = path.join(projectRoot, 'dist');
try {
  const result = spawnSync(process.execPath, [fileURLToPath(new URL('../node_modules/vite/bin/vite.js', import.meta.url)), 'build', '--outDir', stage], { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exitCode = result.status ?? 1;
  else {
    if (process.argv.includes('--review-drafts')) {
      const manifest = await addLocalDraftPreview(stage);
      console.log(`Prepared ${manifest.paths.length} local-only article drafts; production discovery files exclude them.`);
    }
    // Keep the existing preview intact until the entire replacement is ready.
    let backedUp = false;
    try { await rename(destination, previous); backedUp = true; } catch (error) { if (error.code !== 'ENOENT') throw error; }
    try { await rename(stage, destination); }
    catch (error) { if (backedUp) await rename(previous, destination); throw error; }
    if (backedUp) await rm(previous, { recursive: true, force: true });
  }
} finally {
  await rm(stage, { recursive: true, force: true });
}
