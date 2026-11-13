<!--
	2D view of the same cycle: stroke bands, piston position, and valve lift
	over 0–720°, with a playhead at the current angle. The curves are sampled
	from the same kinematics functions the 3D scene uses.
-->
<script lang="ts">
	import { getCycle } from '../../animation/cycle.svelte.ts';
	import { ENGINE, pistonDisplacement, valveLift, type Valve } from './kinematics.ts';

	const cycle = getCycle();

	const W = 720;
	const BAND = { y: 0, h: 34 };
	const PISTON = { y: 52, h: 96 };
	const VALVE = { base: 236, h: 62 };
	const H = VALVE.base + 4;

	const stroke = 2 * ENGINE.crankRadius;
	const pistonY = (deg: number) => PISTON.y + (pistonDisplacement(deg, ENGINE) / stroke) * PISTON.h;
	const valveY = (deg: number, v: Valve) => VALVE.base - valveLift(deg, v) * VALVE.h;

	function path(f: (deg: number) => number): string {
		let d = '';
		for (let deg = 0; deg <= W; deg += 3) d += `${deg ? 'L' : 'M'}${deg},${f(deg).toFixed(2)}`;
		return d;
	}

	const pistonPath = path(pistonY);
	const intakeArea = `${path((d) => valveY(d, 'intake'))}L${W},${VALVE.base}L0,${VALVE.base}Z`;
	const exhaustArea = `${path((d) => valveY(d, 'exhaust'))}L${W},${VALVE.base}L0,${VALVE.base}Z`;

	const bands = [
		{ name: 'Intake', c: 'var(--intake)' },
		{ name: 'Compression', c: 'var(--compression)' },
		{ name: 'Power', c: 'var(--power)' },
		{ name: 'Exhaust', c: 'var(--exhaust)' }
	];
</script>

<figure class="chart">
	<svg
		viewBox="0 -2 {W} {H + 2}"
		role="img"
		aria-label="Piston position and valve lift across the 720° four-stroke cycle"
	>
		{#each bands as b, i (b.name)}
			<rect x={i * 180} y={BAND.y} width="180" height={BAND.h} fill={b.c} opacity="0.9" />
			<text x={i * 180 + 90} y={BAND.y + BAND.h / 2} class="band">{b.name}</text>
			<rect x={i * 180} y={BAND.h} width="180" height={H - BAND.h} fill={b.c} opacity="0.06" />
		{/each}

		<!-- TDC / BDC guides -->
		<line x1="0" x2={W} y1={PISTON.y} y2={PISTON.y} class="guide" />
		<line x1="0" x2={W} y1={PISTON.y + PISTON.h} y2={PISTON.y + PISTON.h} class="guide" />
		<text x="6" y={PISTON.y - 5} class="axis">TDC</text>
		<text x="6" y={PISTON.y + PISTON.h + 16} class="axis">BDC</text>

		<path d={pistonPath} class="piston" />

		<line x1="0" x2={W} y1={VALVE.base} y2={VALVE.base} class="guide" />
		<path d={intakeArea} fill="var(--intake)" opacity="0.55" />
		<path d={exhaustArea} fill="var(--exhaust)" opacity="0.55" />

		<!-- playhead -->
		<g transform="translate({cycle.angle},0)">
			<line y1={BAND.h} y2={H} class="playhead" />
			<circle cy={pistonY(cycle.angle)} r="6" class="dot" />
		</g>
	</svg>
	<figcaption>
		<span><i class="key line"></i>Piston position</span>
		<span><i class="key" style:background="var(--intake)"></i>Intake valve lift</span>
		<span><i class="key" style:background="var(--exhaust)"></i>Exhaust valve lift</span>
	</figcaption>
</figure>

<style>
	.chart {
		margin: 0;
	}
	svg {
		display: block;
		width: 100%;
		height: auto;
		overflow: visible;
	}
	.band {
		/* Dark text: the dark-theme band colours are light, so white would fail contrast. */
		fill: var(--bg);
		font-size: 17px;
		font-weight: 650;
		text-anchor: middle;
		dominant-baseline: central;
	}
	.axis {
		fill: var(--ink-3);
		font-size: 14px;
		font-family: var(--mono);
	}
	.guide {
		stroke: var(--line);
		stroke-dasharray: 4 4;
	}
	.piston {
		fill: none;
		stroke: var(--ink);
		stroke-width: 3;
	}
	.playhead {
		stroke: var(--ink);
		stroke-width: 2;
	}
	.dot {
		fill: var(--accent);
		stroke: var(--surface);
		stroke-width: 2;
	}
	figcaption {
		display: flex;
		flex-wrap: wrap;
		gap: 4px 16px;
		margin-top: 8px;
		font-size: 13px;
		color: var(--ink-2);
	}
	.key {
		display: inline-block;
		width: 12px;
		height: 12px;
		margin-right: 6px;
		vertical-align: -1px;
		border-radius: 3px;
		opacity: 0.8;
	}
	.key.line {
		height: 3px;
		vertical-align: 3px;
		background: var(--ink);
	}
</style>
