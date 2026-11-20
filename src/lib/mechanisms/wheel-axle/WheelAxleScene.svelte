<!--
	The wheel and axle lesson's scene. Everything is placed from the lesson's one
	angle through wheelAxleAt (wheel-axle.ts): which step, the radii, how far
	the pair has turned, and the forces.

	- A spoked wheel and a thin axle, fixed together on one centre, held by a
	  grey bracket behind. The spokes make the turning easy to see.
	- A rope hangs from the left of the wheel and another from the right of the
	  axle, in front of the wheel. In steps 1 to 4 you pull the wheel's rope and
	  the axle's rope lifts the load; in step 5 you pull the axle's rope and the
	  wheel's lifts it.
	- Two arrows, always vertical: your pull (green) and the load's weight
	  (blue). Their lengths follow the forces.

	Drawn in colour (ADR 0015): the wheel green, the axle gold, the load blue,
	the bracket and ropes warm grey. Coordinates: the axle's centre at the
	origin, x to the right, y up, z towards the camera.
-->
<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { PMREMGenerator } from 'three';
	import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
	import { getCycle } from '../../animation/cycle.svelte.ts';
	import { wheelAxleAt } from './wheel-axle.ts';
	import { PARTS, STRUCTURE } from '../palette.ts';

	const cycle = getCycle();
	const now = $derived(wheelAxleAt(cycle.angle));

	// the colours of the lesson's parts (ADR 0015)
	const WHEEL = PARTS.green.fill;
	const AXLE = PARTS.gold.fill;
	const LOAD = PARTS.blue.fill;
	const EFFORT = PARTS.green.fill; // your pull, the same green as the lever's

	const REST = -0.8; // where both ropes end, at rest
	const AXLE_ROPE_Z = 0.22; // the axle's rope hangs in front of the wheel
	const ROPE = 0.012;

	// The wheel's rope hangs from its left, the axle's from its right. Which one
	// you pull, and which one carries the load, depends on the step.
	const pullOnWheel = $derived(now.driven === 'wheel');
	const pull = $derived({
		x: pullOnWheel ? -now.wheel : now.axle,
		z: pullOnWheel ? 0 : AXLE_ROPE_Z,
		end: REST - now.effortMoved
	});
	const hang = $derived({
		x: pullOnWheel ? now.axle : -now.wheel,
		z: pullOnWheel ? AXLE_ROPE_Z : 0,
		top: REST + now.loadMoved
	});

	const block = $derived(0.22 + 0.18 * Math.cbrt(now.load / 300)); // side of the load block
	/** An arrow's length for a force: 300 N is the longest in this lesson. */
	const arrowLength = (newtons: number) => 0.2 + (0.45 * newtons) / 300;

	// ---- camera: fit the machine, its ropes and arrows on any screen ----
	const { size, renderer, scene, invalidate } = useThrelte();
	const FOV = 30;
	const TARGET: [number, number, number] = [0, -0.58, 0.1];
	const DIR = [0.3, 0.18, 1]; // from a little to the right and above, so the axle shows in front
	// room above the bracket for the numbers readout, which sits over the top of the stage
	const HALF = { w: 1.0, h: 1.7 };
	const camPos = $derived.by((): [number, number, number] => {
		const aspect = $size.width / Math.max(1, $size.height);
		const t = Math.tan(((FOV / 2) * Math.PI) / 180);
		const dist = Math.max(HALF.w / (t * aspect), HALF.h / t);
		const len = Math.hypot(DIR[0], DIR[1], DIR[2]);
		return [
			TARGET[0] + (DIR[0] / len) * dist,
			TARGET[1] + (DIR[1] / len) * dist,
			TARGET[2] + (DIR[2] / len) * dist
		];
	});

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
	fov={FOV}
	near={0.1}
	far={60}
	position={camPos}
	oncreate={(c) => c.lookAt(...TARGET)}
/>

