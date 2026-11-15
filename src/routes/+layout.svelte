<script lang="ts">
	// Archivo with its width axis: wide for headlines, normal width for reading.
	import '@fontsource-variable/archivo/wdth.css';
	import '../app.css';
	import favicon from '#lib/assets/favicon.svg';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<!-- No global header: each page owns its chrome (the lesson stage has its own minimal bar). -->
<main>
	{@render children()}
</main>
