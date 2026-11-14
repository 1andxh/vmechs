/**
 * The car's systems, in the order the homepage lists them, each with its
 * planned lessons in teaching order (see docs/ROADMAP.md). A planned lesson
 * becomes a link as soon as a lesson file with that category and slug exists.
 * Every lesson file must be planned here; buildSystemIndex throws otherwise.
 */

export interface SystemDef {
	/** Matches a lesson's `category` and its folder under src/content/articles/. */
	id: string;
	name: string;
	blurb: string;
	/** Future lessons, by the slug their file will have. */
	planned: { slug: string; title: string }[];
}

export interface LessonListing {
	category: string;
	slug: string;
	title: string;
	order: number;
}

export interface SystemRow {
	id: string;
	name: string;
	blurb: string;
	/** How many of this system's lessons are published. */
	available: number;
	lessons: { title: string; href: string | null; available: boolean }[];
}

export const SYSTEMS: SystemDef[] = [
	{
		id: 'engine',
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
		name: 'Brakes',
		blurb: 'Slows and stops the car.',
		planned: [
			{ slug: 'hydraulic-brakes', title: 'Hydraulic brakes' },
			{ slug: 'abs', title: 'Anti-lock brakes (ABS)' }
		]
	},
	{
		id: 'suspension-steering',
		name: 'Suspension and steering',
		blurb: 'Keeps the tyres on the road and pointed where you want.',
		planned: [
			{ slug: 'suspension', title: 'Suspension' },
			{ slug: 'steering', title: 'Steering' }
		]
	},
	{
		id: 'electrical',
		name: 'Electrical',
		blurb: 'Starts the engine and powers everything else.',
		planned: [
			{ slug: 'battery-starter-alternator', title: 'Battery, starter and alternator' },
			{ slug: 'ignition', title: 'Ignition' }
		]
	},
	{
		id: 'ev-hybrid',
		name: 'EVs and hybrids',
		blurb: 'Electric motors, batteries, and engines that share the work.',
		planned: [
			{ slug: 'electric-motor', title: 'Electric motors' },
			{ slug: 'ev-battery', title: 'EV batteries' },
			{ slug: 'hybrids', title: 'Hybrids' }
		]
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
				? { title: lesson.title, href: href(lesson.slug), available: true }
				: { title: p.title, href: null, available: false };
		});
		return {
			id: system.id,
			name: system.name,
			blurb: system.blurb,
			available: entries.filter((l) => l.available).length,
			lessons: entries
		};
	});
}
