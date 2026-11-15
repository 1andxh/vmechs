<!--
	A small frames-per-second readout, for checking performance on a real
	device. The homepage loads it only when the address has `?fps`.
-->
<script lang="ts">
	import { onMount } from 'svelte';

	let fps = $state(0);
	let slowest = $state(0);

	onMount(() => {
		let frame = 0;
		let frames = 0;
		let worst = 0;
		let last = performance.now();
		let windowStart = last;
		const tick = (now: number) => {
			worst = Math.max(worst, now - last);
			last = now;
			frames++;
			if (now - windowStart >= 1000) {
				fps = Math.round((frames * 1000) / (now - windowStart));
				slowest = Math.round(worst);
				frames = 0;
				worst = 0;
				windowStart = now;
			}
			frame = requestAnimationFrame(tick);
		};
		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	});
</script>

<p class="fps" aria-hidden="true">{fps} fps · slowest {slowest} ms</p>

<style>
	.fps {
		position: fixed;
		left: 12px;
		bottom: 12px;
		z-index: 10;
		margin: 0;
		padding: 6px 10px;
		border-radius: 8px;
		background: var(--surface);
		font: 500 13px/1 var(--font);
		color: var(--ink);
	}
</style>
