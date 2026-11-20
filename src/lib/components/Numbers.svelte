<!--
	"The numbers": the part of a simple machine's sheet written for students
	(docs/CONTENT.md). It goes in the lesson body after the last <Step>, so it
	sits between the steps and "Sources and accuracy". The lesson writes the
	formulas, one worked example and one practice question inside it; a formula
	is a <p class="formula">, and the practice answer sits in a <details>, so it
	stays hidden (from sight and from screen readers) until it's asked for.
-->
<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<section class="numbers" aria-labelledby="numbers-title">
	<h2 id="numbers-title">The numbers</h2>
	<p class="for">
		For students: the formulas behind the steps, a worked example, and a question to try.
	</p>
	{@render children()}
</section>

<style>
	.numbers {
		margin-top: 24px;
		padding-top: 4px;
		border-top: 1px solid var(--line);
	}
	.for {
		margin: 0;
		color: var(--ink-3);
		font-size: 15px;
	}
	.numbers :global(h3) {
		margin: 28px 0 8px;
		font-size: 17px;
		font-weight: 600;
		color: var(--ink);
	}
	/* one formula per line, set apart from the prose */
	.numbers :global(.formula) {
		margin: 6px 0;
		padding: 8px 14px;
		border-left: 3px solid var(--accent);
		border-radius: 0 8px 8px 0;
		background: var(--surface);
		color: var(--ink);
		font-variant-numeric: tabular-nums;
	}
	.numbers :global(details) {
		margin-top: 12px;
	}
	.numbers :global(summary) {
		display: inline-flex;
		align-items: center;
		height: 40px;
		padding: 0 16px;
		border: 1px solid var(--line);
		border-radius: 999px;
		color: var(--ink-2);
		font-size: 14px;
		cursor: pointer;
	}
	.numbers :global(summary:hover) {
		border-color: var(--ink-3);
		color: var(--ink);
	}
	.numbers :global(details[open] summary) {
		margin-bottom: 4px;
	}
</style>
