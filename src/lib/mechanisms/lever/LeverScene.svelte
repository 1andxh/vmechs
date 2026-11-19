<!--
	The lever lesson's scene. Everything is placed from the lesson's one angle
	through leverAt (lever.ts): which step, the lever's class and arms, its
	tilt, and the forces.

	- A bar on a wedge-shaped fulcrum (no ground: the machine floats on the page). The bar turns about the
	  fulcrum's tip; the load (a block, bigger for a heavier load) rides on it.
	- Two arrows, always vertical: your push (amber) and the load's weight.
	  Their lengths follow the forces, so 900 N looks three times 300 N.
	- In "The trade", two markers show how far each end has moved.

	Drawn in colour (ADR 0015): your push green, the load blue, the fulcrum
	gold, the bar warm grey; matte, softly lit, outlined by InkRenderer. Coordinates: x along the
	bar, y up, z towards the camera; the bar's middle is at x = 0.
-->
<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { ExtrudeGeometry, PMREMGenerator, Shape } from 'three';
	import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
	import { getCycle } from '../../animation/cycle.svelte.ts';
	import { layout, leverAt } from './lever.ts';
	import { PARTS, STRUCTURE } from '../palette.ts';

	const cycle = getCycle();
	const now = $derived(leverAt(cycle.angle));

	// the colours of the lesson's parts (ADR 0015)
	const EFFORT = PARTS.green.fill;
	const LOAD = PARTS.blue.fill;
	const FULCRUM = PARTS.gold.fill;
	const H = 0.55; // height of the fulcrum's tip
	const BAR = { thick: 0.08, depth: 0.36, overhang: 0.15 };

	// the fulcrum: a wedge, its tip under the bar
	const wedge = (() => {
		const s = new Shape();
		s.moveTo(-0.24, 0);
		s.lineTo(0.24, 0);
		s.lineTo(0, H);
		s.closePath();
		const g = new ExtrudeGeometry(s, { depth: 0.5, bevelEnabled: false });
		g.translate(0, 0, -0.25);
		return g;
	})();

	// where things sit along the bar, the fulcrum at 0, then shifted so the bar's middle is at x = 0
	const pos = $derived(layout(now.cls, now.effortArm, now.loadArm));
	const ends = $derived([
		Math.min(pos.effort, pos.load, pos.fulcrum),
		Math.max(pos.effort, pos.load, pos.fulcrum)
	]);
	const shift = $derived(-(ends[0] + ends[1]) / 2);
	const pivot = $derived(shift); // the fulcrum's x in the scene

	// a point on the bar's top surface, `x` along it from the fulcrum, in the scene
	const onBar = (x: number): [number, number] => {
		const t = now.tilt;
		const up = BAR.thick;
		return [pivot + x * Math.cos(t) - up * Math.sin(t), H + x * Math.sin(t) + up * Math.cos(t)];
	};

	const block = $derived(0.3 + 0.2 * Math.cbrt(now.load / 300)); // side of the load block
	/** An arrow's length for a force: 900 N is the longest. */
	const arrowLength = (newtons: number) => 0.3 + (0.9 * newtons) / 900;

	// your push: down on the bar in the first class (the effort end goes down),
	// up from it in the second and third (you lift)
	const effortAt = $derived(onBar(pos.effort));
	const effortDown = $derived(now.cls === 1);
	// the load's weight presses down on the top of its block
	// (the block tilts with the bar, so its top is `block` along the bar's "up")
	const loadTop = $derived.by((): [number, number] => {
		const [x, y] = onBar(pos.load);
		return [x - block * Math.sin(now.tilt), y + block * Math.cos(now.tilt)];
	});

	// "The trade": how far each end has risen or fallen from rest
	const REST = H + BAR.thick; // the bar's top surface when level
	const travel = $derived(
		now.step === 2
			? [
					[pos.effort, EFFORT],
					[pos.load, LOAD]
				].map(([x, color]) => {
					const [sx, sy] = onBar(x as number);
					return { x: sx, from: REST, to: sy, color: color as string };
				})
			: []
	);

	// ---- camera: fit the lever and its arrows on any screen ----
	const { size, renderer, scene, invalidate } = useThrelte();
	const FOV = 30;
	const TARGET: [number, number, number] = [0, 1.15, 0];
	const DIR = [0.18, 0.32, 1]; // from a little to the right and above
	const HALF = { w: 2.3, h: 1.5 }; // room for the tallest arrow, on step 5
	const camPos = $derived.by((): [number, number, number] => {
		const aspect = $size.width / Math.max(1, $size.height);
		const t = Math.tan(((FOV / 2) * Math.PI) / 180);
		const dist = Math.max(HALF.w / (t * aspect), HALF.h / t);
		const len = Math.hypot(DIR[0], DIR[1], DIR[2]);
		return [
			TARGET[0] + (DIR[0] / len) * dist,
			TARGET[1] + (DIR[1] / len) * dist,
			TARGET[2] + (DIR[2] / len) * dist
		];
	});

	$effect(() => {
		const pmrem = new PMREMGenerator(renderer);
		const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
		scene.environment = env;
		scene.environmentIntensity = 0.6;
		invalidate();
		return () => {
			scene.environment = null;
			env.dispose();
			pmrem.dispose();
		};
	});
