<!--
	The gears lesson's scene: the 12:30 pair, turning. Everything is placed
	from the lesson's one angle (the small gear's, in degrees): the big gear's
	angle comes from meshAngle, and the teeth in contact from contactTeeth.

	Each gear is a body plus one mesh per tooth (pieces.ts), so a single tooth
	can be highlighted. Which parts are highlighted depends on the step.

	Drawn in colour (ADR 0015): the driver green, the driven gear blue, the
	teeth a step points at in gold; matte, softly lit, outlined by InkRenderer.

	Coordinates: z up; the gears lie in the xy plane, the driver's centre at
	the origin and the driven gear's on +x.
-->
<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { BufferGeometry, Float32BufferAttribute, PMREMGenerator } from 'three';
	import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
	import { getCycle } from '../../animation/cycle.svelte.ts';
	import { activeStepIndex } from '../../content/steps.ts';
	import { getLessonSteps } from '../../components/lesson-context.ts';
	import { centreDistance, meshAngle, pitchRadius } from './gears.ts';
	import { PAIR, contactTeeth } from './pair.ts';
	import { gearSolids } from './solid.ts';
	import { PARTS, STRUCTURE } from '../palette.ts';

	const cycle = getCycle();
	const steps = getLessonSteps();
	const { z1, z2, m } = PAIR;
	const WIDTH = 6; // face width: how thick the gears are
	const ARC = 4; // segments per tooth along the cut between teeth and body
	const a = centreDistance(z1, z2, m);

	// the driver, the driven gear, and the teeth a step points at (ADR 0015)
	const GEAR = [PARTS.green.fill, PARTS.blue.fill];
	const TOOTH = PARTS.gold.fill;

	// ---- geometry, built once ----
	type P = [number, number];
	const circle = (r: number, cx = 0, cy = 0, n = 64) =>
		Array.from({ length: n }, (_, k): P => {
			const t = (2 * Math.PI * k) / n;
			return [cx + r * Math.cos(t), cy + r * Math.sin(t)];
		});
	const geometry = (tris: number[]) => {
		const g = new BufferGeometry();
		g.setAttribute('position', new Float32BufferAttribute(tris, 3));
		g.computeVertexNormals(); // not indexed, so each triangle keeps its own flat normal
		return g;
	};

	/** One gear's parts: the tooth (shared by every tooth) and the body with its holes. */
	function gearParts(z: number, bore: number, holes: { r: number; at: number; n: number }[]) {
		const inner = pitchRadius(z, m) - 2 * m; // where the teeth are cut from the body
		const loops = [circle(bore)];
		for (const h of holes)
			for (let k = 0; k < h.n; k++) {
				const t = (2 * Math.PI * k) / h.n;
				loops.push(circle(h.r, h.at * Math.cos(t), h.at * Math.sin(t), 48));
			}
		const { tooth, body } = gearSolids(z, m, inner, ARC, loops, WIDTH);
		return { tooth: geometry(tooth), body: geometry(body) };
	}

	const gears = [
		{ z: z1, centre: [0, 0, 0] as [number, number, number], ...gearParts(z1, 2.5, []) },
		{
			z: z2,
			centre: [a, 0, 0] as [number, number, number],
			...gearParts(z2, 4, [{ r: 2.6, at: 9.2, n: 6 }])
		}
	];

	// ---- motion: all from the one angle ----
	const t = $derived((cycle.angle * Math.PI) / 180);
	const turns = $derived([t, meshAngle(t, z1, z2, 0)]);
	const contact = $derived(contactTeeth(t, z1, z2));
	const step = $derived(activeStepIndex(steps, cycle.angle));

	/**
	 * What each step highlights, in step order (see the lesson's frontmatter):
	 * the teeth in contact; both gears; a marked tooth on each, to count turns;
	 * the big gear; the small gear's working tooth, whose curved side is the involute.
	 */
	type Lit = { whole: boolean; teeth: number[] };
	const lit = $derived.by((): [Lit, Lit] => {
		const none: Lit = { whole: false, teeth: [] };
		const all: Lit = { whole: true, teeth: [] };
		switch (step) {
			case 0:
				return [
					{ whole: false, teeth: [contact[0]] },
					{ whole: false, teeth: [contact[1]] }
				];
			case 1:
				return [all, all];
			case 2:
				return [
					{ whole: false, teeth: [0] },
					{ whole: false, teeth: [0] }
				];
			case 3:
				return [none, all];
			case 4:
				return [{ whole: false, teeth: [contact[0]] }, none];
			default:
				return [none, none];
		}
	});
	/**
	 * A part's colour: a pointed-at tooth is gold. When a step is about one
	 * gear only (the big one, for torque), the other steps back to structure grey.
	 */
	const colourOf = (g: number, k: number | null) => {
		if (k !== null && lit[g].teeth.includes(k)) return TOOTH;
		const otherAlone = lit[1 - g].whole && !lit[g].whole && !lit[g].teeth.length;
		return otherAlone ? STRUCTURE : GEAR[g];
	};

	// ---- camera: fit the pair's width on any screen ----
	const { size, renderer, scene, invalidate } = useThrelte();
	const FOV = 32;
	// the middle of the pair's real extent: from the small gear's far tip to the big one's
	const left = -(pitchRadius(z1, m) + m);
	const right = a + pitchRadius(z2, m) + m;
	const TARGET: [number, number, number] = [(left + right) / 2, 0, -1];
	// from the target towards the camera; the camera only slides along this line,
	// so the one lookAt when it is created keeps it aimed
	const DIR = [-10, -36, 52]; // about 55° above the table, so the teeth in contact show
	const HALF_WIDTH = (right - left) / 2 + 3; // plus a margin
	const camPos = $derived.by((): [number, number, number] => {
		const aspect = $size.width / Math.max(1, $size.height);
		const halfH = Math.tan(((FOV / 2) * Math.PI) / 180);
		const dist = Math.max(64, HALF_WIDTH / (halfH * aspect));
		const len = Math.hypot(DIR[0], DIR[1], DIR[2]);
		return [
			TARGET[0] + (DIR[0] / len) * dist,
			TARGET[1] + (DIR[1] / len) * dist,
			TARGET[2] + (DIR[2] / len) * dist
		];
	});

	// a soft environment for the metal to reflect
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
	near={1}
	far={400}
	up={[0, 0, 1]}
	position={camPos}
	oncreate={(c) => c.lookAt(...TARGET)}
/>

<!-- soft and even, like a studio (ADR 0015) -->
<T.HemisphereLight args={['#fffaf2', '#8a8580', 1.6]} />
<T.DirectionalLight position={[-20, -30, 60]} intensity={1.4} color="#fff6ea" />
<T.DirectionalLight position={[40, 30, 20]} intensity={0.5} />

{#snippet part(geometry: BufferGeometry, color: string, rotation = 0)}
	<T.Mesh {geometry} rotation.z={rotation}>
		<T.MeshStandardMaterial {color} metalness={0.05} roughness={0.6} />
	</T.Mesh>
{/snippet}

{#each gears as gear, g (g)}
	<T.Group position={gear.centre} rotation.z={turns[g]}>
		{@render part(gear.body, colourOf(g, null))}
		{#each { length: gear.z }, k (k)}
			{@render part(gear.tooth, colourOf(g, k), (2 * Math.PI * k) / gear.z)}
		{/each}
	</T.Group>
{/each}
