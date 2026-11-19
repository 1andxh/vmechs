import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { contrast, OUTLINE, outlineOf, PAPER, PARTS, STRUCTURE } from './palette';

const css = readFileSync(new URL('../../app.css', import.meta.url), 'utf8');
const token = (name: string) => css.match(new RegExp(`--${name}:\\s*(#[0-9a-f]{6})`, 'i'))?.[1];

describe('the machine palette (ADR 0015)', () => {
	it('matches the design tokens in app.css, so the two never drift apart', () => {
		expect(PAPER).toBe(token('bg'));
		expect(STRUCTURE).toBe(token('part-grey'));
		for (const [name, { fill, text }] of Object.entries(PARTS)) {
			expect(fill, name).toBe(token(`part-${name}`));
			expect(text, name).toBe(token(`part-${name}-text`));
		}
	});

	it("draws every part's outline dark enough to see on the paper (3 : 1, WCAG for graphics)", () => {
		for (const [name, { fill }] of Object.entries(PARTS))
			expect(contrast(outlineOf(fill), PAPER), name).toBeGreaterThanOrEqual(3);
		expect(contrast(outlineOf(STRUCTURE), PAPER)).toBeGreaterThanOrEqual(3);
	});

	it('keeps the outline the same colour, only darker', () => {
		const [r, g, b] = [1, 3, 5].map((i) => parseInt(outlineOf('#e5484d').slice(i, i + 2), 16));
		expect(r).toBeGreaterThan(g); // still red
		expect(r).toBeLessThan(0xe5);
		expect(outlineOf('#ffffff')).not.toBe('#ffffff');
		expect(OUTLINE).toBeGreaterThan(0);
		expect(OUTLINE).toBeLessThan(1);
	});

	it('gives every part a text shade that passes AA on the paper (4.5 : 1)', () => {
		for (const [name, { text }] of Object.entries(PARTS))
			expect(contrast(text, PAPER), name).toBeGreaterThanOrEqual(4.5);
	});
});
