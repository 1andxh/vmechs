<!-- Bottom end: crankcase, oil pan with its flange lip, bellhousing, mounts, oil filter, dipstick. -->
<script lang="ts">
	import { onDestroy } from 'svelte';
	import InkPart from '../InkPart.svelte';
	import { makeShapes } from './shapes.ts';

	const s = makeShapes();
	onDestroy(s.dispose);

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

<InkPart geometry={s.box(6, 2.6, 13, 0.3)} position={[0, -0.2, 0]} />
<InkPart geometry={s.box(5.4, 0.22, 12.6, 0.08)} position={[0, -1.45, 0.4]} detail />
<InkPart geometry={s.box(5, 1.6, 12, 0.45)} position={[0, -2.3, 0.4]} />

<!-- Bellhousing at the back, with its bolt circle -->
<InkPart geometry={s.cyl(3.6, 3, 1.6, 56)} position={[0, 1, 7.6]} rotation={[-Math.PI / 2, 0, 0]} />
{#each bellBolts as a (a)}
	<InkPart
		geometry={bolt}
		position={[Math.cos(a) * 3.35, 1 + Math.sin(a) * 3.35, 6.78]}
		rotation={[Math.PI / 2, 0, 0]}
		detail
	/>
{/each}

<!-- Engine mounts, one each side -->
{#each [-1, 1] as side (side)}
	<InkPart geometry={s.box(0.8, 1, 1.4, 0.15)} position={[side * 3.3, 0.2, -1.5]} />
	<InkPart
		geometry={s.cyl(0.42, 0.42, 0.5, 24)}
		position={[side * 3.95, 0.2, -1.5]}
		rotation={[0, 0, Math.PI / 2]}
		detail
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
		detail
	/>
{/each}

<!-- Dipstick tube and handle -->
<InkPart geometry={dipstick} crease={60} detail />
<InkPart geometry={s.torus(0.18, 0.05, 20)} position={[-3.9, 4.4, -3.4]} detail />
