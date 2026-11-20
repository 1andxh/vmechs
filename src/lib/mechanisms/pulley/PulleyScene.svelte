<!--
	The pulley lesson's scene. Everything is placed from the lesson's one angle
	through pulleyAt (pulley.ts): which step, how the rope is threaded, how far
	the load has risen, and the forces.

	- The pulleys sit in a row, as in a textbook figure, so every rope runs
	  straight up and down and can be counted. Ropes 0 to n − 1 hold the load;
	  rope n, on the right, is the one you pull.
	- Fixed pulleys hang from a grey beam; moving pulleys hang from a grey bar
	  that carries the load. Each pulley turns by the rope that has run through it.
	- Two arrows, always vertical: your pull (green) and the load's weight (blue).

	Drawn in colour (ADR 0015): fixed pulleys gold, moving pulleys red, the load
	blue, your pull green, the beam, bar and rope warm grey. Coordinates: the
	fixed pulleys' centres at y = 0, x to the right, y up, z towards the camera.
-->
<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { PMREMGenerator } from 'three';
	import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
	import { getCycle } from '../../animation/cycle.svelte.ts';
	import { pulleyAt, ropeThrough } from './pulley.ts';
	import { PARTS, STRUCTURE } from '../palette.ts';

	const cycle = getCycle();
	const now = $derived(pulleyAt(cycle.angle));

	// the colours of the lesson's parts (ADR 0015)
	const FIXED = PARTS.gold.fill;
	const MOVING = PARTS.red.fill;
	const LOAD = PARTS.blue.fill;
	const EFFORT = PARTS.green.fill;

	const R = 0.14; // every pulley's radius: neighbouring ropes are 2R apart
	const BEAM = 0.32; // the beam's height above the fixed pulleys
	const LOW = -1.0; // the moving pulleys' centres at rest
	const HANDLE = -0.75; // where your rope ends at rest
	const ROPE = 0.012;
	const BLOCK = 0.32; // the load's side

	// ropes 0..n, left to right, centred on x = 0
	const ropeX = $derived(
		Array.from({ length: now.ropes + 1 }, (_, k) => (k - now.ropes / 2) * 2 * R)
	);
	const low = $derived(LOW + now.lift); // the moving pulleys rise with the load

	// each pulley joins rope k to rope k + 1, between them; it turns by the rope run through it
	// (over a fixed pulley the rope runs clockwise as seen, under a moving one anticlockwise)
	const pulleys = $derived(
		now.joins.map((at, k) => ({
			k,
			fixed: at === 'top',
			x: ropeX[k] + R,
			y: at === 'top' ? 0 : low,
			turn: ((at === 'top' ? -1 : 1) * ropeThrough(k, now.lift)) / R
		}))
	);
	const moving = $derived(pulleys.filter((p) => !p.fixed));

	// where each rope holding the load ends: at a pulley, at the beam (tied there), or at the
	// moving pulleys (tied there; with no moving pulley, straight onto the load's hook)
	const ropeEnds = $derived(
		ropeX.slice(0, now.ropes).map((x, k) => ({
			x,
			top: k === 0 && now.anchor === 'top' ? BEAM : 0,
			bottom: k === 0 && now.anchor === 'bottom' && moving.length ? barY : low
		}))
	);
	// the bar the moving pulleys hang from, and the load hangs below; with no moving pulley,
	// the load hangs straight from rope 0
	const barY = $derived(low - R - 0.06);
	const loadX = $derived(moving.length ? (ropeX[0] + ropeX[now.ropes - 1]) / 2 : ropeX[0]);
	const loadTop = $derived(moving.length ? barY - 0.12 : low);
	const span = $derived([ropeX[0] - 0.12, ropeX[now.ropes] + 0.12]);

	/** An arrow's length for a force: 300 N is the longest in this lesson. */
	const arrowLength = (newtons: number) => 0.2 + (0.45 * newtons) / 300;
	const handleY = $derived(HANDLE - now.effortMoved);

	// ---- camera: fit the pulleys, ropes and arrows on any screen ----
	const { size, renderer, scene, invalidate } = useThrelte();
	const FOV = 30;
	const TARGET: [number, number, number] = [0, -0.8, 0];
	const DIR = [0.22, 0.14, 1]; // from a little to the right and above
	// room above the beam for the readout, which sits over the top of the stage
	const HALF = { w: 0.95, h: 1.7 };
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

