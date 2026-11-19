<!-- Loaded lazily by LazyCanvas, so three.js only downloads when the homepage needs it. -->
<script lang="ts">
	import { Canvas } from '@threlte/core';
	import InkRenderer from './InkRenderer.svelte';
	import V8Scene from './V8Scene.svelte';
	import type { SheetState } from './v8/sheet.ts';
	import { sectionZ } from './v8/internals.ts';
	import { createFlowShared, setFlow } from './v8/flow.ts';

	let { sheet }: { sheet: SheetState } = $props();

	// shared by the renderer and the gas flow lines (see v8/flow.ts)
	setFlow(createFlowShared());
</script>

<Canvas dpr={[1, 2]}>
	<V8Scene {sheet} />
	<!-- pointing at the pistons cuts the block open to show them -->
	<!-- colour-coded parts, outlined in a darker shade of their colour (ADR 0015) -->
	<InkRenderer mode="colour" weight={1.3} sectionZ={sectionZ(1)} />
</Canvas>
