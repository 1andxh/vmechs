/**
 * What vmechs covers (ADR 0014): machines (a car, a clock) and the mechanisms
 * inside them (gears, cams, springs). Pages are planned in sections: the car
 * has one per system, the other machines one each, and the mechanisms have
 * their own. Each section's pages are in teaching order (see docs/ROADMAP.md).
 * A planned page becomes a link as soon as a lesson file with that category
 * and slug exists. Every lesson file must be planned here; buildSystemIndex
 * throws otherwise.
 */

import type { PartColour } from '../mechanisms/palette.ts';

/** The machines, in the order the homepage shows them, each with its poster's colour. */
export const MACHINES = [
	{
		id: 'car',
		name: 'Car',
		blurb: 'From the engine to the wheels, system by system.',
		colour: 'red'
	},
	{
		id: 'clocks',
		name: 'Clocks and watches',
		blurb: 'How a spring and a swinging wheel keep time.',
		colour: 'blue'
	},
	{
		id: 'simple-machines',
		name: 'Simple machines',
		blurb: 'The six classic building blocks inside every machine.',
		colour: 'gold'
	}
] as const satisfies readonly { id: string; name: string; blurb: string; colour: PartColour }[];

/** A machine's id, or 'mechanisms' for the section of mechanism pages. */
export type Group = (typeof MACHINES)[number]['id'] | 'mechanisms';

export interface SystemDef {
	/** Matches a lesson's `category` and its folder under src/content/articles/. */
	id: string;
	/** The machine it belongs to, or 'mechanisms'. */
	group: Group;
	name: string;
	blurb: string;
	/** Future lessons, by the slug their file will have. */
	planned: { slug: string; title: string }[];
	/**
	 * How the section page groups the pages, if it does: named families, each
	 * a list of planned slugs, together covering every planned page once.
	 */
	families?: { name: string; slugs: string[] }[];
}

export interface LessonListing {
	category: string;
	slug: string;
	title: string;
	order: number;
}

export interface SystemRow {
	id: string;
	group: Group;
	name: string;
	blurb: string;
	/** How many of this system's lessons are published. */
	available: number;
	lessons: { slug: string; title: string; href: string | null; available: boolean }[];
}

