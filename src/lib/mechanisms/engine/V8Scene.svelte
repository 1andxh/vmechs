<!--
	The homepage engine: a generic twin-turbo V8, drawn as ink line art and
	frozen still. Every part is a simple primitive (rounded boxes, cylinders,
	tori, tubes) placed in the engine's own frame (v8/frame.ts) and rendered by
	InkPart; the parts are grouped by area in v8/.

	Layout, like a real twin-turbo V8: two banks of four at ±45° over one
	crankshaft, heads and ribbed valve covers on each bank, an intake plenum
	with eight runners in the V, a turbo low on each side fed by that bank's
	exhaust manifold, charge pipes looping forward to the throttle body, and the
	belt-driven accessories on the front. No branding: it's no particular
	manufacturer's engine.

	This file owns only the camera framing and the callouts, which are links:
	the engine is the way into the site.
-->
<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { HTML } from '@threlte/extras';
	import type { PerspectiveCamera } from 'three';
	import { AMBER, BANKS, DECK, FRONT_Z, at, turboAt, type V3 } from './v8/frame.ts';
	import V8Bank from './v8/V8Bank.svelte';
	import V8Bottom from './v8/V8Bottom.svelte';
	import V8FrontDrive from './v8/V8FrontDrive.svelte';
	import V8Intake from './v8/V8Intake.svelte';
	import V8Turbo from './v8/V8Turbo.svelte';

	let { href }: { href: string } = $props();

	// Framing: the engine sits right of the headline on wide screens.
	const { size, invalidate } = useThrelte();
	let camera = $state<PerspectiveCamera>();
	$effect(() => {
		const { width, height } = $size;
		if (!camera || !width || !height) return;
		const wide = width > 860;
		camera.fov = wide ? 30 : 40;
		if (wide) camera.setViewOffset(width, height, -width * 0.2, 0, width, height);
		else camera.clearViewOffset();
		camera.updateProjectionMatrix();
		invalidate();
	});

	const leftTurbo = turboAt(BANKS[0]);
	const narrow = $derived($size.width <= 860);
	// `before`: the label sits left of its dot.
	const callouts = $derived<{ label: string; at: V3; wideOnly?: boolean; before?: boolean }[]>([
		narrow
			? // phones: on the compressor face, clear of the frame edge and the crankshaft label
				{ label: 'Turbochargers', at: [leftTurbo[0], leftTurbo[1], leftTurbo[2] - 3.6] }
			: // under the turbine housing, so the compressor face and its blades stay clear
				{
					label: 'Turbochargers',
					at: [leftTurbo[0], leftTurbo[1] - 1.8, leftTurbo[2]],
					before: true
				},
		{ label: 'Cylinder heads', at: at(BANKS[0], DECK + 1.2, 1.4, -4.5), wideOnly: true },
		{ label: 'Crankshaft', at: [0, -1.7, FRONT_Z - 0.3] }
	]);
</script>

<T.PerspectiveCamera
	makeDefault
	position={[-21, 15, -25]}
	fov={30}
	oncreate={(cam) => {
		camera = cam;
		cam.lookAt(0, 2.4, 0.5);
	}}
/>

<V8Bottom />
{#each BANKS as bank (bank.name)}
	<V8Bank {bank} />
	<!-- the left turbo is traced in amber: the one part the eye lands on -->
	<V8Turbo {bank} ink={bank.name === 'left' ? AMBER : undefined} />
{/each}
<V8Intake />
<V8FrontDrive />

<!-- Callouts: real links, positioned on the parts they name -->
{#each callouts as callout (callout.label)}
	<HTML position={callout.at}>
		<a class="callout" class:wide-only={callout.wideOnly} class:before={callout.before} {href}
			><span class="dot" aria-hidden="true"></span>{callout.label} →</a
		>
	</HTML>
{/each}

<style>
	.callout {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-height: 32px;
		padding: 0 12px 0 0;
		/* The drawing ignores the pointer so phones can scroll past it, and that
		   setting is inherited; the links switch it back on for themselves. */
		pointer-events: auto;
		/* a dark backing keeps the label readable over the ink lines */
		border-radius: 999px;
		background: var(--bg);
		transform: translate(-5px, -50%);
		font: 500 14px/1 var(--font);
		color: var(--ink-2);
		text-decoration: none;
		white-space: nowrap;
	}
	.callout.before {
		flex-direction: row-reverse;
		padding: 0 0 0 12px;
		transform: translate(calc(-100% + 5px), -50%);
	}
	.callout:hover,
	.callout:focus-visible {
		color: var(--accent);
	}
	.dot {
		width: 10px;
		height: 10px;
		border-radius: 999px;
		border: 1.5px solid currentColor;
		background: var(--bg);
	}
	@media (max-width: 860px) {
		.wide-only {
			display: none;
		}
	}
</style>
