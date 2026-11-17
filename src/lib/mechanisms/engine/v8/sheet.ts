/**
 * The homepage drawing sheet (ADR 0012): the running V8 from one fixed view,
 * and a list of its parts, each leading to the page that has, or will have,
 * it. Pointing at a part in the list draws it in the accent ink; pistons and crankshaft also cut the block open to show them.
 */
import type { V3 } from './frame.ts';

/** The groups of parts the scene can draw in the accent ink. */
export type Part = 'internals' | 'heads' | 'turbos' | 'front' | 'intake';

export interface SheetPart {
	n: number;
	part: Part;
	/** The part, as the parts list names it. */
	name: string;
	/** The engine page it leads to, a slug planned in SYSTEMS. */
	slug: string;
}

export const PARTS: SheetPart[] = [
	{ n: 1, part: 'internals', name: 'Pistons and crankshaft', slug: 'four-stroke-cycle' },
	{ n: 2, part: 'heads', name: 'Cylinder heads', slug: 'valvetrain' },
	{ n: 3, part: 'turbos', name: 'Turbocharger', slug: 'turbocharger' },
	{ n: 4, part: 'front', name: 'Belt drive and water pump', slug: 'cooling-lubrication' },
	{ n: 5, part: 'intake', name: 'Two banks of four', slug: 'engine-layouts' }
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
