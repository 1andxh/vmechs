<!--
	The homepage's engine drawing, loaded lazily. It ignores the pointer
	(pointer-events: none), so scrolling past it on a phone can't get stuck;
	the parts list beside it is what you point at.
-->
<script lang="ts">
	import LazyCanvas from '../../components/LazyCanvas.svelte';
	import type { SheetState } from './v8/sheet.ts';

	let { sheet }: { sheet: SheetState } = $props();
</script>

<div class="hero-engine">
	<LazyCanvas
		load={() => import('./V8Canvas.svelte')}
		props={{ sheet }}
		label="A twin-turbo V8, running, drawn in ink. The list beside it names its parts."
	/>
</div>

<style>
	.hero-engine {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}
</style>
