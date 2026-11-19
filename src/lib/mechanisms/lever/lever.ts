/**
 * The lever, as pure functions (sources: OpenStax College Physics 2e, 9.5;
 * Boyce and Schoenfeld for the three classes). A lever is a rigid bar that
 * turns about a fixed point, the fulcrum. Its "arms" are the distances from the
 * fulcrum to where each force acts: the effort (your push) and the load.
 *
 * Lengths are in metres, forces in newtons, angles in degrees unless named.
 */

export type LeverClass = 1 | 2 | 3;

/**
 * The effort that balances a load. The bar is balanced when the turning
 * effects match: effort × effort arm = load × load arm (the law of the lever).
 */
export function effortFor(load: number, effortArm: number, loadArm: number): number {
	return (load * loadArm) / effortArm;
}

/**
 * Mechanical advantage: how many times the lever multiplies your force.
 * It equals effort arm ÷ load arm, and so load ÷ effort. Below 1, you push
 * harder than the load, but the load moves further and faster.
 */
export function advantage(effortArm: number, loadArm: number): number {
	return effortArm / loadArm;
}

/**
 * How far a point on the bar moves when the bar tilts by `tilt` radians: its
 * distance from the fulcrum times sin(tilt). The effort end and the load end
 * move in the ratio of their arms, which is why force × distance comes out
 * the same at both ends: a lever never makes work for free.
 */
export function endTravel(arm: number, tilt: number): number {
	return arm * Math.sin(tilt);
}

/**
 * Where the fulcrum, load and effort sit along the bar (fulcrum at 0) for a
 * class of lever. The class is named by what's in the middle:
 * 1st, the fulcrum (a seesaw); 2nd, the load (a wheelbarrow);
 * 3rd, the effort (your forearm in a biceps curl).
 */
export function layout(
	cls: LeverClass,
	effortArm: number,
	loadArm: number
): { fulcrum: number; load: number; effort: number } {
	// The effort is always on the left of the fulcrum in class 1, so pushing
	// down on the left lifts the load on the right.
	if (cls === 1) return { fulcrum: 0, effort: -effortArm, load: loadArm };
	// Classes 2 and 3 have both forces on one side; which is nearer the
	// fulcrum decides the class, so the arms must agree with it.
	if (cls === 2 ? effortArm <= loadArm : effortArm >= loadArm) {
		throw new Error(
			`A class ${cls} lever needs the ${cls === 2 ? 'load' : 'effort'} nearer the fulcrum (effort arm ${effortArm}, load arm ${loadArm})`
		);
	}
	return { fulcrum: 0, effort: effortArm, load: loadArm };
}

/**
 * The push through one step (360°): 0 at rest, rising smoothly to 1 (fully
 * pushed) at 180°, and back to rest at 360°.
 */
export function push(angle: number): number {
	return (1 - Math.cos((angle * Math.PI) / 180)) / 2;
}

/** The lever in each step of the lesson. */
export interface StepSetup {
	cls: LeverClass;
	effortArm: number;
	loadArm: number;
	/** The load's weight, in newtons. */
	load: number;
}

export const STEP_SETUPS: StepSetup[] = [
	// 1. A seesaw: equal arms, equal forces.
	{ cls: 1, effortArm: 1.5, loadArm: 1.5, load: 100 },
	// 2. Move the fulcrum towards the load: 100 N lifts 300 N.
	{ cls: 1, effortArm: 2.25, loadArm: 0.75, load: 300 },
	// 3. Same lever: your end travels three times as far.
	{ cls: 1, effortArm: 2.25, loadArm: 0.75, load: 300 },
	// 4. Second class: the load in the middle, like a wheelbarrow.
	{ cls: 2, effortArm: 3, loadArm: 1, load: 300 },
	// 5. Third class: the effort in the middle, like a forearm.
	{ cls: 3, effortArm: 1, loadArm: 3, load: 300 }
];

/** How far the bar tilts at full push, in radians (14°). */
export const MAX_TILT = (14 * Math.PI) / 180;

/** Degrees of the lesson's one value per step: one push. */
export const STEP_SPAN = 360;

/**
 * Everything the stage shows at the lesson's angle: which step, that step's
 * lever, how far it's tilted (radians, positive lifts the load), the forces in
 * newtons, the advantage, and how far each end has moved (metres).
 */
export function leverAt(angle: number) {
	const step = Math.min(STEP_SETUPS.length - 1, Math.max(0, Math.floor(angle / STEP_SPAN)));
	const setup = STEP_SETUPS[step];
	const tilt = MAX_TILT * push(angle - step * STEP_SPAN);
	return {
		step,
		...setup,
		tilt,
		effort: effortFor(setup.load, setup.effortArm, setup.loadArm),
		advantage: advantage(setup.effortArm, setup.loadArm),
		effortMoved: endTravel(setup.effortArm, tilt),
		loadMoved: endTravel(setup.loadArm, tilt)
	};
}

const FRACTIONS: Record<number, string> = { 2: '½', 3: '⅓', 4: '¼', 5: '⅕' };

/** An advantage as people read it: 3×, 2.5×, or ⅓× when it's below 1. */
export function formatAdvantage(a: number): string {
	if (a < 1) {
		const d = Math.round(1 / a);
		if (Math.abs(1 / d - a) < 1e-9 && FRACTIONS[d]) return `${FRACTIONS[d]}×`;
	}
	return `${Number.isInteger(a) ? a : Number(a.toFixed(1))}×`;
}
