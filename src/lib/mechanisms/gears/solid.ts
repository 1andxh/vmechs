/**
 * The gear pieces from pieces.ts as solids: flat triangle lists
 * (x, y, z, x, y, z, ...), face width `w`, centred on z = 0.
 *
 * Each piece gets a top and a bottom face, but side walls only where the
 * gear really has a surface: the tooth profile, the bore and the holes. The
 * cuts between the pieces get no walls. A wall there would sit inside the
 * gear with its edges exactly on the visible faces; where two surfaces share
 * a depth it wins some pixels, and its sideways normal shows as a dark seam
 * (or, drawn in ink, a line). Without them, the pieces together are
 * one closed surface, as if the gear were never cut.
 */
import { ShapeUtils, Vector2 } from 'three';
import { bodyCircle, toothPiece } from './pieces.ts';

type P = [number, number];

const area = (loop: P[]) =>
	loop.reduce((s, [x, y], i) => {
		const [u, v] = loop[(i + 1) % loop.length];
		return s + (x * v - u * y) / 2;
	}, 0);

/**
 * A flat shape extruded to thickness w. `walled(i)` says whether the outer
 * edge from point i to i + 1 gets a side wall; hole edges always do.
 */
function prism(contour: P[], holes: P[][], w: number, walled: (i: number) => boolean): number[] {
	const out: number[] = [];
	const top = w / 2;
	// Outer loop anticlockwise and holes clockwise, so every wall faces out of the solid.
	const outer = area(contour) > 0 ? contour : [...contour].reverse();
	const inside = holes.map((h) => (area(h) < 0 ? h : [...h].reverse()));

	const v = (p: P) => new Vector2(p[0], p[1]);
	const pts = [outer, ...inside].flat();
	for (const face of ShapeUtils.triangulateShape(
		outer.map(v),
		inside.map((h) => h.map(v))
	)) {
		let [p, q, r] = face.map((i) => pts[i]);
		if (area([p, q, r]) < 0) [q, r] = [r, q]; // anticlockwise seen from above
		out.push(...p, top, ...q, top, ...r, top); // top face, facing +z
		out.push(...p, -top, ...r, -top, ...q, -top); // bottom face, facing −z
	}

	const wall = (p: P, q: P) =>
		out.push(...p, -top, ...q, -top, ...q, top, ...p, -top, ...q, top, ...p, top);
	outer.forEach((p, i) => walled(i) && wall(p, outer[(i + 1) % outer.length]));
	for (const h of inside) h.forEach((p, i) => wall(p, h[(i + 1) % h.length]));
	return out;
}

/**
 * Tooth 0's piece and the body (with `holes`, given as point loops) of a gear
 * with z teeth. The tooth piece is used for every tooth, rotated by 2π/z each.
 */
export function gearSolids(
	z: number,
	m: number,
	inner: number,
	arcSteps: number,
	holes: P[][],
	w: number
): { tooth: number[]; body: number[] } {
	const piece = toothPiece(z, m, inner, arcSteps);
	// toothPiece is the tooth's profile, then arcSteps + 1 points back along the
	// cut; only the profile's own edges are real surface.
	const profileEdges = piece.length - (arcSteps + 1) - 1;
	return {
		tooth: prism(piece, [], w, (i) => i < profileEdges),
		body: prism(bodyCircle(z, inner, arcSteps), holes, w, () => false)
	};
}
