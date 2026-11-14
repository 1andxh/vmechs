<!--
	One part of the procedural engine. InkRenderer draws the lines from its
	surface, so this is just the mesh, flagged for the accent ink if tinted.

	Temporary: `detail` and `crease` belonged to the earlier outline renderer
	and are accepted but unused, until this engine is replaced by the model.
-->
<script lang="ts">
	import { T } from '@threlte/core';
	import type { BufferGeometry } from 'three';

	let {
		geometry,
		position = [0, 0, 0],
		rotation = [0, 0, 0],
		ink
	}: {
		geometry: BufferGeometry;
		position?: [number, number, number];
		rotation?: [number, number, number];
		/** Any value draws this part in the accent ink. */
		ink?: string;
		detail?: boolean;
		crease?: number;
	} = $props();
</script>

<T.Mesh {geometry} {position} {rotation} userData={{ ink: ink ? 1 : 0 }}>
	<T.MeshBasicMaterial color="#0a0a0b" />
</T.Mesh>
