import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { runInNewContext } from 'node:vm';

const source = stripTypeScriptTypes(readFileSync(new URL('../src/scripts/target-cursor.ts', import.meta.url), 'utf8')).replace('export {};', '');
function surface() {
  const listeners = new Map();
  return {
    addEventListener(name, fn) { const list = listeners.get(name) || []; list.push(fn); listeners.set(name, list); },
    emit(name, event = {}) { for (const fn of listeners.get(name) || []) fn(event); }
  };
}
function element() {
  const classes = new Set();
  return { children: [], style: {}, setAttribute() {}, append(child) { this.children.push(child); },
    classList: { add(...names) { names.forEach(n => classes.add(n)); }, remove(...names) { names.forEach(n => classes.delete(n)); },
      toggle(name, active) { active ? classes.add(name) : classes.delete(name); }, contains(name) { return classes.has(name); } }
  };
}
function setup({ fine = true, reduced = false, hiddenTarget = false } = {}) {
  const frames = new Map(); let id = 0; let now = 0;
  const media = [{ ...surface(), matches: fine }, { ...surface(), matches: reduced }];
  const target = { closest: () => hiddenTarget ? {} : null, getBoundingClientRect: () => ({ left: 100, top: 100, right: 200, bottom: 140 }) };
  const document = { ...surface(), hidden: false, body: element(), documentElement: surface(), createElement: element,
    elementFromPoint: () => ({ closest: () => target }) };
  const window = { ...surface(), matchMedia: q => media[q.includes('reduced-motion') ? 1 : 0] };
  runInNewContext(source, { window, document, innerWidth: 800, innerHeight: 600,
    getComputedStyle: () => ({ borderTopLeftRadius: '8px' }),
    requestAnimationFrame(fn) { frames.set(++id, fn); return id; }, cancelAnimationFrame(key) { frames.delete(key); } });
  const layer = document.body.children[0];
  const move = (pointerType = 'mouse') => document.emit('pointermove', { clientX: 150, clientY: 120, pointerType });
  const settle = () => { let ticks = 0; while (frames.size && ticks++ < 120) { now += 16; const batch = [...frames.values()]; frames.clear(); batch.forEach(fn => fn(now)); } assert.equal(frames.size, 0, 'idle cursor must stop scheduling frames'); };
  return { window, document, layer, frames, media, move, settle };
}

test('cursor locks on a target, settles, and disappears completely on scroll or keyboard input', () => {
  const app = setup(); app.move(); app.settle();
  assert.ok(app.layer.classList.contains('is-visible'));
  assert.ok(app.layer.classList.contains('is-locked'));
  app.window.emit('scroll');
  assert.equal(app.layer.classList.contains('is-visible'), false);
  assert.equal(app.layer.classList.contains('is-locked'), false);
  app.move(); app.settle(); app.document.emit('keydown', { key: 'Tab' });
  assert.equal(app.layer.classList.contains('is-visible'), false);
  assert.equal(app.frames.size, 0);
});

test('reduced motion, coarse pointer and touch retain the native cursor without animation', () => {
  for (const options of [{ reduced: true }, { fine: false }]) {
    const app = setup(options); app.move(); assert.equal(app.frames.size, 0); assert.equal(app.layer.classList.contains('is-visible'), false);
  }
  const app = setup(); app.move('touch'); assert.equal(app.frames.size, 0);
});

test('hidden faces cannot lock the cursor and changing motion preference cancels pending work', () => {
  const app = setup({ hiddenTarget: true }); app.move(); app.settle();
  assert.equal(app.layer.classList.contains('is-locked'), false);
  app.move(); app.media[1].matches = true; app.media[1].emit('change');
  assert.equal(app.frames.size, 0); assert.equal(app.layer.classList.contains('is-visible'), false);
});

test('hidden documents and window blur release a locked cursor', () => {
  const app = setup(); app.move(); app.settle(); app.window.emit('blur');
  assert.equal(app.layer.classList.contains('is-locked'), false);
  app.move(); app.document.hidden = true; app.document.emit('visibilitychange');
  assert.equal(app.frames.size, 0); app.move(); assert.equal(app.frames.size, 0);
});
