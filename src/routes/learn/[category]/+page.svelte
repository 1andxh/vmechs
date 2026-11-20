<!--
	A section page: one system's pages in teaching order (/learn/simple-machines).
	Where the system has families (systems.ts), the pages are grouped by them;
	each open page shows its cover, its one-line summary and, for the simple
	machines, its ideal mechanical advantage, so the page doubles as a students'
	cheat sheet. Pages still to come are listed, but don't link.
-->
<script lang="ts">
	import PageMeta from '#lib/components/PageMeta.svelte';
	import SiteFooter from '#lib/components/SiteFooter.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const s = $derived(data.system);
</script>

<PageMeta
	title={s.name}
	description="{s.blurb} {s.open} of {s.planned} pages open, each taken apart and set in motion."
	path="/learn/{s.id}"
	image={data.cover ?? '/covers/four-stroke-cycle.jpg'}
/>

<div class="page">
	<header class="bar">
		<a href="/" class="brand">vmechs</a>
		<a href="/about" class="about">About</a>
	</header>

	<div class="intro">
		<h1>{s.name}</h1>
		<p class="lede">{s.blurb}</p>
		<p class="count">
			{s.open === s.planned
				? `All ${s.planned} pages open.`
				: `${s.open} of ${s.planned} pages open.`}
			{#if data.withNumbers}
				Each ends with the numbers: the formulas, a worked example and a question to try.
			{/if}
		</p>
	</div>

	{#each data.groups as group, i (group.name ?? i)}
		<section class="group" aria-labelledby="group-{i}">
			<h2 id="group-{i}" class:sr-only={!group.name}>{group.name ?? 'Pages'}</h2>
			<ol class="lessons">
				{#each group.lessons as lesson (lesson.slug)}
					<li class:open={lesson.href}>
						<div class="thumb">
							{#if lesson.cover}
								<img
									src={lesson.cover}
									alt=""
									width="1280"
									height="860"
									loading="lazy"
									decoding="async"
								/>
							{/if}
						</div>
						<div class="text">
							<span class="n">{lesson.n}</span>
							<h3>
								{#if lesson.href}
									<a class="link" href={lesson.href}>{lesson.title}</a>
								{:else}
									{lesson.title}
								{/if}
							</h3>
							{#if lesson.summary}<p class="sum">{lesson.summary}</p>{/if}
							{#if !lesson.href}<p class="soon">On the way</p>{/if}
						</div>
						{#if lesson.ima}
							<p class="ima"><abbr title="Ideal mechanical advantage">IMA</abbr> = {lesson.ima}</p>
						{/if}
					</li>
				{/each}
			</ol>
		</section>
	{/each}

	<SiteFooter />
</div>

<style>
	.page {
		max-width: 1120px;
		margin: 0 auto;
		padding: 0 48px 40px;
	}
	.bar {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		padding: 20px 0;
	}
	.brand {
		font-weight: 700;
		font-size: 18px;
		letter-spacing: -0.01em;
		color: var(--ink-2);
		text-decoration: none;
	}
	.about {
		font-size: 15px;
		color: var(--ink-2);
		text-decoration: none;
	}
	.about:hover {
		color: var(--accent);
	}

	.intro {
		max-width: 680px;
		padding-top: 72px;
	}
	h1,
	h3 {
		margin: 0;
		font-stretch: var(--display-stretch);
		font-weight: 650;
		letter-spacing: -0.025em;
		color: var(--ink);
	}
	h1 {
		font-size: clamp(40px, 5.6vw, 72px);
		line-height: 1;
	}
	.lede {
		margin: 18px 0 0;
		font-size: 20px;
		line-height: 1.5;
		color: var(--ink-2);
	}
	.count {
		margin: 10px 0 0;
		font-size: 15px;
		line-height: 1.55;
		color: var(--ink-3);
	}

	/* a family's name, like the kickers on the homepage */
	.group {
		margin-top: 56px;
	}
	h2 {
		margin: 0 0 6px;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--accent);
	}
	.lessons {
		margin: 0;
		padding: 0;
		list-style: none;
		border-top: 1px solid var(--line);
	}
	li {
		position: relative;
		display: grid;
		/* the formulas sit in one column, so their left edges line up */
		grid-template-columns: 120px minmax(0, 1fr) 270px;
		gap: 24px;
		align-items: center;
		padding: 16px 0;
		border-bottom: 1px solid var(--line);
	}
	.thumb {
		overflow: hidden;
		border-radius: 8px;
		aspect-ratio: 3 / 2;
	}
	/* covers keep their scene small and centred; zoom in for a thumbnail */
	.thumb img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: scale(1.8);
	}
	.n {
		font-size: 13px;
		font-weight: 600;
		color: var(--ink-3);
		font-variant-numeric: tabular-nums;
	}
	h3 {
		margin-top: 2px;
		font-size: 22px;
		line-height: 1.15;
	}
	li:not(.open) h3 {
		color: var(--ink-3);
	}
	.link {
		color: inherit;
		text-decoration: none;
	}
	/* the whole row is the link */
	.link::after {
		content: '';
		position: absolute;
		inset: 0;
	}
	li.open:hover .link {
		color: var(--accent);
	}
	.sum,
	.soon {
		margin: 4px 0 0;
		max-width: 60ch;
		font-size: 15px;
		line-height: 1.5;
		color: var(--ink-2);
	}
	.soon {
		color: var(--ink-3);
	}
	/* the formula, set apart like the ones in "The numbers" */
	.ima {
		margin: 0;
		padding: 6px 12px;
		border-left: 3px solid var(--accent);
		border-radius: 0 8px 8px 0;
		background: var(--surface);
		font-size: 14px;
		color: var(--ink);
		font-variant-numeric: tabular-nums;
		justify-self: start;
	}
	abbr {
		text-decoration: none;
		font-weight: 600;
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
		.page {
			padding: 0 20px 32px;
		}
		.intro {
			padding-top: 48px;
		}
		li {
			grid-template-columns: 88px minmax(0, 1fr);
			gap: 8px 16px;
		}
		.ima {
			grid-column: 2;
		}
	}
</style>
