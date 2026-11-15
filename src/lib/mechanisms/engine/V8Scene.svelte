<!--
	The homepage engine: a generic twin-turbo V8, drawn as ink line art, that
	comes apart as you scroll, like an exploded technical drawing. Every part
	is a simple primitive placed in the engine's frame (v8/frame.ts); the parts
	are grouped by area in v8/.

	Layout, like a real twin-turbo V8: two banks of four at ±45° over one
	crankshaft, heads and ribbed valve covers on each bank, an intake plenum
	with eight runners in the V, a turbo low on each side fed by that bank's
	exhaust manifold, charge pipes looping forward to the throttle body, and the
	belt-driven accessories on the front. No branding: it's no particular
	manufacturer's engine.

	One value drives it: `tour.progress` (scroll, 0..1). It sets how far each
	group is out (explodeAt), which group is in the accent ink (the one the
	current sentence names) and where the camera stands.
-->
<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import type { PerspectiveCamera } from 'three';
	import { STAGES, cameraAt, explodeAt, stageAt, type TourState } from './v8/explode.ts';
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

	let { tour }: { tour: TourState } = $props();

	const NONE = { intake: 0, turbos: 0, front: 0, heads: 0 };
	// With reduced motion the engine stays assembled; the accent still follows the text.
	const out = $derived(tour.still ? NONE : explodeAt(tour.progress));
	const active = $derived(STAGES[stageAt(tour.progress)].group);
	/** 0 under the headline, 1 once the first part starts coming out. */
	const intoTour = $derived(Math.min(1, tour.progress * (STAGES.length - 1)));

	const { size, invalidate } = useThrelte();

	// The engine clock: a slow display speed, so you can follow each piston.
	// (A real V8 idles at 600 to 800 rpm, too fast to see.)
	const RPM = 40;
	let crank = $state(0);
	const clock = useTask((dt) => (crank += crankAt(dt, RPM)), { autoStart: false });
	$effect(() => (tour.running ? clock.start() : clock.stop()));
	const flow = getFlow();
	$effect(() => {
		flow.uShift.value = flowShift(crank);
	});
	let camera = $state<PerspectiveCamera>();

	$effect(() => {
		const { width, height } = $size;
		if (!camera || !width || !height) return;
		const wide = width > 860;

		// Each stage has its own view (cameraAt); with reduced motion the
		// camera stays put. Tall, narrow screens stand further back so the
		// engine fits across.
		const view = cameraAt(tour.still ? 0 : tour.progress * (STAGES.length - 1));
		const aspect = width / height;
		// (less during the tour: its views already stand back for the spread)
		const narrowness = Math.max(0, 1.2 - aspect);
		const fit = 1 + narrowness * (0.75 - 0.4 * intoTour);
		const [eye, look] = [view.eye, view.look];
		camera.position.set(
			look[0] + (eye[0] - look[0]) * fit,
			look[1] + (eye[1] - look[1]) * fit,
			look[2] + (eye[2] - look[2]) * fit
		);
		camera.lookAt(...look);

		// Under the headline the engine sits right of the words (wide) or above
		// them (narrow); during the tour it rises clear of the sentence band.
		camera.fov = wide ? 30 : 40;
		const x = wide ? -0.2 * width * (1 - intoTour) : 0;
		const y = (wide ? 0.1 * intoTour : 0.19 - 0.09 * intoTour) * height;
		camera.setViewOffset(width, height, x, y, width, height);
		camera.updateProjectionMatrix();
		invalidate();
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
<V8Internals {crank} />
{#each BANKS as bank (bank.name)}
	<V8Bank {bank} lift={out.heads} accent={active === 'heads'} />
	<T.Group
		position={[bank.sgn * 5 * out.turbos, -1.2 * out.turbos, 0]}
		userData={{ ink: active === 'turbos' }}
	>
		<V8Turbo {bank} {crank} />
	</T.Group>
{/each}
<T.Group position={[0, 6.5 * out.intake, 0]} userData={{ ink: active === 'intake' }}>
	<V8Intake />
</T.Group>
<T.Group position={[0, 0, -6 * out.front]} userData={{ ink: active === 'front' }}>
	<V8FrontDrive {crank} />
</T.Group>
