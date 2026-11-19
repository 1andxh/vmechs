/**
 * The colour a group of the V8's parts is drawn in (ADR 0015), passed down to
 * every InkPart inside it. `clip`, when set, cuts the parts away in front of
 * the section plane z = clip, the same cut InkRenderer makes in its line pass.
 */
import { getContext, setContext } from 'svelte';
import { STRUCTURE } from '../../palette.ts';

export interface Tint {
	color: string;
	clip: number | null;
}

const KEY = Symbol('tint');
const DEFAULT: Tint = { color: STRUCTURE, clip: null };

export const setTint = (get: () => Tint) => setContext(KEY, get);
export const getTint = (): (() => Tint) => getContext<() => Tint>(KEY) ?? (() => DEFAULT);
