const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(pointer: fine)');
const root = document.documentElement;
let effectsPaused = false;
const motionDisabled = () => preference.matches || effectsPaused;
const activeAnimations = new Set<Animation>();
const tokenStyles = getComputedStyle(root);
const timing = {
  heading: parseFloat(tokenStyles.getPropertyValue('--motion-heading')) || 800,
  entrance: parseFloat(tokenStyles.getPropertyValue('--motion-enter')) || 600,
  stagger: parseFloat(tokenStyles.getPropertyValue('--motion-stagger')) || 60,
  ease: tokenStyles.getPropertyValue('--motion-ease').trim() || 'cubic-bezier(.16,1,.3,1)',
};

function animate(element: Element, frames: Keyframe[], duration: number, delay = 0): void {
  if (motionDisabled() || element.contains(document.activeElement)) return;
  const animation = element.animate(frames, { duration, delay, easing: timing.ease, fill: 'backwards' });
  activeAnimations.add(animation);
  animation.finished.then(() => activeAnimations.delete(animation)).catch(() => activeAnimations.delete(animation));
}

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

  let visible = true;
  const buttons = system.querySelectorAll<HTMLButtonElement>('[data-scene-button]');
  const lang = system.dataset.language === 'en' ? 'en' : 'ru';

  function updateMotion(): void {
    const reduce = preference.matches;
    system.dataset.motion = motionDisabled() || !visible || document.hidden ? 'paused' : 'running';
    toggle!.disabled = reduce;
    toggle!.setAttribute('aria-pressed', String(motionDisabled()));
    toggle!.textContent = reduce ? toggle!.dataset.reducedLabel! : effectsPaused ? toggle!.dataset.playLabel! : toggle!.dataset.pauseLabel!;
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
  toggle.addEventListener('click', () => { effectsPaused = !effectsPaused; applyMotionPreference(); });
  document.addEventListener('visibilitychange', updateMotion);
  const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; updateMotion(); });
  visibility.observe(system);
  updateMotion();
  return updateMotion;
}

const systemUpdates = [...document.querySelectorAll<HTMLElement>('[data-system]')].map(setupSystem);
const revealElements = document.querySelectorAll<HTMLElement>('.section-heading, [data-reveal]');
const seen = new WeakSet<Element>();
const reveals = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting || seen.has(entry.target)) return;
    seen.add(entry.target);
    reveals.unobserve(entry.target);
    if (motionDisabled()) return;
    const element = entry.target as HTMLElement;
    const words = element.querySelectorAll('.motion-word');
    if (words.length) {
      words.forEach((word, index) => animate(word, [
        { transform: 'translateY(110%)', opacity: 0 },
        { transform: 'translateY(0)', opacity: 1 },
      ], timing.heading, Math.min(index, 5) * timing.stagger));
      const subtitle = element.querySelector('.micro');
      if (subtitle) animate(subtitle, [{ opacity: 0, transform: 'translateX(16px)' }, { opacity: 1, transform: 'translateX(0)' }], timing.entrance, timing.stagger);
      if (element.matches('.section-heading')) return;
    }
    const direction = element.dataset.reveal;
    const offset = direction === 'left' ? 'translateX(-32px)' : direction === 'right' ? 'translateX(32px)' : 'translateY(36px)';
    const delay = (Number(element.dataset.sequence || 0) % 4) * timing.stagger;
    animate(element, [
      { opacity: 0.15, transform: offset },
      { opacity: 1, transform: 'translateY(0)' },
    ], timing.entrance, delay);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
revealElements.forEach((element) => reveals.observe(element));

const hero = document.querySelector<HTMLElement>('.hero');
const visual = document.querySelector<HTMLElement>('[data-system]');
const heroCopy = document.querySelector<HTMLElement>('.hero-copy');
const heroTitle = heroCopy?.querySelector<HTMLElement>('h1');
root.dataset.home = String(Boolean(hero));
document.querySelectorAll('.name-line').forEach((line, index) => animate(line, [
  { transform: 'translateY(110%)' }, { transform: 'translateY(0)' },
], timing.heading, index * timing.stagger));
heroCopy?.querySelectorAll('.hero-role, .hero-lead, .hero-actions').forEach((element, index) => animate(element, [
  { opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'translateY(0)' },
], timing.entrance, timing.heading * .35 + index * timing.stagger));

document.addEventListener('focusin', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  target.closest('[data-reveal], .section-heading, .hero-copy')?.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
});
let pointerFrame = 0;
if (hero && visual) {
  hero.addEventListener('pointermove', (event) => {
    if (motionDisabled() || !finePointer.matches || visual.dataset.motion === 'paused' || pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      const bounds = hero.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
      const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
      document.documentElement.style.setProperty('--spot-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--spot-y', `${event.clientY}px`);
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
  if (heroTitle && hero) {
    const progress = motionDisabled() ? 0 : Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / Math.max(340, window.innerHeight * .6)));
    const opacity = Math.max(0, 1 - progress * 1.6);
    heroTitle.style.setProperty('--hero-opacity', String(opacity));
    heroTitle.style.setProperty('--hero-lift', `${-progress * 64}px`);
  }
  root.style.setProperty('--ambient-shift', motionDisabled() ? '0px' : `${-Math.min(window.scrollY * .04, 120)}px`);
  scrollFrame = 0;
}
window.addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }, { passive: true });
window.addEventListener('resize', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); });
function applyMotionPreference(): void {
  root.dataset.effects = motionDisabled() ? 'paused' : 'running';
  activeAnimations.forEach((animation) => animation.cancel());
  if (visual) {
    visual.style.setProperty('--tilt-x', '0deg');
    visual.style.setProperty('--tilt-y', '0deg');
  }
  systemUpdates.forEach((update) => update());
  updateScroll();
}
preference.addEventListener('change', applyMotionPreference);
// Keep animation cancellation for user changes; initial entrances may finish normally.
root.dataset.effects = motionDisabled() ? 'paused' : 'running';
updateScroll();