export const SYSTEMS: SystemDef[] = [
	{
		id: 'engine',
		group: 'car',
		name: 'Engine',
		blurb: 'Turns fuel into motion.',
		planned: [
			{ slug: 'four-stroke-cycle', title: 'How a four-stroke engine works' },
			{ slug: 'valvetrain', title: 'Valvetrain: camshaft and timing' },
			{ slug: 'engine-layouts', title: 'Engine layouts and firing order' },
			{ slug: 'turbocharger', title: 'Turbocharging' },
			{ slug: 'cooling-lubrication', title: 'Cooling and lubrication' }
		]
	},
	{
		id: 'transmission',
		group: 'car',
		name: 'Transmission',
		blurb: "Gets the engine's power to the wheels.",
		planned: [
			{ slug: 'gears', title: 'Gears and gear ratios' },
			{ slug: 'clutch', title: 'Clutch' },
			{ slug: 'manual-gearbox', title: 'Manual gearbox' },
			{ slug: 'differential', title: 'Differential' },
			{ slug: 'automatic-gearbox', title: 'Automatic gearbox' }
		]
	},
	{
		id: 'brakes',
		group: 'car',
		name: 'Brakes',
		blurb: 'Slows and stops the car.',
		planned: [
			{ slug: 'hydraulic-brakes', title: 'Hydraulic brakes' },
			{ slug: 'abs', title: 'Anti-lock brakes (ABS)' }
		]
	},
	{
		id: 'suspension-steering',
		group: 'car',
		name: 'Suspension and steering',
		blurb: 'Keeps the tyres on the road and pointed where you want.',
		planned: [
			{ slug: 'suspension', title: 'Suspension' },
			{ slug: 'steering', title: 'Steering' }
		]
	},
	{
		id: 'electrical',
		group: 'car',
		name: 'Electrical',
		blurb: 'Starts the engine and powers everything else.',
		planned: [
			{ slug: 'battery-starter-alternator', title: 'Battery, starter and alternator' },
			{ slug: 'ignition', title: 'Ignition' }
		]
	},
	{
		id: 'ev-hybrid',
		group: 'car',
		name: 'EVs and hybrids',
		blurb: 'Electric motors, batteries, and engines that share the work.',
		planned: [
			{ slug: 'electric-motor', title: 'Electric motors' },
			{ slug: 'ev-battery', title: 'EV batteries' },
			{ slug: 'hybrids', title: 'Hybrids' }
		]
	},
	{
		id: 'clocks-watches',
		group: 'clocks',
		name: 'Clocks and watches',
		blurb: 'How a spring and a swinging wheel keep time.',
		planned: [
			{ slug: 'gear-train', title: 'The gear train' },
			{ slug: 'escapement', title: 'The escapement' },
			{ slug: 'mainspring', title: 'The mainspring' },
			{ slug: 'balance-wheel', title: 'The balance wheel' }
		]
	},
	{
		id: 'simple-machines',
		group: 'simple-machines',
		name: 'Simple machines',
		blurb: 'The six classic building blocks inside every machine.',
		// The series teaches them as two families (OpenStax Physics 9.3): the
		// wheel and axle is a form of lever, and the wedge and screw are
		// inclined planes.
		families: [
			{ name: 'Turn about a point', slugs: ['lever', 'wheel-and-axle', 'pulley'] },
			{ name: 'A slope', slugs: ['inclined-plane', 'wedge', 'screw'] }
		],
		planned: [
			{ slug: 'lever', title: 'The lever' },
			{ slug: 'wheel-and-axle', title: 'The wheel and axle' },
			{ slug: 'pulley', title: 'The pulley' },
			{ slug: 'inclined-plane', title: 'The inclined plane' },
			{ slug: 'wedge', title: 'The wedge' },
			{ slug: 'screw', title: 'The screw' }
		]
	},
	{
		id: 'mechanisms',
		group: 'mechanisms',
		name: 'Mechanisms',
		blurb: 'How motion is changed and passed on.',
		planned: [
			{ slug: 'crank-and-slider', title: 'Crank and slider' },
			{ slug: 'cam-and-follower', title: 'Cam and follower' },
			{ slug: 'belts-and-chains', title: 'Belts and chains' },
			{ slug: 'springs', title: 'Springs' },
			{ slug: 'linkages', title: 'Linkages' },
			{ slug: 'ratchet-and-pawl', title: 'Ratchet and pawl' }
		]
	}
];

/**
 * The mechanisms, each with the machines it's found in (plain labels: some,
 * like bicycles, have no section yet) and the page that explains it. Gears and
 * the escapement live in their machine's section; the rest in 'mechanisms'.
 */
export const MECHANISMS: {
	id: string;
	name: string;
	foundIn: string[];
	page: { section: string; slug: string };
}[] = [
	{
		id: 'gears',
		name: 'Gears and gear ratios',
		foundIn: ['Car', 'Clock', 'Bicycle'],
		page: { section: 'transmission', slug: 'gears' }
	},
	{
		id: 'crank-and-slider',
		name: 'Crank and slider',
		foundIn: ['Car', 'Pump'],
		page: { section: 'mechanisms', slug: 'crank-and-slider' }
	},
	{
		id: 'cam-and-follower',
		name: 'Cam and follower',
		foundIn: ['Car', 'Lock'],
		page: { section: 'mechanisms', slug: 'cam-and-follower' }
	},
	{
		id: 'belts-and-chains',
		name: 'Belts and chains',
		foundIn: ['Car', 'Bicycle'],
		page: { section: 'mechanisms', slug: 'belts-and-chains' }
	},
	{
		id: 'escapement',
		name: 'Escapement',
		foundIn: ['Clock'],
		page: { section: 'clocks-watches', slug: 'escapement' }
	},
	{
		id: 'springs',
		name: 'Springs',
		foundIn: ['Clock', 'Car'],
		page: { section: 'mechanisms', slug: 'springs' }
	},
	{
		id: 'linkages',
		name: 'Linkages',
		foundIn: ['Car', 'Door closer'],
		page: { section: 'mechanisms', slug: 'linkages' }
	},
	{
		id: 'ratchet-and-pawl',
		name: 'Ratchet and pawl',
		foundIn: ['Bicycle', 'Clock'],
		page: { section: 'mechanisms', slug: 'ratchet-and-pawl' }
	}
];

