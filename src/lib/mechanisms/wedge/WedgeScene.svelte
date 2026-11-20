<!--
	The wedge lesson's scene. Everything is placed from the lesson's one angle
	through wedgeAt (wedge.ts): which step, the wedge's length and thickness,
	how far it has gone in, and the forces.

	- A log in two halves, and a gold wedge above them, point down. Your push
	  drives it into the gap; the halves slide apart by the wedge's thickness at
	  the log's top. The machine moves; the load only spreads.
	- Your push (green) presses down on the wedge's back. Two arrows (blue), one
	  on each half, show the force pressing it aside. Arrow lengths follow the
	  forces.

	Drawn in colour (ADR 0015): the wedge gold, the wood blue, your push green.
	Coordinates: the log's top at y = 0, its middle at x = 0, y up, z towards
	the camera.
-->
<script lang="ts">
	import { T } from '@threlte/core';
	import { ExtrudeGeometry, Shape } from 'three';
	import { getCycle } from '../../animation/cycle.svelte.ts';
	import Studio from '../studio/Studio.svelte';
	import type { V3 } from '../studio/fit.ts';
	import { wedgeAt } from './wedge.ts';
	import { PARTS } from '../palette.ts';

	const cycle = getCycle();
	const now = $derived(wedgeAt(cycle.angle));

	// the colours of the lesson's parts (ADR 0015)
	const WEDGE = PARTS.gold.fill;
	const WOOD = PARTS.blue.fill;
	const EFFORT = PARTS.green.fill;

	const HALF_W = 0.36; // each half of the log, across
	const LOG_H = 0.5; // the log's height
	const DEPTH = 0.42; // front to back, for the log and the wedge

	// the wedge: a triangle, its tip at the origin, its back `length` above it
	const wedge = $derived.by(() => {
		const s = new Shape();
		s.moveTo(0, 0);
		s.lineTo(now.thickness / 2, now.length);
		s.lineTo(-now.thickness / 2, now.length);
		s.closePath();
		const g = new ExtrudeGeometry(s, { depth: DEPTH, bevelEnabled: false });
		g.translate(0, 0, -DEPTH / 2);
		return g;
	});
	$effect(() => {
		const g = wedge;
		return () => g.dispose();
	});

	const tip = $derived(-now.effortMoved); // the tip goes in below the log's top
	const back = $derived(tip + now.length);
	const gap = $derived(now.loadMoved); // the halves part by the wedge's thickness at y = 0

	/** An arrow's length for a force: 1,000 N is the longest in this lesson. */
	const arrowLength = (newtons: number) => 0.2 + (0.45 * newtons) / 1000;

	// ---- camera: fit the log, the wedge and the arrows (Studio.svelte) ----
	const TARGET: V3 = [0, 0.2, 0];
	const DIR: V3 = [0.25, 0.32, 1]; // from a little to the right and above
	// room above the wedge for the readout, which sits over the top of the stage
	const HALF = { w: 1.15, h: 0.85 };
</script>

<Studio target={TARGET} dir={DIR} half={HALF} />

{#snippet matte(color: string)}
	<T.MeshStandardMaterial {color} metalness={0.05} roughness={0.6} />
{/snippet}

{#snippet arrow(from: [number, number], angle: number, length: number, color: string)}
	<!-- tail at `from`, pointing along `angle` (radians from the +x axis) -->
	{@const head = 0.12}
	{@const shaft = Math.max(0.02, length - head)}
	<T.Group position={[from[0], from[1], DEPTH / 2 - 0.08]} rotation.z={angle}>
		<T.Mesh position.x={shaft / 2} rotation.z={-Math.PI / 2}>
			<T.CylinderGeometry args={[0.018, 0.018, shaft, 16]} />
			{@render matte(color)}
		</T.Mesh>
		<T.Mesh position.x={shaft + head / 2} rotation.z={-Math.PI / 2}>
			<T.ConeGeometry args={[0.055, head, 20]} />
			{@render matte(color)}
		</T.Mesh>
	</T.Group>
{/snippet}

<!-- the two halves of the log, pushed apart by the wedge -->
{#each [-1, 1] as side (side)}
	<T.Mesh position={[side * (gap / 2 + HALF_W / 2), -LOG_H / 2, 0]}>
		<T.BoxGeometry args={[HALF_W, LOG_H, DEPTH]} />
		{@render matte(WOOD)}
	</T.Mesh>
	<!-- the force pressing this half aside, from its outer face -->
	{@render arrow(
		[side * (gap / 2 + HALF_W + 0.04), -0.14],
		side > 0 ? 0 : Math.PI,
		arrowLength(now.load),
		WOOD
	)}
{/each}

<!-- the wedge, point down, driven into the gap -->
<T.Mesh geometry={wedge} position.y={tip}>
	{@render matte(WEDGE)}
</T.Mesh>

<!-- your push: straight down onto the wedge's back -->
{@render arrow(
	[0, back + 0.04 + arrowLength(now.effort)],
	-Math.PI / 2,
	arrowLength(now.effort),
	EFFORT
)}
