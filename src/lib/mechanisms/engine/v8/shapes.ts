/**
 * Geometry makers for the V8's parts. Each component calls makeShapes() once,
 * builds its geometry with it, and calls dispose() when it's destroyed, so
 * GPU memory is released when the homepage is left.
 */
import {
	BufferGeometry,
	CatmullRomCurve3,
	CylinderGeometry,
	Euler,
	Quaternion,
	TorusGeometry,
	TubeGeometry,
	Vector3
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { V3 } from './frame.ts';

export function makeShapes() {
	const made: BufferGeometry[] = [];
	const keep = <G extends BufferGeometry>(g: G) => (made.push(g), g);

	return {
		box: (w: number, h: number, d: number, r = 0.18) =>
			keep(new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2, h / 2, d / 2))),
		cyl: (rTop: number, rBottom: number, h: number, seg = 40) =>
			keep(new CylinderGeometry(rTop, rBottom, h, seg)),
		torus: (r: number, tube: number, seg = 44) => keep(new TorusGeometry(r, tube, 14, seg)),
		tube: (points: V3[], radius: number, closed = false) =>
			keep(new TubeGeometry(curve(points, closed), closed ? 120 : 40, radius, 10, closed)),
		dispose: () => made.forEach((g) => g.dispose())
	};
}

export const curve = (points: V3[], closed = false) =>
	new CatmullRomCurve3(
		points.map((p) => new Vector3(...p)),
		closed
	);

/**
 * Position and rotation for a ring (a torus, which lies in its XY plane) that
 * wraps a pipe at fraction `u` along it: a hose clamp, a flange.
 */
export function ringOn(points: V3[], u: number): { position: V3; rotation: V3 } {
	const c = curve(points);
	const p = c.getPointAt(u);
	const t = c.getTangentAt(u);
	const q = new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), t);
	const e = new Euler().setFromQuaternion(q);
	return { position: [p.x, p.y, p.z], rotation: [e.x, e.y, e.z] };
}
