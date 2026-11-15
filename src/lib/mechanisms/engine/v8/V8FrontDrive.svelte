<!--
	The front of the engine: timing cover with its bolts, the belt-driven
	accessories (crank damper, water pump, alternator, A/C compressor, idler,
	tensioner), pulley grooves, and the serpentine belt.
-->
<script lang="ts">
	import { onDestroy } from 'svelte';
	import InkPart from '../InkPart.svelte';
	import { T } from '@threlte/core';
	import { BELT, BELT_THICKNESS, PULLEYS, beltRibs } from './drive.ts';
	import { pulleyTurn } from './kinematics.ts';
	import { ALONG_Z, FRONT_Z as FZ, type V3 } from './frame.ts';
	import { makeShapes } from './shapes.ts';

	let { crank = 0 }: { crank?: number } = $props();

	const s = makeShapes();
	onDestroy(s.dispose);
	const DEG = Math.PI / 180;

	// Spokes on each pulley's face, so you can see it turn: five on the big
	// ones, three on the small idler and tensioner.
	const spokeAngles = (p: (typeof PULLEYS)[number]) =>
		Array.from({ length: p.r > 0.6 ? 5 : 3 }, (_, k) => (k * 2 * Math.PI) / (p.r > 0.6 ? 5 : 3));
	const spokeFor = (p: (typeof PULLEYS)[number]) => s.box(0.1, p.r * 0.55, 0.06, 0.02);
	const spokes = new Map(PULLEYS.map((p) => [p.name, spokeFor(p)]));
	// A flat serpentine belt, with ribs across its outer face that travel with it.
	const BELT_WIDTH = 0.36;
	const RIBS = 40;
	const RIB = 0.012; // how far a rib stands off the belt: low enough to draw as a fine line
	const rib = s.box(0.05, RIB, BELT_WIDTH, 0.01);
	// The loop runs clockwise, so outward is to the left of the direction of travel.
	const ribAt = (r: { at: [number, number]; along: number }): [number, number, number] => {
		const out = BELT_THICKNESS / 2 + RIB / 2;
		return [r.at[0] - Math.sin(r.along) * out, r.at[1] + Math.cos(r.along) * out, FZ];
	};

	// The pulleys and belt path are shared with the kinematics (drive.ts), so
	// the pulleys turn at the ratios their drawn sizes imply.
	const pulleys = PULLEYS;
	const beltPts: V3[] = BELT.map(([x, y]) => [x, y, FZ]);
	const belt = s.band(beltPts, BELT_THICKNESS, BELT_WIDTH);
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
	<InkPart geometry={bolt} position={[x, y, -7.04]} rotation={ALONG_Z} />
{/each}

{#each pulleys as p, i (i)}
	<InkPart geometry={s.cyl(p.r, p.r, 0.42)} position={[p.at[0], p.at[1], FZ]} rotation={ALONG_Z} />
	<InkPart
		geometry={s.cyl(p.r * 0.38, p.r * 0.38, 0.5)}
		position={[p.at[0], p.at[1], FZ - 0.1]}
		rotation={ALONG_Z}
	/>
	<!-- belt grooves on the rim -->
	{#each [-0.12, 0.12] as dz (dz)}
		<InkPart geometry={s.torus(p.r, 0.025, 48)} position={[p.at[0], p.at[1], FZ + dz]} />
	{/each}
	<!-- the turning part: spokes on the face (and the damper's ring and bolts) -->
	<T.Group position={[p.at[0], p.at[1], FZ]} rotation={[0, 0, pulleyTurn(p, crank) * DEG]}>
		{#each spokeAngles(p) as a (a)}
			<InkPart
				geometry={spokes.get(p.name)!}
				position={[-Math.sin(a) * p.r * 0.64, Math.cos(a) * p.r * 0.64, -0.24]}
				rotation={[0, 0, a]}
			/>
		{/each}
		{#if p.name === 'crank'}
			<InkPart geometry={s.torus(0.92, 0.06, 40)} position={[0, 0, -0.22]} />
			{#each damperBolts as a (a)}
				<InkPart
					geometry={bolt}
					position={[Math.cos(a) * 0.68, Math.sin(a) * 0.68, -0.26]}
					rotation={ALONG_Z}
				/>
			{/each}
		{/if}
	</T.Group>
{/each}

<!-- water pump body, alternator with its cooling rings, A/C compressor and lines -->
<InkPart geometry={s.cyl(0.7, 0.7, 0.6)} position={[0, 2.8, -6.85]} rotation={ALONG_Z} />
<InkPart geometry={s.cyl(0.95, 0.95, 1.6)} position={[-2.5, 3.7, -6.2]} rotation={ALONG_Z} />
{#each [-0.5, 0, 0.5] as dz (dz)}
	<InkPart geometry={s.torus(0.96, 0.03, 40)} position={[-2.5, 3.7, -6.2 + dz]} />
{/each}
<InkPart geometry={s.box(0.5, 1.4, 0.3, 0.08)} position={[-2.5, 2.5, -6.6]} />
<InkPart geometry={s.box(1.5, 1.3, 1.8, 0.3)} position={[2.6, 0.9, -6.1]} />
{#each acLines as line, i (i)}
	<InkPart geometry={line} />
{/each}

<InkPart geometry={belt} />
{#each beltRibs(RIBS, crank) as r (r.index)}
	<InkPart geometry={rib} position={ribAt(r)} rotation={[0, 0, r.along]} />
{/each}
