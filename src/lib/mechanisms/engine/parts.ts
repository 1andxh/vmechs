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
 * WebGL can't read CSS variables, so the 3D scene uses these.
 * Keep `accent`, `hot` and `hotDeep` in sync with app.css.
 */
export const COLORS = {
	// Materials
	block: '#3a3633', // cast-iron block, dark warm grey
	head: '#2c2927',
	alu: '#c9ccd0', // piston
	steel: '#9da1a6', // valves, pins, main journal
	darkSteel: '#4a4d52', // rod, crank webs
	port: '#1c1a19',
	plug: '#e8e2d8', // spark-plug insulator

	// Light
	key: '#fff0dc', // the spotlight
	rim: '#ffd9b0', // back light that outlines the silhouette

	// Gas, by what it's doing
	air: '#b9c6d3',
	flash: '#fff2d6',
	hot: '#ffb46e',
	hotDeep: '#e0552e',
	smoke: '#6f6a66',

	// Selection
	accent: '#ffb46e'
} as const;
