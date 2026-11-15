<!-- Loaded lazily by LazyCanvas, so three.js only downloads when the homepage needs it. -->
<script lang="ts">
	import { Canvas } from '@threlte/core';
	import InkRenderer from './InkRenderer.svelte';
	import V8Scene from './V8Scene.svelte';
	import { explodeAt, type TourState } from './v8/explode.ts';
	import { sectionZ } from './v8/internals.ts';
	import { createFlowShared, setFlow } from './v8/flow.ts';

	let { tour }: { tour: TourState } = $props();

	// shared by the renderer and the gas flow lines (see v8/flow.ts)
	setFlow(createFlowShared());
</script>

<Canvas dpr={[1, 2]}>
	<V8Scene {tour} />
	<!-- the section cuts in as the heads come off -->
	<InkRenderer sectionZ={sectionZ(tour.still ? 0 : explodeAt(tour.progress).heads)} />
</Canvas>
