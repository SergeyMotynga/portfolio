const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const fine = window.matchMedia('(pointer: fine)');
const canMove = () => !reduced.matches && fine.matches;
const limit = (value: number, max: number) => Math.max(-max, Math.min(max, value));

// Flip controls are real buttons; hidden faces never retain keyboard focus.
document.querySelectorAll<HTMLElement>('[data-card]').forEach((card) => {
  const front = card.querySelector<HTMLElement>('[data-card-front]')!;
  const back = card.querySelector<HTMLElement>('[data-card-back]')!;
  const buttons = card.querySelectorAll<HTMLButtonElement>('[data-card-flip]');
  back.id = `${card.id}-contribution`;
  const show = (flipped: boolean, focus: boolean) => {
    card.dataset.flipped = String(flipped);
    front.inert = flipped;
    back.inert = !flipped;
    front.setAttribute('aria-hidden', String(flipped));
    back.setAttribute('aria-hidden', String(!flipped));
    if (focus) (flipped ? back : front).querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
  };
  buttons.forEach((button) => {
    button.hidden = false;
    button.addEventListener('click', () => show(card.dataset.flipped !== 'true', true));
  });
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && card.dataset.flipped === 'true') { event.preventDefault(); show(false, true); }
  });
  card.addEventListener('click', (event) => {
    if (!(event.target instanceof Element) || event.target.closest('a, button') || window.getSelection()?.toString()) return;
    show(card.dataset.flipped !== 'true', false);
  });
  card.dataset.enhanced = '';
  show(false, false);
  let frame = 0;
  let x = 0;
  let y = 0;
  card.addEventListener('pointermove', (event) => {
    if (!canMove() || event.pointerType === 'touch') return;
    x = event.clientX; y = event.clientY;
    if (!frame) frame = requestAnimationFrame(() => {
      frame = 0;
      const box = card.getBoundingClientRect();
      const px = Math.max(0, Math.min(1, (x - box.left) / box.width));
      const py = Math.max(0, Math.min(1, (y - box.top) / box.height));
      card.style.setProperty('--card-rx', `${(0.5 - py) * 9}deg`);
      card.style.setProperty('--card-ry', `${(px - 0.5) * 9}deg`);
      card.style.setProperty('--glare-x', `${px * 100}%`);
      card.style.setProperty('--glare-y', `${py * 100}%`);
    });
  }, { passive: true });
  const reset = () => { cancelAnimationFrame(frame); frame = 0; card.style.setProperty('--card-rx', '0deg'); card.style.setProperty('--card-ry', '0deg'); };
  card.addEventListener('pointerleave', reset);
  reduced.addEventListener('change', reset);
});

// Measure the stationary wrapper, rather than chasing the translated button.
const magnets = [...document.querySelectorAll<HTMLElement>('[data-magnet]')];
let magnetFrame = 0;
let pointer = { x: 0, y: 0 };
const resetMagnets = () => magnets.forEach((element) => {
  element.style.setProperty('--magnet-x', '0px'); element.style.setProperty('--magnet-y', '0px');
});
document.addEventListener('pointermove', (event) => {
  if (!canMove() || event.pointerType === 'touch') return;
  pointer = { x: event.clientX, y: event.clientY };
  if (!magnetFrame) magnetFrame = requestAnimationFrame(() => {
    magnetFrame = 0;
    if (!canMove()) { resetMagnets(); return; }
    const measured = magnets.map((element) => ({ element, box: element.getBoundingClientRect() }));
    let winner: HTMLElement | undefined;
    let distance = Infinity;
    measured.forEach(({ element, box }) => {
      const near = Math.hypot(pointer.x - box.left - box.width / 2, pointer.y - box.top - box.height / 2);
      if (pointer.x > box.left - 36 && pointer.x < box.right + 36 && pointer.y > box.top - 36 && pointer.y < box.bottom + 36 && near < distance) { winner = element; distance = near; }
    });
    measured.forEach(({ element, box }) => {
      const active = winner === element && !element.matches(':focus-within');
      element.style.setProperty('--magnet-x', `${active ? limit((pointer.x - box.left - box.width / 2) / 4, 10) : 0}px`);
      element.style.setProperty('--magnet-y', `${active ? limit((pointer.y - box.top - box.height / 2) / 4, 8) : 0}px`);
    });
  });
}, { passive: true });
window.addEventListener('scroll', resetMagnets, { passive: true });
window.addEventListener('blur', resetMagnets);
document.addEventListener('pointerleave', resetMagnets);
reduced.addEventListener('change', resetMagnets);

