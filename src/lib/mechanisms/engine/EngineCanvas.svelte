<!-- Loaded lazily by LazyCanvas, so three.js only downloads when this scrolls into view. -->
<script lang="ts">
	import { Canvas } from '@threlte/core';
	import EngineScene from './EngineScene.svelte';
	import InkRenderer from './InkRenderer.svelte';
	import { createFlowShared, setFlow } from './v8/flow.ts';
	import type { PartId } from './parts.ts';

	let props: { selected?: PartId | null; onselect?: (id: PartId | null) => void } = $props();

	// InkRenderer shares its depth with the gas-flow pass (unused here, but expected)
	setFlow(createFlowShared());
</script>

<Canvas dpr={[1, 2]}>
	<EngineScene {...props} />
	<!-- colour-coded parts, outlined in a darker shade of their colour (ADR 0015) -->
	<InkRenderer mode="colour" weight={1.6} />
</Canvas>
