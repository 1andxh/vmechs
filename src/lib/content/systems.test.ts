import { describe, it, expect } from 'vitest';
import { buildSystemIndex, type SystemDef } from './systems';

const systems: SystemDef[] = [
	{
		id: 'engine',
		name: 'Engine',
		blurb: 'Turns fuel into motion.',
		planned: [
			{ slug: 'four-stroke-cycle', title: 'How a four-stroke engine works' },
			{ slug: 'valvetrain', title: 'Valvetrain' }
		]
	},
	{
		id: 'transmission',
		name: 'Transmission',
		blurb: "Gets the engine's power to the wheels.",
		planned: [{ slug: 'gears', title: 'Gears and gear ratios' }]
	}
];

const fourStroke = {
	category: 'engine',
	slug: 'four-stroke-cycle',
	title: 'How a four-stroke engine works',
	order: 1
};

describe('buildSystemIndex (systems list for the homepage)', () => {
	it('links a planned lesson once it exists, and keeps the rest as coming', () => {
		const [engine] = buildSystemIndex(systems, [fourStroke]);
		expect(engine.lessons).toEqual([
			{
				title: 'How a four-stroke engine works',
				href: '/learn/engine/four-stroke-cycle',
				available: true
			},
			{ title: 'Valvetrain', href: null, available: false }
		]);
		expect(engine.available).toBe(1);
	});

	it('keeps systems in their defined order, even ones with no lessons yet', () => {
		const index = buildSystemIndex(systems, [fourStroke]);
		expect(index.map((s) => s.id)).toEqual(['engine', 'transmission']);
		expect(index[1].available).toBe(0);
	});

	it('fails loudly when a published lesson is not in its system plan', () => {
		// A slug typo would otherwise show the lesson twice: dimmed as planned, and as a live link.
		const typo = { ...fourStroke, slug: 'four-stroke' };
		expect(() => buildSystemIndex(systems, [typo])).toThrow(
			/"four-stroke" isn't planned in the engine system/
		);
	});

	it('fails loudly when a lesson belongs to a system that does not exist', () => {
		const stray = { category: 'wipers', slug: 'blades', title: 'Wiper blades', order: 1 };
		expect(() => buildSystemIndex(systems, [stray])).toThrow(/wipers/);
	});
});
