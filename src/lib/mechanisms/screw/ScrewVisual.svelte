<!--
	The screw lesson's stage: the 3D machine, filling the space, with a
	quiet readout of the numbers in the corner (your push, the load, the
	advantage, how far your hand has gone round and how far the load has risen),
	like the lever's. Both come from screwAt, the same as the scene.
-->
<script lang="ts">
	import LazyCanvas from '../../components/LazyCanvas.svelte';
	import ForcesReadout from '../studio/ForcesReadout.svelte';
	import { getCycle } from '../../animation/cycle.svelte.ts';
	import { screwAt } from './screw.ts';

	const cycle = getCycle();
	const now = $derived(screwAt(cycle.angle));
</script>

<div class="machine">
	<LazyCanvas
		load={() => import('./ScrewCanvas.svelte')}
		label="The screw jack, in 3D. The subtitles describe each step."
	/>
	<ForcesReadout
		effort={now.effort}
		load={now.load}
		advantage={now.advantage}
		effortMoved={now.effortMoved}
		loadMoved={now.loadMoved}
	/>
</div>

<style>
	.machine {
		position: absolute;
		inset: 0;
		touch-action: pan-y;
	}
</style>
