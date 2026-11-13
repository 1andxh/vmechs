import { describe, it, expect } from 'vitest';
import { activeStepIndex, parseEmphasis, stepProgress, type StepMeta } from './steps';

const steps: StepMeta[] = [
	{ title: 'Intake', from: 0, to: 180, subtitle: '' },
	{ title: 'Compression', from: 180, to: 360, subtitle: '' },
	{ title: 'Power', from: 360, to: 540, subtitle: '' },
	{ title: 'Exhaust', from: 540, to: 720, subtitle: '' }
];

describe('parseEmphasis (*word* marks the highlighted word in a subtitle)', () => {
	it('splits text around one highlighted word', () => {
		expect(parseEmphasis('drives the *piston* down.')).toEqual([
			{ text: 'drives the ', hl: false },
			{ text: 'piston', hl: true },
			{ text: ' down.', hl: false }
		]);
	});

	it('returns plain text unchanged as a single segment', () => {
		expect(parseEmphasis('No highlight here.')).toEqual([
			{ text: 'No highlight here.', hl: false }
		]);
	});

	it('leaves an unmatched asterisk as literal text', () => {
		expect(parseEmphasis('5 * 3')).toEqual([{ text: '5 * 3', hl: false }]);
	});
});

describe('activeStepIndex (which step the playhead is in)', () => {
	it('finds the step whose half-open range [from, to) holds the angle', () => {
		expect(activeStepIndex(steps, 450)).toBe(2);
	});

	it('treats a boundary as the start of the next step', () => {
		expect(activeStepIndex(steps, 180)).toBe(1);
	});

	it('returns -1 when no step covers the angle', () => {
		expect(activeStepIndex(steps.slice(0, 2), 500)).toBe(-1);
	});
});

describe('stepProgress (how full a timeline segment is)', () => {
	it('is 0.5 halfway through a step', () => {
		expect(stepProgress(steps[2], 450)).toBe(0.5);
	});

	it('is 0 before the step and 1 after it', () => {
		expect(stepProgress(steps[2], 100)).toBe(0);
		expect(stepProgress(steps[2], 600)).toBe(1);
	});
});
