<!--
	One bank: the block slab with its four cylinder bores (real holes, so the
	pistons show when the head is off), and on top of it the cylinder head with
	its valve cover, gasket, cover bolts, coil packs and exhaust port flanges.
	The head and everything on it is one group, which lifts off along the
	bank's axis for the exploded view (`lift`, 0..1). The slab is flagged for
	the section cut (see InkRenderer).
-->
<script lang="ts">
	import { T } from '@threlte/core';
	import { onDestroy, untrack } from 'svelte';
	import { ExtrudeGeometry, Matrix4, Path, Shape, Vector3 } from 'three';
	import InkPart from '../InkPart.svelte';
	import Tint from './Tint.svelte';
	import { STRUCTURE } from '../../palette.ts';
	import { DECK, FOUR, at, cylZ, tilt, type Bank } from './frame.ts';
	import { BORE, SLAB_BASE, SLAB_LENGTH } from './internals.ts';
	import { makeShapes } from './shapes.ts';

	let {
		bank: b,
		lift = 0,
		accent = false,
		headColour,
		clip = null
	}: {
		bank: Bank;
		/** 0 = bolted down, 1 = lifted clear of the block. */
		lift?: number;
		/** Draw the head in the accent ink. */
		accent?: boolean;
		/** The head's colour in colour mode (ADR 0015); warm grey if not given. */
		headColour?: string;
		/** The section plane's z, to cut the block in colour mode too. */
		clip?: number | null;
	} = $props();

	const LIFT = 6;

	const s = makeShapes();
	onDestroy(s.dispose);

	const rib = s.box(2.1, 0.14, 0.2, 0.05);
	const bolt = s.cyl(0.1, 0.1, 0.18, 12);
	const coil = s.box(0.55, 0.45, 0.75, 0.12);
	const plug = s.box(0.28, 0.2, 0.32, 0.05);
	const flange = s.box(0.22, 0.95, 0.95, 0.08);
	// The slab: its outline across the bank (x) and along the crank (y), with
	// the four bores as holes, pushed up the bank's axis from SLAB_BASE to the
	// deck. Built once: a bank never changes.
	const slab = untrack(() => {
		const half = 1.45;
		const outline = new Shape()
			.moveTo(-half, b.dz - SLAB_LENGTH / 2)
			.lineTo(half, b.dz - SLAB_LENGTH / 2)
			.lineTo(half, b.dz + SLAB_LENGTH / 2)
			.lineTo(-half, b.dz + SLAB_LENGTH / 2)
			.closePath() as Shape;
		for (const i of FOUR) {
			outline.holes.push(new Path().absarc(0, cylZ(b, i), BORE.radius, 0, Math.PI * 2, false));
		}
		const g = new ExtrudeGeometry(outline, {
			depth: DECK - SLAB_BASE,
			bevelEnabled: false,
			curveSegments: 40
		});
		// shape x → across the bank, shape y → along the crank (z), extrusion → up the bank
		const up = new Vector3(...at(b, 1, 0, 0));
		const along = new Vector3(0, 0, 1);
		const across = new Vector3().crossVectors(along, up);
		g.applyMatrix4(new Matrix4().makeBasis(across, along, up));
		g.translate(...at(b, SLAB_BASE, 0, 0));
		return g;
	});
	onDestroy(() => slab.dispose());
	const ribZ = [-4.8, -3.2, -1.6, 0, 1.6, 3.2, 4.8];
	const boltZ = [-5.6, -2.8, 0, 2.8, 5.6];

	// along the bank's own axis, away from the crankshaft
	const offset = $derived(at(b, lift * LIFT, 0, 0));
</script>

<!-- Block slab with its bores, open under the head; cut by the section plane -->
<T.Group userData={{ section: true }}>
	<Tint color={STRUCTURE} {clip}>
		<InkPart geometry={slab} />
	</Tint>
</T.Group>

<T.Group position={offset} userData={{ ink: accent }}>
	<Tint color={headColour ?? STRUCTURE}>
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
		/>
		<InkPart
			geometry={s.box(2.5, 0.75, 12.2, 0.32)}
			position={at(b, DECK + 1.45, 0, b.dz)}
			rotation={tilt(b)}
		/>

		{#each ribZ as z (z)}
			<InkPart geometry={rib} position={at(b, DECK + 1.86, 0.15, b.dz + z)} rotation={tilt(b)} />
		{/each}
		{#each boltZ as z (z)}
			{#each [-1.12, 1.12] as side (side)}
				<InkPart geometry={bolt} position={at(b, DECK + 1.84, side, b.dz + z)} rotation={tilt(b)} />
			{/each}
		{/each}
		{#each FOUR as i (i)}
			<InkPart geometry={coil} position={at(b, DECK + 2, -0.85, cylZ(b, i))} rotation={tilt(b)} />
			<InkPart
				geometry={plug}
				position={at(b, DECK + 2.2, -0.85, cylZ(b, i) - 0.48)}
				rotation={tilt(b)}
			/>
			<InkPart
				geometry={flange}
				position={at(b, DECK + 0.4, 1.58, cylZ(b, i))}
				rotation={tilt(b)}
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
	</Tint>
</T.Group>
