<!--
	One interactive lesson, laid out as a full-screen stage:
	header · engine · subtitle · timeline. The long-form explanation (the
	article body passed as children) sits below in #details.

	Owns the CycleState and shares it, plus the steps, via context. Everything
	on stage reads the same angle, so it all stays in sync.
-->
<script lang="ts">
	import { onMount, type Component, type Snippet } from 'svelte';
	import { page } from '$app/state';
	import { CycleState, setCycle } from '../animation/cycle.svelte.ts';
	import type { LessonMeta } from '../content/lesson-meta.ts';
	import { reportMistakeUrl } from '../site.ts';
	import { setLessonParts, setLessonSteps, setSheet } from './lesson-context.ts';
	import Subtitle from './Subtitle.svelte';
	import Timeline from './Timeline.svelte';

	let {
		meta,
		period,
		angleLabel,
		visual: Visual,
		children
	}: {
		/** The lesson's frontmatter (mdsvex exposes it as `metadata`). */
		meta: LessonMeta;
		period: number;
		/** What the driving value is, read out with the timeline (default "Crank angle"). */
		angleLabel?: string;
		visual: Component;
		children: Snippet;
	} = $props();

	// A lesson's frontmatter and period are fixed for its lifetime, so reading them once is intended.
	// svelte-ignore state_referenced_locally
	const { title, steps, parts = {} } = meta;
	// svelte-ignore state_referenced_locally
	const cycle = new CycleState(period);
	setCycle(cycle);
	setLessonSteps(steps);
	setLessonParts(parts);

	const reviewed = $derived(
		new Date(`${meta.reviewed}T00:00:00Z`).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			timeZone: 'UTC'
		})
	);
	const reportUrl = $derived(reportMistakeUrl(page.url.pathname, title));

	// The "All steps" sheet is a native <dialog>: showModal() gives focus
	// trapping, Esc to close, an inert background and focus return for free.
	let sheet: HTMLDialogElement;
	let sheetOpen = $state(false);
	function openSheet() {
		sheet.showModal();
		sheetOpen = true;
	}
	function closeSheet() {
		sheet.close();
	}
	setSheet({ close: closeSheet });
	// The dialog element itself only receives clicks on its backdrop, because
	// .sheet-inner fills the whole panel.
	function onSheetClick(e: MouseEvent) {
		if (e.target === sheet) closeSheet();
	}

	// False in the prerendered HTML; true once Svelte has hydrated and handlers work.
	let hydrated = $state(false);

	onMount(() => {
		hydrated = true;
		// Respect reduced motion: no autoplay, the reader drives it.
		if (!matchMedia('(prefers-reduced-motion: reduce)').matches) cycle.play();
		return () => cycle.pause();
	});
</script>

<!-- data-hydrated lets tests (and anything else) wait until the controls are live. -->
<div class="lesson" data-hydrated={hydrated || undefined}>
	<header class="bar">
		<a href="/" class="brand">vmechs</a>
		<h1 class="title">{title}</h1>
		<button
			type="button"
			class="all"
			disabled={!hydrated}
			aria-haspopup="dialog"
			aria-expanded={sheetOpen}
			onclick={openSheet}>All {steps.length} steps</button
		>
	</header>

	<div class="stage">
		<Visual />
	</div>

	<Subtitle />
	<Timeline label={angleLabel} />
</div>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<!-- (Backdrop click is a mouse convenience; keyboard users close with Esc or the Close button.) -->
<dialog
	bind:this={sheet}
	class="sheet"
	aria-labelledby="sheet-title"
	onclose={() => (sheetOpen = false)}
	onclick={onSheetClick}
