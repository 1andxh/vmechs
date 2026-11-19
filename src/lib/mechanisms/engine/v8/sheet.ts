/**
 * The homepage drawing sheet (ADR 0012): the running V8 from one fixed view,
 * and a list of its parts, each leading to the page that has, or will have,
 * it. Each part has its own colour (ADR 0015) and the block is drawn cut open;
 * pointing at a part keeps it in colour and turns the rest warm grey.
 */
import type { V3 } from './frame.ts';
import type { PartColour } from '../../palette.ts';

/** The groups of parts the scene can draw in the accent ink. */
export type Part = 'internals' | 'heads' | 'turbos' | 'front' | 'intake';

export interface SheetPart {
	n: number;
	part: Part;
	/** The part, as the parts list names it. */
	name: string;
	/** The engine page it leads to, a slug planned in SYSTEMS. */
	slug: string;
	/** Its colour on the drawing and in the list (ADR 0015). */
	colour: PartColour;
}

export const PARTS: SheetPart[] = [
	{
		n: 1,
		part: 'internals',
		name: 'Pistons and crankshaft',
		slug: 'four-stroke-cycle',
		colour: 'green'
	},
	{ n: 2, part: 'heads', name: 'Cylinder heads', slug: 'valvetrain', colour: 'slate' },
	{ n: 3, part: 'turbos', name: 'Turbocharger', slug: 'turbocharger', colour: 'red' },
	{
		n: 4,
		part: 'front',
		name: 'Belt drive and water pump',
		slug: 'cooling-lubrication',
		colour: 'gold'
	},
	{ n: 5, part: 'intake', name: 'Two banks of four', slug: 'engine-layouts', colour: 'blue' }
];

/** The one view: the whole engine from the front left, its near bank and belt drive in sight. */
export const VIEW: { eye: V3; look: V3 } = { eye: [-21, 15, -25], look: [0, 1.6, 0.5] };

/** What the homepage and the drawing share. */
export interface SheetState {
	/** The engine turns over (on screen, motion allowed). */
	running: boolean;
	/** The part drawn in the accent ink: the line in the parts list being pointed at. */
	active: Part | null;
	/** The first frame is on screen (tests wait for it before clicking). */
	drawn: boolean;
}
