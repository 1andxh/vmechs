<!--
	The quiet readout in the corner of a simple machine's stage: your effort and
	the load (named in their parts' colours, like the arrows), the advantage, and
	how far each end has moved. Beginners can ignore it; students get the real
	values. The lesson passes them from the same function that places its scene.
-->
<script lang="ts">
	import { formatAdvantage } from '../lever/lever.ts';

	let {
		effort,
		load,
		advantage,
		effortMoved,
		loadMoved
	}: {
		effort: number;
		load: number;
		advantage: number;
		effortMoved: number;
		loadMoved: number;
	} = $props();

	const n = (v: number) => Math.round(v).toLocaleString('en-GB');
</script>

<dl class="readout" aria-label="Forces and distances">
	<div>
		<dt class="effort">Effort</dt>
		<dd>{n(effort)} N</dd>
	</div>
	<div>
		<dt class="load">Load</dt>
		<dd>{n(load)} N</dd>
	</div>
	<div>
		<dt>Advantage</dt>
		<dd>{formatAdvantage(advantage)}</dd>
	</div>
	<div>
		<dt>Moved</dt>
		<dd>{effortMoved.toFixed(2)} m · {loadMoved.toFixed(2)} m</dd>
	</div>
</dl>

<style>
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
	/* the forces' names in their parts' colours, like the arrows (ADR 0015) */
	.readout dt.effort {
		color: var(--part-green-text);
	}
	.readout dt.load {
		color: var(--part-blue-text);
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
