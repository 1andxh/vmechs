<!--
	The 4-stroke lesson's stage: just the 3D engine, filling the space.
	Tapping a part names it in the scene (unit 3 restyles this).
-->
<script lang="ts">
	import LazyCanvas from '../../components/LazyCanvas.svelte';
	import type { PartId } from './parts.ts';

	let selected = $state<PartId | null>(null);
	const onselect = (id: PartId | null) => (selected = id);
</script>

<div class="engine">
	<LazyCanvas
		load={() => import('./EngineCanvas.svelte')}
		props={{ selected, onselect }}
		label="One cylinder of a four-stroke engine, cut in half, in 3D. The subtitles describe each step."
	/>
</div>

<style>
	.engine {
		position: absolute;
		inset: 0;
		touch-action: pan-y;
	}
</style>
