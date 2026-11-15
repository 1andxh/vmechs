<!--
	The V8's moving insides: the crankshaft (main journals, four crank pins at
	their cross-plane angles, webs with counterweights), eight connecting rods
	and eight pistons. One value drives them all, the crank angle; where each
	part goes comes from v8/internals.ts (tested), its timing from
	v8/kinematics.ts.

	The crankshaft is modelled at crank angle 0 and turned as one piece.
	Mostly hidden inside the block: it shows down the bores when the heads are
	off, and through the section cut.
-->
<script lang="ts">
	import { T } from '@threlte/core';
	import { onDestroy } from 'svelte';
	import { Shape } from 'three';
	import { ENGINE } from '../kinematics.ts';
	import InkPart from '../InkPart.svelte';
	import { ALONG_Z, BANKS, PITCH, at, cylZ, tilt } from './frame.ts';
	import { PISTON, crankPin, crankSpin, pistonCrown, rodTurn } from './internals.ts';
	import { CYLINDERS, throwAngle } from './kinematics.ts';
	import { makeShapes } from './shapes.ts';

	let { crank }: { crank: number } = $props();

	const DEG = Math.PI / 180;
	const s = makeShapes();
	onDestroy(s.dispose);

	// ---- crankshaft, modelled at crank angle 0 ----
	const THROWS = [0, 1, 2, 3];
	const pinZ = (j: number) => (j - 1.5) * PITCH; // between the two rods that share it
	const WEB = { gap: 0.72, thick: 0.4 }; // web faces start this far either side of a pin
	const pin = s.cyl(0.5, 0.5, 1.44, 32);
	// A web: a lobe around the crank pin (+y) and a counterweight opposite it.
	const webShape = new Shape()
		.moveTo(1.7 * Math.cos(210 * DEG), 1.7 * Math.sin(210 * DEG))
		.absarc(0, 0, 1.7, 210 * DEG, 330 * DEG, false)
		.lineTo(0.72, ENGINE.crankRadius)
		.absarc(0, ENGINE.crankRadius, 0.72, 0, Math.PI, false)
		.closePath() as Shape;
	const web = s.prism(webShape, WEB.thick, -WEB.thick / 2);
	// main journals: the nose, one between each pair of throws, and the tail
	const mainEdges = [
		-6.6,
		...THROWS.flatMap((j) => [pinZ(j) - WEB.gap - WEB.thick, pinZ(j) + WEB.gap + WEB.thick]),
		6.6
	];
	const mains = Array.from({ length: mainEdges.length / 2 }, (_, k) => {
		const [z0, z1] = [mainEdges[2 * k], mainEdges[2 * k + 1]];
		return { z: (z0 + z1) / 2, geometry: s.cyl(0.55, 0.55, z1 - z0, 32) };
	});

	// ---- rod: big end round the crank pin at the origin, small end one rod length up ----
	const l = ENGINE.rodLength;
	const rodShape = new Shape()
		.moveTo(0.62 * Math.cos(60 * DEG), 0.62 * Math.sin(60 * DEG))
		.absarc(0, 0, 0.62, 60 * DEG, 120 * DEG, true)
		.lineTo(0.36 * Math.cos(240 * DEG), l + 0.36 * Math.sin(240 * DEG))
		.absarc(0, l, 0.36, 240 * DEG, 300 * DEG, true)
		.closePath() as Shape;
	const rod = s.prism(rodShape, 0.4, -0.2);

	// ---- piston: turned profile, crown at y = 0, skirt below ----
	const h = PISTON.height;
	const R = PISTON.radius;
	const piston = s.lathe([
		[0, 0.03],
		[R * 0.95, 0],
		[R, -0.06],
		[R, -0.18],
		[R * 0.95, -0.2],
		[R * 0.95, -0.26],
		[R, -0.28],
		[R, -0.38],
		[R * 0.95, -0.4],
		[R * 0.95, -0.46],
		[R, -0.48],
		[R, -h],
		[R * 0.88, -h],
		[R * 0.88, -0.6],
		[0, -0.6]
	]);

	const bankOf = (name: 'left' | 'right') => BANKS.find((b) => b.name === name)!;
</script>

<T.Group rotation={[0, 0, crankSpin(crank)]}>
	{#each mains as m (m.z)}
		<InkPart geometry={m.geometry} position={[0, 0, m.z]} rotation={ALONG_Z} />
	{/each}
	{#each THROWS as j (j)}
		<InkPart geometry={pin} position={crankPin(j, 0, pinZ(j))} rotation={ALONG_Z} />
		{#each [-1, 1] as side (side)}
			<InkPart
				geometry={web}
				position={[0, 0, pinZ(j) + side * (WEB.gap + WEB.thick / 2)]}
				rotation={[0, 0, -throwAngle(j, 0) * DEG]}
			/>
		{/each}
	{/each}
</T.Group>

{#each CYLINDERS as c (c.n)}
	{@const b = bankOf(c.bank)}
	{@const z = cylZ(b, c.index)}
	<InkPart
		geometry={rod}
		position={crankPin(c.index, crank, z)}
		rotation={[0, 0, rodTurn(c.n, crank)]}
	/>
	<InkPart geometry={piston} position={at(b, pistonCrown(c.n, crank), 0, z)} rotation={tilt(b)} />
{/each}
