<!--
	Landing page, laid out as an engineering drawing sheet (ADR 0012): the
	running ink V8 with a list of its parts beside it, each leading to the page
	that has, or will have, it. Pointing at a part lights it in the
	accent ink. Then what's open, and the whole car. No course language: this
	is a machine to explore, not a class to enrol in.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { beforeNavigate } from '$app/navigation';
	import HeroEngine from '#lib/mechanisms/engine/HeroEngine.svelte';
	import { PARTS, type Part, type SheetState } from '#lib/mechanisms/engine/v8/sheet.ts';
	import PageMeta from '#lib/components/PageMeta.svelte';
	import { planTotals } from '#lib/content/systems.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const totals = $derived(planTotals(data.systems));
	// "Open now" features the newest page (data.open is newest first); the rest follow as a list.
	const [newest, ...earlier] = $derived(data.open);
	const engine = $derived(data.systems.find((s) => s.id === 'engine')!);
	// Each part with its page: open pages link, the rest are on the way.
	const parts = $derived(
		PARTS.map((p) => ({ ...p, page: engine.lessons.find((l) => l.slug === p.slug)! }))
	);

	const sheet = $state<SheetState>({ running: false, active: null, drawn: false });
	const point = (part: Part | null) => () => (sheet.active = part);

	// Leaving for another page: stop the engine first. Where WebGL is drawn in
	// software (no GPU), each running frame takes tens of milliseconds, and the
	// next page's code has to run between those frames.
	let leaving = false;
	beforeNavigate(({ to }) => {
		if (to?.url.pathname === location.pathname) return;
		leaving = true;
		sheet.running = false;
	});

	let drawEl: HTMLElement;
	onMount(() => {
		// The engine runs only while it's on screen and motion is allowed.
		const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const seen = new IntersectionObserver(
			([e]) => (sheet.running = e.isIntersecting && !still && !leaving)
		);
		seen.observe(drawEl);
		return () => seen.disconnect();
	});
</script>

<PageMeta
	title=""
	description="How machines actually work, taken apart and set in motion: engines, gears, clocks, simple machines and more, as interactive 3D you can explore."
	path="/"
	image="/covers/four-stroke-cycle.jpg"
/>

