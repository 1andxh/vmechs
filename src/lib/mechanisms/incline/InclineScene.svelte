<!--
	The inclined plane lesson's scene. Everything is placed from the lesson's
	one angle through inclineAt (incline.ts): which step, the ramp's length and
	height, how far the block has been pushed, and the forces.

	- A gold ramp rising to the right, against a grey ledge at its top, the
	  height the block is being raised to. The ramp's length changes by step,
	  its height stays 1 m.
	- A blue block slides up the slope. Your push (green) acts behind it,
	  along the slope; its weight (blue) presses down on its top. In the last
	  step, friction (red) acts down the slope, at the surface it rubs on.
	  Arrow lengths follow the forces.

	Drawn in colour (ADR 0015): the ramp gold, the load blue, your push green,
	friction red, the ledge warm grey. Coordinates: the ramp's foot at the
	origin, x to the right along the ground, y up, z towards the camera.
-->
<script lang="ts">
	import { T } from '@threlte/core';
	import { ExtrudeGeometry, Shape } from 'three';
	import { getCycle } from '../../animation/cycle.svelte.ts';
	import Studio from '../studio/Studio.svelte';
	import type { V3 } from '../studio/fit.ts';
	import { inclineAt } from './incline.ts';
	import { PARTS, STRUCTURE } from '../palette.ts';

	const cycle = getCycle();
	const now = $derived(inclineAt(cycle.angle));

	// the colours of the lesson's parts (ADR 0015)
	const RAMP = PARTS.gold.fill;
	const LOAD = PARTS.blue.fill;
	const EFFORT = PARTS.green.fill;
	const FRICTION = PARTS.red.fill;

	const DEPTH = 0.7; // the ramp's width, front to back
	const SIDE = 0.32; // the block's side
	const START = 0.12; // where the block starts, as a share of the slope

	const run = $derived(Math.sqrt(now.length ** 2 - now.height ** 2)); // the horizontal run
	const theta = $derived(Math.atan2(now.height, run));
	const up = $derived([Math.cos(theta), Math.sin(theta)]); // along the slope
	const out = $derived([-Math.sin(theta), Math.cos(theta)]); // out of the slope

	// the ramp: a right-angled wedge, its slope from the origin to (run, height)
	const ramp = $derived.by(() => {
		const s = new Shape();
		s.moveTo(0, 0);
		s.lineTo(run, 0);
		s.lineTo(run, now.height);
		s.closePath();
		const g = new ExtrudeGeometry(s, { depth: DEPTH, bevelEnabled: false });
		g.translate(0, 0, -DEPTH / 2);
		return g;
	});
	$effect(() => {
		const g = ramp;
		return () => g.dispose();
	});

	// the block's distance up the slope, from the foot to its back face
	const along = $derived(START * now.length + now.effortMoved);
	/** A point `s` along the slope and `n` out from it. */
	const at = (s: number, n: number): [number, number] => [
		up[0] * s + out[0] * n,
		up[1] * s + out[1] * n
	];
	const centre = $derived(at(along + SIDE / 2, SIDE / 2));

	/** An arrow's length for a force: 300 N is the longest in this lesson. */
	const arrowLength = (newtons: number) => 0.2 + (0.45 * newtons) / 300;

	// ---- camera: fit the ramp, the ledge and the arrows (Studio.svelte) ----
	// The ramp grows from 1.5 to 6 m long, so the frame follows it.
	const TARGET: V3 = $derived([run / 2 + 0.2, 0.75, 0]);
	const DIR: V3 = [0.12, 0.3, 1]; // from a little to the right and above
	// room above for the readout, which sits over the top of the stage
	const HALF = $derived({ w: run / 2 + 0.6, h: 1.25 });
</script>

<Studio target={TARGET} dir={DIR} half={HALF} />

{#snippet matte(color: string)}
	<T.MeshStandardMaterial {color} metalness={0.05} roughness={0.6} />
{/snippet}

{#snippet arrow(from: [number, number], angle: number, length: number, color: string)}
	<!-- tail at `from`, pointing along `angle` (radians from the +x axis) -->
	{@const head = 0.14}
	{@const shaft = Math.max(0.02, length - head)}
	<T.Group position={[from[0], from[1], DEPTH / 2 - 0.12]} rotation.z={angle}>
		<T.Mesh position.x={shaft / 2} rotation.z={-Math.PI / 2}>
			<T.CylinderGeometry args={[0.02, 0.02, shaft, 16]} />
			{@render matte(color)}
		</T.Mesh>
		<T.Mesh position.x={shaft + head / 2} rotation.z={-Math.PI / 2}>
			<T.ConeGeometry args={[0.06, head, 20]} />
			{@render matte(color)}
		</T.Mesh>
	</T.Group>
{/snippet}

<!-- the ledge at the top of the ramp: the height the block is raised to -->
<T.Mesh position={[run + 0.3, now.height / 2, 0]}>
	<T.BoxGeometry args={[0.6, now.height, DEPTH]} />
	{@render matte(STRUCTURE)}
</T.Mesh>

<!-- the ramp -->
<T.Mesh geometry={ramp}>
	{@render matte(RAMP)}
</T.Mesh>

<!-- the block, sitting on the slope -->
<T.Mesh position={[centre[0], centre[1], 0]} rotation.z={theta}>
	<T.BoxGeometry args={[SIDE, SIDE, SIDE]} />
	{@render matte(LOAD)}
</T.Mesh>

<!-- your push: along the slope, ending at the block's back face -->
{@render arrow(
	at(along - arrowLength(now.effort) - 0.02, SIDE / 2),
	theta,
	arrowLength(now.effort),
	EFFORT
)}
<!-- its weight: straight down onto its top -->
{@render arrow(
	[centre[0], centre[1] + SIDE / 2 + 0.05 + arrowLength(now.load)],
	-Math.PI / 2,
	arrowLength(now.load),
	LOAD
)}
<!-- friction: down the slope, along the surface the block rubs on -->
{#if now.friction > 0}
	{@render arrow(
		at(along + SIDE * 0.75, 0.03),
		theta + Math.PI,
		arrowLength(now.friction),
		FRICTION
	)}
{/if}
