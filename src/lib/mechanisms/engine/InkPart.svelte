<!--
	One part of the drawn engine. InkRenderer draws the lines from its surface;
	in colour mode it also shows the part's colour, which comes from the Tint
	around it (warm grey structure if none). To draw a part in the accent ink
	(ink mode), set `userData.ink` on a group around it.
-->
<script lang="ts">
	import { T } from '@threlte/core';
	import { DoubleSide, FrontSide, Plane, Vector3, type BufferGeometry } from 'three';
	import { getTint } from './v8/tint.ts';

	let {
		geometry,
		position = [0, 0, 0],
		rotation = [0, 0, 0]
	}: {
		geometry: BufferGeometry;
		position?: [number, number, number];
		rotation?: [number, number, number];
	} = $props();

	const tint = getTint();
	// a cut part shows its inside, so both faces are drawn
	const clipping = $derived.by(() => {
		const z = tint().clip;
		return z === null ? [] : [new Plane(new Vector3(0, 0, 1), -z)]; // keeps z >= the plane
	});
</script>

<T.Mesh {geometry} {position} {rotation}>
	<T.MeshStandardMaterial
		color={tint().color}
		metalness={0.05}
		roughness={0.6}
		clippingPlanes={clipping}
		side={clipping.length ? DoubleSide : FrontSide}
	/>
</T.Mesh>
