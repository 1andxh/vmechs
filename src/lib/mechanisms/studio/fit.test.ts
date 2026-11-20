import { describe, it, expect } from 'vitest';
import { fitCamera } from './fit';

const half = (fov: number) => Math.tan(((fov / 2) * Math.PI) / 180);

describe('fitCamera: where the camera stands so a box of the given half-size fits the view', () => {
	it('stands back along the viewing direction from the target', () => {
		const [x, y, z] = fitCamera([0, 0, 0], [0, 0, 1], { w: 1, h: 1 }, 1, 30);
		expect(x).toBeCloseTo(0);
		expect(y).toBeCloseTo(0);
		expect(z).toBeCloseTo(1 / half(30));
	});

	it('is fitted by height on a wide screen and by width on a narrow one', () => {
		const wide = fitCamera([0, 0, 0], [0, 0, 1], { w: 1, h: 1.5 }, 2, 30)[2];
		expect(wide).toBeCloseTo(1.5 / half(30)); // height decides
		const narrow = fitCamera([0, 0, 0], [0, 0, 1], { w: 1, h: 1.5 }, 0.5, 30)[2];
		expect(narrow).toBeCloseTo(1 / (half(30) * 0.5)); // width decides
	});

	it('normalises the direction, so only its angle matters', () => {
		const a = fitCamera([1, 2, 3], [0.3, 0.18, 1], { w: 1, h: 1.7 }, 1.4, 30);
		const b = fitCamera([1, 2, 3], [0.6, 0.36, 2], { w: 1, h: 1.7 }, 1.4, 30);
		a.forEach((v, i) => expect(v).toBeCloseTo(b[i], 12));
	});
});
