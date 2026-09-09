import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
if (basePath && !/^\/[A-Za-z0-9_.-]+$/.test(basePath)) {
  throw new Error('Expected a single GitHub repository path.');
}
const source = path.resolve('dist/client');
const destination = path.resolve('dist/pages');
// Only replace the generated Pages artifact, never the source or client build.
if (path.dirname(destination) !== path.resolve('dist')) throw new Error('Unsafe output path');
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true });
if (basePath) {
  // Vinext includes assetPrefix in its disk layout. Pages supplies that prefix
  // itself, so _next must be at the artifact root alongside index.html.
  await cp(path.join(source, basePath.slice(1), '_next'), path.join(destination, '_next'), { recursive: true });
  await rm(path.join(destination, basePath.slice(1)), { recursive: true, force: true });
}
await writeFile(path.join(destination, '.nojekyll'), '');

async function filesIn(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const groups = await Promise.all(entries.map(entry => entry.isDirectory()
    ? filesIn(path.join(dir, entry.name)) : [path.join(dir, entry.name)]));
  return groups.flat();
}
async function exists(file) {
  try { return (await stat(file)).isFile(); } catch { return false; }
}
let checked = 0;
const failures = [];
for (const file of await filesIn(destination)) {
  if (!/\.(html|css)$/.test(file)) continue;
  const text = await readFile(file, 'utf8');
  const refs = file.endsWith('.html')
    ? [...text.matchAll(/(?:src|href)="([^"]+)"/g)].map(match => match[1])
    : [...text.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/g)].map(match => match[1]);
  const pageUrl = `https://pages.test${basePath}/${path.relative(destination, file).split(path.sep).join('/')}`;
  for (const ref of refs) {
    if (/^(?:#|data:|https?:|\/\/|tel:|mailto:)/.test(ref)) continue;
    const url = new URL(ref, pageUrl);
    if (basePath && url.pathname !== basePath && !url.pathname.startsWith(`${basePath}/`)) {
      failures.push(`${file}: outside repository path: ${ref}`);
      continue;
    }
    const relative = decodeURIComponent(url.pathname.slice(basePath.length)).replace(/^\/+/, '');
    const target = path.resolve(destination, relative);
    if (target !== destination && !target.startsWith(destination + path.sep)) throw new Error('Unsafe asset path');
    const candidates = [target, `${target}.html`, path.join(target, 'index.html')];
    if (!(await Promise.all(candidates.map(exists))).some(Boolean)) failures.push(`${file}: missing ${ref}`);
    checked++;
  }
}
if (failures.length) throw new Error(failures.join('\n'));
console.log(`Pages artifact ready: ${checked} page and stylesheet references resolve to files.`);
