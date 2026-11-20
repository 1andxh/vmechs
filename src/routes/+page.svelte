<!--
	Landing page (ADR 0016): no 3D model. The headline is the one moving thing:
	its "o" is a gear that turns and its full stop a piston that rises and
	falls. Under it, a quiet poster for each machine and one for the
	mechanisms, each listing its open pages. Then what's open. No course
	language: this is machines to explore, not a class to enrol in.
-->
<script lang="ts">
	import PageMeta from '#lib/components/PageMeta.svelte';
	import SiteFooter from '#lib/components/SiteFooter.svelte';
	import { posterList } from '#lib/content/posters.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	// "Open now" features the newest page (data.open is newest first); the rest follow as a list.
	const [newest, ...earlier] = $derived(data.open);
	// A poster for each machine, then one for the mechanisms, each in a part colour (ADR 0015).
	const posters = $derived([
		...data.machines.map((m) => ({
			name: m.name,
			href: m.href,
			blurb: m.blurb,
			colour: m.colour,
			...posterList(m.open, m.planned, m.href ?? undefined)
		})),
		{
			name: 'Mechanisms',
			href: null,
			blurb: 'The same few ideas, inside every machine.',
			colour: 'green',
			...posterList(
				data.mechanisms.flatMap((m) => (m.href ? [{ title: m.name, href: m.href }] : [])),
				data.mechanisms.length
			)
		}
	]);
</script>

<PageMeta
	title=""
	description="How machines actually work, taken apart and set in motion: engines, gears, clocks, simple machines and more, as interactive 3D you can explore."
	path="/"
	image="/covers/four-stroke-cycle.jpg"
/>

