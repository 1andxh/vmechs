import { createContext } from 'svelte';
import type { StepMeta } from '../content/steps.ts';

/** The lesson's steps (from frontmatter), shared with Subtitle, Timeline and every <Step>. */
export const [getLessonSteps, setLessonSteps] = createContext<StepMeta[]>();

/** Lets content inside the "All steps" sheet close it (e.g. "Watch this step"). */
export const [getSheet, setSheet] = createContext<{ close: () => void }>();
