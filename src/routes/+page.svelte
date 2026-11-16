<!--
	Landing page. One job: make someone want to look inside a car, then let
	them in. The signature is the ink-drawn V8, which comes apart as you
	scroll, like an exploded technical drawing: one group of parts per screen,
	one sentence about each, then the way in. No course language: this is a
	machine to explore, not a class to enrol in.

	The sentences are ordinary paragraphs in reading order (pinned with CSS
	sticky), so screen readers and no-WebGL browsers get the same tour.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { beforeNavigate } from '$app/navigation';
	import HeroEngine from '#lib/mechanisms/engine/HeroEngine.svelte';
	import {
		STAGES,
		follow,
		tourProgress,
		type TourState
	} from '#lib/mechanisms/engine/v8/explode.ts';
	import { parseEmphasis } from '#lib/content/steps.ts';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	// Where the way in leads: the first page that exists, in system order.
	const entry = $derived(data.systems.flatMap((s) => s.lessons).find((l) => l.available));

	const tour = $state<TourState>({ progress: 0, still: false, running: false });

	// Leaving for another page: stop the engine first. Where WebGL is drawn in
	// software (no GPU), each running frame takes tens of milliseconds, and the
	// next page's code has to run between those frames: a link click could
	// take seconds to arrive. The page is going away, so nothing visible is lost.
	let leaving = false;
	beforeNavigate(({ to }) => {
		if (to?.url.pathname === location.pathname) return;
		leaving = true;
		tour.running = false;
	});

	// `?fps` shows a frame-rate readout, for checking performance on a phone;
	// it's only downloaded when asked for.
	let FrameRate = $state<typeof import('#lib/components/FrameRate.svelte').default>();
	onMount(() => {
		if (new URLSearchParams(location.search).has('fps')) {
			import('#lib/components/FrameRate.svelte').then((m) => (FrameRate = m.default));
		}
	});
	let tourEl: HTMLElement;

	/** Scroll position in stage units: 0 at the headline, 1 per screen after. */
	const t = $derived(tour.progress * (STAGES.length - 1));
	/** Each sentence is fully shown while its parts arrive, and gone halfway to the next. */
	const shown = (i: number) => Math.min(1, Math.max(0, 2.2 - 4.5 * Math.abs(t - i)));

	onMount(() => {
		tour.still = matchMedia('(prefers-reduced-motion: reduce)').matches;
		// Scroll sets where the drawing should be; each frame it glides part of
		// the way there (follow), so wheel steps become smooth motion. The loop
		// runs only until it arrives.
		let target = 0;
		let frame = 0;
		let last = 0;
		const glide = (now: number) => {
			const dt = Math.min(0.1, (now - last) / 1000);
			last = now;
			tour.progress = tour.still ? target : follow(tour.progress, target, dt);
			frame = tour.progress === target ? 0 : requestAnimationFrame(glide);
		};
		const onScroll = () => {
			target = tourProgress(tourEl.getBoundingClientRect().top, innerHeight);
			if (!frame) {
				last = performance.now();
				frame = requestAnimationFrame(glide);
			}
		};
		// Start where the page already is (e.g. after a reload part-way down).
		tour.progress = target = tourProgress(tourEl.getBoundingClientRect().top, innerHeight);
		addEventListener('scroll', onScroll, { passive: true });
		addEventListener('resize', onScroll);
		// The engine runs only while the tour is on screen (and motion is allowed),
		// so it costs nothing while you read the rest of the page.
		const seen = new IntersectionObserver(
			([e]) => (tour.running = e.isIntersecting && !tour.still && !leaving)
		);
		seen.observe(tourEl);
		return () => {
			removeEventListener('scroll', onScroll);
			removeEventListener('resize', onScroll);
			cancelAnimationFrame(frame);
			seen.disconnect();
		};
	});
</script>

<svelte:head>
	<title>vmechs · How cars actually work</title>
	<meta
		name="description"
		content="How cars actually work, taken apart and set in motion: engines, transmissions, brakes and more, as interactive 3D you can explore."
	/>
</svelte:head>

