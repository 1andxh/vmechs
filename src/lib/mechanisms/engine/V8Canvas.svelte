<!-- Loaded lazily by LazyCanvas, so three.js only downloads when the homepage needs it. -->
<script lang="ts">
	import { Canvas } from '@threlte/core';
	import InkRenderer from './InkRenderer.svelte';
	import V8Scene from './V8Scene.svelte';

	let props: { href: string } = $props();
</script>

<Canvas dpr={[1, 2]}>
	<V8Scene {...props} />
	<InkRenderer />
</Canvas>
