<!-- The gears lesson's stage: the 3D gear pair, filling the space. -->
<script lang="ts">
	import LazyCanvas from '../../components/LazyCanvas.svelte';
</script>

<div class="gears">
	<LazyCanvas
		load={() => import('./GearsCanvas.svelte')}
		label="Two gears in mesh, in 3D. The subtitles describe each step."
	/>
</div>

<style>
	.gears {
		position: absolute;
		inset: 0;
		touch-action: pan-y;
	}
</style>
