<!--
	The wheel and axle lesson's stage: the 3D machine, filling the space, with a
	quiet readout of the numbers in the corner (forces, advantage, how far each
	rope has moved), like the lever's. Both come from wheelAxleAt, the same as
	the scene.
-->
<script lang="ts">
	import LazyCanvas from '../../components/LazyCanvas.svelte';
	import ForcesReadout from '../studio/ForcesReadout.svelte';
	import { getCycle } from '../../animation/cycle.svelte.ts';
	import { wheelAxleAt } from './wheel-axle.ts';

	const cycle = getCycle();
	const now = $derived(wheelAxleAt(cycle.angle));
</script>

<div class="machine">
	<LazyCanvas
		load={() => import('./WheelAxleCanvas.svelte')}
		label="The wheel and axle, in 3D. The subtitles describe each step."
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
