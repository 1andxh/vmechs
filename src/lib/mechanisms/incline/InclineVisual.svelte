<!--
	The inclined plane lesson's stage: the 3D machine, filling the space, with a
	quiet readout of the numbers in the corner (forces, the advantage the forces
	show, how far the block has been pushed and how far it has risen), like the
	lever's. Both come from inclineAt, the same as the scene.
-->
<script lang="ts">
	import LazyCanvas from '../../components/LazyCanvas.svelte';
	import ForcesReadout from '../studio/ForcesReadout.svelte';
	import { getCycle } from '../../animation/cycle.svelte.ts';
	import { inclineAt } from './incline.ts';

	const cycle = getCycle();
	const now = $derived(inclineAt(cycle.angle));
</script>

<div class="machine">
	<LazyCanvas
		load={() => import('./InclineCanvas.svelte')}
		label="The inclined plane, in 3D. The subtitles describe each step."
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
