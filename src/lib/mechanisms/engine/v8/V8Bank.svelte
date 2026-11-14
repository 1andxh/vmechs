<!--
	One bank: block slab, cylinder head and ribbed valve cover, with the seams
	between them, cover bolts, coil packs with connectors, and the exhaust port
	flanges on the outside of the head.
-->
<script lang="ts">
	import { onDestroy } from 'svelte';
	import InkPart from '../InkPart.svelte';
	import { DECK, FOUR, at, cylZ, tilt, type Bank } from './frame.ts';
	import { makeShapes } from './shapes.ts';

	let { bank: b }: { bank: Bank } = $props();

	const s = makeShapes();
	onDestroy(s.dispose);

	const rib = s.box(2.1, 0.14, 0.2, 0.05);
	const bolt = s.cyl(0.1, 0.1, 0.18, 12);
	const coil = s.box(0.55, 0.45, 0.75, 0.12);
	const plug = s.box(0.28, 0.2, 0.32, 0.05);
	const flange = s.box(0.22, 0.95, 0.95, 0.08);
	const ribZ = [-4.8, -3.2, -1.6, 0, 1.6, 3.2, 4.8];
	const boltZ = [-5.6, -2.8, 0, 2.8, 5.6];
</script>

<InkPart
	geometry={s.box(2.9, DECK - 1.2, 12.6, 0.25)}
	position={at(b, (1.2 + DECK) / 2, 0, b.dz)}
	rotation={tilt(b)}
/>
<InkPart
	geometry={s.box(3.1, 1.1, 13, 0.25)}
	position={at(b, DECK + 0.55, 0, b.dz)}
	rotation={tilt(b)}
/>
<!-- Cover gasket: sunk into the head so only its top edge shows, standing
     clear of the head. A detail flush with a surface draws its lines at that
     surface's depth, and the depth test breaks them into dots. -->
<InkPart
	geometry={s.box(2.72, 0.2, 12.42, 0.04)}
	position={at(b, DECK + 1.12, 0, b.dz)}
	rotation={tilt(b)}
	detail
/>
<InkPart
	geometry={s.box(2.5, 0.75, 12.2, 0.32)}
	position={at(b, DECK + 1.45, 0, b.dz)}
	rotation={tilt(b)}
/>

{#each ribZ as z (z)}
	<InkPart geometry={rib} position={at(b, DECK + 1.86, 0.15, b.dz + z)} rotation={tilt(b)} detail />
{/each}
{#each boltZ as z (z)}
	{#each [-1.12, 1.12] as side (side)}
		<InkPart
			geometry={bolt}
			position={at(b, DECK + 1.84, side, b.dz + z)}
			rotation={tilt(b)}
			detail
		/>
	{/each}
{/each}
{#each FOUR as i (i)}
	<InkPart geometry={coil} position={at(b, DECK + 2, -0.85, cylZ(b, i))} rotation={tilt(b)} />
	<InkPart
		geometry={plug}
		position={at(b, DECK + 2.2, -0.85, cylZ(b, i) - 0.48)}
		rotation={tilt(b)}
		detail
	/>
	<InkPart
		geometry={flange}
		position={at(b, DECK + 0.4, 1.58, cylZ(b, i))}
		rotation={tilt(b)}
		detail
	/>
{/each}

{#if b.name === 'left'}
	<!-- oil filler cap -->
	<InkPart
		geometry={s.cyl(0.38, 0.38, 0.28)}
		position={at(b, DECK + 1.95, 0.6, -5.4)}
		rotation={tilt(b)}
	/>
{/if}
