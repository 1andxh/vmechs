<!--
	Play/pause plus a thin timeline, one part per step, each as wide as its
	step is long, so the bars line up with the slider on top of them.
	- The bars ARE the slider: a native range input sits on top of them, so
	  dragging along the bars scrubs, and arrow keys work for free.
	- The labels under the bars are buttons: clicking one plays that step once
	  (or jumps to its middle under reduced motion).
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { getCycle } from '../animation/cycle.svelte.ts';
	import { activeStepIndex, stepProgress, type StepMeta } from '../content/steps.ts';
	import { getLessonSteps } from './lesson-context.ts';

	let {
		label = 'Crank angle'
	}: { /** What the driving value is, for screen readers. */ label?: string } = $props();

	const cycle = getCycle();
	const steps = getLessonSteps();
	// e.g. "180fr 180fr 180fr 180fr": each step's share of the cycle
	const columns = steps.map((s) => `minmax(0, ${s.to - s.from}fr)`).join(' ');
	const active = $derived(activeStepIndex(steps, cycle.angle));

	let reduced = $state(false);
	// Controls render disabled in the prerendered HTML and enable once hydrated.
	// Otherwise a drag before hydration moves the native slider, then hydration
	// snaps it back to the real state, silently undoing the reader's input.
	let ready = $state(false);
	onMount(() => {
		reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		ready = true;
	});

	function show(s: StepMeta) {
		if (reduced) cycle.seek((s.from + s.to) / 2);
		else cycle.playRange(s.from, s.to);
	}
</script>

<div class="timeline">
	<button
		type="button"
		class="play"
		disabled={!ready}
		onclick={() => cycle.toggle()}
		aria-label={cycle.playing ? 'Pause' : 'Play'}
	>
		{#if cycle.playing}
			<svg viewBox="0 0 16 16" aria-hidden="true"
				><rect x="3" y="2" width="3.4" height="12" rx="1" /><rect
					x="9.6"
					y="2"
					width="3.4"
					height="12"
					rx="1"
				/></svg
			>
		{:else}
			<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9.5-5.5z" /></svg>
		{/if}
	</button>

	<div class="track">
		<div class="rail">
			<div class="bars" aria-hidden="true" style:grid-template-columns={columns}>
				{#each steps as s, i (s.title)}
					<span class="bar">
						<span
							class="fill"
							class:past={i < active}
							style:transform="scaleX({stepProgress(s, cycle.angle)})"
						></span>
					</span>
				{/each}
			</div>
			<input
				type="range"
				min="0"
				max={cycle.period}
				step="1"
				value={cycle.angle}
				disabled={!ready}
				oninput={(e) => cycle.seek(+e.currentTarget.value)}
				aria-label={label}
				aria-valuetext="{Math.round(cycle.angle)}°, {steps[active]?.title ?? ''}"
			/>
		</div>

		<div class="labels" style:grid-template-columns={columns}>
			{#each steps as s, i (s.title)}
				<button
					type="button"
					class:current={i === active}
					aria-current={i === active ? 'step' : undefined}
					disabled={!ready}
					onclick={() => show(s)}>{s.title}</button
				>
			{/each}
		</div>
	</div>
</div>

<style>
	.timeline {
		width: 100%;
		max-width: 1240px;
		margin: 0 auto;
		padding: 0 40px 26px;
		display: flex;
		align-items: flex-start;
		gap: 18px;
	}

	.play {
		flex: none;
		width: 44px;
		height: 44px;
		margin-top: -10px;
		display: grid;
		place-items: center;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: var(--ink);
		cursor: pointer;
	}
	/* Before hydration: same look, but no pointer or hover until they work. */
	.timeline :disabled {
		cursor: default;
	}
	.play:hover:not(:disabled) {
		background: var(--surface-2);
	}
	.play svg {
		width: 16px;
		height: 16px;
		fill: currentColor;
	}

	.track {
		flex: 1 1 0;
		min-width: 0;
	}

	/* The bars and the range input share one 24px-tall row. */
	.rail {
		position: relative;
		height: 24px;
	}
	.bars {
		position: absolute;
		inset: 11px 0 auto;
		display: grid;
		gap: 4px;
	}
	.bar {
		height: 2px;
		background: var(--line);
		overflow: hidden;
	}
	.fill {
		display: block;
		height: 100%;
		background: var(--ink);
		transform-origin: left;
	}
	.fill.past {
		background: var(--ink-3);
	}

	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		margin: 0;
		background: transparent;
		cursor: pointer;
	}
	input[type='range']::-webkit-slider-runnable-track {
		height: 24px;
		background: transparent;
	}
	input[type='range']::-moz-range-track {
		height: 24px;
		background: transparent;
	}
	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		width: 12px;
		height: 12px;
		margin-top: 6px;
		border-radius: 999px;
		background: var(--ink);
		border: 0;
	}
	input[type='range']::-moz-range-thumb {
		width: 12px;
		height: 12px;
		border-radius: 999px;
		background: var(--ink);
		border: 0;
	}
	input[type='range']:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 4px;
		border-radius: 4px;
	}

	.labels {
		display: grid;
		gap: 4px;
	}
	.labels button {
		min-height: 44px;
		padding: 2px 0 0;
		border: 0;
		background: none;
		text-align: left;
		font: inherit;
		font-size: 12.5px;
		color: var(--ink-3);
		cursor: pointer;
		align-self: start;
		display: flex;
		align-items: flex-start;
	}
	.labels button:hover:not(:disabled) {
		color: var(--ink-2);
	}
	.labels button.current {
		color: var(--ink);
	}

	@media (max-width: 640px) {
		.timeline {
			padding: 0 16px 18px 8px;
			gap: 8px;
		}
		.labels button {
			font-size: 12px;
		}
	}
</style>
