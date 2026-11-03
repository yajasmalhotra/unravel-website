import { readFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ART_BY_PATH, ARTICLE_ART } from './artwork.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const publicRoot=path.join(root,'public');
const list=async directory=>(await Promise.all(await readdir(directory,{withFileTypes:true}).then(items=>items.map(async item=>item.isDirectory()?list(path.join(directory,item.name)):path.join(directory,item.name))))).flat();
export async function checkArtwork(){
 const assigned=[...Object.values(ART_BY_PATH),...Object.values(ARTICLE_ART)];
 if(new Set(assigned).size!==assigned.length)throw Error('Assign distinct illustrations to each page; practical pages can remain image-free.');
 const manifest=JSON.parse(await readFile(path.join(root,'content/artwork-assets.json'),'utf8'));
 for(const asset of manifest){
  if(asset.width>1920 || asset.height>1920 || asset.bytes>250*1024)throw Error(`Image budget exceeded: ${asset.path}`);
  const bytes=await readFile(path.join(publicRoot,asset.path));
  if(bytes.length!==asset.bytes || createHash('sha256').update(bytes).digest('hex')!==asset.sha256)throw Error(`Artwork changed without updating its size record: ${asset.path}`);
 }
 const byPath=new Map(manifest.map(asset=>[asset.path,asset]));
 const files=await list(publicRoot);
 const existingFiles=new Set(files.map(file=>path.resolve(file)));
 for(const file of files.filter(file=>/\.(avif|webp|png|jpe?g)$/i.test(file)))if((await stat(file)).size>250*1024)throw Error(`Compress or archive the oversized public image: ${path.relative(publicRoot,file)}`);
 for(const file of [path.join(root,'index.html'),...files.filter(file=>/\.(html|css)$/.test(file))]){
  const text=await readFile(file,'utf8');
  const urls=new Set([...text.matchAll(/(?:src|href)="([^"#?]+)"/g)].map(m=>m[1]));
  for(const match of text.matchAll(/srcset="([^"]+)"/g))for(const entry of match[1].split(',')){
   const [url,descriptor]=entry.trim().split(/\s+/);urls.add(url);
   const asset=byPath.get(url);
   if(asset && descriptor?.endsWith('w') && Number.parseInt(descriptor,10)!==asset.width)throw Error(`Incorrect responsive image width in ${path.relative(root,file)}: ${url}`);
  }
  for(const match of text.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g))urls.add(match[1]);
  for(const url of urls){
   if(!/\.(avif|webp|png|jpe?g|css|woff2)$/i.test(url)||/^(https?:|data:)/.test(url))continue;
   const target=url.startsWith('/')?path.join(publicRoot,url):path.resolve(path.dirname(file),url);
   if(!existingFiles.has(path.resolve(target)))throw Error(`${path.relative(root,file)} references a missing asset: ${url}`);
  }
 }
 console.log(`Artwork check passed: ${manifest.length} optimized variants; no missing image variants or oversized public images.`);
 return manifest.length;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await checkArtwork();
