import test from 'node:test';
import assert from 'node:assert/strict';
import { selectActiveSection } from '../src/lib/active-section.ts';

test('navigation stays neutral before the first section and selects the last crossed section', () => {
  assert.equal(selectActiveSection([{ id: 'projects', top: 700 }], 250, false), null);
  assert.equal(selectActiveSection([{ id: 'projects', top: -600 }, { id: 'presentations', top: 190 }, { id: 'about', top: 900 }], 250, false), 'presentations');
});
test('navigation follows reverse scrolling without retaining a visited section', () => {
  const positions = [{ id: 'projects', top: -50 }, { id: 'presentations', top: 700 }];
  assert.equal(selectActiveSection(positions, 250, false), 'projects');
  assert.equal(selectActiveSection(positions.map(s => ({ ...s, top: s.top + 900 })), 250, false), null);
});
test('a short final contact section is selected at the document end, but absent sections are not invented', () => {
  assert.equal(selectActiveSection([{ id: 'about', top: -400 }, { id: 'contact', top: 400 }], 250, true), 'contact');
  assert.equal(selectActiveSection([], 250, true), null);
});
