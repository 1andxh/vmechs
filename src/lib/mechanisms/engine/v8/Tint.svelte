<!-- Draws every part inside it in one colour, optionally cut by the section plane (see tint.ts). -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setTint } from './tint.ts';

	let {
		color,
		clip = null,
		children
	}: { color: string; clip?: number | null; children: Snippet } = $props();

	setTint(() => ({ color, clip }));
</script>

{@render children()}