<!-- soft and even, like a studio (ADR 0015) -->
<T.HemisphereLight args={['#fffaf2', '#8a8580', 1.6]} />
<T.DirectionalLight position={[-2, 5, 4]} intensity={1.4} color="#fff6ea" />
<T.DirectionalLight position={[3, 2, -3]} intensity={0.5} />

{#snippet matte(color: string)}
	<T.MeshStandardMaterial {color} metalness={0.05} roughness={0.6} />
{/snippet}

{#snippet rope(x: number, z: number, from: number, to: number)}
	<T.Mesh position={[x, (from + to) / 2, z]}>
		<T.CylinderGeometry args={[ROPE, ROPE, Math.max(0.001, from - to), 8]} />
		{@render matte(STRUCTURE)}
	</T.Mesh>
{/snippet}

{#snippet arrowDown(x: number, y: number, z: number, length: number, color: string)}
	<!-- tail at (x, y), pointing straight down -->
	{@const head = 0.14}
	{@const shaft = Math.max(0.02, length - head)}
	<T.Group position={[x, y, z]}>
		<T.Mesh position.y={-shaft / 2}>
			<T.CylinderGeometry args={[0.02, 0.02, shaft, 16]} />
			{@render matte(color)}
		</T.Mesh>
		<T.Mesh position.y={-shaft - head / 2} rotation.z={Math.PI}>
			<T.ConeGeometry args={[0.06, head, 20]} />
			{@render matte(color)}
		</T.Mesh>
	</T.Group>
{/snippet}

<!-- the bracket: a post behind the wheel, up from the axle to a short beam -->
<T.Mesh position={[0, 0.375, -0.32]}>
	<T.BoxGeometry args={[0.1, 0.75, 0.1]} />
	{@render matte(STRUCTURE)}
</T.Mesh>
<T.Mesh position={[0, 0.75, -0.32]}>
	<T.BoxGeometry args={[0.8, 0.08, 0.16]} />
	{@render matte(STRUCTURE)}
</T.Mesh>

<!-- the wheel and the axle, fixed together, turning about one centre -->
<T.Group rotation.z={now.spin}>
	<T.Mesh>
		<T.TorusGeometry args={[now.wheel, 0.035, 14, 72]} />
		{@render matte(WHEEL)}
	</T.Mesh>
	{#each [0, 1, 2, 3] as i (i)}
		<T.Mesh rotation.z={(i * Math.PI) / 4}>
			<T.BoxGeometry args={[2 * now.wheel, 0.035, 0.03]} />
			{@render matte(WHEEL)}
		</T.Mesh>
	{/each}
	<T.Mesh position.z={0.02} rotation.x={Math.PI / 2}>
		<T.CylinderGeometry args={[now.axle, now.axle, 0.7, 40]} />
		{@render matte(AXLE)}
	</T.Mesh>
	<!-- a flat on the axle's front, so it can be seen turning too -->
	<T.Mesh position={[0, now.axle * 0.55, 0.37]}>
		<T.BoxGeometry args={[now.axle * 0.9, now.axle * 0.5, 0.01]} />
		{@render matte(STRUCTURE)}
	</T.Mesh>
</T.Group>

<!-- your pull: a rope down to a handle, and an arrow below it -->
{@render rope(pull.x, pull.z, 0, pull.end)}
<T.Mesh position={[pull.x, pull.end - 0.04, pull.z]}>
	<T.SphereGeometry args={[0.045, 20, 12]} />
	{@render matte(EFFORT)}
</T.Mesh>
{@render arrowDown(pull.x, pull.end - 0.09, pull.z, arrowLength(now.effort), EFFORT)}

<!-- the load: a rope down to a block, and its weight below it -->
{@render rope(hang.x, hang.z, 0, hang.top)}
<T.Mesh position={[hang.x, hang.top - block / 2, hang.z]}>
	<T.BoxGeometry args={[block, block, block]} />
	{@render matte(LOAD)}
</T.Mesh>
{@render arrowDown(hang.x, hang.top - block - 0.03, hang.z, arrowLength(now.load), LOAD)}
