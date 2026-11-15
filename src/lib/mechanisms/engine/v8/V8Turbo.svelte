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
	import { T } from '@threlte/core';
	import { ALONG_Z, DECK, FOUR, at, cylZ, turboAt, type Bank, type V3 } from './frame.ts';
	import { turboTurn } from './kinematics.ts';
	import FlowLine from './FlowLine.svelte';
	import { GAS } from './flow.ts';
	import { airIn, chargePipe, downPipe, primary } from './plumbing.ts';
	import { makeShapes, ringOn } from './shapes.ts';

	let { bank, crank = 0 }: { bank: Bank; crank?: number } = $props();

	// The pipes are built once from the bank, and a bank never changes, so the
	// prop is read once on purpose rather than tracked.
	const b = untrack(() => bank);

	const s = makeShapes();
	onDestroy(s.dispose);

	const t = turboAt(b);
	const [tx, ty, tz] = t;

	// exhaust primaries and the charge pipe (routes shared with the gas flow)
	const primaries = FOUR.map((i) => s.tube(primary(b, i), 0.2));
	const chargePts = chargePipe(b);
	const clamps = [0.06, 0.55, 0.93].map((u) => ringOn(chargePts, u));

	const downPts = downPipe(b);
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
	<InkPart geometry={primary} />
{/each}

<!-- turbine (exhaust) housing and its core -->
<InkPart geometry={s.torus(1, 0.56)} position={t} />
<InkPart geometry={s.cyl(0.65, 0.65, 0.78)} position={t} rotation={ALONG_Z} />
<!-- centre section -->
<InkPart geometry={s.cyl(0.55, 0.55, 1)} position={[tx, ty, tz - 0.95]} rotation={ALONG_Z} />
<!-- compressor (intake) housing, the intake, its lip, and the wheel inside -->
<InkPart geometry={s.torus(1.15, 0.64)} position={[tx, ty, tz - 1.7]} />
<!-- the intake is an open tube, so the wheel shows inside it -->
<InkPart
	geometry={s.cyl(0.8, 0.65, 1.4, 40, true)}
	position={[tx, ty, tz - 2.9]}
	rotation={ALONG_Z}
/>
<InkPart geometry={s.torus(0.8, 0.07, 36)} position={[tx, ty, tz - 3.6]} />
<!-- the compressor wheel, spinning (a display speed: see turboTurn) -->
<T.Group position={[tx, ty, tz - 3.35]} rotation={[0, 0, (turboTurn(crank) * Math.PI) / 180]}>
	<InkPart geometry={s.cyl(0.2, 0.2, 0.5, 16)} rotation={ALONG_Z} />
	{#each blades as a (a)}
		<InkPart
			geometry={blade}
			position={[Math.sin(a) * 0.42, Math.cos(a) * 0.42, 0]}
			rotation={[0, 0.5, -a]}
		/>
	{/each}
</T.Group>

<!-- wastegate actuator and oil feed -->
<InkPart geometry={s.cyl(0.36, 0.36, 0.42, 24)} position={gate} rotation={[0, 0, Math.PI / 2]} />
<InkPart geometry={gateRod} />
<InkPart geometry={oilFeed} />

<!-- charge pipe with hose clamps, then the downpipe with its flange -->
<InkPart geometry={s.tube(chargePts, 0.3)} />
{#each clamps as c, i (i)}
	<InkPart geometry={s.torus(0.34, 0.05, 28)} position={c.position} rotation={c.rotation} />
{/each}
<InkPart geometry={s.tube(downPts, 0.34)} />
<InkPart
	geometry={s.torus(0.42, 0.07, 28)}
	position={downFlange.position}
	rotation={downFlange.rotation}
/>

<!-- gas flow, in the pipes only: air into the compressor and along the
     charge pipe; exhaust from every cylinder to the turbine, then down the downpipe -->
<FlowLine route={airIn(b)} color={GAS.intake} />
<FlowLine route={chargePts} color={GAS.intake} />
{#each FOUR as i (i)}
	<FlowLine route={primary(b, i)} color={GAS.exhaust} />
{/each}
<FlowLine route={downPts} color={GAS.exhaust} />
