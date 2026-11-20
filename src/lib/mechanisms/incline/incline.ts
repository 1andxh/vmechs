/**
 * The inclined plane, as pure functions (sources: OpenStax College Physics 2e
 * 9.5: pushing a cart up a plane takes less force than lifting it, and with
 * negligible friction the work is the same; OpenStax Physics 9.3: IMA = effort
 * distance ÷ load distance; OpenStax College Physics 2e 5.1: kinetic friction
 * = μk × the normal force, which on a slope is the weight × cos θ, with
 * μk = 0.3 for wood on wood).
 *
 * The block is pushed steadily up the slope, parallel to it. Pushed a
 * distance d along a slope of length L and height h, it rises d × h ÷ L, so
 * the ideal advantage (effort distance ÷ load distance) is L ÷ h.
 *
 * Lengths are in metres (the slope's length, not its horizontal run), forces
 * in newtons.
 */
import { push } from '../lever/lever.ts';

/** Kinetic friction between wood and wood (College Physics 2e, Table 5.1). */
export const WOOD_ON_WOOD = 0.3;

/** cos θ for a slope of `length` rising `height`: the horizontal run ÷ the length. */
function cosOf(length: number, height: number): number {
	return Math.sqrt(length * length - height * height) / length;
}

/** Friction down the slope on a load sliding up it: μ × the part of its weight pressing into the slope. */
export function frictionFor(load: number, length: number, height: number, mu: number): number {
	return mu * load * cosOf(length, height);
}

/**
 * The steady push, along the slope, that moves a load up it: the part of its
 * weight that pulls it back down the slope (load × height ÷ length), plus
 * friction if there is any.
 */
export function effortFor(load: number, length: number, height: number, mu = 0): number {
	return (load * height) / length + frictionFor(load, length, height, mu);
}

/** The ideal mechanical advantage: the slope's length ÷ its height. */
export function advantage(length: number, height: number): number {
	return length / height;
}

/** The ramp in each step of the lesson. */
export interface StepSetup {
	/** The slope's length. */
	length: number;
	/** The height it climbs. */
	height: number;
	/** The load's weight, in newtons. */
	load: number;
	/** The coefficient of kinetic friction between block and ramp (0: none). */
	mu: number;
}

export const STEP_SETUPS: StepSetup[] = [
	// 1. A slope instead of a lift: 200 N pushes 300 N up a 1.5 m ramp.
	{ length: 1.5, height: 1, load: 300, mu: 0 },
	// 2. Three times as long as it is high: 100 N.
	{ length: 3, height: 1, load: 300, mu: 0 },
	// 3. The trade: three metres of pushing for one metre of height.
	{ length: 3, height: 1, load: 300, mu: 0 },
	// 4. Twice as long again: 50 N.
	{ length: 6, height: 1, load: 300, mu: 0 },
	// 5. A wooden block on a wooden ramp: friction adds about 85 N.
	{ length: 3, height: 1, load: 300, mu: WOOD_ON_WOOD }
];

/** How far along the slope the block is pushed at full push, as a share of its length. */
export const MAX_TRAVEL = 0.6;

/** Degrees of the lesson's one value per step: one push. */
export const STEP_SPAN = 360;

/**
 * Everything the stage shows at the lesson's angle: which step, that step's
 * ramp, the push and friction, the advantage the forces show (load ÷ push)
 * and the ideal one, and how far the block has been pushed along the slope
 * and how far it has risen.
 */
export function inclineAt(angle: number) {
	const step = Math.min(STEP_SETUPS.length - 1, Math.max(0, Math.floor(angle / STEP_SPAN)));
	const setup = STEP_SETUPS[step];
	const along = MAX_TRAVEL * setup.length * push(angle - step * STEP_SPAN);
	const effort = effortFor(setup.load, setup.length, setup.height, setup.mu);
	return {
		step,
		...setup,
		effort,
		friction: frictionFor(setup.load, setup.length, setup.height, setup.mu),
		advantage: setup.load / effort,
		ideal: advantage(setup.length, setup.height),
		effortMoved: along,
		loadMoved: (along * setup.height) / setup.length
	};
}
