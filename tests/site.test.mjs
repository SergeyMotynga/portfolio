import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHTML } from 'linkedom';
import { approvedPackageUrls, approvedRepositoryUrls } from '../src/lib/publication-policy.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = path.join(root, 'dist');
const projectKeys = (await readdir(path.join(root, 'src/content/projects'), { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
const achievementKeys = ['bdai', 'avtomatika-service', 'data-match', 'it-forum-xi'];
const achievementRoutes = ['ru', 'en'].flatMap((lang) => achievementKeys.map((key) => `/${lang}/achievements/${key}`));
const experienceProjects = {
  aimy: ['audio-badges', 'defect-monitoring'],
  'avtomatika-service': ['git-sync', 'project-release-tracker', 'spas-system', 'time-series'],
};
const experienceKeys = Object.keys(experienceProjects);
const experienceRoutes = ['ru', 'en'].flatMap((lang) => experienceKeys.map((key) => `/${lang}/experience/${key}`));
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

test('home and company pages connect the confirmed experience to its related projects', async () => {
  const expected = {
    ru: [['aimy', 'AIMY', '4 месяца'], ['avtomatika-service', 'Автоматика-Сервис', '8 месяцев']],
    en: [['aimy', 'AIMY', '4 months'], ['avtomatika-service', 'Avtomatika-Service', '8 months']],
  };
  for (const lang of ['ru', 'en']) {
    const other = lang === 'ru' ? 'en' : 'ru';
    const home = await page(`/${lang}`);
    const section = home.querySelector('#experience > section');
    assert(section.querySelector('#experience-title'));
    const entries = [...section.querySelectorAll('article')];
    assert.equal(entries.length, expected[lang].length);
    for (const [index, entry] of entries.entries()) {
      const [key, company, duration] = expected[lang][index];
      const href = `/${lang}/experience/${key}/`;
      const links = entry.querySelectorAll('a');
      assert.equal(links.length, 1);
      assert.equal(links[0].getAttribute('href'), href);
      const companyHeading = entry.querySelector('h3');
      assert.equal(companyHeading.textContent, company);
      assert.equal(links[0].getAttribute('aria-labelledby'), companyHeading.id);
      assert(entry.querySelector('.experience-period').textContent.startsWith(duration));

      const detail = await page(href.slice(0, -1));
      const translatedHref = `/${other}/experience/${key}/`;
      assert.equal(detail.querySelector('h1').textContent, company);
      assert(detail.querySelector('.case-header .experience-period').textContent.startsWith(duration));
      assert(detail.querySelector(`.back-link[href="/${lang}/#experience"]`));
      assert.equal(detail.querySelector(`.language a[lang="${other}"]`).getAttribute('href'), translatedHref);
      assert.equal(detail.querySelector(`link[rel="alternate"][hreflang="${other}"]`).getAttribute('href'), translatedHref);
      assert.deepEqual(
        [...detail.querySelectorAll('.related-project')].map((link) => link.getAttribute('href')),
        experienceProjects[key].map((project) => `/${lang}/projects/${project}/`),
      );
    }
    assert(home.querySelector('.navigation a[href="#experience"][data-section-link="experience"]'));
    const project = await page(`/${lang}/projects/chess-broadcast`);
    assert(project.querySelector(`.navigation a[href="/${lang}/#experience"]`));
    const stack = home.querySelector('#about .skills').textContent;
    for (const technology of ['Pydantic', 'Docker Compose', 'GitLab CI/CD', 'Nginx']) {
      assert(stack.includes(technology), `${lang}: missing ${technology}`);
    }
  }
});

test('contact details are available in static footers on home and case pages', async () => {
  for (const lang of ['ru', 'en']) {
    for (const route of [`/${lang}`, ...projectKeys.map((key) => `/${lang}/projects/${key}`), ...achievementKeys.map((key) => `/${lang}/achievements/${key}`)]) {
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
  const routes = ['/ru', '/en', ...achievementRoutes, ...experienceRoutes, ...['ru', 'en'].flatMap((lang) => projectKeys.map((key) => `/${lang}/projects/${key}`)), '/404.html', '/'];
  for (const route of routes) {
    const doc = await page(route);
    assert(!doc.body.textContent.includes('\u2197'), `${route}: old link arrow`);
    for (const icon of doc.querySelectorAll('a svg[data-link-icon]')) {
      assert.equal(icon.getAttribute('aria-hidden'), 'true', `${route}: decorative link icon`);
    }
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
  const approved = new Set(['https://github.com/SergeyMotynga', 'https://t.me/S1moll', ...approvedRepositoryUrls, ...approvedPackageUrls]);
  for (const lang of ['ru', 'en']) {
    for (const route of [`/${lang}`, ...projectKeys.map((key) => `/${lang}/projects/${key}`), ...achievementKeys.map((key) => `/${lang}/achievements/${key}`), ...experienceKeys.map((key) => `/${lang}/experience/${key}`)]) {
      const doc = await page(route);
      for (const anchor of doc.querySelectorAll('a[href^="http"]')) assert(approved.has(anchor.getAttribute('href')), `${route}: unapproved external link`);
      assert(!/aimy-ii|gitlab\.extserv|vector_badges_backend|defect_radar_backend|datamatch-ticket-demand/i.test(doc.documentElement.outerHTML), `${route}: internal identifier`);
      const outsideAchievements = doc.documentElement.cloneNode(true);
      outsideAchievements.querySelector('#presentations')?.remove();
      if (!route.includes('/achievements/')) assert(!/DATA\s*MATCH|Авангард|Avangard/i.test(outsideAchievements.outerHTML), `${route}: event identity is approved only in achievements`);
    }
    const restricted = await page(`/${lang}/projects/demand-forecasting`);
    assert.equal(restricted.querySelector('article').dataset.disclosure, 'restricted');
    assert(!/DATA\s*MATCH|Авангард|Avangard/i.test(restricted.documentElement.outerHTML), 'restricted case stays anonymous');
    assert(!/RMSE|\b\d+(?:[.,]\d+)?\s*%|predictions\.csv|\.ipynb/i.test(restricted.querySelector('.prose').textContent));
  }
});

test('achievements preserve the owner-confirmed event and project associations', async () => {
  const expected = [
    ['BDAI', 'bdai'],
    ['Автоматика-Сервис', 'avtomatika-service'],
    ['Data Match', 'data-match'],
    ['XI Международный ИТ-форум', 'it-forum-xi'],
  ];
  const home = await page('/ru');
  const entries = [...home.querySelectorAll('.presentation')];
  assert.equal(home.querySelector('#presentations-title').textContent, 'Достижения');
  for (const [title, key] of expected) {
    const entry = entries.find((item) => item.querySelector('h3').textContent.includes(title));
    assert.ok(entry, title);
    assert.equal(entry.querySelector('a').getAttribute('href'), `/ru/achievements/${key}/`);
  }
  assert(entries[1].textContent.includes('по приглашению'));
  const english = await page('/en');
  assert.equal(english.querySelector('#presentations-title').textContent, 'Achievements');
});


test('the showcase keeps project contributions and hero navigation in static HTML', async () => {
  for (const lang of ['ru', 'en']) {
    const doc = await page(`/${lang}`);
    assert(doc.querySelector('.hero a[href="#contact"]'));
    for (const id of ['projects', 'presentations', 'experience', 'about', 'contact']) {
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
      assert.ok(link.getAttribute('href').startsWith(`/${lang}/achievements/`));
      const title = document.getElementById(link.getAttribute('aria-labelledby'));
      assert.ok(title && link.contains(title));
      assert.ok(link.querySelector('p:not(.micro)'));
      assert.equal(link.querySelectorAll('button, a, input').length, 0);
    }
  }
});


test('achievement pages include the correct documents or placeholders, related project and translation', async () => {
  const related = { bdai: 'finguru', 'avtomatika-service': 'spas-system', 'data-match': 'demand-forecasting', 'it-forum-xi': 'chess-broadcast' };
  const previews = { bdai: 'bdai-diploma.jpg', 'data-match': 'data-match-certificate-preview.webp' };
  assert.deepEqual(
    (await readdir(path.join(dist, 'documents/achievements'))).sort(),
    Object.values(previews).sort(),
  );
  for (const lang of ['ru', 'en']) {
    const other = lang === 'ru' ? 'en' : 'ru';
    for (const [key, project] of Object.entries(related)) {
      const doc = await page(`/${lang}/achievements/${key}`);
      assert.equal(doc.querySelectorAll('h1').length, 1);
      assert(doc.querySelector('article[data-achievement] .prose p').textContent.length > 50);
      const preview = doc.querySelector('.achievement-document img');
      assert.equal(doc.querySelector('.achievement-document a'), null);
      if (previews[key]) {
        assert.equal(preview.getAttribute('src'), `/documents/achievements/${previews[key]}`);
        assert(!/заглушка|placeholder/.test(doc.querySelector('figcaption').textContent));
        assert(preview.getAttribute('width') && preview.getAttribute('height'));
      } else {
        assert.equal(preview.getAttribute('src'), '/images/achievement-placeholder.svg');
        assert.match(doc.querySelector('figcaption').textContent, /заглушка|placeholder/);
      }
      assert(preview.getAttribute('alt').length > 10);
      assert(doc.querySelector(`.prose a[href="/${lang}/projects/${project}/"]`));
      assert(doc.querySelector(`.back-link[href="/${lang}/#presentations"]`));
      assert.equal(doc.querySelector(`.language a[lang="${other}"]`).getAttribute('href'), `/${other}/achievements/${key}/`);
      assert.equal(doc.querySelector(`link[rel="alternate"][hreflang="${other}"]`).getAttribute('href'), `/${other}/achievements/${key}/`);
      assert(doc.querySelector('a[href="mailto:Motynga12345@mail.ru"]'));
    }
  }
});


test('documents confirm second place at BDAI and participation in the Data Match technical track', async () => {
  const bdai = await page('/ru/achievements/bdai');
  assert.match(bdai.querySelector('.case-header').textContent, /II место/);
  assert.match(bdai.querySelector('figcaption').textContent, /II место/);
  const dataMatch = await page('/ru/achievements/data-match');
  assert.match(dataMatch.querySelector('figcaption').textContent, /участника технического трека/);
  assert(!/II место|призёр|победитель/.test(dataMatch.querySelector('.prose').textContent));
});
