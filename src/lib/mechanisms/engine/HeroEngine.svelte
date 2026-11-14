<!--
	The homepage's engine: a static V8 drawn as a wireframe mesh. The drawing
	doesn't respond to dragging (pointer-events: none), so scrolling past it on
	a phone can't get stuck; only its part callouts, which are links, take
	clicks and taps.
-->
<script lang="ts">
	import LazyCanvas from '../../components/LazyCanvas.svelte';

	let { href }: { href: string } = $props();
</script>

<div class="hero-engine">
	<LazyCanvas load={() => import('./V8Canvas.svelte')} props={{ href }} />
</div>

<style>
	.hero-engine {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}
</style>