<div class="top">
	<header class="bar">
		<a href="/" class="brand" aria-current="page">vmechs</a>
		<a href="/about" class="about">About</a>
	</header>

	<!-- The gear and the piston are decoration; screen readers get the plain words. -->
	<h1 class="head">
		<span class="sr-only">How things move.</span>
		<span aria-hidden="true"
			>H<span class="gear"
				><svg viewBox="-50 -50 100 100"
					><path
						d="M32.9 -8.6L43.6 -5.6L43.6 5.6L32.9 8.6L32.3 10.5L39.8 18.8L33.7 28.3L23.0 25.0L21.5 26.3L23.3 37.4L13.0 42.0L5.8 33.5L3.9 33.8L-0.6 44.0L-11.8 42.4L-13.2 31.3L-15.0 30.5L-24.3 36.7L-32.8 29.3L-28.1 19.2L-29.1 17.6L-40.3 17.7L-43.5 6.9L-34.0 1.0L-34.0 -1.0L-43.5 -6.9L-40.3 -17.7L-29.1 -17.6L-28.1 -19.2L-32.8 -29.3L-24.3 -36.7L-15.0 -30.5L-13.2 -31.3L-11.8 -42.4L-0.6 -44.0L3.9 -33.8L5.8 -33.5L13.0 -42.0L23.3 -37.4L21.5 -26.3L23.0 -25.0L33.7 -28.3L39.8 -18.8L32.3 -10.5Z"
					/><circle r="13" /></svg
				></span
			>w things<br />move<span class="piston"></span></span
		>
	</h1>
	<div class="row">
		<p class="lede">
			Every machine, from a car engine to a wristwatch, runs on a few simple ideas. vmechs takes
			them apart and sets them moving, step by step, with every part in its own colour. Curious, or
			studying engineering: see how it works, not just read about it.
		</p>
	</div>

	<!-- What vmechs covers (ADR 0014): each machine, then the mechanisms inside them. -->
	<section class="posters" aria-labelledby="posters-title">
		<h2 id="posters-title" class="sr-only">Machines and mechanisms</h2>
		{#each posters as p (p.name)}
			<article class="poster" style:--c="var(--part-{p.colour})">
				<div>
					<h3>
						{#if p.href}<a class="title" href={p.href}>{p.name}</a>{:else}{p.name}{/if}
					</h3>
					<p class="blurb">{p.blurb}</p>
				</div>
				<ul>
					{#each p.links as page (page.href)}
						<li><a href={page.href}>{page.title}</a></li>
					{/each}
					{#if p.more?.href}
						<li><a class="more" href={p.more.href}>{p.more.text}</a></li>
					{:else if p.more}
						<li class="more">{p.more.text}</li>
					{/if}
				</ul>
			</article>
		{/each}
	</section>
</div>

<div class="page">
	<section class="open" aria-labelledby="open-title">
		<h2 id="open-title">Open now</h2>
		{#if newest}
			<article class="feat">
				{#if newest.cover}
					<img
						src={newest.cover}
						alt=""
						width="1280"
						height="860"
						loading="lazy"
						decoding="async"
					/>
				{/if}
				<div class="feat-text">
					<span class="tag">Newest</span>
					<p class="kicker">{newest.system} · {newest.steps} steps</p>
					<!-- The title's link covers the whole card (see .link::after). -->
					<h3><a class="link" href={newest.href}>{newest.title}</a></h3>
					<p class="sum">{newest.summary}</p>
					<span class="go" aria-hidden="true">See it run →</span>
				</div>
			</article>
		{/if}
		{#each earlier as page (page.href)}
			<article class="item">
				{#if page.cover}
					<div class="thumb">
						<img
							src={page.cover}
							alt=""
							width="1280"
							height="860"
							loading="lazy"
							decoding="async"
						/>
					</div>
				{/if}
				<div>
					<p class="kicker">{page.system} · {page.steps} steps</p>
					<h3><a class="link" href={page.href}>{page.title}</a></h3>
				</div>
				<span class="go" aria-hidden="true">See it run →</span>
			</article>
		{/each}
	</section>

	<section class="promise" aria-label="Accuracy">
		<p class="pledge">Every page names its sources and says where it simplifies.</p>
		<p>
			Spot something wrong? Each page has a link to report it, and shows when it was last checked.
		</p>
	</section>

	<SiteFooter />
</div>

<style>
	/* ---- The top: the moving headline, then the posters ---- */
	.top {
		/* the same column as the rest of the page, so the left edges line up */
		max-width: 1120px;
		margin: 0 auto;
		padding: 20px 48px 0;
	}
	.bar {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
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
	.head {
		margin: 64px 0 0;
		font-size: clamp(56px, 10.5vw, 150px);
		line-height: 0.92;
		font-stretch: 122%;
		font-weight: 700;
		letter-spacing: -0.035em;
		color: var(--ink);
	}
	/* the "o": a gear, turning slowly */
	.gear {
		display: inline-block;
		width: 0.74em;
		height: 0.74em;
		margin: 0 0.01em;
		vertical-align: -0.02em;
	}
	.gear svg {
		display: block;
		width: 100%;
		height: 100%;
		animation: turn 9s linear infinite;
	}
	.gear path {
		fill: var(--part-green);
		stroke: var(--part-green-text);
		stroke-width: 3;
		stroke-linejoin: round;
	}
	.gear circle {
		fill: var(--bg);
		stroke: var(--part-green-text);
		stroke-width: 3;
	}
	/* the full stop: a piston, rising and falling */
	.piston {
		display: inline-block;
		width: 0.2em;
		height: 0.2em;
		margin-left: 0.05em;
		border-radius: 0.03em;
		background: var(--part-red);
		outline: 0.035em solid var(--part-red-text);
		outline-offset: -0.035em;
		animation: pump 1.5s ease-in-out infinite;
	}
	@keyframes turn {
		to {
			transform: rotate(360deg);
		}
	}
	@keyframes pump {
		50% {
			transform: translateY(-0.32em);
		}
	}
	.row {
		margin-top: 14px;
	}
	.lede {
		margin: 0;
		max-width: 42ch;
		font-size: 20px;
		line-height: 1.5;
		color: var(--ink-2);
	}

	/* quiet posters: a soft tint of the part colour, ink type, no pictures */
	.posters {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 14px;
		margin-top: 64px;
	}
	/*
	 * Each poster spans two rows of the posters grid and shares them (subgrid):
	 * the name and blurb in the first, the list in the second. A row is as tall
	 * as its tallest poster, so the dividers line up even when a name wraps.
	 */
	.poster {
		display: grid;
		grid-row: span 2;
		grid-template-rows: subgrid;
		row-gap: 44px;
		padding: 18px 18px 16px;
		border-radius: 12px;
		background: color-mix(in srgb, var(--c) 13%, var(--bg));
		transition: background-color 0.15s ease-out;
	}
	.poster:hover,
	.poster:focus-within {
		background: color-mix(in srgb, var(--c) 22%, var(--bg));
	}
	.poster h3 {
		margin: 0;
		font-size: clamp(24px, 2.2vw, 30px);
		line-height: 1;
		color: var(--ink);
	}
	.blurb {
		margin: 10px 0 0;
		font-size: 14px;
		line-height: 1.45;
		color: var(--ink-2);
	}
	/* room for two links and a "more" line, so every divider sits at the same height */
	.poster ul {
		display: grid;
		align-content: start;
		gap: 4px;
		min-height: calc(10px + 4.2em + 8px);
		margin: 0;
		padding: 10px 0 0;
		list-style: none;
		border-top: 1px solid color-mix(in srgb, var(--c) 40%, var(--bg));
		font-size: 14px;
		line-height: 1.4;
	}
	.poster a {
		font-weight: 550;
		color: var(--ink);
		text-decoration: none;
	}
	.poster a:hover {
		color: var(--ink);
		text-decoration: underline;
		text-decoration-color: var(--c);
		text-decoration-thickness: 2px;
		text-underline-offset: 3px;
	}
	/* a poster's title links to its section page, where it has one */
	.poster a.title {
		font-weight: inherit;
		color: inherit;
		text-decoration: none;
	}
	.poster a.title:hover {
		text-decoration: underline;
		text-decoration-color: var(--c);
		text-decoration-thickness: 3px;
		text-underline-offset: 5px;
	}
	.more,
	a.more {
		font-weight: 400;
		color: var(--ink-2);
	}

	.page {
		max-width: 1120px;
		margin: 0 auto;
		padding: 72px 48px 40px;
	}

	/* ---- What's open, the promise ---- */
	h2,
	.open h3,
	.poster h3,
	.pledge {
		font-stretch: var(--display-stretch);
		font-weight: 650;
		letter-spacing: -0.025em;
	}
	h2 {
		margin: 0 0 22px;
		font-size: clamp(26px, 3vw, 34px);
		line-height: 1.1;
		color: var(--ink);
	}

	/* the newest page, big: its picture full width, its title over the bottom */
	.feat,
	.item {
		position: relative;
	}
	/* the newest page: words on the left, its picture on the right, nothing over it */
	.feat {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr);
		align-items: center;
		overflow: hidden;
		border: 1px solid var(--line);
		border-radius: 16px;
		/* the paper colour, so the picture (shot on paper) has no seam */
		background: var(--bg);
		transition: border-color 0.15s ease-out;
	}
	.feat img {
		order: 2;
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 4 / 3;
		object-fit: cover;
		object-position: 50% 45%;
	}
	.feat-text {
		padding: 32px 0 32px 36px;
	}
	.tag {
		display: inline-block;
		margin-bottom: 8px;
		padding: 3px 10px;
		border: 1px solid var(--line);
		border-radius: 99px;
		background: var(--surface);
		font-size: 12px;
		color: var(--ink);
	}
	.kicker {
		margin: 0;
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--accent);
	}
	.feat h3 {
		margin: 8px 0 0;
		font-size: clamp(34px, 4.4vw, 60px);
		line-height: 1;
	}
	.sum {
		margin: 12px 0 16px;
		max-width: 52ch;
		font-size: 17px;
		line-height: 1.5;
		color: var(--ink-2);
	}
	.link {
		color: var(--ink);
		text-decoration: none;
	}
	/* the whole card is the link */
	.link::after {
		content: '';
		position: absolute;
		inset: 0;
	}
	.go {
		display: inline-block;
		font-size: 17px;
		font-weight: 500;
		color: var(--ink);
		border-bottom: 1px solid var(--line);
		padding-bottom: 3px;
		transition: border-color 0.15s ease-out;
	}
	.feat:hover,
	.feat:focus-within {
		border-color: var(--ink-3);
	}
	.feat:hover .go,
	.item:hover .go {
		border-color: var(--accent);
	}

	/* the earlier pages: one line each */
	.item {
		display: grid;
		grid-template-columns: 120px minmax(0, 1fr) auto;
		gap: 24px;
		align-items: center;
		padding: 16px 0;
		border-bottom: 1px solid var(--line);
	}
	.feat + .item {
		margin-top: 8px;
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
	.item h3 {
		margin: 4px 0 0;
		font-size: 22px;
		line-height: 1.15;
	}
	.item:hover .link {
		color: var(--accent);
	}
	.item .go {
		border: 0;
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
	.promise {
		margin-top: 120px;
	}
	.pledge {
		margin: 0;
		max-width: 24ch;
		font-size: clamp(26px, 3.2vw, 38px);
		line-height: 1.15;
		color: var(--ink);
		text-wrap: balance;
	}
	.promise p:not(.pledge) {
		margin: 16px 0 0;
		max-width: 52ch;
		font-size: 17px;
		line-height: 1.55;
		color: var(--ink-2);
	}

	@media (max-width: 960px) {
		.posters {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (max-width: 860px) {
		.top {
			padding: 14px 20px 0;
		}
		.head {
			margin-top: 48px;
		}
		.posters {
			margin-top: 44px;
			gap: 10px;
		}
		.page {
			padding: 56px 20px 32px;
		}
		/* on a phone the text goes under the picture, so it doesn't hide it */
		.feat {
			grid-template-columns: minmax(0, 1fr);
		}
		.feat img {
			order: 0;
		}
		.feat-text {
			padding: 4px 20px 22px;
		}
		.item {
			grid-template-columns: 88px minmax(0, 1fr);
			gap: 16px;
		}
		.item .go {
			display: none;
		}
		.promise {
			margin-top: 80px;
		}
	}
	@media (max-width: 560px) {
		.posters {
			grid-template-columns: minmax(0, 1fr);
		}
		.poster {
			min-height: 0;
		}
		.poster {
			row-gap: 24px;
		}
		/* one poster per row: nothing to line up with, so no room held for a third line */
		.poster ul {
			min-height: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.feat,
		.go {
			transition: none;
		}
		.gear svg,
		.piston {
			animation: none;
		}
		.poster {
			transition: none;
		}
	}
</style>
