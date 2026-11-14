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
const heroScene = document.querySelector<HTMLElement>('.hero-scene');
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
  target.closest('[data-reveal], .section-heading, .hero-scene')?.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
  if (target.matches(':focus-visible') && hero?.contains(target) && hero.dataset.sceneFading === 'true') {
    target.scrollIntoView({ block: 'center', behavior: 'instant' });
  }
});
let pointerFrame = 0;
let pointerX = 0;
let pointerY = 0;
function resetTilt(): void {
  visual?.style.setProperty('--tilt-x', '0deg');
  visual?.style.setProperty('--tilt-y', '0deg');
}
function updatePointer(): void {
  pointerFrame = 0;
  if (motionDisabled() || !finePointer.matches) return;
  const bounds = hero?.getBoundingClientRect();
  root.style.setProperty('--spot-x', `${pointerX}px`);
  root.style.setProperty('--spot-y', `${pointerY}px`);
  if (bounds && visual && pointerY >= bounds.top && pointerY <= bounds.bottom && pointerX >= bounds.left && pointerX <= bounds.right) {
    const x = clamp((pointerX - bounds.left) / bounds.width);
    const y = clamp((pointerY - bounds.top) / bounds.height);
    visual.style.setProperty('--tilt-x', `${(0.5 - y) * 9}deg`);
    visual.style.setProperty('--tilt-y', `${(x - 0.5) * 11}deg`);
  } else resetTilt();
}
// The light lives in viewport coordinates and follows the pointer on every page.
document.addEventListener('pointermove', (event) => {
  if (motionDisabled() || !finePointer.matches || event.pointerType === 'touch') return;
  pointerX = event.clientX;
  pointerY = event.clientY;
  if (!pointerFrame) pointerFrame = requestAnimationFrame(updatePointer);
}, { passive: true });
document.addEventListener('pointerleave', resetTilt);

const header = document.querySelector<HTMLElement>('.site-header');
let headerHeight = 88;
function measureHeader(): void {
  headerHeight = header?.getBoundingClientRect().height || 88;
  root.style.setProperty('--header-height', `${headerHeight}px`);
}
measureHeader();
let scrollFrame = 0;
function updateScroll(): void {
  const currentY = Math.max(0, window.scrollY);
  const viewportHeight = window.innerHeight;
  const range = document.documentElement.scrollHeight - viewportHeight;
  const revealStates = measureReveals(viewportHeight, Math.max(0, range - currentY));
  const heroBounds = hero?.getBoundingClientRect();
  document.documentElement.style.setProperty('--scroll-progress', String(range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0));
  if (heroScene && heroBounds && hero) {
    // The next section rises over a fading scene. Tall scenes scroll through first.
    const visibleHeight = Math.max(1, viewportHeight - headerHeight);
    const readTravel = Math.max(0, heroBounds.height - visibleHeight);
    const travel = Math.max(0, headerHeight - heroBounds.top);
    const pin = motionDisabled() ? 0 : Math.min(visibleHeight, Math.max(0, travel - readTravel));
    const progress = motionDisabled() ? 0 : clamp((travel - readTravel) / visibleHeight);
    const opacity = Math.pow(1 - progress, 3);
    heroScene.style.setProperty('--scene-opacity', String(opacity));
    heroScene.style.setProperty('--scene-pin', `${pin}px`);
    heroScene.style.setProperty('--scene-lift', `${-progress * 24}px`);
    hero.dataset.sceneHidden = String(opacity < .02);
    hero.dataset.sceneFading = String(progress > 0);
  }
  root.style.setProperty('--ambient-shift', motionDisabled() ? '0px' : `${-Math.min(window.scrollY * .04, 120)}px`);
  paintReveals(revealStates);
  scrollFrame = 0;
}
window.addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }, { passive: true });
window.addEventListener('resize', () => { measureHeader(); if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); });
function applyMotionPreference(): void {
  root.dataset.effects = motionDisabled() ? 'paused' : 'running';
  activeAnimations.forEach((animation) => animation.cancel());
  if (pointerFrame) cancelAnimationFrame(pointerFrame);
  pointerFrame = 0;
  resetTilt();
  updateScroll();
}
preference.addEventListener('change', applyMotionPreference);
// Keep animation cancellation for user changes; initial entrances may finish normally.
root.dataset.effects = motionDisabled() ? 'paused' : 'running';
updateScroll();

// Details change page geometry without scrolling; recompute every visible state.
document.addEventListener('toggle', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }, true);
window.addEventListener('pageshow', updateScroll);
