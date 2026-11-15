<!--
	One part of the drawn engine: just the mesh. InkRenderer draws the lines
	from its surface; to draw a part in the accent ink, set `userData.ink` on a
	group around it.
-->
<script lang="ts">
	import { T } from '@threlte/core';
	import type { BufferGeometry } from 'three';

	let {
		geometry,
		position = [0, 0, 0],
		rotation = [0, 0, 0]
	}: {
		geometry: BufferGeometry;
		position?: [number, number, number];
		rotation?: [number, number, number];
	} = $props();
</script>

<T.Mesh {geometry} {position} {rotation}>
	<T.MeshBasicMaterial color="#0a0a0b" />
</T.Mesh>
