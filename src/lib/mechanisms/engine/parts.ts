export type PartId =
	'piston' | 'rod' | 'crank' | 'intakeValve' | 'exhaustValve' | 'sparkPlug' | 'cylinder';

export interface Part {
	id: PartId;
	name: string;
	what: string;
}

export const PARTS: readonly Part[] = [
	{
		id: 'piston',
		name: 'Piston',
		what: 'Slides up and down in the cylinder. The burning fuel pushes it down, and that push is what moves the car.'
	},
	{
		id: 'rod',
		name: 'Connecting rod',
		what: 'Links the piston to the crankshaft. It turns the piston’s straight up-and-down motion into rotation.'
	},
	{
		id: 'crank',
		name: 'Crankshaft',
		what: 'The offset “handle” the rod pushes on, like pedals on a bike. It turns twice per full 4-stroke cycle.'
	},
	{
		id: 'intakeValve',
		name: 'Intake valve',
		what: 'Opens during the intake stroke to let air and fuel into the cylinder, then seals shut.'
	},
	{
		id: 'exhaustValve',
		name: 'Exhaust valve',
		what: 'Opens during the exhaust stroke so the rising piston can push burnt gas out.'
	},
	{
		id: 'sparkPlug',
		name: 'Spark plug',
		what: 'Fires a spark just before the piston reaches the top, igniting the squeezed mixture.'
	},
	{
		id: 'cylinder',
		name: 'Cylinder',
		what: 'The tube the piston travels in. Shown cut in half here so you can see inside.'
	}
];

/**
 * WebGL can't read CSS variables, so the 3D scene uses these. The parts'
 * own colours come from palette.ts (ADR 0015); these are the gas, the light
 * and the selection glow.
 */
export const COLORS = {
	// The spark plug's ceramic insulator
	plug: '#f4f1ec',

	// Gas, by what it's doing
	air: '#9fc3e6',
	flash: '#ffd27a',
	hot: '#ffa95c',
	hotDeep: '#e0552e',
	smoke: '#8a8f96',

	// Selection
	accent: '#ffb46e'
} as const;
