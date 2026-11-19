<!--
	About vmechs: what it is, who it's for, how a page works, how accuracy is
	handled, and how to report a mistake (roadmap, Phase 1). Plain and calm,
	in the homepage's type; prerendered like every page.
-->
<script lang="ts">
	import PageMeta from '#lib/components/PageMeta.svelte';
	import { SITE } from '#lib/site.ts';

	const reportUrl = `${SITE.repo}/issues/new?template=report-a-mistake.yml`;
</script>

<PageMeta
	title="About"
	description="vmechs takes machines apart and sets them in motion: what it is, who it's for, how accuracy is handled, and how to report a mistake."
	path="/about"
	image="/covers/four-stroke-cycle.jpg"
/>

<div class="page">
	<header class="bar">
		<a href="/" class="brand">vmechs</a>
	</header>

	<article>
		<h1>Machines are easier to understand when you can watch them move.</h1>
		<p class="lede">
			vmechs takes machines apart and sets them in motion, one idea at a time: car engines and
			gearboxes, clocks and watches, the lever and the other simple machines, and the mechanisms
			they all share.
		</p>

		<section aria-labelledby="who">
			<h2 id="who">Who it’s for</h2>
			<p>
				Anyone curious about how things work, with no background needed, and engineering students
				who want the numbers behind the motion. Each page starts in plain words. The details, the
				formulas and the sources are one tap away, in its “All steps” sheet.
			</p>
		</section>

		<section aria-labelledby="how">
			<h2 id="how">How a page works</h2>
			<p>
				Each page shows one mechanism, driven by a single value, such as a crank angle or a push.
				Play it, pause it, or drag through it, and the subtitles explain each step as it happens.
				Nobody drew the motion by hand: it’s calculated from the same equations an engineer would
				use, and those calculations are tested.
			</p>
		</section>

		<section aria-labelledby="accuracy">
			<h2 id="accuracy">How accuracy is handled</h2>
			<ul>
				<li>Every page names its sources: textbooks, standards and handbooks.</li>
				<li>
					Every page says where it simplifies (no friction, idealised timing), and shows when it was
					last checked against its sources.
				</li>
				<li>The numbers on screen come from that tested code.</li>
			</ul>
			<p class="safety">
				vmechs explains how machines work. It never diagnoses a fault in your car, or in anything
				else.
			</p>
		</section>

		<section aria-labelledby="mistake">
			<h2 id="mistake">Spotted a mistake?</h2>
			<p>
				Every page ends with a “Report a mistake” link. It opens a short form on GitHub, with the
				page’s address already filled in (you’ll need a free GitHub account). Confirmed mistakes get
				fixed, and the page’s review date is updated.
			</p>
			<p>
				<a class="report" href={reportUrl} target="_blank" rel="noopener">Report a mistake</a>
				<span class="note">(opens GitHub)</span>
			</p>
		</section>
	</article>
</div>

<style>
	.page {
		max-width: 1120px;
		margin: 0 auto;
		padding: 0 48px 96px;
	}
	.bar {
		padding: 20px 0;
	}
	.brand {
		font-weight: 700;
		font-size: 18px;
		letter-spacing: -0.01em;
		color: var(--ink-2);
		text-decoration: none;
	}
	article {
		max-width: 680px;
		padding-top: 88px;
	}
	h1,
	h2 {
		margin: 0;
		font-stretch: var(--display-stretch);
		font-weight: 650;
		letter-spacing: -0.025em;
		color: var(--ink);
		text-wrap: balance;
	}
	h1 {
		font-size: clamp(34px, 4.6vw, 58px);
		line-height: 1.02;
	}
	.lede {
		margin: 22px 0 0;
		font-size: 20px;
		line-height: 1.55;
		color: var(--ink-2);
	}
	section {
		margin-top: 56px;
	}
	h2 {
		font-size: 22px;
		line-height: 1.2;
	}
	p,
	li {
		font-size: 17px;
		line-height: 1.65;
		color: var(--ink-2);
	}
	p {
		margin: 12px 0 0;
	}
	ul {
		margin: 12px 0 0;
		padding-left: 20px;
		display: grid;
		gap: 6px;
	}
	.safety {
		padding-left: 14px;
		border-left: 2px solid var(--accent);
		color: var(--ink);
	}
	.report {
		color: var(--ink);
		font-weight: 500;
		text-decoration: underline;
		text-decoration-color: var(--accent);
		text-underline-offset: 5px;
	}
	.note {
		font-size: 14px;
		color: var(--ink-3);
	}
	@media (max-width: 860px) {
		.page {
			padding: 0 20px 64px;
		}
		.bar {
			padding: 14px 0;
		}
		article {
			padding-top: 48px;
		}
		.lede {
			font-size: 18px;
		}
	}
</style>
