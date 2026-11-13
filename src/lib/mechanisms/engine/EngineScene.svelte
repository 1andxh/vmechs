<!--
	Procedural single-cylinder engine. Every position below is computed from
	the cycle angle using the tested kinematics functions — nothing is
	animated independently.

	Look (direction D2): one warm spotlight from above on a dark stage, a faint
	rim light behind, dark metal. The gas carries the story: cool haze → warm
	squeeze → white-hot flash → smoke, and the combustion lights the metal.

	Coordinates: crankshaft centre at the origin, y up, crank turns about z.
	Scene units match ENGINE (crank radius 1, rod 3.5).
-->
<script lang="ts">
	import { T, useThrelte } from '@threlte/core';
	import { HTML, OrbitControls, interactivity } from '@threlte/extras';
	import { AdditiveBlending, DoubleSide, NormalBlending, PMREMGenerator } from 'three';
	import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
	import { getCycle } from '../../animation/cycle.svelte.ts';
	import {
		ENGINE,
		crankPin,
		strokeAt,
		valveLift,
		wristPinHeight,
		wrapCycle
	} from './kinematics.ts';
	import { COLORS, PARTS, type PartId } from './parts.ts';

	let {
		selected = null,
		onselect
	}: { selected?: PartId | null; onselect?: (id: PartId | null) => void } = $props();

	interactivity();
	const cycle = getCycle();

	// Metal is mostly reflection: with nothing to reflect it renders near-black.
	// A generated "room", kept dim, gives the metal something to show without
	// lifting the dark stage.
	const { renderer, scene, invalidate } = useThrelte();
	$effect(() => {
		const pmrem = new PMREMGenerator(renderer);
		const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
		scene.environment = env;
		scene.environmentIntensity = 0.35;
		invalidate();
		return () => {
			scene.environment = null;
			env.dispose();
			pmrem.dispose();
		};
	});

	// --- fixed dimensions -------------------------------------------------
	const BORE_R = 1.1; // cylinder radius
	const PISTON_H = 1.1;
	const PIN_TO_CROWN = 0.55; // wrist pin sits this far below the piston top
	const HEAD_Y = ENGINE.crankRadius + ENGINE.rodLength + PIN_TO_CROWN + 0.25; // 0.25 = clearance at TDC
	const VALVE_X = 0.55;
	const VALVE_R = 0.36;
	const MAX_LIFT = 0.4;
	const STEM_LEN = 1.4;

	// --- everything that moves, derived from the one angle -----------------
	const deg = $derived(cycle.angle);
	const pin = $derived(crankPin(deg, ENGINE));
	const wristY = $derived(wristPinHeight(deg, ENGINE));
	const crownY = $derived(wristY + PIN_TO_CROWN);
	const rodLen = ENGINE.rodLength;
	const rodMid = $derived({ x: pin.x / 2, y: (pin.y + wristY) / 2 });
	// Tilt the rod (a y-aligned box) so it points from crank pin to wrist pin.
	const rodTilt = $derived(Math.atan2(pin.x, wristY - pin.y));
	const intakeLift = $derived(valveLift(deg, 'intake') * MAX_LIFT);
	const exhaustLift = $derived(valveLift(deg, 'exhaust') * MAX_LIFT);

	// Spark fires just before TDC at the end of compression (~350°).
	const sparking = $derived(wrapCycle(deg) > 345 && wrapCycle(deg) < 372);

	// Gas in the chamber: colour and strength say what it's doing right now.
	// `glow` gases add light (additive blending); air and smoke just tint, because
	// grey added to near-black barely changes anything.
	const gasH = $derived(HEAD_Y - crownY);
	const gas = $derived.by(() => {
		const t = (wrapCycle(deg) % 180) / 180; // progress through this stroke, 0..1
		switch (strokeAt(deg)) {
			case 'intake':
				return { color: COLORS.air, opacity: 0.1 + 0.14 * t, glow: false, light: 0 };
			case 'compression':
				return { color: COLORS.hot, opacity: 0.06 + 0.24 * t, glow: true, light: 0 };
			case 'power':
				// White-hot flash at ignition, cooling through amber to deep orange.
				if (t < 0.1) return { color: COLORS.flash, opacity: 0.95, glow: true, light: 14 };
				return {
					color: t < 0.5 ? COLORS.hot : COLORS.hotDeep,
					opacity: 0.85 - 0.65 * t,
					glow: true,
					light: 12 * (1 - t)
				};
			case 'exhaust':
				return { color: COLORS.smoke, opacity: 0.5 - 0.4 * t, glow: false, light: 0 };
		}
	});

	// --- interaction -------------------------------------------------------
	let hovered = $state<PartId | null>(null);
	const glow = (id: PartId) => (selected === id ? 0.6 : hovered === id ? 0.25 : 0);
	const handlers = (id: PartId) => ({
		onclick: (e: { stopPropagation: () => void }) => {
			e.stopPropagation();
			onselect?.(selected === id ? null : id);
		},
		onpointerenter: () => {
			hovered = id;
			document.body.style.cursor = 'pointer';
		},
		onpointerleave: () => {
			hovered = null;
			document.body.style.cursor = '';
		}
	});

	const labelAnchor: Record<PartId, () => [number, number, number]> = {
		piston: () => [BORE_R + 0.5, crownY - PISTON_H / 2, 0],
		rod: () => [rodMid.x + 0.6, rodMid.y, 0],
		crank: () => [1.7, -0.6, 0],
		intakeValve: () => [-VALVE_X - 1, HEAD_Y + 0.9, 0],
		exhaustValve: () => [VALVE_X + 1, HEAD_Y + 0.9, 0],
		sparkPlug: () => [0, HEAD_Y + 1.8, 0],
		cylinder: () => [-BORE_R - 0.6, 3.2, 0]
	};
	const selectedPart = $derived(PARTS.find((p) => p.id === selected));
