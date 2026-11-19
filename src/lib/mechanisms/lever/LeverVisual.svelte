<!--
	The lever lesson's stage: the 3D lever, filling the space, with a quiet
	readout of the numbers in the corner (forces, advantage, how far each end
	has moved). Beginners can ignore it; students get the real values. Both come
	from leverAt, the same as the scene.
-->
<script lang="ts">
	import LazyCanvas from '../../components/LazyCanvas.svelte';
	import { getCycle } from '../../animation/cycle.svelte.ts';
	import { formatAdvantage, leverAt } from './lever.ts';

	const cycle = getCycle();
	const now = $derived(leverAt(cycle.angle));
	const n = (v: number) => Math.round(v).toLocaleString('en-GB');
</script>

<div class="lever">
	<LazyCanvas
		load={() => import('./LeverCanvas.svelte')}
		label="The lever, in 3D. The subtitles describe each step."
	/>
	<dl class="readout" aria-label="The numbers">
		<div>
			<dt>Effort</dt>
			<dd>{n(now.effort)} N</dd>
		</div>
		<div>
			<dt>Load</dt>
			<dd>{n(now.load)} N</dd>
		</div>
		<div>
			<dt>Advantage</dt>
			<dd>{formatAdvantage(now.advantage)}</dd>
		</div>
		<div>
			<dt>Moved</dt>
			<dd>{now.effortMoved.toFixed(2)} m · {now.loadMoved.toFixed(2)} m</dd>
		</div>
	</dl>
</div>

<style>
	.lever {
		position: absolute;
		inset: 0;
		touch-action: pan-y;
	}
	.readout {
		position: absolute;
		left: 24px;
		top: 16px;
		display: flex;
		flex-wrap: wrap;
		gap: 4px 20px;
		margin: 0;
		font-size: 13px;
		font-variant-numeric: tabular-nums;
		pointer-events: none;
	}
	.readout div {
		display: flex;
		gap: 6px;
	}
	.readout dt {
		color: var(--ink-3);
	}
	.readout dd {
		margin: 0;
		color: var(--ink-2);
	}
	@media (max-width: 860px) {
		.readout {
			left: 16px;
			right: 16px;
			font-size: 12px;
			gap: 2px 14px;
		}
	}
</style>
