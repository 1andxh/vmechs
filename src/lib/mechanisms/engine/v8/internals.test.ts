import { describe, it, expect } from 'vitest';
import { ENGINE } from '../kinematics';
import { BANKS, DECK, cylZ } from './frame';
import { CYLINDERS } from './kinematics';
import {
	BORE,
	PISTON,
	SLAB_BASE,
	SLAB_LENGTH,
	crankPin,
	crankSpin,
	pistonCrown,
	rodTurn,
	sectionZ,
	wristPin
} from './internals';

const ANGLES = Array.from({ length: 73 }, (_, i) => i * 10); // 0..720 in 10° steps
const bankOf = (n: number) => BANKS.find((b) => b.name === CYLINDERS.find((c) => c.n === n)!.bank)!;
const throwOf = (n: number) => CYLINDERS.find((c) => c.n === n)!.index;
const dist = (a: number[], b: number[]) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);

describe('where the moving parts are drawn', () => {
	it('connects every rod: crank pin to wrist pin is always one rod length', () => {
		for (const crank of ANGLES) {
			for (const c of CYLINDERS) {
				const pin = crankPin(c.index, crank, cylZ(bankOf(c.n), c.index));
				expect(dist(pin, wristPin(c.n, crank))).toBeCloseTo(ENGINE.rodLength, 9);
			}
		}
	});

	it('turns the whole crankshaft as one piece: spinning it moves each pin to where the kinematics put it', () => {
		for (const crank of ANGLES) {
			const a = crankSpin(crank);
			for (const j of [0, 1, 2, 3]) {
				const [x, y] = crankPin(j, 0, 0);
				const turned = [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
				const [tx, ty] = crankPin(j, crank, 0);
				expect(turned[0]).toBeCloseTo(tx, 9);
				expect(turned[1]).toBeCloseTo(ty, 9);
			}
		}
	});

	it('points each rod from its crank pin to its wrist pin', () => {
		for (const crank of ANGLES) {
			for (const c of CYLINDERS) {
				const pin = crankPin(c.index, crank, 0);
				const wrist = wristPin(c.n, crank);
				const t = rodTurn(c.n, crank);
				// the rod is drawn pointing up (+y), length l, then turned by t about z
				const l = ENGINE.rodLength;
				expect(pin[0] - l * Math.sin(t)).toBeCloseTo(wrist[0], 9);
				expect(pin[1] + l * Math.cos(t)).toBeCloseTo(wrist[1], 9);
			}
		}
	});

	it('keeps every wrist pin on its own bore axis, at its own cylinder', () => {
		for (const crank of ANGLES) {
			for (const c of CYLINDERS) {
				const b = bankOf(c.n);
				const [x, y, z] = wristPin(c.n, crank);
				// on the axis: the bank's direction is (sgn·√½, √½), so x = sgn·y
				expect(x).toBeCloseTo(b.sgn * y, 9);
				expect(z).toBeCloseTo(cylZ(b, throwOf(c.n)), 9);
			}
		}
	});

	it('keeps every piston inside its bore: crown below the deck, skirt above the slab base', () => {
		for (const crank of ANGLES) {
			for (const c of CYLINDERS) {
				const crown = pistonCrown(c.n, crank);
				expect(crown).toBeLessThan(DECK);
				expect(crown - PISTON.height).toBeGreaterThan(SLAB_BASE);
			}
		}
		expect(PISTON.radius).toBeLessThan(BORE.radius);
	});
});

describe('sectionZ (where the section plane cuts the block)', () => {
	it('cuts nothing while the heads are on: the plane is in front of the block', () => {
		const blockFront = Math.min(...BANKS.map((b) => b.dz - SLAB_LENGTH / 2));
		expect(sectionZ(0)).toBeLessThan(blockFront);
	});

	it('cuts open both front bores (cylinders 1 and 2) once the heads are off', () => {
		for (const b of BANKS) expect(Math.abs(sectionZ(1) - cylZ(b, 0))).toBeLessThan(BORE.radius);
	});
});
