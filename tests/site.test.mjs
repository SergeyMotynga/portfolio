import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHTML } from 'linkedom';
import { approvedRepositoryUrls } from '../src/lib/publication-policy.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = path.join(root, 'dist');
const projectKeys = (await readdir(path.join(root, 'src/content/projects'), { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
const pages = new Map();
const routeFile = (route) => path.join(dist, route.endsWith('.html') ? route : `${route}/index.html`);

async function page(route) {
  if (!pages.has(route)) pages.set(route, parseHTML(await readFile(routeFile(route), 'utf8')).document);
  return pages.get(route);
}

test('both home pages and every translated case contain useful static HTML', async () => {
  for (const lang of ['ru', 'en']) {
    const home = await page(`/${lang}`);
    assert.equal(home.documentElement.lang, lang);
    assert.equal(home.querySelectorAll('.project-row').length, projectKeys.length);
    assert.equal(home.querySelectorAll('#projects > .page-scene > .project-row').length, 4);
    assert.equal(home.querySelectorAll('.presentation').length, 4);
    assert.equal(home.querySelectorAll('h1').length, 1);
    assert(home.querySelector('meta[name="description"]').content.length > 30);
    assert(!home.querySelector('#experience'));
    for (const key of projectKeys) {
      const doc = await page(`/${lang}/projects/${key}`);
      assert.equal(doc.documentElement.lang, lang);
      assert.equal(doc.querySelector('article').dataset.project, key);
      assert(doc.querySelector('.prose').textContent.length > 80);
    }
  }
});

test('language switching keeps the current project', async () => {
  for (const key of projectKeys) {
    for (const lang of ['ru', 'en']) {
      const other = lang === 'ru' ? 'en' : 'ru';
      const doc = await page(`/${lang}/projects/${key}`);
      assert.equal(doc.querySelector(`.language a[lang="${other}"]`).getAttribute('href'), `/${other}/projects/${key}/`);
      assert.equal(doc.querySelector(`link[rel="alternate"][hreflang="${other}"]`).getAttribute('href'), `/${other}/projects/${key}/`);
    }
  }
});

test('contact details are available in static footers on home and case pages', async () => {
  for (const lang of ['ru', 'en']) {
    for (const route of [`/${lang}`, ...projectKeys.map((key) => `/${lang}/projects/${key}`)]) {
      const doc = await page(route);
      assert.equal(doc.querySelectorAll('#contact').length, 1, `${route}: one contact destination`);
      const footer = doc.querySelector('footer');
      assert(footer.querySelector('a[href="mailto:Motynga12345@mail.ru"]').textContent.includes('Motynga12345@mail.ru'));
      assert(footer.querySelector('a[href="https://t.me/S1moll"]').textContent.includes('@S1moll'));
      assert(footer.querySelector('a[href="https://github.com/SergeyMotynga"]'));
    }
  }
});

test('all local links, fragment targets and stylesheet assets resolve', async () => {
  const routes = ['/ru', '/en', ...['ru', 'en'].flatMap((lang) => projectKeys.map((key) => `/${lang}/projects/${key}`)), '/404.html', '/'];
  for (const route of routes) {
    const doc = await page(route);
    for (const element of doc.querySelectorAll('a[href], link[href]')) {
      const href = element.getAttribute('href');
      if (/^(https?:|mailto:|tel:)/.test(href)) continue;
      const url = new URL(href, `https://portfolio.example${route.endsWith('.html') || route === '/' ? route : `${route}/`}`);
      const pathname = decodeURIComponent(url.pathname);
      if (/\.[a-z0-9]+$/i.test(pathname) && !pathname.endsWith('.html')) {
        await access(path.join(dist, pathname));
      } else {
        const destination = await page(pathname.replace(/\/$/, '') || '/');
        if (url.hash) assert(destination.getElementById(decodeURIComponent(url.hash.slice(1))), `${route}: missing ${href}`);
      }
    }
  }
});

test('public pages contain only approved external links and anonymised case content', async () => {
  const approved = new Set(['https://github.com/SergeyMotynga', 'https://t.me/S1moll', ...approvedRepositoryUrls]);
  for (const lang of ['ru', 'en']) {
    for (const route of [`/${lang}`, ...projectKeys.map((key) => `/${lang}/projects/${key}`)]) {
      const doc = await page(route);
      for (const anchor of doc.querySelectorAll('a[href^="http"]')) assert(approved.has(anchor.getAttribute('href')), `${route}: unapproved external link`);
      assert(!/aimy-ii|gitlab\.extserv|vector_badges_backend|defect_radar_backend|datamatch-ticket-demand|DATA MATCH|Авангард/i.test(doc.documentElement.outerHTML), `${route}: internal identifier`);
    }
    const restricted = await page(`/${lang}/projects/demand-forecasting`);
    assert.equal(restricted.querySelector('article').dataset.disclosure, 'restricted');
    assert(!/RMSE|\b\d+(?:[.,]\d+)?\s*%|predictions\.csv|\.ipynb/i.test(restricted.querySelector('.prose').textContent));
  }
});

test('FinGuru is a hackathon and SPAS is an invited conference presentation', async () => {
  const home = await page('/ru');
  const entries = [...home.querySelectorAll('.presentation')];
  assert(entries.some((entry) => entry.textContent.includes('FinGuru') && entry.textContent.includes('Хакатон')));
  assert(entries.some((entry) => entry.textContent.includes('SPAS System') && entry.textContent.includes('по приглашению')));
});


test('the showcase keeps project contributions and hero navigation in static HTML', async () => {
  for (const lang of ['ru', 'en']) {
    const doc = await page(`/${lang}`);
    assert(doc.querySelector('.hero a[href="#contact"]'));
    for (const id of ['projects', 'presentations', 'about', 'contact']) {
      assert(doc.getElementById(id)?.hasAttribute('data-scene-frame'), `${id}: navigation targets the stationary frame`);
    }
    assert.equal(doc.querySelectorAll('[data-badge-flip]').length, 0);
    const crystal = doc.querySelector('#about > .page-scene > [data-crystal]');
    assert.equal(crystal?.getAttribute('aria-hidden'), 'true');
    const fallback = doc.querySelector('.hero img');
    assert(fallback?.getAttribute('alt').length > 10);
    await access(path.join(dist, fallback.getAttribute('src')));
    for (const card of doc.querySelectorAll('[data-card]')) {
      const front = card.querySelector('[data-card-front]');
      const back = card.querySelector('[data-card-back]');
      const cover = front.querySelector('.project-cover img');
      assert.equal(cover?.getAttribute('alt'), '');
      await access(path.join(dist, cover.getAttribute('src')));
      const technologies = front.querySelectorAll('.card-preview-stack li');
      assert(technologies.length >= 1 && technologies.length <= 3);
      assert(front.textContent.trim().length > 40);
      assert(back.textContent.trim().length > 80);
      assert(!back.hasAttribute('inert') && !back.hasAttribute('hidden'), 'contribution is readable without JS');
      assert(front.querySelector('a[href*="/projects/"]'), 'case opens directly without flipping');
    }
  }
});


test('each event is one named native link covering its heading and description in both languages', async () => {
  for (const lang of ['ru', 'en']) {
    const document = await page(`/${lang}`);
    const events = [...document.querySelectorAll('.presentation')];
    assert.equal(events.length, 4);
    for (const event of events) {
      const link = event.querySelector('.presentation-link');
      assert.ok(link);
      assert.equal(event.querySelectorAll('a').length, 1);
      assert.ok(link.getAttribute('href').startsWith(`/${lang}/projects/`));
      const title = document.getElementById(link.getAttribute('aria-labelledby'));
      assert.ok(title && link.contains(title));
      assert.ok(link.querySelector('p:not(.micro)'));
      assert.equal(link.querySelectorAll('button, a, input').length, 0);
    }
  }
});
