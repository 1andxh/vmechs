/**
 * Where a perspective camera stands so that a box of half-size `half` around
 * `target` fits the view, looking along `dir` (any length; only its angle
 * matters). On a wide screen the height decides; on a narrow one, the width.
 * Used by the simple machines' scenes (Studio.svelte).
 */
export type V3 = [number, number, number];

export function fitCamera(
	target: V3,
	dir: V3,
	half: { w: number; h: number },
	aspect: number,
	fov: number
): V3 {
	const t = Math.tan(((fov / 2) * Math.PI) / 180);
	const dist = Math.max(half.w / (t * aspect), half.h / t);
	const len = Math.hypot(dir[0], dir[1], dir[2]);
	return [
		target[0] + (dir[0] / len) * dist,
		target[1] + (dir[1] / len) * dist,
		target[2] + (dir[2] / len) * dist
	];
}
