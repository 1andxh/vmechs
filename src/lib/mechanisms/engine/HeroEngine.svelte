<!--
	The homepage's engine drawing, loaded lazily. It ignores the pointer
	(pointer-events: none), so scrolling past it on a phone can't get stuck;
	`tour` (scroll progress) is what moves it.
-->
<script lang="ts">
	import LazyCanvas from '../../components/LazyCanvas.svelte';
	import type { TourState } from './v8/explode.ts';

	let { tour }: { tour: TourState } = $props();
</script>

<div class="hero-engine">
	<LazyCanvas load={() => import('./V8Canvas.svelte')} props={{ tour }} />
</div>

<style>
	.hero-engine {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}
</style>
