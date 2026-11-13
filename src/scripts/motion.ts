const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(pointer: fine)');
const root = document.documentElement;
const motionDisabled = () => preference.matches;
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

const revealElements = [...document.querySelectorAll<HTMLElement>('.section-heading, [data-reveal]')];
const revealOffsets = new WeakMap<HTMLElement, number>();
const clamp = (value: number) => Math.min(1, Math.max(0, value));

// Scroll determines the visible state in both directions; no one-shot observer.
function measureReveals(viewportHeight: number, remainingScroll: number) {
  return revealElements.map((element) => {
    const bounds = element.getBoundingClientRect();
    const distance = Math.min(240, viewportHeight * .34);
    const previousOffset = revealOffsets.get(element) || 0;
    const top = bounds.top - previousOffset;
    const bottom = bounds.bottom - previousOffset;
    const entryProgress = clamp((viewportHeight * .88 - top) / distance);
    const endProgress = top < viewportHeight && bottom > 0 ? clamp(1 - remainingScroll / distance) : 0;
    const progress = motionDisabled() ? 1 : Math.max(entryProgress, endProgress);
    return { element, progress };
  });
}

function paintReveals(states: ReturnType<typeof measureReveals>): void {
  states.forEach(({ element, progress }) => {
    element.dataset.scrollReveal = '';
    const words = element.querySelectorAll<HTMLElement>('.motion-word');
    words.forEach((word, index) => {
      const offset = Math.min(index, 5) * .07;
      const wordProgress = clamp((progress - offset) / (1 - offset));
      word.style.setProperty('--word-shift', `${(1 - wordProgress) * 105}%`);
      word.style.setProperty('--word-opacity', String(wordProgress));
    });
    if (element.matches('.section-heading')) {
      element.style.setProperty('--reveal-opacity', '1');
      return;
    }
    const sequence = Number(element.dataset.sequence || 0) % 3;
    const offset = sequence * .04;
    const itemProgress = clamp((progress - offset) / (1 - offset));
    const distance = (1 - itemProgress) * 36;
    const direction = element.dataset.reveal;
    const transform = direction === 'left' ? `translateX(${-distance}px)` : direction === 'right' ? `translateX(${distance}px)` : `translateY(${distance}px)`;
    element.style.setProperty('--reveal-opacity', String(itemProgress));
    element.style.setProperty('--reveal-transform', transform);
    revealOffsets.set(element, direction === 'left' || direction === 'right' ? 0 : distance);
  });
}

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
    if (motionDisabled() || !finePointer.matches || pointerFrame) return;
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

const header = document.querySelector<HTMLElement>('.site-header');
let lastScrollY = window.scrollY;
let headerScrollDistance = 0;
function measureHeader(): void {
  root.style.setProperty('--header-height', `${header?.getBoundingClientRect().height || 88}px`);
}
measureHeader();
let scrollFrame = 0;
function updateScroll(): void {
  const currentY = Math.max(0, window.scrollY);
  const viewportHeight = window.innerHeight;
  const range = document.documentElement.scrollHeight - viewportHeight;
  const revealStates = measureReveals(viewportHeight, Math.max(0, range - currentY));
  const heroTop = hero?.getBoundingClientRect().top || 0;
  document.documentElement.style.setProperty('--scroll-progress', String(range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0));
  if (heroTitle && hero) {
    const progress = motionDisabled() ? 0 : Math.min(1, Math.max(0, -heroTop / Math.max(340, viewportHeight * .6)));
    const opacity = Math.max(0, 1 - progress * 1.6);
    heroTitle.style.setProperty('--hero-opacity', String(opacity));
    heroTitle.style.setProperty('--hero-lift', `${-progress * 64}px`);
  }
  root.style.setProperty('--ambient-shift', motionDisabled() ? '0px' : `${-Math.min(window.scrollY * .04, 120)}px`);
  paintReveals(revealStates);
  if (header) {
    const delta = currentY - lastScrollY;
    if (delta !== 0) headerScrollDistance = Math.sign(delta) === Math.sign(headerScrollDistance) ? headerScrollDistance + delta : delta;
    if (currentY < 100 || headerScrollDistance < -8) header.dataset.hidden = 'false';
    else if (currentY > 160 && headerScrollDistance > 12) header.dataset.hidden = 'true';
  }
  lastScrollY = currentY;
  scrollFrame = 0;
}
window.addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }, { passive: true });
window.addEventListener('resize', () => { measureHeader(); if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); });
function applyMotionPreference(): void {
  root.dataset.effects = motionDisabled() ? 'paused' : 'running';
  activeAnimations.forEach((animation) => animation.cancel());
  if (visual) {
    visual.style.setProperty('--tilt-x', '0deg');
    visual.style.setProperty('--tilt-y', '0deg');
  }
  updateScroll();
}
preference.addEventListener('change', applyMotionPreference);
// Keep animation cancellation for user changes; initial entrances may finish normally.
root.dataset.effects = motionDisabled() ? 'paused' : 'running';
updateScroll();

// Details change page geometry without scrolling; recompute every visible state.
document.addEventListener('toggle', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }, true);
window.addEventListener('pageshow', updateScroll);
