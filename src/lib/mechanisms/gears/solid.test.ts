import { describe, it, expect } from 'vitest';
import { pitchRadius } from './gears';
import { gearSolids } from './solid';

const M = 1;
const W = 6;

/** Rotate a flat triangle list (x, y, z, x, y, z, ...) about z. */
const turn = (tris: number[], a: number) => {
	const out: number[] = [];
	for (let i = 0; i < tris.length; i += 3) {
		const [x, y, z] = [tris[i], tris[i + 1], tris[i + 2]];
		out.push(x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a), z);
	}
	return out;
};

/**
 * Directed edges of a triangle list, with points welded by position. In a
 * closed surface with no faces inside it, every edge a→b appears exactly once,
 * and its reverse b→a exactly once (in the triangle on the other side).
 */
function edgeCounts(tris: number[]) {
	const key = (i: number) =>
		[tris[i], tris[i + 1], tris[i + 2]]
			.map((v) => (Math.abs(v) < 5e-7 ? 0 : v).toFixed(6))
			.join(',');
	const counts = new Map<string, number>();
	for (let t = 0; t < tris.length; t += 9) {
		const v = [key(t), key(t + 3), key(t + 6)];
		for (let e = 0; e < 3; e++) {
			const k = `${v[e]}>${v[(e + 1) % 3]}`;
			counts.set(k, (counts.get(k) ?? 0) + 1);
		}
	}
	return counts;
}

describe('gearSolids (a gear as a body plus one piece per tooth, with no faces inside)', () => {
	for (const z of [12, 30]) {
		const inner = pitchRadius(z, M) - 2 * M;
		const bore = Array.from({ length: 24 }, (_, i): [number, number] => [
			2 * Math.cos((2 * Math.PI * i) / 24),
			2 * Math.sin((2 * Math.PI * i) / 24)
		]);
		const { tooth, body } = gearSolids(z, M, inner, 4, [bore], W);
		const all = [...body];
		for (let k = 0; k < z; k++) all.push(...turn(tooth, (2 * Math.PI * k) / z));

		it(`${z} teeth: the pieces together are one closed surface, every edge used once each way`, () => {
			const counts = edgeCounts(all);
			const bad = [...counts].filter(([k, n]) => {
				const [a, b] = k.split('>');
				return n !== 1 || counts.get(`${b}>${a}`) !== 1;
			});
			expect(bad.length, `first bad edge: ${bad[0]?.[0]} ×${bad[0]?.[1]}`).toBe(0);
		});

		it(`${z} teeth: it is ${W} thick, centred on z = 0`, () => {
			const zs = all.filter((_, i) => i % 3 === 2);
			expect(Math.min(...zs)).toBeCloseTo(-W / 2, 9);
			expect(Math.max(...zs)).toBeCloseTo(W / 2, 9);
		});
	}
});