/** Merge the systems list with the lessons that actually exist. */
export function buildSystemIndex(systems: SystemDef[], lessons: LessonListing[]): SystemRow[] {
	const known = new Set(systems.map((s) => s.id));
	const stray = lessons.find((l) => !known.has(l.category));
	if (stray) {
		throw new Error(
			`Lesson "${stray.slug}" has category "${stray.category}", which isn't a system in SYSTEMS`
		);
	}

	return systems.map((system) => {
		// The plan sets the order; published lessons just fill their slots.
		const published = lessons.filter((l) => l.category === system.id);
		const bySlug = new Map(published.map((l) => [l.slug, l]));
		const href = (slug: string) => `/learn/${system.id}/${slug}`;

		// Every published lesson must be in the plan. Otherwise a slug typo would
		// show it twice: dimmed under its planned slug, and live under its file name.
		const plannedSlugs = new Set(system.planned.map((p) => p.slug));
		const unplanned = published.find((l) => !plannedSlugs.has(l.slug));
		if (unplanned) {
			throw new Error(
				`Lesson "${unplanned.slug}" isn't planned in the ${system.id} system; add it to SYSTEMS in systems.ts`
			);
		}

		const entries = system.planned.map((p) => {
			const lesson = bySlug.get(p.slug);
			return lesson
				? { slug: p.slug, title: lesson.title, href: href(lesson.slug), available: true }
				: { slug: p.slug, title: p.title, href: null, available: false };
		});
		return {
			id: system.id,
			group: system.group,
			name: system.name,
			blurb: system.blurb,
			available: entries.filter((l) => l.available).length,
			lessons: entries
		};
	});
}

/**
 * The plan in three numbers, for the spec plate under the homepage headline:
 * pages open now, systems in the plan, and planned pages still to come.
 * Counted from the same rows as "The whole car", so the two always agree.
 */
export function planTotals(rows: SystemRow[]): { open: number; systems: number; coming: number } {
	const open = rows.reduce((n, row) => n + row.available, 0);
	const planned = rows.reduce((n, row) => n + row.lessons.length, 0);
	return { open, systems: rows.length, coming: planned - open };
}

/**
 * The lessons that exist, as links named by their planned titles, in plan
 * order. Client-safe (no frontmatter needed), for places that can't load the
 * full listing, such as the error page.
 */
export function openPages(
	systems: SystemDef[],
	refs: { category: string; slug: string }[]
): { title: string; href: string }[] {
	return systems.flatMap((s) =>
		s.planned
			.filter((p) => refs.some((r) => r.category === s.id && r.slug === p.slug))
			.map((p) => ({ title: p.title, href: `/learn/${s.id}/${p.slug}` }))
	);
}

/**
 * A section page's pages, grouped: by the system's families if it has them,
 * in family order, otherwise as one unnamed list in plan order.
 */
export function sectionGroups(
	system: SystemDef,
	row: SystemRow
): { name: string | null; lessons: SystemRow['lessons'] }[] {
	if (!system.families) return [{ name: null, lessons: row.lessons }];
	const bySlug = new Map(row.lessons.map((l) => [l.slug, l]));
	return system.families.map((f) => ({
		name: f.name,
		lessons: f.slugs.map((s) => bySlug.get(s)!)
	}));
}

/** The systems that get a section page: those with at least one open lesson. */
export function sectionIds(rows: SystemRow[]): string[] {
	return rows.filter((r) => r.available > 0).map((r) => r.id);
}

/** A lesson's section, from its category: the system's name and its section page. */
export function sectionOf(category: string): { name: string; href: string } | null {
	const system = SYSTEMS.find((s) => s.id === category);
	return system ? { name: system.name, href: `/learn/${system.id}` } : null;
}