</script>

<T.PerspectiveCamera
	makeDefault
	fov={FOV}
	near={0.1}
	far={60}
	position={camPos}
	oncreate={(c) => c.lookAt(...TARGET)}
/>

<!-- soft and even, like a studio (ADR 0015) -->
<T.HemisphereLight args={['#fffaf2', '#8a8580', 1.6]} />
<T.DirectionalLight position={[-2, 5, 4]} intensity={1.4} color="#fff6ea" />
<T.DirectionalLight position={[3, 2, -3]} intensity={0.5} />

{#snippet matte(color: string)}
	<T.MeshStandardMaterial {color} metalness={0.05} roughness={0.6} />
{/snippet}

{#snippet arrow(at: [number, number], down: boolean, length: number, color: string)}
	<!-- tip at `at`, pointing down onto it, or up away from it -->
	{@const head = 0.16}
	{@const shaft = Math.max(0.02, length - head)}
	<T.Group position={[at[0], at[1], 0]}>
		<T.Mesh position.y={down ? head + shaft / 2 : shaft / 2}>
			<T.CylinderGeometry args={[0.022, 0.022, shaft, 16]} />
			<T.MeshStandardMaterial {color} metalness={0.05} roughness={0.6} />
		</T.Mesh>
		<T.Mesh position.y={down ? head / 2 : shaft + head / 2} rotation.z={down ? Math.PI : 0}>
			<T.ConeGeometry args={[0.07, head, 20]} />
			<T.MeshStandardMaterial {color} metalness={0.05} roughness={0.6} />
		</T.Mesh>
	</T.Group>
{/snippet}

<!-- the fulcrum -->
<T.Mesh geometry={wedge} position={[pivot, 0, 0]}>
	{@render matte(FULCRUM)}
</T.Mesh>

<!-- the bar and the load on it, turning about the fulcrum's tip -->
<T.Group position={[pivot, H, 0]} rotation.z={now.tilt}>
	<T.Mesh position={[(ends[0] + ends[1]) / 2, BAR.thick / 2, 0]}>
		<T.BoxGeometry args={[ends[1] - ends[0] + 2 * BAR.overhang, BAR.thick, BAR.depth]} />
		{@render matte(STRUCTURE)}
	</T.Mesh>
	<T.Mesh position={[pos.load, BAR.thick + block / 2, 0]}>
		<T.BoxGeometry args={[block, block, block]} />
		{@render matte(LOAD)}
	</T.Mesh>
</T.Group>

<!-- forces: your push in green, the load's weight in blue, like the load -->
{@render arrow(effortAt, effortDown, arrowLength(now.effort), EFFORT)}
{@render arrow(loadTop, true, arrowLength(now.load), LOAD)}

<!-- "The trade": a bar for each end's travel, from rest to where it is now -->
{#each travel as t (t.x)}
	{@const lo = Math.min(t.from, t.to)}
	{@const hi = Math.max(t.from, t.to)}
	<T.Mesh position={[t.x, (lo + hi) / 2, BAR.depth / 2 + 0.05]}>
		<T.BoxGeometry args={[0.03, Math.max(0.001, hi - lo), 0.03]} />
		<T.MeshBasicMaterial color={t.color} />
	</T.Mesh>
{/each}
