export {};
// Native Target Cursor interaction, inspired by React Bits (see docs/third-party.md).
// Ordinary pointer and keyboard focus remain intact; this layer never captures input.
const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const forcedColors = window.matchMedia('(forced-colors: active)');
const enabled = () => fine.matches && !reduced.matches && !forcedColors.matches && !document.hidden;
const layer = document.createElement('div');
layer.className = 'target-cursor';
layer.setAttribute('aria-hidden', 'true');
const corners = Array.from({ length: 4 }, () => {
  const corner = document.createElement('span');
  layer.append(corner);
  return corner;
});
document.body.append(layer);
const selector = 'a[href], button:not(:disabled), summary, .card-face';
let pointer = { x: 0, y: 0 };
let target: Element | null = null;
let raf = 0;
let last = 0;
let shown = false;
let pressed = false;
let points = corners.map(() => ({ x: 0, y: 0 }));
let angle = 0;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

function findTarget(): Element | null {
  const element = document.elementFromPoint(pointer.x, pointer.y)?.closest(selector);
  if (!element || element.closest('[inert], [aria-hidden="true"]')) return null;
  return element;
}
function hide(): void {
  cancelAnimationFrame(raf);
  raf = 0;
  last = 0;
  shown = false;
  pressed = false;
  target = null;
  layer.classList.remove('is-visible', 'is-locked');
}
function paint(now: number): void {
  raf = 0;
  if (!shown || !enabled()) { hide(); return; }
  const dt = last ? Math.min((now - last) / 1000, .05) : 1 / 60;
  last = now;
  // Resolve again while settling: transforms and card flips can change the target.
  target = findTarget();
  const rect = target?.getBoundingClientRect();
  const padding = pressed ? 3 : 7;
  const half = pressed ? 11 : 15;
  const left = rect ? rect.left - padding : pointer.x - half;
  const right = rect ? rect.right + padding : pointer.x + half;
  const top = rect ? rect.top - padding : pointer.y - half;
  const bottom = rect ? rect.bottom + padding : pointer.y + half;
  const blend = 1 - Math.exp(-dt * (rect ? 20 : 32));
  if (rect) angle += (0 - angle) * blend;
  else {
    angle = (angle + dt * 90) % 360;
    if (angle > 180) angle -= 360;
  }
  const goals = [{ x: left, y: top }, { x: right, y: top }, { x: right, y: bottom }, { x: left, y: bottom }];
  if (!rect) {
    const radians = angle * Math.PI / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    goals.forEach((point) => {
      const x = point.x - pointer.x;
      const y = point.y - pointer.y;
      point.x = pointer.x + x * cos - y * sin;
      point.y = pointer.y + x * sin + y * cos;
    });
  }
  let distance = Math.abs(angle);
  goals.forEach((goal, index) => {
    goal.x = clamp(goal.x, 3, innerWidth - 3);
    goal.y = clamp(goal.y, 3, innerHeight - 3);
    const point = points[index];
    point.x += (goal.x - point.x) * blend;
    point.y += (goal.y - point.y) * blend;
    distance += Math.abs(goal.x - point.x) + Math.abs(goal.y - point.y);
  });
  // Read geometry first, then write transforms; no animated layout dimensions.
  const radius = rect ? Math.min(7, parseFloat(getComputedStyle(target!).borderTopLeftRadius) || 0) : 0;
  corners.forEach((corner, index) => {
    const point = points[index];
    corner.style.transform = `translate3d(${point.x.toFixed(2)}px, ${point.y.toFixed(2)}px, 0) rotate(${index * 90 + angle}deg)`;
    corner.style.borderTopLeftRadius = `${radius}px`;
  });
  layer.classList.toggle('is-locked', !!rect);
  if (!rect || distance > .15) raf = requestAnimationFrame(paint);
  else last = 0;
}
function wake(): void {
  if (!raf && shown && enabled()) raf = requestAnimationFrame(paint);
}
document.addEventListener('pointermove', (event) => {
  if (!enabled() || event.pointerType === 'touch') { hide(); return; }
  pointer = { x: event.clientX, y: event.clientY };
  if (!shown) {
    points = corners.map(() => ({ ...pointer }));
    shown = true;
    layer.classList.add('is-visible');
  }
  wake();
}, { passive: true });
document.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch') { hide(); return; }
  pressed = true;
  wake();
}, { passive: true });
document.addEventListener('pointerup', () => { pressed = false; wake(); }, { passive: true });
document.addEventListener('pointercancel', hide);
document.documentElement.addEventListener('pointerleave', hide);
document.addEventListener('keydown', hide);
document.addEventListener('visibilitychange', hide);
window.addEventListener('blur', hide);
window.addEventListener('scroll', hide, { passive: true });
window.addEventListener('resize', hide);
window.addEventListener('pagehide', hide);
fine.addEventListener('change', hide);
reduced.addEventListener('change', hide);
forcedColors.addEventListener('change', hide);
