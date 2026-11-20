/**
 * The wheel and axle, as pure functions (sources: OpenStax Physics 9.3, which
 * calls it "a form of lever" with IMA = wheel radius ÷ axle radius; OpenStax
 * College Physics 2e 9.5, where an axle driving a larger wheel has an
 * advantage below 1). A big wheel and a thin axle are fixed together and turn
 * about one centre, the fulcrum; their radii are the two arms.
 *
 * In the lesson, a rope hangs from the left of the wheel and another from the
 * right of the axle. Pulling one turns both, winding the other up.
 *
 * Lengths are in metres, forces in newtons, angles in radians unless named.
 */
import { push } from '../lever/lever.ts';

/** The effort that balances a load: effort × effort radius = load × load radius. */
export function effortFor(load: number, effortRadius: number, loadRadius: number): number {
	return (load * loadRadius) / effortRadius;
}

/**
 * The ideal mechanical advantage: the radius you pull at ÷ the radius the load
 * hangs from. Turn the wheel to lift with the axle and it's above 1; drive the
 * axle to move the wheel and it's below 1.
 */
export function advantage(effortRadius: number, loadRadius: number): number {
	return effortRadius / loadRadius;
}

/**
 * How much rope a drum of `radius` pays out or winds in as it turns by `turn`:
 * the arc, radius × angle. Wheel and axle turn by the same angle, so their
 * ropes move in the ratio of their radii.
 */
export function ropeTravel(radius: number, turn: number): number {
	return radius * turn;
}

/** The wheel and axle in each step of the lesson. */
export interface StepSetup {
	/** The wheel's radius. */
	wheel: number;
	/** The axle's radius. */
	axle: number;
	/** The load's weight, in newtons. */
	load: number;
	/** Which one you pull on: the wheel (to lift with the axle) or the axle. */
	driven: 'wheel' | 'axle';
}

export const STEP_SETUPS: StepSetup[] = [
	// 1. The machine: a wheel three times the axle's radius.
	{ wheel: 0.3, axle: 0.1, load: 300, driven: 'wheel' },
	// 2. Its advantage: 100 N on the wheel lifts 300 N on the axle.
	{ wheel: 0.3, axle: 0.1, load: 300, driven: 'wheel' },
	// 3. The trade: your rope moves three times as far as the load.
	{ wheel: 0.3, axle: 0.1, load: 300, driven: 'wheel' },
	// 4. A wheel twice as big: the same load needs half the pull.
	{ wheel: 0.6, axle: 0.1, load: 300, driven: 'wheel' },
	// 5. Drive the axle: 300 N on the axle lifts 100 N on the rim, three times as far.
	{ wheel: 0.3, axle: 0.1, load: 100, driven: 'axle' }
];

/** How far the wheel turns at full pull: a quarter turn. */
export const MAX_TURN = Math.PI / 2;

/** Degrees of the lesson's one value per step: one pull. */
export const STEP_SPAN = 360;

/**
 * Everything the stage shows at the lesson's angle: which step, that step's
 * wheel and axle, how far it has turned (`turn`, always positive) and which
 * way (`spin`: positive is anticlockwise as you look at it, which is how a
 * pull on the wheel's left-hand rope turns it), the forces, the advantage, and
 * how far each rope has moved.
 */
export function wheelAxleAt(angle: number) {
	const step = Math.min(STEP_SETUPS.length - 1, Math.max(0, Math.floor(angle / STEP_SPAN)));
	const setup = STEP_SETUPS[step];
	const turn = MAX_TURN * push(angle - step * STEP_SPAN);
	const [effortArm, loadArm] =
		setup.driven === 'wheel' ? [setup.wheel, setup.axle] : [setup.axle, setup.wheel];
	return {
		step,
		...setup,
		turn,
		spin: setup.driven === 'wheel' ? turn : -turn,
		effortArm,
		loadArm,
		effort: effortFor(setup.load, effortArm, loadArm),
		advantage: advantage(effortArm, loadArm),
		effortMoved: ropeTravel(effortArm, turn),
		loadMoved: ropeTravel(loadArm, turn)
	};
}
