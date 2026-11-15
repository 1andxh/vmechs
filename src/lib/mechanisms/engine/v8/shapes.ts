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
	ExtrudeGeometry,
	LatheGeometry,
	Quaternion,
	Shape,
	TorusGeometry,
	Vector2,
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
			keep(new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 2, h / 2, d / 2))),
		cyl: (rTop: number, rBottom: number, h: number, seg = 40, open = false) =>
			keep(new CylinderGeometry(rTop, rBottom, h, seg, 1, open)),
		// Thin rings (grooves, clamps, lips) show as lines, not as round tubes:
		// far fewer segments around and along them are indistinguishable.
		torus: (r: number, tube: number, seg = 44) =>
			keep(
				tube < 0.1
					? new TorusGeometry(r, tube, 6, Math.min(seg, 36))
					: new TorusGeometry(r, tube, 14, seg)
			),
		tube: (points: V3[], radius: number, closed = false, sides = 10) =>
			keep(new TubeGeometry(curve(points, closed), closed ? 120 : 40, radius, sides, closed)),
		/** A flat outline (x, y) pushed along z, from z0 to z0 + depth: a closed solid. */
		prism: (outline: Shape | [number, number][], depth: number, z0 = 0) => {
			const shape = Array.isArray(outline)
				? new Shape(outline.map(([x, y]) => new Vector2(x, y)))
				: outline;
			const g = new ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 32 });
			return keep(g.translate(0, 0, z0));
		},
		/**
		 * A flat band along a closed path in the xy plane, like a belt:
		 * `thickness` across the path (in the plane), `width` along z.
		 */
		band: (points: V3[], thickness: number, width: number, steps = 600) =>
			keep(
				new ExtrudeGeometry(
					new Shape([
						new Vector2(-thickness / 2, -width / 2),
						new Vector2(thickness / 2, -width / 2),
						new Vector2(thickness / 2, width / 2),
						new Vector2(-thickness / 2, width / 2)
					]),
					{ steps, bevelEnabled: false, extrudePath: curve(points, true) }
				)
			),
		/** A turned part: a profile of (radius, height) points spun about y. */
		lathe: (profile: [number, number][], seg = 40) =>
			keep(
				new LatheGeometry(
					profile.map(([r, y]) => new Vector2(r, y)),
					seg
				)
			),
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