>
	<div class="sheet-inner">
		<header class="sheet-head">
			<p id="sheet-title">{title}</p>
			<button type="button" class="close" aria-label="Close" onclick={closeSheet}>
				<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 3.5l9 9M12.5 3.5l-9 9" /></svg>
			</button>
		</header>
		<div class="sheet-body">
			{@render children()}

			<section class="accuracy" aria-labelledby="accuracy-title">
				<h2 id="accuracy-title">Sources and accuracy</h2>
				<p class="reviewed">Last reviewed {reviewed}.</p>

				{#if meta.simplifications.length}
					<h3>What this lesson simplifies</h3>
					<ul>
						{#each meta.simplifications as s (s)}<li>{s}</li>{/each}
					</ul>
				{/if}

				<h3>Sources</h3>
				<ul class="sources">
					{#each meta.sources as src (src.title)}
						<li>
							{#if src.url}<a href={src.url} rel="noopener">{src.title}</a>{:else}<cite
									>{src.title}</cite
								>{/if}{#if src.author}, {src.author}{/if}{#if src.publisher}, {src.publisher}{/if}{#if src.year},
								{src.year}{/if}.
							{#if src.note}<span class="note">{src.note}</span>{/if}
						</li>
					{/each}
				</ul>

				<p class="report">
					Spotted something wrong? <a href={reportUrl} target="_blank" rel="noopener"
						>Report a mistake</a
					> (opens GitHub).
				</p>
			</section>
		</div>
	</div>
</dialog>

<style>
	.lesson {
		min-height: 100svh;
		display: grid;
		/* minmax(0, 1fr), not the implicit auto column: an auto column grows to its
		   content's min width (the no-wrap title), pushing the page past phone width. */
		grid-template-columns: minmax(0, 1fr);
		grid-template-rows: auto minmax(320px, 1fr) auto auto;
		background: var(--bg);
	}

	.bar {
		width: 100%;
		max-width: 1240px;
		margin: 0 auto;
		padding: 20px 40px;
		display: flex;
		align-items: center;
		gap: 20px;
	}
	.brand {
		font-weight: 700;
		font-size: 18px;
		letter-spacing: -0.01em;
		color: var(--ink-2);
		text-decoration: none;
	}
	.title {
		flex: 1 1 0;
		min-width: 0;
		margin: 0;
		text-align: center;
		font-size: 14px;
		font-weight: 500;
		color: var(--ink-3);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.all {
		display: inline-flex;
		align-items: center;
		height: 40px;
		padding: 0 16px;
		border: 1px solid var(--line);
		border-radius: 999px;
		font-size: 14px;
		font-weight: 500;
		background: transparent;
		color: var(--ink-2);
		font: inherit;
		font-size: 14px;
		font-weight: 500;
		white-space: nowrap;
		cursor: pointer;
	}
	.all:disabled {
		cursor: default;
	}
	.all:hover:not(:disabled) {
		border-color: var(--ink-3);
		color: var(--ink);
	}

	.stage {
		position: relative;
		min-height: 0;
	}

	/* ---- "All steps" sheet: a side panel that slides in from the right ---- */
	.sheet {
		position: fixed;
		inset: 0 0 0 auto;
		width: min(560px, 100vw);
		height: 100dvh;
		max-width: none;
		max-height: none;
		margin: 0;
		padding: 0;
		border: 0;
		border-left: 1px solid var(--line);
		background: var(--surface);
		color: var(--ink-2);
		transform: translateX(0);
		transition:
			transform 0.32s cubic-bezier(0.2, 0.8, 0.2, 1),
			display 0.32s allow-discrete,
			overlay 0.32s allow-discrete;
	}
	.sheet:not([open]) {
		transform: translateX(100%);
	}
	@starting-style {
		.sheet[open] {
			transform: translateX(100%);
		}
	}
	.sheet::backdrop {
		background: rgba(0, 0, 0, 0.55);
		transition:
			background-color 0.32s,
			display 0.32s allow-discrete,
			overlay 0.32s allow-discrete;
	}
	@starting-style {
		.sheet[open]::backdrop {
			background: rgba(0, 0, 0, 0);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.sheet,
		.sheet::backdrop {
			transition: none;
		}
	}

	.sheet-inner {
		height: 100%;
		overflow-y: auto;
		overscroll-behavior: contain;
	}
	.sheet-head {
		position: sticky;
		top: 0;
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 14px 16px 14px 28px;
		background: var(--surface);
		border-bottom: 1px solid var(--line);
	}
	.sheet-head p {
		flex: 1 1 0;
		margin: 0;
		font-size: 15px;
		font-weight: 500;
		color: var(--ink);
	}
	.close {
		width: 44px;
		height: 44px;
		display: grid;
		place-items: center;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: var(--ink-2);
		cursor: pointer;
	}
	.close:hover {
		background: var(--surface-2);
		color: var(--ink);
	}
	.close svg {
		width: 16px;
		height: 16px;
		stroke: currentColor;
		stroke-width: 1.8;
		stroke-linecap: round;
	}
	.sheet-body {
		padding: 8px 28px 64px;
		font-size: 17px;
		line-height: 1.65;
	}
	.sheet-body :global(h2) {
		margin: 40px 0 10px;
		font-size: 21px;
		line-height: 1.3;
		color: var(--ink);
	}
	.sheet-body :global(strong) {
		color: var(--ink);
		font-weight: 600;
	}

	/* ---- Sources and accuracy (end of the sheet) ---- */
	.accuracy {
		margin-top: 48px;
		padding-top: 8px;
		border-top: 1px solid var(--line);
		font-size: 15px;
		line-height: 1.6;
	}
	.accuracy h3 {
		margin: 24px 0 8px;
		font-size: 15px;
		font-weight: 600;
		color: var(--ink);
	}
	.accuracy ul {
		margin: 0;
		padding-left: 18px;
	}
	.accuracy li + li {
		margin-top: 8px;
	}
	.reviewed {
		margin: 0;
		color: var(--ink-3);
	}
	.sources cite {
		font-style: italic;
		color: var(--ink);
	}
	.note {
		display: block;
		color: var(--ink-3);
	}
	.report {
		margin: 28px 0 0;
	}
	.report a {
		color: var(--accent);
	}

	@media (max-width: 640px) {
		.bar {
			padding: 8px 12px 8px 16px;
		}
		.title {
			text-align: left;
		}
	}
</style>