</script>

<T.PerspectiveCamera makeDefault position={[7, 6.5, 12]} fov={38}>
	<OrbitControls
		target={[0, 3.2, 0]}
		enableDamping
		enablePan={false}
		minDistance={6}
		maxDistance={22}
	/>
</T.PerspectiveCamera>

<!-- Lighting: one warm key from above (aimed at the origin), a faint rim from behind, almost no ambient. -->
<T.AmbientLight intensity={0.2} />
<T.SpotLight
	position={[2.5, 16, 7]}
	angle={0.42}
	penumbra={0.9}
	decay={0}
	intensity={3.4}
	color={COLORS.key}
/>
<T.DirectionalLight position={[-5, 7, -8]} intensity={1.6} color={COLORS.rim} />
<T.DirectionalLight position={[-6, 3, 8]} intensity={0.2} />

<!-- Cylinder: back half only, so we can see inside (cutaway) -->
<T.Mesh position.y={(2 + HEAD_Y) / 2} {...handlers('cylinder')}>
	<T.CylinderGeometry
		args={[BORE_R + 0.02, BORE_R + 0.02, HEAD_Y - 2, 48, 1, true, Math.PI / 2, Math.PI]}
	/>
	<T.MeshStandardMaterial
		color={COLORS.block}
		side={DoubleSide}
		metalness={0.3}
		roughness={0.7}
		emissive={COLORS.accent}
		emissiveIntensity={glow('cylinder')}
	/>
</T.Mesh>

