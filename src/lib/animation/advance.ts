export interface AdvanceInput {
	/** Current driving angle, in [0, period). */
	angle: number;
	/** Seconds since the last frame. */
	dt: number;
	degPerSec: number;
	/** Length of one full cycle (720 for a 4-stroke). */
	period: number;
	/** If set, stop when the angle reaches this value (end of a step's range). */
	stopAt?: number;
}

/**
 * How far below `stopAt` we park. Ranges are half-open [from, to), so parking
 * exactly on `to` would make the *next* step active (e.g. strokeAt(180) is
 * compression, not intake). 1e-6° is invisible but keeps us inside the range.
 */
const PARK = 1e-6;

/** One animation frame of the driving angle. Pure, so it's testable without rAF. */
export function advance({ angle, dt, degPerSec, period, stopAt }: AdvanceInput): {
	angle: number;
	stopped: boolean;
} {
	const next = angle + degPerSec * dt;
	if (stopAt !== undefined && angle < stopAt && next >= stopAt) {
		return { angle: stopAt - PARK, stopped: true };
	}
	return { angle: next % period, stopped: false };
}
