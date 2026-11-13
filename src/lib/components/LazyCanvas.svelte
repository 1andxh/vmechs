<!--
	Mounts a 3D component only when it scrolls near the viewport, via a
	dynamic import, so three.js stays out of the page's initial JavaScript.
	Shows `fallback` if the browser has no WebGL.
-->
<script lang="ts">
	import { onMount, type Component, type Snippet } from 'svelte';

	let {
		load,
		fallback,
		props = {}
	}: {
		load: () => Promise<{ default: Component<any> }>;
		fallback?: Snippet;
		props?: Record<string, unknown>;
	} = $props();

	let el: HTMLDivElement;
	let Scene = $state<Component<any> | null>(null);
	let status = $state<'waiting' | 'loading' | 'ready' | 'no-webgl' | 'error'>('waiting');

	function hasWebGL(): boolean {
		try {
			const c = document.createElement('canvas');
			return !!(c.getContext('webgl2') ?? c.getContext('webgl'));
		} catch {
			return false;
		}
	}

	onMount(() => {
		if (!hasWebGL()) {
			status = 'no-webgl';
			return;
		}
		const io = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				io.disconnect();
				status = 'loading';
				load()
					.then((m) => {
						Scene = m.default;
						status = 'ready';
					})
					.catch(() => (status = 'error'));
			},
			{ rootMargin: '200px' }
		);
		io.observe(el);
		return () => io.disconnect();
	});
</script>

<div class="lazy" bind:this={el} data-status={status}>
	{#if Scene}
		<Scene {...props} />
	{:else if status === 'no-webgl' || status === 'error'}
		{#if fallback}{@render fallback()}{:else}<p class="msg">
				3D view unavailable in this browser.
			</p>{/if}
	{:else}
		<p class="msg">Loading 3D model…</p>
	{/if}
</div>

<style>
	.lazy {
		position: relative;
		width: 100%;
		height: 100%;
	}
	.msg {
		display: grid;
		place-items: center;
		height: 100%;
		margin: 0;
		color: var(--ink-3);
		font-size: 14px;
	}
</style>
