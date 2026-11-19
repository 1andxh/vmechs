<!-- A page's title, description, canonical address and share tags (see #lib/seo.ts). -->
<script lang="ts">
	import { pageMeta, type PageInfo } from '../seo.ts';

	let props: PageInfo = $props();
	const meta = $derived(pageMeta(props));
</script>

<svelte:head>
	<title>{meta.title}</title>
	<meta name="description" content={meta.description} />
	<link rel="canonical" href={meta.canonical} />
	{#each Object.entries(meta.og) as [property, content] (property)}
		<meta {property} {content} />
	{/each}
	{#each Object.entries(meta.twitter) as [name, content] (name)}
		<meta {name} {content} />
	{/each}
</svelte:head>
