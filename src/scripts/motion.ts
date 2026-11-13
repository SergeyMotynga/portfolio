const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(pointer: fine)');

const scenes = {
  ru: {
    api: ['POST /tasks', 'Авторизация → логика → сохранение'],
    data: ['GET /projects', 'Запрос → фильтрация → данные'],
    ml: ['POST /query', 'Поиск → переранжирование → ответ'],
  },
  en: {
    api: ['POST /tasks', 'Authentication → logic → persistence'],
    data: ['GET /projects', 'Request → filtering → data'],
    ml: ['POST /query', 'Retrieval → reranking → answer'],
  },
} as const;

function setupSystem(system: HTMLElement): () => void {
  const controls = system.querySelector<HTMLElement>('.system-controls');
  const toggle = system.querySelector<HTMLButtonElement>('[data-motion-toggle]');
  const request = system.querySelector<HTMLElement>('[data-request-label]');
  const caption = system.querySelector<HTMLElement>('[data-system-caption]');
  if (!controls || !toggle || !request || !caption) return () => {};

  let paused = preference.matches;
  let visible = true;
  const buttons = system.querySelectorAll<HTMLButtonElement>('[data-scene-button]');
  const lang = system.dataset.language === 'en' ? 'en' : 'ru';

  function updateMotion(): void {
    const reduce = preference.matches;
    system.dataset.motion = paused || reduce || !visible || document.hidden ? 'paused' : 'running';
    toggle!.disabled = reduce;
    toggle!.setAttribute('aria-pressed', String(paused || reduce));
    toggle!.textContent = reduce ? toggle!.dataset.reducedLabel! : paused ? toggle!.dataset.playLabel! : toggle!.dataset.pauseLabel!;
  }

  controls.hidden = false;
  buttons.forEach((button) => button.addEventListener('click', () => {
    const scene = button.dataset.sceneButton as keyof typeof scenes.ru;
    const content = scenes[lang][scene];
    system.dataset.scene = scene;
    request.textContent = content[0];
    caption.textContent = content[1];
    buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
  }));
  toggle.addEventListener('click', () => { paused = !paused; updateMotion(); });
  document.addEventListener('visibilitychange', updateMotion);
  const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; updateMotion(); });
  visibility.observe(system);
  updateMotion();
  return updateMotion;
}

const systemUpdates = [...document.querySelectorAll<HTMLElement>('[data-system]')].map(setupSystem);
const activeAnimations = new Set<Animation>();
const revealElements = document.querySelectorAll<HTMLElement>('.section-heading, .project-row, .presentation, .education, .contact-section');
const seen = new WeakSet<Element>();
const reveals = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting || seen.has(entry.target)) return;
    seen.add(entry.target);
    reveals.unobserve(entry.target);
    if (preference.matches) return;
    const animation = entry.target.animate([
      { opacity: 0.4, transform: 'translateY(30px)' },
      { opacity: 1, transform: 'translateY(0)' },
    ], { duration: 650, easing: 'cubic-bezier(.16,1,.3,1)' });
    activeAnimations.add(animation);
    animation.finished.then(() => activeAnimations.delete(animation)).catch(() => activeAnimations.delete(animation));
  });
}, { threshold: 0.08 });
revealElements.forEach((element) => reveals.observe(element));

const hero = document.querySelector<HTMLElement>('.hero');
const visual = document.querySelector<HTMLElement>('[data-system]');
let pointerFrame = 0;
if (hero && visual) {
  hero.addEventListener('pointermove', (event) => {
    if (preference.matches || !finePointer.matches || visual.dataset.motion === 'paused' || pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      const bounds = hero.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
      const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
      hero.style.setProperty('--spot-x', `${x * 100}%`);
      hero.style.setProperty('--spot-y', `${y * 100}%`);
      visual.style.setProperty('--tilt-x', `${(0.5 - y) * 9}deg`);
      visual.style.setProperty('--tilt-y', `${(x - 0.5) * 11}deg`);
      pointerFrame = 0;
    });
  });
  hero.addEventListener('pointerleave', () => {
    if (pointerFrame) cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    visual.style.setProperty('--tilt-x', '0deg');
    visual.style.setProperty('--tilt-y', '0deg');
  });
}

let scrollFrame = 0;
function updateScroll(): void {
  const range = document.documentElement.scrollHeight - window.innerHeight;
  document.documentElement.style.setProperty('--scroll-progress', String(range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0));
  if (hero) hero.style.setProperty('--title-shift', preference.matches ? '0px' : `${Math.min(window.scrollY, 400) * 0.04}px`);
  scrollFrame = 0;
}
window.addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }, { passive: true });
window.addEventListener('resize', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); });
preference.addEventListener('change', () => {
  activeAnimations.forEach((animation) => animation.cancel());
  if (visual) {
    visual.style.setProperty('--tilt-x', '0deg');
    visual.style.setProperty('--tilt-y', '0deg');
  }
  systemUpdates.forEach((update) => update());
  updateScroll();
});
updateScroll();
