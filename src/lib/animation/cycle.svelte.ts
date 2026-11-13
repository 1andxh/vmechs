import { createContext } from 'svelte';
import { advance } from './advance';

/**
 * The single source of truth for one lesson's animation: the driving angle.
 *
 * Everything visual (3D scene, SVG chart, step highlighting, scrubber) only
 * *reads* `angle`. Only this class *writes* it. That one-way flow is why the
 * views can never drift out of sync with each other.
 */
export class CycleState {
	angle = $state(0);
	playing = $state(false);
	degPerSec = $state(120);

	readonly period: number;
	#stopAt: number | undefined;
	#raf = 0;
	#last = 0;

	constructor(period: number) {
		this.period = period;
	}

	/** Jump to an angle (scrubbing). Stops playback, like dragging a video playhead. */
	seek(angle: number): void {
		this.pause();
		this.angle = ((angle % this.period) + this.period) % this.period;
	}

	play(): void {
		if (this.playing || typeof requestAnimationFrame === 'undefined') return;
		this.playing = true;
		this.#last = performance.now();
		this.#raf = requestAnimationFrame(this.#tick);
	}

	pause(): void {
		this.playing = false;
		this.#stopAt = undefined;
		if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(this.#raf);
	}

	toggle(): void {
		if (this.playing) this.pause();
		else this.play();
	}

	/** Animate through [from, to) once, then stop. Used when a step is clicked. */
	playRange(from: number, to: number): void {
		this.seek(from);
		this.#stopAt = to;
		this.play();
	}

	#tick = (now: number): void => {
		if (!this.playing) return;
		// Clamp dt so a backgrounded tab doesn't jump half a cycle on return.
		const dt = Math.min((now - this.#last) / 1000, 0.1);
		this.#last = now;
		const r = advance({
			angle: this.angle,
			dt,
			degPerSec: this.degPerSec,
			period: this.period,
			stopAt: this.#stopAt
		});
		this.angle = r.angle;
		if (r.stopped) this.pause();
		else this.#raf = requestAnimationFrame(this.#tick);
	};
}

export const [getCycle, setCycle] = createContext<CycleState>();
