<!--
	The homepage engine: a generic twin-turbo V8, drawn as ink line art and
	running, on the homepage's drawing sheet (ADR 0012). Every part is a simple
	primitive placed in the engine's frame (v8/frame.ts); the parts are grouped
	by area in v8/.

	Layout, like a real twin-turbo V8: two banks of four at ±45° over one
	crankshaft, heads and ribbed valve covers on each bank, an intake plenum
	with eight runners in the V, a turbo low on each side fed by that bank's
	exhaust manifold, charge pipes looping forward to the throttle body, and the
	belt-driven accessories on the front. No branding: it's no particular
	manufacturer's engine.

	One fixed view (VIEW). `sheet.active` draws one group in the accent ink;
	the scene writes back when its first frame is up (`sheet.drawn`).
-->
<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import type { PerspectiveCamera } from 'three';
	import { VIEW, type SheetState } from './v8/sheet.ts';
	import { BANKS } from './v8/frame.ts';
	import V8Bank from './v8/V8Bank.svelte';
	import V8Bottom from './v8/V8Bottom.svelte';
	import V8FrontDrive from './v8/V8FrontDrive.svelte';
	import V8Intake from './v8/V8Intake.svelte';
	import V8Internals from './v8/V8Internals.svelte';
	import { crankAt } from './v8/kinematics.ts';
	import { getFlow } from './v8/flow.ts';
	import { flowShift } from './v8/plumbing.ts';
	import V8Turbo from './v8/V8Turbo.svelte';

	let { sheet }: { sheet: SheetState } = $props();
	const active = $derived(sheet.active);

	const { size, invalidate } = useThrelte();

	// The engine clock: a slow display speed, so you can follow each piston.
	// (A real V8 idles at 600 to 800 rpm, too fast to see.)
	const RPM = 40;
	let crank = $state(0);
	const clock = useTask((dt) => (crank += crankAt(dt, RPM)), { autoStart: false });
	$effect(() => (sheet.running ? clock.start() : clock.stop()));
	const flow = getFlow();
	$effect(() => {
		flow.uShift.value = flowShift(crank);
	});
	$effect(() => {
		void active;
		invalidate(); // redraw when the accent moves, even while stopped
	});
	let camera = $state<PerspectiveCamera>();

	$effect(() => {
		const { width, height } = $size;
		if (!camera || !width || !height) return;
		// Tall, narrow boxes stand further back so the engine fits across.
		// (0.8: closer than the old tour's opening view, so the engine fills its box)
		const fit = (width < 600 ? 0.9 : 0.8) * (1 + Math.max(0, 1.2 - width / height) * 0.75);
		const { eye, look } = VIEW;
		camera.position.set(
			look[0] + (eye[0] - look[0]) * fit,
			look[1] + (eye[1] - look[1]) * fit,
			look[2] + (eye[2] - look[2]) * fit
		);
		camera.lookAt(...look);
		camera.fov = 30;
		camera.updateProjectionMatrix();
		invalidate();
		// The frame is drawn on the next animation frame; mark it once it is.
		if (!sheet.drawn)
			requestAnimationFrame(() => requestAnimationFrame(() => (sheet.drawn = true)));
	});
</script>

<T.PerspectiveCamera
	makeDefault
	fov={30}
	oncreate={(cam) => {
		camera = cam;
	}}
/>

<V8Bottom />
<T.Group userData={{ ink: active === 'internals' }}>
	<V8Internals {crank} />
</T.Group>
{#each BANKS as bank (bank.name)}
	<V8Bank {bank} accent={active === 'heads'} />
	<T.Group userData={{ ink: active === 'turbos' }}>
		<V8Turbo {bank} {crank} />
	</T.Group>
{/each}
<T.Group userData={{ ink: active === 'intake' }}>
	<V8Intake />
</T.Group>
<T.Group userData={{ ink: active === 'front' }}>
	<V8FrontDrive {crank} />
</T.Group>
