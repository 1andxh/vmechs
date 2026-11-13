<!-- Loaded lazily by LazyCanvas, so three.js only downloads when this scrolls into view. -->
<script lang="ts">
	import { Canvas } from '@threlte/core';
	import EngineScene from './EngineScene.svelte';
	import type { PartId } from './parts.ts';

	let props: { selected?: PartId | null; onselect?: (id: PartId | null) => void } = $props();
</script>

<Canvas dpr={[1, 2]}>
	<EngineScene {...props} />
</Canvas>
