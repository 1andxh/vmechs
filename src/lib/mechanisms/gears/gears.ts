/**
 * Spur gear geometry and meshing, as pure functions. Lengths are in any unit;
 * `m` (the module) sets the tooth size: a gear with z teeth has a pitch circle
 * of radius m·z/2, the circle along which two meshing gears roll on each
 * other without slipping.
 *
 * Teeth follow the standard involute profile, 20° pressure angle: the curve
 * traced by the end of a taut string unwound from the "base circle". Two
 * involute teeth stay in rolling contact at a constant speed ratio, which is
 * why real gears use it. Angles are in radians; tooth 0 is centred on +x.
 */

type P = [number, number];

const PRESSURE = (20 * Math.PI) / 180;
const ADDENDUM = 1; // tip sits one module beyond the pitch circle
const DEDENDUM = 1.25; // root sits 1.25 modules inside it
const BACKLASH = 0.04; // teeth a little thinner than ideal, so they never bind

/** Pitch radius of a gear with z teeth of module m. */
export function pitchRadius(z: number, m: number): number {
	return (m * z) / 2;
}

/** How far apart two meshing gears' centres sit. */
export function centreDistance(z1: number, z2: number, m: number): number {
	return pitchRadius(z1, m) + pitchRadius(z2, m);
}

/**
 * The gear ratio: how many times the driven gear (z2) multiplies the driver's
 * (z1) torque, and divides its speed. 2.5 means 2.5× the torque at 1/2.5 the speed.
 */
export function ratio(z1: number, z2: number): number {
	return z2 / z1;
}

/**
 * Angle of the driven gear (z2) when the driver (z1) is at angle t, with the
 * driven gear's centre in direction `dir` from the driver's. It turns the
 * other way, at z1/z2 of the speed, phased so that the driver's teeth sit in
 * its gaps: at t = dir the driver points a tooth straight at it, so it must
 * point a gap (half a tooth pitch off a tooth) straight back.
 */
export function meshAngle(t: number, z1: number, z2: number, dir: number): number {
	return dir + Math.PI - Math.PI / z2 - (t - dir) * (z1 / z2);
}

/** inv(α) = tan α − α: how far an involute has turned by the time it reaches pressure angle α. */
const inv = (a: number) => Math.tan(a) - a;

/**
 * The gear's outline as a closed polygon, counter-clockwise, centred on the
 * origin. `steps` sets how finely each flank is drawn.
 */
export function gearOutline(z: number, m: number, steps = 10): P[] {
	const r = pitchRadius(z, m);
	const rb = r * Math.cos(PRESSURE); // base circle: where the involute starts
	const ra = r + ADDENDUM * m; // tip
	const rf = r - DEDENDUM * m; // root
	const halfTooth = (Math.PI * m - BACKLASH * m) / 2 / r / 2; // half the tooth's angle at the pitch circle
	const flank0 = halfTooth + inv(PRESSURE); // a flank's polar angle where it leaves the base circle

	// One flank, from the root up to the tip: [radius, angle back from flank0].
	const tTip = Math.sqrt((ra / rb) ** 2 - 1);
	const tStart = rf > rb ? Math.sqrt((rf / rb) ** 2 - 1) : 0;
	const flank: [number, number][] = [];
	if (rf < rb) flank.push([rf, 0]); // radial below the base circle
	for (let k = 0; k <= steps; k++) {
		const t = tStart + ((tTip - tStart) * k) / steps;
		flank.push([rb * Math.sqrt(1 + t * t), t - Math.atan(t)]);
	}

	const pts: P[] = [];
	const at = (radius: number, angle: number) =>
		pts.push([radius * Math.cos(angle), radius * Math.sin(angle)]);
	const tipHalf = flank0 - flank[flank.length - 1][1];
	for (let k = 0; k < z; k++) {
		const c = (2 * Math.PI * k) / z;
		// rising flank (the tooth's clockwise side), root to tip
		for (const [radius, back] of flank) at(radius, c - flank0 + back);
		// across the tip
		for (let s = 1; s < 4; s++) at(ra, c - tipHalf + (2 * tipHalf * s) / 4);
		// falling flank, tip to root
		for (let i = flank.length - 1; i >= 0; i--) at(flank[i][0], c + flank0 - flank[i][1]);
		// along the root to the next tooth
		const from = c + flank0;
		const to = c + (2 * Math.PI) / z - flank0;
		for (let s = 1; s < 6; s++) at(rf, from + ((to - from) * s) / 6);
	}
	return pts;
}
