import { describe, it, expect } from 'vitest';
import { PARTS } from './sheet';
import { PARTS as PALETTE } from '../../palette';
import { SYSTEMS } from '#lib/content/systems.ts';

describe('PARTS (the parts list on the homepage drawing sheet)', () => {
	const engine = SYSTEMS.find((s) => s.id === 'engine')!;

	it('points every part at a page planned for the engine, so none leads nowhere', () => {
		const planned = new Set(engine.planned.map((p) => p.slug));
		for (const part of PARTS) expect(planned.has(part.slug), part.slug).toBe(true);
	});

	it('gives every planned engine page exactly one part', () => {
		expect(PARTS.map((p) => p.slug).sort()).toEqual(engine.planned.map((p) => p.slug).sort());
	});

	it("gives each part its own colour from the palette, so the list is the drawing's key", () => {
		const colours = PARTS.map((p) => p.colour);
		expect(new Set(colours).size).toBe(PARTS.length);
		for (const c of colours) expect(Object.keys(PALETTE)).toContain(c);
	});

	it('numbers the parts 1, 2, 3… in order, and lights a different part for each', () => {
		expect(PARTS.map((p) => p.n)).toEqual(PARTS.map((_, i) => i + 1));
		expect(new Set(PARTS.map((p) => p.part)).size).toBe(PARTS.length);
	});
});
