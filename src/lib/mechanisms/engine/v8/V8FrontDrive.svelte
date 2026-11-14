<!--
	The front of the engine: timing cover with its bolts, the belt-driven
	accessories (crank damper, water pump, alternator, A/C compressor, idler,
	tensioner), pulley grooves, and the serpentine belt.
-->
<script lang="ts">
	import { onDestroy } from 'svelte';
	import InkPart from '../InkPart.svelte';
	import { ALONG_Z, FRONT_Z as FZ, type V3 } from './frame.ts';
	import { makeShapes } from './shapes.ts';

	const s = makeShapes();
	onDestroy(s.dispose);

	const pulleys: { at: [number, number]; r: number }[] = [
		{ at: [0, -0.2], r: 1.35 }, // crankshaft (harmonic damper)
		{ at: [0, 2.8], r: 0.95 }, // water pump
		{ at: [-2.5, 3.7], r: 0.55 }, // alternator
		{ at: [2.6, 0.9], r: 0.72 }, // A/C compressor
		{ at: [1.6, 2.5], r: 0.42 }, // idler
		{ at: [-1.7, 1.5], r: 0.42 } // tensioner
	];
	const beltPts: V3[] = [
		[0, -1.62, FZ],
		[-1.32, -0.7, FZ],
		[-2.15, 1.55, FZ],
		[-3.1, 3.6, FZ],
		[-2.55, 4.3, FZ],
		[-1.2, 3.8, FZ],
		[0, 3.8, FZ],
		[1.15, 2.95, FZ],
		[2.05, 2.5, FZ],
		[3.35, 1.2, FZ],
		[3.1, 0.1, FZ],
		[1.3, -1.0, FZ]
	];
	// timing cover bolts around its edge
	const coverBolts: [number, number][] = [
		[-2.55, -0.9],
		[-2.55, 1.6],
		[-2.55, 4.1],
		[-1.5, 5.75],
		[0, 5.75],
		[1.5, 5.75],
		[2.55, 4.1],
		[2.55, 2.4],
		[2.55, -0.9],
		[1.3, -1.15],
		[-1.3, -1.15]
	];
	const bolt = s.cyl(0.09, 0.09, 0.16, 10);
	const damperBolts = [0, 1, 2, 3].map((i) => (i / 4) * Math.PI * 2 + 0.4);
	const acLines = [
		s.tube(
			[
				[2.9, 1.6, -6.0],
				[3.1, 3.2, -6.2],
				[2.8, 4.2, -6.6]
			],
			0.07
		),
		s.tube(
			[
				[2.3, 1.6, -5.8],
				[2.4, 3.4, -5.9],
				[2.0, 4.4, -6.3]
			],
			0.06
		)
	];
</script>

<InkPart geometry={s.box(5.6, 7.2, 0.5, 0.3)} position={[0, 2.3, -6.75]} />
{#each coverBolts as [x, y] (`${x},${y}`)}
	<InkPart geometry={bolt} position={[x, y, -7.04]} rotation={ALONG_Z} detail />
{/each}

{#each pulleys as p, i (i)}
	<InkPart geometry={s.cyl(p.r, p.r, 0.42)} position={[p.at[0], p.at[1], FZ]} rotation={ALONG_Z} />
	<InkPart
		geometry={s.cyl(p.r * 0.38, p.r * 0.38, 0.5)}
		position={[p.at[0], p.at[1], FZ - 0.1]}
		rotation={ALONG_Z}
		detail
	/>
	<!-- belt grooves on the rim -->
	{#each [-0.12, 0.12] as dz (dz)}
		<InkPart geometry={s.torus(p.r, 0.025, 48)} position={[p.at[0], p.at[1], FZ + dz]} detail />
	{/each}
{/each}

<!-- harmonic damper: inner ring and bolts on the crank pulley -->
<InkPart geometry={s.torus(0.92, 0.06, 40)} position={[0, -0.2, FZ - 0.22]} detail />
{#each damperBolts as a (a)}
	<InkPart
		geometry={bolt}
		position={[Math.cos(a) * 0.68, -0.2 + Math.sin(a) * 0.68, FZ - 0.26]}
		rotation={ALONG_Z}
		detail
	/>
{/each}

<!-- water pump body, alternator with its cooling rings, A/C compressor and lines -->
<InkPart geometry={s.cyl(0.7, 0.7, 0.6)} position={[0, 2.8, -6.85]} rotation={ALONG_Z} />
<InkPart geometry={s.cyl(0.95, 0.95, 1.6)} position={[-2.5, 3.7, -6.2]} rotation={ALONG_Z} />
{#each [-0.5, 0, 0.5] as dz (dz)}
	<InkPart geometry={s.torus(0.96, 0.03, 40)} position={[-2.5, 3.7, -6.2 + dz]} detail />
{/each}
<InkPart geometry={s.box(0.5, 1.4, 0.3, 0.08)} position={[-2.5, 2.5, -6.6]} detail />
<InkPart geometry={s.box(1.5, 1.3, 1.8, 0.3)} position={[2.6, 0.9, -6.1]} />
{#each acLines as line, i (i)}
	<InkPart geometry={line} crease={60} detail />
{/each}

<InkPart geometry={s.tube(beltPts, 0.11, true)} crease={60} />
