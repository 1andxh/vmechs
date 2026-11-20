<!--
	The studio every simple machine is shown in: a camera that keeps the whole
	machine in view on any screen (fit.ts), soft even light, and a gentle room
	reflection (ADR 0015). A scene places it once and passes its own framing:
	where to look, from which direction, and the half-size of the box to fit.
-->
<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { PMREMGenerator } from 'three';
	import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
	import { fitCamera, type V3 } from './fit.ts';

	let {
		target,
		dir,
		half,
		fov = 30
	}: { target: V3; dir: V3; half: { w: number; h: number }; fov?: number } = $props();

	const { size, renderer, scene, invalidate } = useThrelte();
	const position = $derived(
		fitCamera(target, dir, half, $size.width / Math.max(1, $size.height), fov)
	);

	$effect(() => {
		const pmrem = new PMREMGenerator(renderer);
		const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
		scene.environment = env;
		scene.environmentIntensity = 0.6;
		invalidate();
		return () => {
			scene.environment = null;
			env.dispose();
			pmrem.dispose();
		};
	});
</script>

<T.PerspectiveCamera
	makeDefault
	{fov}
	near={0.1}
	far={60}
	{position}
	oncreate={(c) => c.lookAt(...target)}
/>

<!-- soft and even, like a studio (ADR 0015) -->
<T.HemisphereLight args={['#fffaf2', '#8a8580', 1.6]} />
<T.DirectionalLight position={[-2, 5, 4]} intensity={1.4} color="#fff6ea" />
<T.DirectionalLight position={[3, 2, -3]} intensity={0.5} />