{#if FrameRate}<FrameRate />{/if}

<header class="bar">
	<a href="/" class="brand" aria-current="page">vmechs</a>
</header>

<section class="tour" bind:this={tourEl} aria-label="A V8 engine, taken apart">
	<div class="stage" style:--into={Math.min(1, t)}><HeroEngine {tour} /></div>

	<div class="steps">
		<div class="step opening">
			<div class="intro">
				<h1>Look inside the machine.</h1>
				<p class="lede">How cars actually work, taken apart and set in motion.</p>
				{#if entry?.href}
					<a class="way-in" href={entry.href}
						>See inside the engine <span aria-hidden="true">→</span></a
					>
				{/if}
			</div>
			<p class="hint" aria-hidden="true">Scroll to take it apart <span>↓</span></p>
		</div>
		<!-- A sentence stays pinned for most of its screen; this offset centres
		     that stretch on the moment its parts arrive. -->
		<div class="lead-in"></div>

		{#each STAGES.slice(1) as stage, k (stage.text)}
			{@const i = k + 1}
			<div class="step">
				<div class="caption" style:opacity={shown(i)}>
					<p class="line">
						{#each parseEmphasis(stage.text) as seg, j (j)}{#if seg.hl}<span class="hl"
									>{seg.text}</span
								>{:else}{seg.text}{/if}{/each}
					</p>
					{#if i === STAGES.length - 1 && entry?.href}
						<a class="way-in" href={entry.href}>See it run <span aria-hidden="true">→</span></a>
					{/if}
				</div>
			</div>
		{/each}
	</div>
</section>

<div class="below">
	<section class="open" aria-labelledby="open-title">
		<h2 id="open-title">Open now</h2>
		{#each data.open as page (page.href)}
			<article class="feature">
				{#if page.cover}
					<img src={page.cover} alt="" width="1280" height="860" loading="lazy" decoding="async" />
				{/if}
				<div class="feature-text">
					<!-- The title's link covers the whole card (see .feature h3 a::after). -->
					<h3><a href={page.href}>{page.title}</a></h3>
					<p>{page.summary}</p>
					<p class="meta">{page.steps} steps · play, pause or drag through them</p>
					<span class="go" aria-hidden="true">See it run →</span>
				</div>
			</article>
		{/each}
	</section>

	<section class="car" aria-labelledby="car-title">
		<h2 id="car-title">The whole car</h2>
		<ul class="tiles">
			{#each data.systems as system (system.id)}
				{@const total = system.lessons.length}
				{@const first = system.lessons.find((l) => l.href)}
				<li class="tile">
					<h3>{system.name}</h3>
					<p>{system.blurb}</p>
					<!-- One segment per planned page, lit once it's open; the count below says the same in words. -->
					<div class="segments" aria-hidden="true">
						{#each system.lessons as page (page.title)}<i class:on={page.available}></i>{/each}
					</div>
					<p class="count">
						<span
							>{system.available
								? `${system.available} of ${total} open`
								: `${total} on the way`}</span
						>
						{#if first?.href}
							<a href={first.href}
								>Open<span class="sr-only">{` ${system.name}`}</span>
								<span aria-hidden="true">→</span></a
							>
						{/if}
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
		<span>How cars actually work · © 2026</span>
	</footer>
</div>

<style>
	/* ---- The tour: a sticky stage under screen-tall steps ---- */
	.bar {
		position: absolute;
		inset: 0 0 auto;
		z-index: 2;
		max-width: 1440px;
		margin: 0 auto;
		padding: 20px 48px;
	}
	.brand {
		font-weight: 700;
		font-size: 18px;
		letter-spacing: -0.01em;
		color: var(--ink-2);
		text-decoration: none;
	}
	.tour {
		position: relative;
	}
	.stage {
		position: sticky;
		top: 0;
		height: 100svh;
	}
	/* during the tour, the drawing fades out under the sentences */
	.stage::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: linear-gradient(to top, var(--bg) 18%, transparent 34%);
		opacity: var(--into, 0);
	}
	.steps {
		position: relative;
		z-index: 1;
		margin-top: -100svh;
	}
	.step {
		height: 100svh;
	}
	.lead-in {
		height: 27svh;
	}

	/* the opening screen: the words left of the engine (wide), under it (narrow) */
	.opening {
		position: relative;
		display: grid;
		align-items: center;
		max-width: 1440px;
		margin: 0 auto;
		padding: 0 48px;
	}
	.intro {
		max-width: 560px;
	}
	h1 {
		margin: 0;
		font-size: clamp(40px, 5vw, 76px);
		line-height: 0.98;
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
	.hint {
		position: absolute;
		left: 0;
		right: 0;
		bottom: 28px;
		margin: 0;
		text-align: center;
		font-size: 14px;
		color: var(--ink-3);
	}

	/* each later step: one sentence, pinned at subtitle height while its step passes */
	.caption {
		position: sticky;
		top: 76svh;
		padding: 0 24px;
		text-align: center;
	}
	.line {
		max-width: 780px;
		margin: 0 auto;
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
	.caption .way-in {
		margin-top: 14px;
	}

	/* ---- Below the tour: what's open, the whole car, the promise ---- */
	h1,
	h2,
	.feature h3,
	.pledge,
	.wordmark {
		font-stretch: var(--display-stretch);
		font-weight: 650;
		letter-spacing: -0.025em;
	}
	.below {
		max-width: 1120px;
		margin: 0 auto;
		padding: 96px 48px 40px;
	}
	h2 {
		margin: 0 0 22px;
		font-size: clamp(26px, 3vw, 34px);
		line-height: 1.1;
		color: var(--ink);
	}

	.feature {
		position: relative;
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
		gap: 40px;
		align-items: center;
		padding: 28px;
		border: 1px solid var(--line);
		border-radius: 16px;
		background: var(--surface);
		transition: border-color 0.15s ease-out;
	}
	.feature:hover,
	.feature:focus-within {
		border-color: var(--ink-3);
	}
	.feature img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 10px;
	}
	.feature h3 {
		margin: 0;
		font-size: clamp(24px, 2.6vw, 30px);
		line-height: 1.12;
	}
	.feature h3 a {
		color: var(--ink);
		text-decoration: none;
	}
	/* the whole card is the link */
	.feature h3 a::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: 16px;
	}
	.feature-text p {
		margin: 12px 0 0;
		font-size: 17px;
		line-height: 1.55;
		color: var(--ink-2);
	}
	.feature-text .meta {
		font-size: 15px;
		color: var(--ink-3);
	}
	.go {
		display: inline-block;
		margin-top: 22px;
		font-size: 17px;
		font-weight: 500;
		color: var(--ink);
		text-decoration: underline;
		text-decoration-color: var(--line);
		text-underline-offset: 6px;
	}
	.feature:hover .go {
		text-decoration-color: var(--accent);
	}

	.car {
		margin-top: 96px;
	}
	.tiles {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1px;
		background: var(--line);
		border: 1px solid var(--line);
		border-radius: 16px;
		overflow: hidden;
	}
	.tile {
		display: flex;
		flex-direction: column;
		padding: 24px 24px 20px;
		background: var(--bg);
	}
	.tile h3 {
		margin: 0;
		font-size: 21px;
		font-weight: 600;
		color: var(--ink);
	}
	.tile p {
		margin: 6px 0 18px;
		font-size: 15px;
		line-height: 1.5;
		color: var(--ink-3);
	}
	.segments {
		display: flex;
		gap: 4px;
		margin-top: auto;
	}
	.segments i {
		flex: 1;
		height: 3px;
		border-radius: 2px;
		background: var(--line);
	}
	.segments i.on {
		background: var(--accent);
	}
	.tile .count {
		display: flex;
		justify-content: space-between;
		align-items: center;
		min-height: 32px;
		margin: 8px 0 0;
		font-size: 14px;
		color: var(--ink-3);
	}
	.count a {
		font-size: 15px;
		font-weight: 500;
		color: var(--ink);
		text-decoration: none;
	}
	.count a:hover {
		color: var(--accent);
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
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0 0 0 0);
		white-space: nowrap;
	}

	@media (max-width: 860px) {
		.bar {
			padding: 14px 20px;
		}
		.opening {
			align-items: end;
			padding: 0 24px 72px;
		}
		.caption {
			top: 70svh;
		}
		.below {
			padding: 72px 20px 32px;
		}
		.feature {
			grid-template-columns: minmax(0, 1fr);
			gap: 20px;
			padding: 16px 16px 22px;
		}
		.tiles {
			grid-template-columns: minmax(0, 1fr);
		}
		.car,
		.promise {
			margin-top: 80px;
		}
		.foot {
			flex-direction: column;
			margin-top: 80px;
		}
	}
	@media (min-width: 861px) and (max-width: 1080px) {
		.tiles {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.way-in,
		.feature {
			transition: none;
		}
	}
</style>
