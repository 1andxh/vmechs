# 0003. Extract shared mechanism parts from real lessons, not in advance

## Status

Accepted

## Context

An earlier plan built a reusable "mechanism kit" (gears, shafts, belts, fluids, circuits) before writing more lessons, and assumed every part would be driven by a single value, as the four-stroke lesson's crank angle drives everything today (`src/lib/animation/cycle.svelte.ts`). Those parts cover several different kinds of simulation, which are unlikely to share one design. Some planned features also need more state than one angle: a fault demo needs a fault setting, and a side-by-side comparison needs two models.

## Decision

- Build the **next lesson (valvetrain)** first, and use it to find out what genuinely repeats.
- Extract shared components **only from patterns seen in at least two real lessons**.
- Keep the single driving value until a lesson needs more. At that point, generalise to a **lesson-owned state object with named values**, rather than forcing every mechanism into one angle.

## Consequences

- The second lesson will contain some duplication on purpose, until the shared shape is clear.
- Don't build a general-purpose kit or a generalised state model ahead of a lesson that needs it.
