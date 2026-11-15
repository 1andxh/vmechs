<!--
	Gas moving along one route (plumbing.ts), drawn as streaks over the ink
	drawing. Lives on the flow layer, so the ink pass never sees it; put it in
	the same group as its pipe so it moves with the pipe in the exploded view.
-->
<script lang="ts">
	import { T } from '@threlte/core';
	import { onDestroy, untrack } from 'svelte';
	import { BufferAttribute } from 'three';
	import type { V3 } from './frame.ts';
	import { FLOW_LAYER, flowMaterial, getFlow } from './flow.ts';
	import { curve, makeShapes } from './shapes.ts';

	let { route, color }: { route: V3[]; color: string } = $props();

	const s = makeShapes();
	const material = untrack(() => flowMaterial(getFlow(), color));
	onDestroy(() => {
		s.dispose();
		material.dispose();
	});

	// A thin tube down the route, with each vertex's distance along it.
	const geometry = untrack(() => {
		// four sides is plenty: the streaks are unlit, so their cross-section never shows
		const g = s.tube(route, 0.09, false, 4);
		const length = curve(route).getLength();
		const uv = g.attributes.uv;
		const dist = new Float32Array(uv.count);
		for (let i = 0; i < uv.count; i++) dist[i] = uv.getX(i) * length;
		g.setAttribute('aDist', new BufferAttribute(dist, 1));
		return g;
	});
</script>

<T.Mesh {geometry} {material} oncreate={(m) => void m.layers.set(FLOW_LAYER)} />
