<!--
	Shown for an address that doesn't exist (404), and for any other error.
	On the live site, Cloudflare serves the build's 404.html for unknown
	addresses (wrangler.jsonc, not_found_handling), which boots the app and
	renders this page. Calm, like the homepage: one headline, one sentence,
	a way back, and the pages that are open.
-->
<script lang="ts">
	import { page } from '$app/state';
	import { articleRefs } from '#lib/content/articles.ts';
	import { openPages, SYSTEMS } from '#lib/content/systems.ts';

	const missing = $derived(page.status === 404);
	const pages = openPages(SYSTEMS, articleRefs);
</script>

<svelte:head>
	<title>{missing ? 'Not found' : 'Something went wrong'} · vmechs</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="page">
	<header class="bar">
		<a href="/" class="brand">vmechs</a>
	</header>

	<section class="what">
		<p class="code">{page.status}</p>
		<h1>{missing ? "This page isn't here." : 'Something went wrong.'}</h1>
		<p class="lede">
			{missing
				? 'The address may be mistyped, or the page may have moved.'
				: 'Try again in a moment, or start again from the beginning.'}
		</p>
		<a class="home" href="/">Back to the start <span aria-hidden="true">→</span></a>
	</section>

	{#if pages.length}
		<section class="open" aria-labelledby="open-title">
			<h2 id="open-title">Open now</h2>
			<ul>
				{#each pages as p (p.href)}
					<li><a href={p.href}>{p.title}</a></li>
				{/each}
			</ul>
		</section>
	{/if}
</div>

<style>
	.page {
		max-width: 1120px;
		margin: 0 auto;
		padding: 0 48px 64px;
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
	.what {
		padding: 96px 0 64px;
	}
	.code {
		margin: 0 0 12px;
		font-family: var(--mono);
		font-size: 14px;
		color: var(--ink-3);
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
		font-size: clamp(36px, 5vw, 64px);
		line-height: 1;
	}
	.lede {
		margin: 18px 0 0;
		max-width: 40ch;
		font-size: 18px;
		line-height: 1.5;
		color: var(--ink-2);
	}
	.home {
		display: inline-flex;
		gap: 8px;
		min-height: 44px;
		align-items: center;
		margin-top: 22px;
		font-size: 17px;
		font-weight: 500;
		color: var(--ink);
		text-decoration: underline;
		text-decoration-color: var(--accent);
		text-underline-offset: 6px;
	}
	h2 {
		font-size: 22px;
	}
	.open ul {
		list-style: none;
		margin: 14px 0 0;
		padding: 0;
		border-top: 1px solid var(--line);
	}
	.open li {
		border-bottom: 1px solid var(--line);
	}
	.open li a {
		display: block;
		padding: 14px 0;
		color: var(--ink);
		text-decoration: none;
	}
	.open li a:hover {
		color: var(--accent);
	}
	@media (max-width: 860px) {
		.page {
			padding: 0 20px 48px;
		}
		.bar {
			padding: 14px 0;
		}
		.what {
			padding: 56px 0 48px;
		}
	}
</style>
