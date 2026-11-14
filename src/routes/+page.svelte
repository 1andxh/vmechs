<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const byCategory = $derived(Map.groupBy(data.articles, (a) => a.category));
</script>

<svelte:head>
	<title>vmechs · How cars actually work</title>
</svelte:head>

<div class="home">
	<p class="brand">vmechs</p>
	<h1>See how a car works, part by part.</h1>
	<p class="lede">
		Interactive guides you can play, pause and take apart, from the engine to the transmission to
		the electronics.
	</p>

	{#each byCategory as [category, list] (category)}
		<section>
			<h2>{category}</h2>
			<ul>
				{#each list as a (a.slug)}
					<li>
						<a href="/learn/{a.category}/{a.slug}">
							<strong>{a.title}</strong>
							<span>{a.summary}</span>
							<em>{a.difficulty}</em>
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</div>

<style>
	.home {
		max-width: 860px;
		margin: 0 auto;
		padding: 24px 20px 80px;
	}
	.brand {
		margin: 0 0 56px;
		font-weight: 700;
		font-size: 18px;
		color: var(--ink-2);
	}
	h1 {
		margin: 0;
		font-size: clamp(30px, 5vw, 48px);
		line-height: 1.1;
		letter-spacing: -0.025em;
	}
	.lede {
		max-width: 56ch;
		color: var(--ink-2);
		font-size: 18px;
	}
	h2 {
		margin-top: 40px;
		font-size: 14px;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--ink-3);
	}
	ul {
		list-style: none;
		padding: 0;
		display: grid;
		gap: 12px;
	}
	a {
		display: grid;
		gap: 4px;
		padding: 18px 20px;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: var(--radius);
		color: var(--ink);
		text-decoration: none;
		transition: border-color 0.15s;
	}
	a:hover {
		border-color: var(--accent);
	}
	a span {
		color: var(--ink-2);
		font-size: 15px;
	}
	a em {
		font-style: normal;
		font-size: 12px;
		color: var(--ink-3);
	}
</style>
