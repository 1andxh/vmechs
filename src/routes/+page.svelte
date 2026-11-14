<!--
	Landing page. One job: make someone want to look inside a car, then let
	them in. The signature is a static V8 drawn as a wireframe mesh; its part
	callouts are the links, so the engine itself is the door. No course
	language: this is a machine to explore, not a class to enrol in.
-->
<script lang="ts">
	import HeroEngine from '#lib/mechanisms/engine/HeroEngine.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Where the engine's doors lead: the first page that exists, in system order.
	const entry = $derived(data.systems.flatMap((s) => s.lessons).find((l) => l.available));
</script>

<svelte:head>
	<title>vmechs · How cars actually work</title>
	<meta
		name="description"
		content="How cars actually work, taken apart and set in motion: engines, transmissions, brakes and more, as interactive 3D you can explore."
	/>
</svelte:head>

<section class="hero">
	<header class="bar">
		<a href="/" class="brand" aria-current="page">vmechs</a>
	</header>

	<div class="intro">
		<h1>Look inside the machine.</h1>
		<p class="lede">How cars actually work, taken apart and set in motion.</p>
		{#if entry?.href}
			<a class="way-in" href={entry.href}>See inside the engine <span aria-hidden="true">→</span></a
			>
		{/if}
	</div>

	<div class="stage">
		{#if entry?.href}<HeroEngine href={entry.href} />{/if}
	</div>
</section>

<section class="systems" aria-labelledby="systems-title">
	<h2 id="systems-title">The car, system by system</h2>
	<p class="legend">Bright ones are ready to explore; the dimmed ones are on the way.</p>

	<ul class="system-list">
		{#each data.systems as system (system.id)}
			<li class="system">
				<div class="system-head">
					<h3>{system.name}</h3>
					<p>{system.blurb}</p>
				</div>
				<ul class="pages">
					{#each system.lessons as page (page.title)}
						<li>
							{#if page.href}
								<a href={page.href}>{page.title} <span aria-hidden="true">→</span></a>
							{:else}
								<!-- The space lives inside a string: Svelte trims whitespace in markup, never in strings. -->
								<span class="coming"
									>{page.title}<span class="sr-only">{' (coming soon)'}</span></span
								>
							{/if}
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>
</section>

<style>
	/* ---- Hero: words on the left, the V8 large on the right; stacked on phones ---- */
	.hero {
		position: relative;
		min-height: 100svh;
		display: grid;
		grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
		grid-template-rows: auto minmax(0, 1fr);
		grid-template-areas:
			'bar bar'
			'intro stage';
		max-width: 1440px;
		margin: 0 auto;
	}
	.bar {
		grid-area: bar;
		padding: 20px 48px;
		position: relative;
		z-index: 1;
	}
	.brand {
		font-weight: 700;
		font-size: 18px;
		letter-spacing: -0.01em;
		color: var(--ink-2);
		text-decoration: none;
	}
	.intro {
		grid-area: intro;
		align-self: center;
		padding: 0 0 80px 48px;
		position: relative;
		z-index: 1;
	}
	h1 {
		margin: 0;
		font-size: clamp(44px, 6.4vw, 92px);
		font-weight: 600;
		line-height: 0.98;
		letter-spacing: -0.04em;
		color: var(--ink);
		text-wrap: balance;
	}
	.lede {
		margin: 22px 0 0;
		max-width: 28ch;
		font-size: clamp(17px, 1.5vw, 20px);
		line-height: 1.5;
		color: var(--ink-2);
		text-wrap: balance;
	}
	.way-in {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		min-height: 44px;
		margin-top: 28px;
		font-size: 17px;
		font-weight: 500;
		color: var(--ink);
		text-decoration: underline;
		text-decoration-color: var(--line);
		text-underline-offset: 6px;
		text-decoration-thickness: 1px;
		transition: text-decoration-color 0.15s ease-out;
	}
	.way-in:hover {
		color: var(--ink);
		text-decoration-color: var(--accent);
	}
	/* On wide screens the drawing spans the whole hero, behind the words;
	   the scene's camera shifts the engine to the right (see V8Scene). */
	.stage {
		grid-area: 1 / 1 / -1 / -1;
		position: relative;
		min-height: 560px;
	}

	/* ---- System index ---- */
	.systems {
		max-width: 920px;
		margin: 0 auto;
		padding: 48px 24px 96px;
	}
	h2 {
		margin: 0;
		font-size: 22px;
		font-weight: 600;
		color: var(--ink);
	}
	.legend {
		margin: 6px 0 28px;
		font-size: 15px;
		color: var(--ink-3);
	}
	.system-list,
	.pages {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.system {
		display: grid;
		grid-template-columns: minmax(0, 260px) minmax(0, 1fr);
		gap: 8px 40px;
		padding: 22px 0;
		border-top: 1px solid var(--line);
	}
	h3 {
		margin: 0;
		font-size: 18px;
		font-weight: 600;
		color: var(--ink);
	}
	.system-head p {
		margin: 4px 0 0;
		font-size: 15px;
		line-height: 1.5;
		color: var(--ink-3);
	}
	.pages {
		display: grid;
		gap: 6px;
		align-content: start;
		padding-top: 2px;
	}
	.pages a {
		font-size: 16px;
		font-weight: 500;
		color: var(--ink);
		text-decoration: none;
	}
	.pages a:hover {
		color: var(--accent);
	}
	.coming {
		font-size: 16px;
		color: var(--ink-3);
	}
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	@media (max-width: 860px) {
		.hero {
			min-height: auto;
			grid-template-columns: minmax(0, 1fr);
			grid-template-rows: auto auto auto;
			grid-template-areas: 'bar' 'stage' 'intro';
		}
		.bar {
			padding: 14px 20px;
		}
		.stage {
			grid-area: stage;
			min-height: 0;
			height: 58svh;
		}
		.intro {
			padding: 8px 24px 48px;
		}
		.system {
			grid-template-columns: minmax(0, 1fr);
		}
		.pages {
			padding-top: 8px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.way-in {
			transition: none;
		}
	}
</style>
