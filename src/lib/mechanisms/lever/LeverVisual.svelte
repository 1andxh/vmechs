<!--
	The lever lesson's stage: the 3D lever, filling the space, with a quiet
	readout of the numbers in the corner (forces, advantage, how far each end
	has moved). Beginners can ignore it; students get the real values. Both come
	from leverAt, the same as the scene.
-->
<script lang="ts">
	import LazyCanvas from '../../components/LazyCanvas.svelte';
	import ForcesReadout from '../studio/ForcesReadout.svelte';
	import { getCycle } from '../../animation/cycle.svelte.ts';
	import { leverAt } from './lever.ts';

	const cycle = getCycle();
	const now = $derived(leverAt(cycle.angle));
</script>

<div class="lever">
	<LazyCanvas
		load={() => import('./LeverCanvas.svelte')}
		label="The lever, in 3D. The subtitles describe each step."
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
	.lever {
		position: absolute;
		inset: 0;
		touch-action: pan-y;
	}
</style>