// Heavy effects enhance visible HTML; failures leave the original heading/image.
type Dispose = () => void;
const effects = new Map<HTMLElement, Dispose>();
const pending = new Set<HTMLElement>();
let generation = 0;
async function enhance(host: HTMLElement): Promise<void> {
  if (reduced.matches || effects.has(host) || pending.has(host) || (host.hasAttribute('data-elastic') && !fine.matches)) return;
  const version = generation;
  const palette = getComputedStyle(document.documentElement);
  const accent = palette.getPropertyValue('--accent').trim();
  pending.add(host);
  try {
    if (host.hasAttribute('data-badge')) {
      const { mountLanyard } = await import('../lib/effects/lanyard.js');
      if (version !== generation || reduced.matches) return;
      const dispose = mountLanyard(host, { frontImage: host.dataset.front, backImage: host.dataset.back, cardColor: accent, strapColor: accent, size: .7, strapLength: .25, breeze: 0, intro: true, damping: .8, finish: 'glossy' });
      if (dispose) effects.set(host, dispose);
    } else if (host.hasAttribute('data-molten')) {
      const { mountMoltenMetal } = await import('../lib/effects/molten.js');
      if (version !== generation || reduced.matches) return;
      const dispose = mountMoltenMetal(host, { colors: ['#48246E', '#8D5BD6', accent], coreColor: '#E3D9FF', speed: .18, detail: 2, glow: .9, brightness: 1.1, haze: .5, scale: 4, dpr: 1, flareOnClick: false });
      if (dispose) effects.set(host, dispose);
    } else if (host.hasAttribute('data-crystal')) {
      const { mountCrystalizedBall } = await import('../lib/effects/crystal.js');
      if (version !== generation || reduced.matches) return;
      const dispose = mountCrystalizedBall(host, { color: accent, particleCount: 2400, speed: .4, intro: true });
      if (dispose) effects.set(host, dispose);
    } else {
      const { mountElasticMesh } = await import('../lib/effects/mesh.js');
      if (version !== generation || reduced.matches) return;
      const dispose = mountElasticMesh(host, { text: host.dataset.text, color: accent, fontFamily: getComputedStyle(host).fontFamily, fontWeight: Number(getComputedStyle(host).fontWeight) || 700, material: 'balloon', inflate: .45, stiffness: .65, wobble: .35, stretch: .3, intro: false, shadow: .25, dpr: 1.5 });
      if (dispose) effects.set(host, dispose);
    }
  } catch (error) { console.warn('Optional visual effect unavailable; static content retained.', error); }
  finally { pending.delete(host); }
}
const hosts = [...document.querySelectorAll<HTMLElement>('[data-badge], [data-elastic], [data-molten], [data-crystal]')];
const visible = new Set<HTMLElement>();
const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  const host = entry.target as HTMLElement;
  if (entry.isIntersecting) { visible.add(host); void enhance(host); } else visible.delete(host);
}), { rootMargin: '100px' });
hosts.forEach((host) => {
  observer.observe(host);
  host.addEventListener('webglcontextlost', () => { effects.get(host)?.(); effects.delete(host); delete host.dataset.ready; }, true);
});
reduced.addEventListener('change', () => {
  generation++;
  effects.forEach((dispose) => dispose()); effects.clear();
  if (!reduced.matches) visible.forEach((host) => void enhance(host));
});

// Per-word blur entrance, inspired by Motion Primitives TextEffect's blur preset.
const textObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (!entry.isIntersecting || reduced.matches) return;
  const text = entry.target;
  if (text.closest('[aria-hidden="true"]')) return;
  text.querySelectorAll<HTMLElement>('.effect-word').forEach((word, index) => {
    word.getAnimations().forEach((animation) => animation.cancel());
    word.animate([{ opacity: 0, filter: 'blur(6px)', transform: 'translateY(6px)' }, { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0)' }], { duration: 500, delay: Math.min(index, 20) * 22, easing: 'ease-out', fill: 'backwards' });
  });
}), { threshold: .15 });
document.querySelectorAll('[data-text-effect]').forEach((text) => textObserver.observe(text));
reduced.addEventListener('change', () => {
  if (reduced.matches) document.querySelectorAll('.effect-word').forEach((word) => word.getAnimations().forEach((animation) => animation.cancel()));
});
