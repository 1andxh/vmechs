import { createContext } from 'svelte';
import type { StepMeta } from '../content/steps.ts';
import type { PartColour } from '../mechanisms/palette.ts';

/** The lesson's steps (from frontmatter), shared with Subtitle, Timeline and every <Step>. */
export const [getLessonSteps, setLessonSteps] = createContext<StepMeta[]>();

/** The lesson's parts and their colours (frontmatter `parts`, ADR 0015), for coloured words. */
export const [getLessonParts, setLessonParts] = createContext<Record<string, PartColour>>();

/** Lets content inside the "All steps" sheet close it (e.g. "Watch this step"). */
export const [getSheet, setSheet] = createContext<{ close: () => void }>();
