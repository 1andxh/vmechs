<!--
	Intake in the V: plenum with its top ribs, eight runners, a fuel rail and
	injectors along each side, the throttle body with its flange, and the
	coolant crossover at the front with the thermostat housing.
-->
<script lang="ts">
	import { onDestroy } from 'svelte';
	import InkPart from '../InkPart.svelte';
	import { ALONG_Z, BANKS, DECK, FOUR, at, cylZ, tilt } from './frame.ts';
	import FlowLine from './FlowLine.svelte';
	import { GAS } from './flow.ts';
	import { airToPlenum, runner } from './plumbing.ts';
	import { makeShapes } from './shapes.ts';

	const s = makeShapes();
	onDestroy(s.dispose);

	const injector = s.cyl(0.12, 0.09, 0.55, 14);
	// runner routes are shared with the air flow (plumbing.ts)
	const runnerPipe = (bank: (typeof BANKS)[number], i: number) => s.tube(runner(bank, i), 0.22);
	const rail = (sgn: number) =>
		s.tube(
			[
				[sgn * 2.2, 5.05, -5.6],
				[sgn * 2.2, 5.05, 5.6]
			],
			0.1
		);
	const crossover = s.tube(
		[at(BANKS[0], DECK + 0.6, -0.4, -6.75), [0, 4.7, -7.05], at(BANKS[1], DECK + 0.6, -0.4, -6.75)],
		0.24
	);
	const upperHose = s.tube(
		[
			[0, 4.7, -7.3],
			[0, 4.3, -8.1],
			[0, 3.6, -7.9]
		],
		0.2
	);
</script>

<InkPart geometry={s.box(2.4, 1.3, 10.4, 0.45)} position={[0, 5.7, 0.2]} />
{#each [-3.6, -1.2, 1.2, 3.6] as z (z)}
	<InkPart geometry={s.box(1.9, 0.12, 0.18, 0.04)} position={[0, 6.4, z]} />
{/each}

{#each BANKS as bank (bank.name)}
	{#each FOUR as i (i)}
		<InkPart geometry={runnerPipe(bank, i)} />
		<InkPart
			geometry={injector}
			position={at(bank, DECK + 0.95, -1.3, cylZ(bank, i))}
			rotation={tilt(bank)}
		/>
	{/each}
	<InkPart geometry={rail(bank.sgn)} />
{/each}

<!-- throttle body and its flange -->
<InkPart geometry={s.cyl(0.6, 0.6, 1.3)} position={[0, 5.6, -5.9]} rotation={ALONG_Z} />
<InkPart geometry={s.box(1.6, 1.6, 0.16, 0.1)} position={[0, 5.6, -5.25]} />
<InkPart geometry={s.torus(0.6, 0.06, 32)} position={[0, 5.6, -6.55]} />

<!-- coolant crossover, thermostat housing and the upper hose stub -->
<InkPart geometry={crossover} />
<InkPart geometry={s.box(0.8, 0.6, 0.7, 0.15)} position={[0, 4.7, -7.1]} />
<InkPart geometry={upperHose} />

<!-- air flow: through the throttle body, along the plenum, down every runner -->
<FlowLine route={airToPlenum()} color={GAS.intake} />
{#each BANKS as bank (bank.name)}
	{#each FOUR as i (i)}
		<FlowLine route={runner(bank, i)} color={GAS.intake} />
	{/each}
{/each}
