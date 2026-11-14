<!--
	One bank's turbocharger and plumbing: four exhaust primaries into a
	collector, the turbine housing (exhaust side) and compressor housing (intake
	side) on a centre section, compressor wheel blades visible in the intake,
	a wastegate actuator, oil feed line, the charge pipe looping forward to the
	throttle body with hose clamps, and the downpipe.
-->
<script lang="ts">
	import { onDestroy, untrack } from 'svelte';
	import InkPart from '../InkPart.svelte';
	import { ALONG_Z, DECK, FOUR, at, cylZ, turboAt, type Bank, type V3 } from './frame.ts';
	import { makeShapes, ringOn } from './shapes.ts';

	let { bank, ink }: { bank: Bank; ink?: string } = $props();

	// The pipes are built once from the bank, and a bank never changes, so the
	// prop is read once on purpose rather than tracked.
	const b = untrack(() => bank);

	const s = makeShapes();
	onDestroy(s.dispose);

	const t = turboAt(b);
	const [tx, ty, tz] = t;

	// exhaust primaries
	const collector: V3 = [tx, ty + 1.6, tz - 0.2];
	const primaries = FOUR.map((i) => {
		const z = cylZ(b, i);
		return s.tube(
			[
				at(b, DECK + 0.4, 1.6, z),
				at(b, DECK - 0.2, 2.6, z),
				[tx, ty + 2.2, (z + tz) / 2],
				collector
			],
			0.2
		);
	});

	// charge pipe: compressor outlet, up and forward to the throttle body
	const chargePts: V3[] = [
		[tx, ty + 1.6, tz - 1.7],
		[tx * 1.05, ty + 3.2, tz - 4.5],
		[b.sgn * 3.2, 5.4, -7.6],
		[b.sgn * 0.9, 5.8, -8.4],
		[0, 5.6, -7.6]
	];
	const clamps = [0.06, 0.55, 0.93].map((u) => ringOn(chargePts, u));

	const downPts: V3[] = [
		[tx, ty - 1, tz + 0.5],
		[tx, ty - 2.2, tz + 2.2],
		[tx * 0.8, -3.4, 8.2]
	];
	const downFlange = ringOn(downPts, 0.03);

	const oilFeed = s.tube(
		[[tx, ty + 0.6, tz - 0.95], [tx - b.sgn * 0.4, ty + 1.7, tz - 1.1], at(b, 2.6, 1.5, tz - 1.4)],
		0.05
	);

	// wastegate actuator: a canister on the compressor side, its rod to the turbine
	const gate: V3 = [tx + b.sgn * 1.25, ty + 0.75, tz - 1.7];
	const gateRod = s.tube(
		[gate, [tx + b.sgn * 0.95, ty + 0.5, tz - 0.6], [tx + b.sgn * 0.75, ty + 0.35, tz]],
		0.04
	);

	// compressor wheel blades, seen through the intake
	const blades = Array.from({ length: 7 }, (_, i) => (i / 7) * Math.PI * 2);
	const blade = s.box(0.05, 0.42, 0.5, 0.02);
</script>

{#each primaries as primary, i (i)}
	<InkPart geometry={primary} crease={60} />
{/each}

<!-- turbine (exhaust) housing and its core -->
<InkPart geometry={s.torus(1, 0.56)} position={t} {ink} crease={60} />
<InkPart geometry={s.cyl(0.65, 0.65, 0.78)} position={t} rotation={ALONG_Z} {ink} />
<!-- centre section -->
<InkPart geometry={s.cyl(0.55, 0.55, 1)} position={[tx, ty, tz - 0.95]} rotation={ALONG_Z} {ink} />
<!-- compressor (intake) housing, the intake, its lip, and the wheel inside -->
<InkPart geometry={s.torus(1.15, 0.64)} position={[tx, ty, tz - 1.7]} {ink} crease={60} />
<InkPart geometry={s.cyl(0.8, 0.65, 1.4)} position={[tx, ty, tz - 2.9]} rotation={ALONG_Z} {ink} />
<InkPart geometry={s.torus(0.8, 0.07, 36)} position={[tx, ty, tz - 3.6]} {ink} detail />
<InkPart
	geometry={s.cyl(0.2, 0.2, 0.5, 16)}
	position={[tx, ty, tz - 3.35]}
	rotation={ALONG_Z}
	{ink}
	detail
/>
{#each blades as a (a)}
	<InkPart
		geometry={blade}
		position={[tx + Math.sin(a) * 0.42, ty + Math.cos(a) * 0.42, tz - 3.35]}
		rotation={[0, 0.5, -a]}
		{ink}
		detail
	/>
{/each}

<!-- wastegate actuator and oil feed -->
<InkPart
	geometry={s.cyl(0.36, 0.36, 0.42, 24)}
	position={gate}
	rotation={[0, 0, Math.PI / 2]}
	{ink}
/>
<InkPart geometry={gateRod} crease={60} {ink} detail />
<InkPart geometry={oilFeed} crease={60} detail />

<!-- charge pipe with hose clamps, then the downpipe with its flange -->
<InkPart geometry={s.tube(chargePts, 0.3)} crease={60} />
{#each clamps as c, i (i)}
	<InkPart geometry={s.torus(0.34, 0.05, 28)} position={c.position} rotation={c.rotation} detail />
{/each}
<InkPart geometry={s.tube(downPts, 0.34)} crease={60} />
<InkPart
	geometry={s.torus(0.42, 0.07, 28)}
	position={downFlange.position}
	rotation={downFlange.rotation}
	detail
/>