<section class="sheet" aria-labelledby="sheet-title" data-drawn={sheet.drawn || undefined}>
	<header class="bar">
		<a href="/" class="brand" aria-current="page">vmechs</a>
		<span class="sheet-no">Sheet 1 · Engine</span>
	</header>

	<div class="top">
		<div class="draw" bind:this={drawEl}>
			<HeroEngine {sheet} />
		</div>

		<div class="legend">
			<h1 id="sheet-title">Look inside the <span class="hl">machine.</span></h1>
			<p class="lede">
				Pick a part. Each one opens into a page that takes it apart and sets it running.
			</p>
			<ol class="parts" aria-label="Parts of the engine">
				{#each parts as part (part.n)}
					<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
					<li
						class:on={part.page.available}
						class:lit={sheet.active === part.part}
						onpointerenter={point(part.part)}
						onpointerleave={point(null)}
					>
						<b aria-hidden="true">{part.n}</b>
						{#if part.page.href}
							<a href={part.page.href} onfocus={point(part.part)} onblur={point(null)}>
								<span class="part">{part.name}</span>
								<span class="dest">{part.page.title}</span>
							</a>
						{:else}
							<div>
								<span class="part">{part.name}</span>
								<span class="dest">{part.page.title}{' · on the way'}</span>
							</div>
						{/if}
					</li>
				{/each}
			</ol>
			<dl class="block">
				<dt>Drawing</dt>
				<dd>Twin-turbo V8</dd>
				<dt>Pages open</dt>
				<dd>{totals.open} of {totals.open + totals.coming}</dd>
			</dl>
		</div>
	</div>
</section>

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

	<!-- What vmechs covers (ADR 0014): machines, then the mechanisms inside them. -->
	<section class="machines" aria-labelledby="machines-title">
		<h2 id="machines-title">Machines</h2>
		<div class="machine-grid">
			{#each data.machines as m (m.id)}
				<article class="machine">
					<div class="pic">
						{#if m.cover}
							<img
								src={m.cover.src}
								class:drawing={m.cover.src.endsWith('.svg')}
								alt=""
								width={m.cover.width}
								height={m.cover.height}
								loading="lazy"
								decoding="async"
							/>
						{:else}
							<span>Drawing comes with its first page</span>
						{/if}
					</div>
					<div class="machine-text">
						<h3>{m.name}</h3>
						<p>{m.blurb}</p>
						<p class="count">
							{m.open.length
								? `${m.open.length} open of ${m.planned} planned`
								: `${m.planned} planned`}
						</p>
						{#each m.open as page (page.href)}
							<a href={page.href}>{page.title} <span aria-hidden="true">→</span></a>
						{/each}
					</div>
				</article>
			{/each}
		</div>
	</section>

	<section class="mechanisms" aria-labelledby="mechanisms-title">
		<h2 id="mechanisms-title">Mechanisms</h2>
		<p class="sub">The same few ideas run through every machine.</p>
		<ul class="mech-grid">
			{#each data.mechanisms as m (m.id)}
				<li class:on={m.href}>
					{#if m.href}
						<a href={m.href}>{m.name} <span aria-hidden="true">→</span></a>
					{:else}
						<span class="name">{m.name}</span>
					{/if}
					<p class="found">
						Found in {#each m.foundIn as place, i (place)}{#if i}<span class="sr-only">{', '}</span
								>{/if}<span class="chip">{place}</span>{/each}
					</p>
				</li>
			{/each}
		</ul>
	</section>

	<section class="promise" aria-label="Accuracy">
		<p class="pledge">Every page names its sources and says where it simplifies.</p>
		<p>
			Spot something wrong? Each page has a link to report it, and shows when it was last checked.
		</p>
	</section>

	<footer class="foot">
		<span class="wordmark">vmechs</span>
		<span><a href="/about">About</a> · How machines actually work · © 2026</span>
	</footer>
</div>

<style>
	/* ---- The drawing sheet: a faint grid, the engine, its parts list ---- */
	.sheet {
		position: relative;
		max-width: 1280px;
		margin: 0 auto;
		padding: 20px 48px 56px;
		background-image:
			linear-gradient(var(--line) 1px, transparent 1px),
			linear-gradient(90deg, var(--line) 1px, transparent 1px);
		background-size: 80px 80px;
		background-position: -1px -1px;
	}
	/* the grid fades out towards the edges, like light falling off a sheet */
	.sheet::before {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(ellipse at 45% 50%, transparent 25%, var(--bg) 72%);
		pointer-events: none;
	}
	.bar {
		position: relative;
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
	.sheet-no {
		font-size: 14px;
		font-weight: 600;
		color: var(--ink-2);
	}
	.top {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1fr) 380px;
		gap: 32px;
		align-items: center;
		margin-top: 12px;
	}
	.draw {
		position: relative;
		aspect-ratio: 1.28;
	}
	h1 {
		margin: 0;
		font-size: clamp(40px, 4.2vw, 62px);
		line-height: 0.95;
		color: var(--ink);
		text-wrap: balance;
	}
	.hl {
		color: var(--accent);
	}
	.lede {
		margin: 16px 0 26px;
		font-size: 18px;
		line-height: 1.45;
		color: var(--ink-2);
	}
	.parts {
		list-style: none;
		margin: 0;
		padding: 0;
		border-top: 1px solid var(--line);
	}
	.parts li {
		display: flex;
		gap: 14px;
		align-items: start;
		padding: 13px 0;
		border-bottom: 1px solid var(--line);
	}
	.parts b {
		flex: none;
		display: grid;
		place-items: center;
		width: 26px;
		height: 26px;
		border: 1px solid var(--ink-3);
		border-radius: 50%;
		font-size: 12px;
		color: var(--ink-2);
	}
	.parts li.on b {
		border-color: var(--accent);
		background: var(--accent);
		color: #1a1206;
	}
	.parts li.lit b {
		border-color: var(--accent);
	}
	.parts a {
		text-decoration: none;
	}
	.part {
		display: block;
		font-weight: 600;
		color: var(--ink);
	}
	.dest {
		display: block;
		font-size: 14px;
		color: var(--ink-3);
	}
	.parts li.on .dest {
		color: var(--accent);
	}
	.parts a:hover .part,
	.parts li.lit .part {
		color: var(--accent);
	}
	/* the title block in a drawing's corner */
	.block {
		display: grid;
		grid-template-columns: auto auto;
		gap: 4px 18px;
		width: max-content;
		margin: 26px 0 0 auto;
		padding: 12px 16px;
		border: 1px solid var(--line);
		background: var(--bg);
		font-size: 12px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.block dt {
		color: var(--ink-3);
	}
	.block dd {
		margin: 0;
		font-weight: 600;
		color: var(--ink-2);
	}
	/* ---- Below the sheet ---- */
	.page {
		max-width: 1120px;
		margin: 0 auto;
		padding: 72px 48px 40px;
	}

	/* ---- What's open, the whole car, the promise ---- */
	h1,
	h2,
	.open h3,
	.machine h3,
	.pledge,
	.wordmark {
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
	.feat {
		overflow: hidden;
		border: 1px solid var(--line);
		border-radius: 16px;
		transition: border-color 0.15s ease-out;
	}
	.feat img {
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 16 / 7;
		object-fit: cover;
		object-position: 50% 45%;
	}
	.feat-text {
		position: absolute;
		inset: auto 0 0;
		padding: 120px 36px 32px;
		background: linear-gradient(to top, var(--bg) 35%, transparent);
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

	/* ---- Machines and mechanisms (ADR 0014) ---- */
	.machines {
		margin-top: 96px;
	}
	.machine-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 16px;
	}
	.machine {
		display: flex;
		flex-direction: column;
		overflow: hidden;
		border: 1px solid var(--line);
		border-radius: 14px;
		background: var(--surface);
	}
	.machine .pic {
		display: grid;
		place-items: center;
		aspect-ratio: 16 / 10;
		/* clip, so a picture can't stretch the box past its ratio */
		overflow: hidden;
		background: var(--bg);
		font-size: 13px;
		color: var(--ink-3);
	}
	.machine .pic img {
		display: block;
		width: 100%;
		height: 100%;
		/* a still from a lesson fills the card (its edges are empty stage) */
		object-fit: cover;
	}
	/* a line drawing is shown whole, centred, with room around it */
	.machine .pic img.drawing {
		object-fit: contain;
		padding: 0 8%;
	}
	.machine-text {
		display: grid;
		gap: 6px;
		padding: 16px 18px 20px;
	}
	.machine h3 {
		margin: 0;
		font-size: 22px;
		line-height: 1.15;
	}
	.machine-text p {
		margin: 0;
		font-size: 15px;
		line-height: 1.5;
		color: var(--ink-2);
	}
	.machine .count {
		font-size: 13px;
		color: var(--ink-3);
	}
	.machine a,
	.mech-grid a {
		font-size: 15px;
		font-weight: 500;
		color: var(--accent);
		text-decoration: none;
	}
	.machine a:hover,
	.mech-grid a:hover {
		text-decoration: underline;
		text-underline-offset: 4px;
	}
	.mechanisms {
		margin-top: 72px;
	}
	.mechanisms h2 {
		margin-bottom: 6px;
	}
	.sub {
		margin: 0 0 18px;
		font-size: 16px;
		color: var(--ink-3);
	}
	.mech-grid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		column-gap: 20px;
		border-top: 1px solid var(--line);
	}
	.mech-grid li {
		display: grid;
		align-content: start;
		gap: 6px;
		padding: 14px 0;
		border-bottom: 1px solid var(--line);
	}
	.mech-grid .name {
		font-size: 15px;
		font-weight: 600;
		color: var(--ink-2);
	}
	.found {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 4px;
		margin: 0;
		font-size: 12px;
		color: var(--ink-3);
	}
	.chip {
		padding: 1px 8px;
		border: 1px solid var(--line);
		border-radius: 999px;
		font-size: 11px;
		font-weight: 600;
		letter-spacing: 0.03em;
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

	.foot {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 16px;
		margin-top: 120px;
		padding-top: 24px;
		border-top: 1px solid var(--line);
		font-size: 14px;
		color: var(--ink-3);
	}
	.wordmark {
		font-size: 18px;
		color: var(--ink-2);
	}
	.foot a {
		color: var(--ink-2);
	}
	.foot a:hover {
		color: var(--accent);
	}

	@media (max-width: 860px) {
		.sheet {
			padding: 14px 20px 40px;
		}
		.top {
			grid-template-columns: minmax(0, 1fr);
			gap: 8px;
		}
		.block {
			margin-left: 0;
		}
		.page {
			padding: 56px 20px 32px;
		}
		/* on a phone the text goes under the picture, so it doesn't hide it */
		.feat img {
			aspect-ratio: 4 / 3;
		}
		.feat-text {
			position: static;
			padding: 4px 20px 22px;
			background: none;
		}
		.item {
			grid-template-columns: 88px minmax(0, 1fr);
			gap: 16px;
		}
		.item .go {
			display: none;
		}
		.machines,
		.promise {
			margin-top: 80px;
		}
		.machine-grid,
		.mech-grid {
			grid-template-columns: minmax(0, 1fr);
		}
		.foot {
			flex-direction: column;
			margin-top: 80px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.feat,
		.go {
			transition: none;
		}
	}
</style>
