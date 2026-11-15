<!--
	Bottom end: crankcase walls and oil pan (hollow, so the crankshaft has room
	to turn and shows through the section cut), bellhousing, mounts, oil
	filter and dipstick.
-->
<script lang="ts">
	import { T } from '@threlte/core';
	import { onDestroy } from 'svelte';
	import InkPart from '../InkPart.svelte';
	import { makeShapes } from './shapes.ts';

	const s = makeShapes();
	onDestroy(s.dispose);

	// The crankcase is its two side walls; the space between them is open, as
	// in a real block, for the crankshaft's throws and counterweights.
	const wall = s.prism(
		[
			[2.3, -1.5],
			[3, -1.5],
			[3, 1.1],
			[2.3, 1.1]
		],
		13,
		-6.5
	);
	// The oil pan: a tray with a lip where it bolts to the crankcase.
	const pan = s.prism(
		[
			[-2.7, -1.5],
			[-2.7, -1.62],
			[-2.5, -1.62],
			[-2.5, -3.1],
			[2.5, -3.1],
			[2.5, -1.62],
			[2.7, -1.62],
			[2.7, -1.5],
			[2.1, -1.5],
			[2.1, -2.7],
			[-2.1, -2.7],
			[-2.1, -1.5]
		],
		12,
		-5.6
	);
	const bolt = s.cyl(0.09, 0.09, 0.14, 10);
	const bellBolts = Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2);
	const filterRings = [-0.36, -0.18, 0, 0.18, 0.36];
	const dipstick = s.tube(
		[
			[-3.05, -0.7, -2.6],
			[-3.6, 1.6, -3],
			[-3.9, 4.2, -3.4]
		],
		0.05
	);
</script>

<!-- crankcase walls and oil pan: cut by the section plane -->
<T.Group userData={{ section: true }}>
	<InkPart geometry={wall} />
	<InkPart geometry={wall} rotation={[0, Math.PI, 0]} />
	<InkPart geometry={pan} />
</T.Group>

<!-- Bellhousing at the back, with its bolt circle -->
<InkPart geometry={s.cyl(3.6, 3, 1.6, 56)} position={[0, 1, 7.6]} rotation={[-Math.PI / 2, 0, 0]} />
{#each bellBolts as a (a)}
	<InkPart
		geometry={bolt}
		position={[Math.cos(a) * 3.35, 1 + Math.sin(a) * 3.35, 6.78]}
		rotation={[Math.PI / 2, 0, 0]}
	/>
{/each}

<!-- Engine mounts, one each side -->
{#each [-1, 1] as side (side)}
	<InkPart geometry={s.box(0.8, 1, 1.4, 0.15)} position={[side * 3.3, 0.2, -1.5]} />
	<InkPart
		geometry={s.cyl(0.42, 0.42, 0.5, 24)}
		position={[side * 3.95, 0.2, -1.5]}
		rotation={[0, 0, Math.PI / 2]}
	/>
{/each}

<!-- Oil filter on the right side, with its grip ribs -->
<InkPart
	geometry={s.cyl(0.55, 0.55, 1.2, 32)}
	position={[3.6, -0.9, -3.4]}
	rotation={[0, 0, Math.PI / 2]}
/>
{#each filterRings as dx (dx)}
	<InkPart
		geometry={s.torus(0.56, 0.03, 32)}
		position={[3.6 + dx, -0.9, -3.4]}
		rotation={[0, Math.PI / 2, 0]}
	/>
{/each}

<!-- Dipstick tube and handle -->
<InkPart geometry={dipstick} />
<InkPart geometry={s.torus(0.18, 0.05, 20)} position={[-3.9, 4.4, -3.4]} />
