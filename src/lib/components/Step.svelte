<!--
	The long-form explanation for one step, shown in the "All steps" sheet.
	Title and angle range come from the lesson's frontmatter (by number), so
	they're written once. The step that's playing on stage is marked.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { getCycle } from '../animation/cycle.svelte.ts';
	import { getLessonSteps, getSheet } from './lesson-context.ts';

	let { n, children }: { n: number; children: Snippet } = $props();

	const cycle = getCycle();
	const steps = getLessonSteps();
	const sheet = getSheet();
	const meta = $derived(steps[n - 1]);
	const current = $derived(cycle.angle >= meta.from && cycle.angle < meta.to);

	function play() {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
			cycle.seek((meta.from + meta.to) / 2);
		} else {
			cycle.playRange(meta.from, meta.to);
		}
		// Close the sheet so the reader sees it play on stage.
		sheet.close();
	}
</script>

<section class="step" class:current aria-current={current ? 'step' : undefined}>
	<h2>
		<span class="n">{n}</span>{meta.title}
		{#if current}<span class="now">On stage now</span>{/if}
	</h2>
	{@render children()}
	<!-- the name adds the step, so the buttons can be told apart; it starts with
	     the visible words, so voice control can find it by what it says -->
	<button type="button" onclick={play} aria-label="Watch this step: {meta.title}"
		>Watch this step</button
	>
</section>

<style>
	.step {
		padding: 4px 0 24px;
		border-top: 1px solid var(--line);
	}
	h2 {
		display: flex;
		align-items: baseline;
		gap: 12px;
	}
	.n {
		font-size: 15px;
		font-weight: 500;
		color: var(--ink-3);
		font-variant-numeric: tabular-nums;
	}
	.current .n {
		color: var(--accent);
	}
	.now {
		margin-left: auto;
		font-size: 13px;
		font-weight: 500;
		color: var(--accent);
	}
	button {
		height: 40px;
		padding: 0 16px;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: transparent;
		color: var(--ink-2);
		font: inherit;
		font-size: 14px;
		cursor: pointer;
	}
	button:hover {
		border-color: var(--ink-3);
		color: var(--ink);
	}
</style>
