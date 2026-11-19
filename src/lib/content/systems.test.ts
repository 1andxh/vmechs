import { describe, it, expect } from 'vitest';
import {
	buildSystemIndex,
	planTotals,
	openPages,
	MACHINES,
	MECHANISMS,
	SYSTEMS,
	type SystemDef
} from './systems';

const systems: SystemDef[] = [
	{
		id: 'engine',
		group: 'car',
		name: 'Engine',
		blurb: 'Turns fuel into motion.',
		planned: [
			{ slug: 'four-stroke-cycle', title: 'How a four-stroke engine works' },
			{ slug: 'valvetrain', title: 'Valvetrain' }
		]
	},
	{
		id: 'transmission',
		group: 'car',
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
				slug: 'four-stroke-cycle',
				title: 'How a four-stroke engine works',
				href: '/learn/engine/four-stroke-cycle',
				available: true
			},
			{ slug: 'valvetrain', title: 'Valvetrain', href: null, available: false }
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

describe('planTotals (the spec plate on the homepage)', () => {
	it('counts open pages, systems, and the planned pages still on the way', () => {
		// engine plans 2 (1 published), transmission plans 1 (none published)
		expect(planTotals(buildSystemIndex(systems, [fourStroke]))).toEqual({
			open: 1,
			systems: 2,
			coming: 2
		});
	});

	it('has nothing on the way once every planned page is open', () => {
		const gears = { category: 'transmission', slug: 'gears', title: 'Gears', order: 1 };
		const valvetrain = { category: 'engine', slug: 'valvetrain', title: 'Valvetrain', order: 2 };
		const all = buildSystemIndex(systems, [fourStroke, valvetrain, gears]);
		expect(planTotals(all)).toEqual({ open: 3, systems: 2, coming: 0 });
	});
});

describe('the catalogue: machines, their sections, and mechanisms (ADR 0014)', () => {
	const groups = new Set([...MACHINES.map((m) => m.id), 'mechanisms']);

	it('puts every section in a machine or in the mechanisms group', () => {
		for (const s of SYSTEMS) expect(groups.has(s.group), s.id).toBe(true);
	});

	it('gives every machine at least one section', () => {
		for (const m of MACHINES)
			expect(
				SYSTEMS.some((s) => s.group === m.id),
				m.id
			).toBe(true);
	});

	it("points each mechanism's page at a page planned in some section", () => {
		for (const m of MECHANISMS) {
			const section = SYSTEMS.find((s) => s.id === m.page.section);
			expect(
				section?.planned.some((p) => p.slug === m.page.slug),
				m.id
			).toBe(true);
		}
	});

	it('lists every page of the mechanisms section as a mechanism, once', () => {
		const own = SYSTEMS.find((s) => s.id === 'mechanisms')!
			.planned.map((p) => p.slug)
			.sort();
		const listed = MECHANISMS.filter((m) => m.page.section === 'mechanisms')
			.map((m) => m.page.slug)
			.sort();
		expect(listed).toEqual(own);
		expect(new Set(MECHANISMS.map((m) => m.id)).size).toBe(MECHANISMS.length);
	});

	it('says where each mechanism is found', () => {
		for (const m of MECHANISMS) expect(m.foundIn.length, m.id).toBeGreaterThan(0);
	});
});

describe('openPages (the links on the error page)', () => {
	it('names each existing lesson by its planned title, in plan order', () => {
		const refs = [
			{ category: 'transmission', slug: 'gears' },
			{ category: 'engine', slug: 'four-stroke-cycle' }
		];
		expect(openPages(systems, refs)).toEqual([
			{ title: 'How a four-stroke engine works', href: '/learn/engine/four-stroke-cycle' },
			{ title: 'Gears and gear ratios', href: '/learn/transmission/gears' }
		]);
	});

	it('leaves out a file that is not in the plan', () => {
		expect(openPages(systems, [{ category: 'engine', slug: 'not-planned' }])).toEqual([]);
	});
});
