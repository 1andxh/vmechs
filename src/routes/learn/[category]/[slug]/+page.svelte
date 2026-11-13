<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const Content = $derived(data.content);
</script>

<svelte:head>
	<title>{data.meta.title} · Mecha</title>
	<meta name="description" content={data.meta.summary} />
</svelte:head>

<!-- The article owns its whole layout (the lesson stage renders the h1). -->
<Content />
