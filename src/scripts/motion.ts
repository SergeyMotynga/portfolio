import './showcase';
import './scene-backgrounds';
import './target-cursor';
import { selectActiveSection } from '../lib/active-section';

const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
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
      word.style.setProperty('--word-blur', `${(1 - wordProgress) * 8}px`);
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
const heroCopy = document.querySelector<HTMLElement>('.hero-copy');
const heroScene = document.querySelector<HTMLElement>('.hero-scene');
const heroContainer = hero?.closest('main');
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
const header = document.querySelector<HTMLElement>('.site-header');
let headerHeight = 88;
function measureHeader(): void {
  headerHeight = header?.getBoundingClientRect().height || 88;
  root.style.setProperty('--header-height', `${headerHeight}px`);
  if (hero) {
    // CSS holds the scene; tall scenes can scroll until their bottom is visible.
    hero.style.setProperty('--hero-sticky-top', `${Math.min(headerHeight, window.innerHeight - hero.getBoundingClientRect().height)}px`);
  }
}
measureHeader();
let scrollFrame = 0;
// Measure stationary wrappers, so the child's transform cannot feed back into scroll.
const sceneFrames = [...document.querySelectorAll<HTMLElement>('[data-scene-frame]')];
const sectionLinks = [...document.querySelectorAll<HTMLAnchorElement>('.navigation [data-section-link]')];
let activeSection: string | null = null;
function measureScenePanels(viewportHeight: number, remainingScroll: number) {
  const distance = Math.min(320, viewportHeight * .45);
  return sceneFrames.map((frame) => {
    const bounds = frame.getBoundingClientRect();
    const entry = clamp((viewportHeight * .92 - bounds.top) / distance);
    const atEnd = bounds.top < viewportHeight && bounds.bottom > 0 ? clamp(1 - remainingScroll / distance) : 0;
    return { frame, id: frame.id, top: bounds.top, progress: motionDisabled() ? 1 : Math.max(entry, atEnd) };
  });
}
function paintScenePanels(states: ReturnType<typeof measureScenePanels>): void {
  states.forEach(({ frame, progress }) => {
    frame.style.setProperty('--panel-opacity', String(.45 + .55 * progress));
    frame.style.setProperty('--panel-shift', `${(1 - progress) * 40}px`);
    frame.style.setProperty('--panel-scale', String(.98 + .02 * progress));
  });
}
function paintActiveSection(states: ReturnType<typeof measureScenePanels>, viewportHeight: number, remainingScroll: number): void {
  if (!sectionLinks.length) return;
  const next = selectActiveSection(states, headerHeight + Math.min(180, viewportHeight * .2), remainingScroll <= 2);
  if (next === activeSection) return;
  activeSection = next;
  sectionLinks.forEach((link) => {
    if (link.dataset.sectionLink === next) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
function updateScroll(): void {
  const currentY = Math.max(0, window.scrollY);
  const viewportHeight = window.innerHeight;
  const range = document.documentElement.scrollHeight - viewportHeight;
  const remainingScroll = Math.max(0, range - currentY);
  const revealStates = measureReveals(viewportHeight, remainingScroll);
  const panelStates = measureScenePanels(viewportHeight, remainingScroll);
  const heroHeight = hero?.getBoundingClientRect().height;
  const heroStart = heroContainer?.getBoundingClientRect().top;
  document.documentElement.style.setProperty('--scroll-progress', String(range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0));
  if (heroScene && heroHeight !== undefined && heroStart !== undefined && hero) {
    // Measure normal document flow, never the sticky element's clamped position.
    const visibleHeight = Math.max(1, viewportHeight - headerHeight);
    const readTravel = Math.max(0, heroHeight - visibleHeight);
    const travel = Math.max(0, headerHeight - heroStart);
    const progress = motionDisabled() ? 0 : clamp((travel - readTravel) / visibleHeight);
    const opacity = Math.pow(1 - progress, 3);
    heroScene.style.setProperty('--scene-opacity', String(opacity));
    root.style.setProperty('--badge-opacity', String(opacity));
    const hidden = opacity < .02;
    root.style.setProperty('--badge-visibility', hidden ? 'hidden' : 'visible');
    const wasHidden = hero.dataset.sceneHidden === 'true';
    hero.dataset.sceneHidden = String(hidden);
    if (wasHidden && !hidden) hero.dispatchEvent(new Event('hero-visible'));
    hero.dataset.sceneFading = String(progress > 0);
  }
  root.style.setProperty('--ambient-shift', motionDisabled() ? '0px' : `${-Math.min(window.scrollY * .04, 120)}px`);
  paintScenePanels(panelStates);
  paintActiveSection(panelStates, viewportHeight, remainingScroll);
  paintReveals(revealStates);
  scrollFrame = 0;
}
window.addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }, { passive: true });
window.addEventListener('resize', () => { measureHeader(); if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); });
function applyMotionPreference(): void {
  root.dataset.effects = motionDisabled() ? 'paused' : 'running';
  activeAnimations.forEach((animation) => animation.cancel());
  updateScroll();
}
preference.addEventListener('change', applyMotionPreference);
// Keep animation cancellation for user changes; initial entrances may finish normally.
root.dataset.effects = motionDisabled() ? 'paused' : 'running';
updateScroll();

// Details change page geometry without scrolling; recompute every visible state.
document.addEventListener('toggle', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }, true);
window.addEventListener('pageshow', updateScroll);

// Web fonts can change sticky geometry after first paint.
void document.fonts.ready.then(() => { measureHeader(); updateScroll(); });
