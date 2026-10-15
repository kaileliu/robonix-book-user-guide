import {cpSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync} from 'node:fs';
import {dirname, join, posix, resolve} from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
import {load} from 'cheerio';

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'offline/robonix-book');
const origin = 'https://book.robonix.ai';
process.chdir(root);
execFileSync(process.execPath, ['node_modules/@docusaurus/core/bin/docusaurus.mjs',
  'build', '--config', 'docusaurus.offline.config.ts', '--out-dir', output], {stdio: 'inherit'});
execFileSync('python3', ['scripts/write-legacy-pages.py', output], {stdio: 'inherit'});

function files(directory, prefix = '') {
  return readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const path = posix.join(prefix, entry.name);
    return entry.isDirectory() ? files(join(directory, entry.name), path) : [path];
  });
}
const allFiles = files(output);
const available = new Set(allFiles);
const missing = new Set();
const onlineOnly = new Set();

function localUrl(value, source) {
  if (!value || value.startsWith('#') || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value)) return value;
  const url = new URL(value, `${origin}/${source}`);
  const pathname = decodeURIComponent(url.pathname).replace(/^\//, '');
  const target = [pathname, `${pathname}.html`, posix.join(pathname, 'index.html')]
    .find((candidate) => available.has(candidate));
  if (!target) {
    if (pathname.startsWith('api/')) {
      onlineOnly.add(url.pathname);
      return url.href;
    }
    missing.add(`${source}: ${value}`);
    return value;
  }
  const relative = posix.relative(posix.dirname(source), target);
  return relative.split('/').map(encodeURIComponent).join('/') + url.search + url.hash;
}

const index = [];
const seen = new Set();
for (const file of allFiles.filter((name) => name.endsWith('.html'))) {
  const $ = load(readFileSync(join(output, file), 'utf8'));
  const canonical = $('link[rel="canonical"]').attr('href') || file;
  if ($('article').length && !seen.has(canonical)) {
    seen.add(canonical);
    const article = $('article').clone();
    article.find('.hash-link').remove();
    // Cheerio text() omits block boundaries; preserve them for search snippets.
    article.find('p,li,h1,h2,h3,h4,tr,pre').append(' ');
    index.push({url: file, title: $('h1').first().text(), text: article.text().replace(/\s+/g, ' ').trim()});
  }
  $('script, link[rel="preload"], link[rel="prefetch"], link[rel="modulepreload"]').remove();
  $('html').attr('data-theme', 'light').attr('data-has-hydrated', 'true');
  $('[href], [src], [poster], [action]').each((_, element) => {
    for (const attribute of ['href', 'src', 'poster', 'action']) {
      const value = $(element).attr(attribute);
      if (value) {
        const rewritten = localUrl(value, file);
        $(element).attr(attribute, rewritten);
        if (value.startsWith('/api/') && rewritten.startsWith(origin)) {
          $(element).attr('title', '此 API 参考需联网查看').append('（在线）');
        }
      }
    }
  });
  $('[srcset]').each((_, element) => {
    $(element).attr('srcset', $(element).attr('srcset').split(',').map((entry) => {
      const [url, ...descriptor] = entry.trim().split(/\s+/);
      return [localUrl(url, file), ...descriptor].join(' ');
    }).join(', '));
  });
  $('[style]').each((_, element) => {
    $(element).attr('style', $(element).attr('style').replace(/url\((['"]?)(\/[^)'"\s]+)\1\)/g,
      (_, quote, url) => `url("${localUrl(url, file)}")`));
  });
  $('details').removeAttr('data-collapsed');
  $('.navbar__search-input').attr('placeholder', '搜索离线手册').attr('aria-label', '搜索离线手册');
  $('.navbar__title').append(' · 离线版');
  const prefix = posix.relative(posix.dirname(file), 'offline-assets');
  $('head').append(`<link rel="stylesheet" href="${prefix}/offline.css">`);
  $('body').append(`<script src="${prefix}/search-data.js"></script><script src="${prefix}/offline.js" defer></script>`);
  if ($('.mermaid').length) {
    $('body').append(`<script src="${prefix}/mermaid.min.js" defer></script>`);
  }
  writeFileSync(join(output, file), $.html());
}

for (const file of allFiles.filter((name) => name.endsWith('.css'))) {
  const css = readFileSync(join(output, file), 'utf8').replace(/url\((['"]?)(\/[^)'"\s]+)\1\)/g,
    (_, quote, url) => `url("${localUrl(url, file)}")`);
  writeFileSync(join(output, file), css);
}
if (missing.size) throw new Error(`Missing offline resources:\n${[...missing].join('\n')}`);

const assets = join(output, 'offline-assets');
mkdirSync(assets, {recursive: true});
for (const name of ['offline.js', 'offline.css']) cpSync(join(root, 'scripts/offline', name), join(assets, name));
const mermaidRoot = resolve(dirname(require.resolve('mermaid')), '..');
cpSync(join(mermaidRoot, 'dist/mermaid.min.js'), join(assets, 'mermaid.min.js'));
cpSync(join(mermaidRoot, 'LICENSE'), join(assets, 'MERMAID-LICENSE'));
writeFileSync(join(assets, 'search-data.js'), `window.ROBONIX_OFFLINE_INDEX=${JSON.stringify(index)};\n`);
for (const name of ['LICENSE', 'THIRD_PARTY_NOTICES.md']) cpSync(join(root, name), join(output, name));
writeFileSync(join(output, '打开说明.txt'), [
  'Robonix 手册 · 离线版', '',
  '1. 将整个压缩包解压到任意文件夹。',
  '2. 双击 index.html，使用 Chrome、Edge、Firefox 或 Safari 打开。',
  '3. 分享时发送整个 ZIP；不要只发送 index.html。', '',
  '阅读手册、目录跳转、全文搜索、图表和图片不需要网络或本地服务器。',
  'Hub、GitHub、在线体验及标有“在线”的 API 参考链接需要联网。',
  '本离线包不包含独立生成的 Rust/Python API 文档。', '',
  `导出时间：${new Date().toISOString()}`,
  `手册页面：${index.length}`,
].join('\n'));
execFileSync('python3', ['-c',
  'import shutil; shutil.make_archive("offline/robonix-book-offline", "zip", "offline", "robonix-book")'], {stdio: 'inherit'});
const zip = join(root, 'offline/robonix-book-offline.zip');
console.log(`Offline export: ${index.length} pages; ${onlineOnly.size} API links marked online.`);
console.log(`${zip} (${(statSync(zip).size / 1024 / 1024).toFixed(1)} MB)`);
