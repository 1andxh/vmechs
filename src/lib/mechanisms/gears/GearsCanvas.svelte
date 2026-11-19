<!-- Loaded lazily by LazyCanvas, so three.js only downloads when the lesson needs it. -->
<script lang="ts">
	import { Canvas } from '@threlte/core';
	import GearsScene from './GearsScene.svelte';
	import InkRenderer from '../engine/InkRenderer.svelte';
	import { createFlowShared, setFlow } from '../engine/v8/flow.ts';

	setFlow(createFlowShared());
</script>

<Canvas dpr={[1, 2]}>
	<GearsScene />
	<!-- colour-coded gears, outlined in a darker shade of their colour (ADR 0015) -->
	<InkRenderer mode="colour" weight={1.6} />
</Canvas>