{#snippet rod(x: number, top: number, bottom: number, radius: number)}
	<T.Mesh position={[x, (top + bottom) / 2, 0]}>
		<T.CylinderGeometry args={[radius, radius, Math.max(0.001, top - bottom), 8]} />
		{@render matte(STRUCTURE)}
	</T.Mesh>
{/snippet}

{#snippet arrowDown(x: number, y: number, length: number, color: string)}
	<!-- tail at (x, y), pointing straight down -->
	{@const head = 0.14}
	{@const shaft = Math.max(0.02, length - head)}
	<T.Group position={[x, y, 0]}>
		<T.Mesh position.y={-shaft / 2}>
			<T.CylinderGeometry args={[0.02, 0.02, shaft, 16]} />
			{@render matte(color)}
		</T.Mesh>
		<T.Mesh position.y={-shaft - head / 2} rotation.z={Math.PI}>
			<T.ConeGeometry args={[0.06, head, 20]} />
			{@render matte(color)}
		</T.Mesh>
	</T.Group>
{/snippet}

<!-- the beam the fixed pulleys hang from -->
<T.Mesh position={[(span[0] + span[1]) / 2, BEAM + 0.04, 0]}>
	<T.BoxGeometry args={[span[1] - span[0], 0.08, 0.2]} />
	{@render matte(STRUCTURE)}
</T.Mesh>

<!-- the pulleys: a grooved wheel with spokes, so its turning shows -->
{#each pulleys as p (p.k)}
	{#if p.fixed}{@render rod(p.x, BEAM, 0, 0.018)}{/if}
	<T.Group position={[p.x, p.y, 0]} rotation.z={p.turn}>
		<T.Mesh rotation.x={Math.PI / 2}>
			<T.CylinderGeometry args={[R * 0.82, R * 0.82, 0.07, 40]} />
			{@render matte(p.fixed ? FIXED : MOVING)}
		</T.Mesh>
		<T.Mesh>
			<T.TorusGeometry args={[R * 0.9, 0.022, 10, 48]} />
			{@render matte(p.fixed ? FIXED : MOVING)}
		</T.Mesh>
		<T.Mesh position.z={0.04}>
			<T.BoxGeometry args={[R * 1.5, 0.025, 0.005]} />
			{@render matte(STRUCTURE)}
		</T.Mesh>
	</T.Group>
{/each}

<!-- the bar that carries the moving pulleys and the load -->
{#if moving.length}
	{#each moving as p (p.k)}{@render rod(p.x, p.y, barY, 0.018)}{/each}
	<T.Mesh position={[(ropeX[0] + ropeX[now.ropes - 1]) / 2, barY, 0]}>
		<T.BoxGeometry args={[Math.max(0.24, ropeX[now.ropes - 1] - ropeX[0] + 0.16), 0.06, 0.16]} />
		{@render matte(STRUCTURE)}
	</T.Mesh>
	{@render rod(loadX, barY, loadTop, 0.018)}
{/if}

<!-- the ropes holding the load -->
{#each ropeEnds as r (r.x)}
	{@render rod(r.x, r.top, r.bottom, ROPE)}
{/each}

<!-- the load, and its weight -->
<T.Mesh position={[loadX, loadTop - BLOCK / 2, 0]}>
	<T.BoxGeometry args={[BLOCK, BLOCK, BLOCK]} />
	{@render matte(LOAD)}
</T.Mesh>
{@render arrowDown(loadX, loadTop - BLOCK - 0.03, arrowLength(now.load), LOAD)}

<!-- your rope, down off the last fixed pulley to a handle, and your pull -->
{@render rod(ropeX[now.ropes], 0, handleY, ROPE)}
<T.Mesh position={[ropeX[now.ropes], handleY - 0.04, 0]}>
	<T.SphereGeometry args={[0.045, 20, 12]} />
	{@render matte(EFFORT)}
</T.Mesh>
{@render arrowDown(ropeX[now.ropes], handleY - 0.09, arrowLength(now.effort), EFFORT)}
