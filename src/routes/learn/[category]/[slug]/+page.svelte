<script lang="ts">
	import { page } from '$app/state';
	import PageMeta from '#lib/components/PageMeta.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	const Content = $derived(data.content);
</script>

<!-- a lesson shares its own cover; one without a cover yet shares the engine's -->
<PageMeta
	title={data.meta.title}
	description={data.meta.summary}
	path={page.url.pathname}
	image={data.meta.cover ?? '/covers/four-stroke-cycle.jpg'}
/>

<!-- The article owns its whole layout (the lesson stage renders the h1). -->
<Content />