<!-- Gas in the combustion chamber -->
{#if gasH > 0.01}
	<T.Mesh position.y={crownY + gasH / 2}>
		<T.CylinderGeometry args={[BORE_R - 0.02, BORE_R - 0.02, gasH, 40]} />
		<T.MeshBasicMaterial
			color={gas.color}
			transparent
			opacity={gas.opacity}
			depthWrite={false}
			blending={gas.glow ? AdditiveBlending : NormalBlending}
		/>
	</T.Mesh>
{/if}
<!-- The burn lights up the metal around it. -->
{#if gas.light > 0}
	<T.PointLight
		position.y={crownY + gasH / 2}
		color={COLORS.hot}
		intensity={gas.light}
		distance={5}
		decay={2}
	/>
{/if}

<!-- Cylinder head (smoked-glass roof) -->
<T.Mesh position.y={HEAD_Y + 0.3}>
	<T.BoxGeometry args={[2.9, 0.6, 2.6]} />
	<T.MeshStandardMaterial
		color={COLORS.head}
		metalness={0.3}
		roughness={0.6}
		transparent
		opacity={0.4}
		depthWrite={false}
	/>
</T.Mesh>

<!-- Piston -->
<T.Mesh position.y={crownY - PISTON_H / 2} {...handlers('piston')}>
	<T.CylinderGeometry args={[BORE_R - 0.04, BORE_R - 0.04, PISTON_H, 48]} />
	<T.MeshStandardMaterial
		color={COLORS.alu}
		metalness={0.75}
		roughness={0.32}
		emissive={COLORS.accent}
		emissiveIntensity={glow('piston')}
	/>
</T.Mesh>
<!-- Wrist pin -->
<T.Mesh position.y={wristY} rotation.x={Math.PI / 2}>
	<T.CylinderGeometry args={[0.16, 0.16, 1.6, 20]} />
	<T.MeshStandardMaterial color={COLORS.steel} metalness={0.8} roughness={0.3} />
</T.Mesh>

<!-- Connecting rod -->
<T.Mesh position={[rodMid.x, rodMid.y, 0]} rotation.z={rodTilt} {...handlers('rod')}>
	<T.BoxGeometry args={[0.32, rodLen, 0.28]} />
	<T.MeshStandardMaterial
		color={COLORS.darkSteel}
		metalness={0.8}
		roughness={0.38}
		emissive={COLORS.accent}
		emissiveIntensity={glow('rod')}
	/>
</T.Mesh>

<!-- Crankshaft: rotates clockwise (seen from the front), -θ about z -->
<T.Group rotation.z={(-deg * Math.PI) / 180} {...handlers('crank')}>
	<!-- main journal -->
	<T.Mesh rotation.x={Math.PI / 2}>
		<T.CylinderGeometry args={[0.32, 0.32, 2.4, 28]} />
		<T.MeshStandardMaterial
			color={COLORS.steel}
			metalness={0.8}
			roughness={0.3}
			emissive={COLORS.accent}
			emissiveIntensity={glow('crank')}
		/>
	</T.Mesh>
	<!-- two crank webs with counterweights -->
	{#each [-0.42, 0.42] as z (z)}
		<T.Mesh position={[0, 0.15, z]}>
			<T.BoxGeometry args={[0.7, 1.9, 0.18]} />
			<T.MeshStandardMaterial
				color={COLORS.darkSteel}
				metalness={0.75}
				roughness={0.4}
				emissive={COLORS.accent}
				emissiveIntensity={glow('crank')}
			/>
		</T.Mesh>
		<T.Mesh position={[0, -0.75, z]} rotation.x={Math.PI / 2}>
			<T.CylinderGeometry args={[0.85, 0.85, 0.18, 32, 1, false, Math.PI / 2, Math.PI]} />
			<T.MeshStandardMaterial
				color={COLORS.darkSteel}
				metalness={0.75}
				roughness={0.4}
				emissive={COLORS.accent}
				emissiveIntensity={glow('crank')}
			/>
		</T.Mesh>
	{/each}
	<!-- crank pin (the rod's big end rides on this) -->
	<T.Mesh position.y={ENGINE.crankRadius} rotation.x={Math.PI / 2}>
		<T.CylinderGeometry args={[0.24, 0.24, 1.0, 24]} />
		<T.MeshStandardMaterial
			color={COLORS.steel}
			metalness={0.8}
			roughness={0.3}
			emissive={COLORS.accent}
			emissiveIntensity={glow('crank')}
		/>
	</T.Mesh>
</T.Group>

<!-- Valves: a disc (head) on a stem, pushed down (open) by the lift -->
{#each [{ id: 'intakeValve' as const, x: -VALVE_X, lift: intakeLift }, { id: 'exhaustValve' as const, x: VALVE_X, lift: exhaustLift }] as v (v.id)}
	<T.Group position={[v.x, HEAD_Y - v.lift, 0]} {...handlers(v.id)}>
		<T.Mesh position.y={0.04}>
			<T.CylinderGeometry args={[VALVE_R, VALVE_R * 0.75, 0.1, 32]} />
			<T.MeshStandardMaterial
				color={COLORS.steel}
				metalness={0.8}
				roughness={0.35}
				emissive={COLORS.accent}
				emissiveIntensity={glow(v.id)}
			/>
		</T.Mesh>
		<T.Mesh position.y={STEM_LEN / 2}>
			<T.CylinderGeometry args={[0.06, 0.06, STEM_LEN, 12]} />
			<T.MeshStandardMaterial
				color={COLORS.steel}
				metalness={0.8}
				roughness={0.35}
				emissive={COLORS.accent}
				emissiveIntensity={glow(v.id)}
			/>
		</T.Mesh>
	</T.Group>
	<!-- port: the passage the gas flows through, angled away from the cylinder -->
	<T.Mesh position={[v.x * 2.2, HEAD_Y + 0.75, 0]} rotation.z={v.x < 0 ? 0.9 : -0.9}>
		<T.CylinderGeometry args={[0.3, 0.3, 1.5, 20, 1, true]} />
		<T.MeshStandardMaterial
			color={COLORS.port}
			metalness={0.3}
			roughness={0.7}
			transparent
			opacity={0.6}
			side={DoubleSide}
			depthWrite={false}
		/>
	</T.Mesh>
{/each}

<!-- Spark plug -->
<T.Group position.y={HEAD_Y} {...handlers('sparkPlug')}>
	<T.Mesh position.y={0.8}>
		<T.CylinderGeometry args={[0.14, 0.14, 1.6, 16]} />
		<T.MeshStandardMaterial
			color={COLORS.plug}
			roughness={0.55}
			emissive={COLORS.accent}
			emissiveIntensity={glow('sparkPlug')}
		/>
	</T.Mesh>
	<T.Mesh position.y={0.05}>
		<T.SphereGeometry args={[sparking ? 0.22 : 0.06, 16, 16]} />
		<T.MeshBasicMaterial color={sparking ? COLORS.flash : COLORS.darkSteel} />
	</T.Mesh>
	{#if sparking}
		<T.PointLight position.y={-0.2} color={COLORS.flash} intensity={10} distance={4} />
	{/if}
</T.Group>

<!-- Label for the tapped part, anchored in 3D but rendered as real HTML -->
{#if selectedPart}
	<HTML position={labelAnchor[selectedPart.id]()} center pointerEvents="none">
		<div class="tag">{selectedPart.name}</div>
	</HTML>
{/if}

<style>
	.tag {
		padding: 4px 11px;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: rgba(20, 20, 21, 0.86);
		color: var(--ink);
		font: 500 13px/1.4 var(--font);
		white-space: nowrap;
		pointer-events: none;
	}
</style>
