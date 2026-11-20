<!--
	The wedge lesson's stage: the 3D machine, filling the space, with a
	quiet readout of the numbers in the corner (your push, the force pressing
	each side apart, the advantage, how far the wedge has gone in and how far the
	wood has opened), like the lever's. Both come from wedgeAt, the same as the
	scene.
-->
<script lang="ts">
	import LazyCanvas from '../../components/LazyCanvas.svelte';
	import ForcesReadout from '../studio/ForcesReadout.svelte';
	import { getCycle } from '../../animation/cycle.svelte.ts';
	import { wedgeAt } from './wedge.ts';

	const cycle = getCycle();
	const now = $derived(wedgeAt(cycle.angle));
</script>

<div class="machine">
	<LazyCanvas
		load={() => import('./WedgeCanvas.svelte')}
		label="The wedge, in 3D. The subtitles describe each step."
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
