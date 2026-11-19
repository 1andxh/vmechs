<!--
	The lesson's one line of text, shown like a film subtitle under the engine.
	It follows the playhead: whichever step the angle is in, its subtitle shows,
	and it fades in when the step changes.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { getCycle } from '../animation/cycle.svelte.ts';
	import { activeStepIndex, highlightColour, parseEmphasis } from '../content/steps.ts';
	import { getLessonParts, getLessonSteps } from './lesson-context.ts';

	const cycle = getCycle();
	const steps = getLessonSteps();
	const parts = getLessonParts();
	/** A highlighted word naming a part is shown in the part's text colour (ADR 0015). */
	const colourOf = (word: string) => {
		const c = highlightColour(word, parts);
		return c ? `var(--part-${c}-text)` : undefined;
	};

	const i = $derived(activeStepIndex(steps, cycle.angle));
	const step = $derived(steps[i]);
	const segments = $derived(step ? parseEmphasis(step.subtitle) : []);

	let reduced = $state(false);
	onMount(() => (reduced = matchMedia('(prefers-reduced-motion: reduce)').matches));
</script>

<!-- Announce only when paused: during autoplay a live region would talk over itself every stroke. -->
<div class="subtitle" aria-live={cycle.playing ? 'off' : 'polite'}>
	{#key i}
		<div class="inner" in:fade={{ duration: reduced ? 0 : 280 }}>
			{#if step}
				<p class="where">{step.title} · step {i + 1} of {steps.length}</p>
				<p class="line">
					{#each segments as s, k (k)}{#if s.hl}<span class="hl" style:color={colourOf(s.text)}
								>{s.text}</span
							>{:else}{s.text}{/if}{/each}
				</p>
			{/if}
		</div>
	{/key}
</div>

<style>
	.subtitle {
		padding: 0 40px 28px;
		text-align: center;
	}
	.where {
		margin: 0 0 10px;
		font-size: 15px;
		color: var(--ink-3);
	}
	.line {
		max-width: 780px;
		margin: 0 auto;
		/* Reserve two lines so the timeline doesn't jump when the text length changes. */
		min-height: calc(2 * 1.38em);
		font-size: clamp(21px, 2.3vw, 30px);
		font-weight: 500;
		line-height: 1.38;
		letter-spacing: -0.01em;
		color: var(--ink);
		text-wrap: balance;
	}
	.hl {
		color: var(--accent);
	}
	@media (max-width: 640px) {
		.subtitle {
			padding: 0 24px 18px;
		}
		.where {
			font-size: 14px;
			margin-bottom: 6px;
		}
	}
</style>
