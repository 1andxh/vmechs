<!--
	The screw lesson's scene: a screw jack. Everything is placed from the
	lesson's one angle through screwAt (screw.ts): which step, the pitch, the
	radius it is turned at, how many turns, and the forces.

	- A gold threaded rod turns in a grey base, the nut, and lifts a blue load
	  (the corner of a car) on a cap that doesn't turn. The thread is drawn to
	  the step's pitch. Turning once raises the rod one pitch, so its thread
	  looks still where it passes through the nut, as on a real jack.
	- Steps 1 and 2 turn the screw by its head; from step 3 a grey handle, a
	  lever, turns it. Your push (green) acts at the head's rim or the handle's
	  tip, round the circle; the load's weight (blue) presses down on top.
	  Arrow lengths follow the forces.

	Drawn in colour (ADR 0015): the screw gold, the load blue, your push green,
	the base, head, handle and cap warm grey. Coordinates: the screw's axis is
	the y axis, the nut's top at y = 0.2, z towards the camera.
-->
<script lang="ts">
	import { T } from '@threlte/core';
	import { Curve, TubeGeometry, Vector3 } from 'three';
	import { getCycle } from '../../animation/cycle.svelte.ts';
	import Studio from '../studio/Studio.svelte';
	import type { V3 } from '../studio/fit.ts';
	import { screwAt } from './screw.ts';
	import { PARTS, STRUCTURE } from '../palette.ts';

	const cycle = getCycle();
	const now = $derived(screwAt(cycle.angle));

	// the colours of the lesson's parts (ADR 0015)
	const SCREW = PARTS.gold.fill;
	const LOAD = PARTS.blue.fill;
	const EFFORT = PARTS.green.fill;

	const ROD = 0.042; // the rod's radius, inside the thread
	const THREAD = 0.05; // the thread's radius (the head's too)
	const BOTTOM = -0.1; // the rod's foot at rest
	const TOP = 0.62; // the rod's top at rest
	const BASE_TOP = 0.2;

	/** The thread: a helix round the rod, rising one pitch per turn. */
	class Helix extends Curve<Vector3> {
		pitch: number;
		length: number;
		constructor(pitch: number, length: number) {
			super();
			this.pitch = pitch;
			this.length = length;
		}
		getPoint(t: number, target = new Vector3()) {
			const turns = this.length / this.pitch;
			const a = 2 * Math.PI * turns * t;
			return target.set(THREAD * Math.cos(a), this.length * t, -THREAD * Math.sin(a));
		}
	}
	const thread = $derived.by(() => {
		const length = TOP - BOTTOM - 0.04;
		const turns = length / now.pitch;
		return new TubeGeometry(new Helix(now.pitch, length), Math.round(turns * 28), 0.009, 8);
	});
	$effect(() => {
		const g = thread;
		return () => g.dispose();
	});

	// turning one way raises the rod one pitch per turn (screw.ts); the jack starts
	// with the handle pointing at the camera, so your push runs across the screen
	const spin = $derived(2 * Math.PI * now.turns - Math.PI / 2);
	const GRIP = TOP - 0.2; // the height of the head or handle, below the load
	const lift = $derived(now.loadMoved);

	/** An arrow's length for a force: 200 N is the longest push in this lesson. */
	const pushLength = (newtons: number) => 0.12 + (0.33 * newtons) / 200;
	const weightLength = 0.3;

	// ---- camera: fit the jack, its handle and the arrows (Studio.svelte) ----
	const TARGET: V3 = [0.05, 0.6, 0];
	const DIR: V3 = [0.45, 0.42, 1]; // from the right and above, to see the handle go round
	// room above for the readout, which sits over the top of the stage
	const HALF = { w: 0.6, h: 0.82 };
</script>

<Studio target={TARGET} dir={DIR} half={HALF} />

{#snippet matte(color: string)}
	<T.MeshStandardMaterial {color} metalness={0.05} roughness={0.6} />
{/snippet}

{#snippet arrow(length: number, color: string)}
	<!-- tail at the origin, pointing along −z -->
	{@const head = 0.08}
	{@const shaft = Math.max(0.02, length - head)}
	<T.Mesh position.z={-shaft / 2} rotation.x={-Math.PI / 2}>
		<T.CylinderGeometry args={[0.012, 0.012, shaft, 12]} />
		{@render matte(color)}
	</T.Mesh>
	<T.Mesh position.z={-shaft - head / 2} rotation.x={-Math.PI / 2}>
		<T.ConeGeometry args={[0.035, head, 16]} />
		{@render matte(color)}
	</T.Mesh>
{/snippet}

<!-- the base: the nut the screw turns in -->
<T.Mesh position.y={BASE_TOP / 2}>
	<T.CylinderGeometry args={[0.13, 0.17, BASE_TOP, 40]} />
	{@render matte(STRUCTURE)}
</T.Mesh>

<!-- the screw, turning and rising together -->
<T.Group position.y={lift} rotation.y={spin}>
	<T.Mesh position.y={(BOTTOM + TOP) / 2}>
		<T.CylinderGeometry args={[ROD, ROD, TOP - BOTTOM, 32]} />
		{@render matte(SCREW)}
	</T.Mesh>
	<T.Mesh geometry={thread} position.y={BOTTOM + 0.02}>
		{@render matte(SCREW)}
	</T.Mesh>
	{#if now.handle}
		<!-- the handle, a lever, from the axis out to the radius you push at -->
		<T.Mesh position={[now.radius / 2, GRIP, 0]} rotation.z={Math.PI / 2}>
			<T.CylinderGeometry args={[0.014, 0.014, now.radius, 12]} />
			{@render matte(STRUCTURE)}
		</T.Mesh>
		<T.Mesh position={[now.radius, GRIP, 0]}>
			<T.SphereGeometry args={[0.025, 16, 10]} />
			{@render matte(STRUCTURE)}
		</T.Mesh>
	{:else}
		<!-- the head you turn it by -->
		<T.Mesh position.y={GRIP}>
			<T.CylinderGeometry args={[now.radius + 0.012, now.radius + 0.012, 0.05, 6]} />
			{@render matte(STRUCTURE)}
		</T.Mesh>
	{/if}
	<!-- your push, at the head's rim or the handle's tip, round the circle -->
	<T.Group position={[now.radius + 0.02, GRIP, pushLength(now.effort)]}>
		{@render arrow(pushLength(now.effort), EFFORT)}
	</T.Group>
</T.Group>

<!-- the cap, which doesn't turn, and the load on it -->
<T.Mesh position.y={TOP + 0.02 + lift}>
	<T.CylinderGeometry args={[0.07, 0.07, 0.04, 32]} />
	{@render matte(STRUCTURE)}
</T.Mesh>
<T.Mesh position.y={TOP + 0.04 + 0.08 + lift}>
	<T.BoxGeometry args={[0.36, 0.16, 0.28]} />
	{@render matte(LOAD)}
</T.Mesh>
<!-- the load's weight, pressing down on its top -->
<T.Group position={[0, TOP + 0.2 + weightLength + lift, 0]} rotation.x={-Math.PI / 2}>
	{@render arrow(weightLength, LOAD)}
</T.Group>
