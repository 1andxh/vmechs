# 0013. "The whole car" is a plan view of the car

## Status

Superseded by ADR 0014: vmechs covers all mechanics, and the homepage shows machines and mechanisms instead of one car. `CarPlan` and its callouts were removed.

Was: accepted. Continued the drawing-sheet language of ADR 0012 below the homepage's first screen.

## Context

"The whole car" listed the six systems as tiles: a name, a blurb, and each system's planned pages with a dot for open or on the way. After the homepage became a drawing sheet of the engine (ADR 0012), the maintainer asked for a redesign of this section too. Three directions were mocked up with the real data:

- **A plan view:** a schematic of a car seen from above, with each system called out.
- **A drawing register:** a table like the index sheet of a drawing set, listing every planned page with its status.
- **Six sheets:** a small framed sheet per system, with a line icon and a title block.

The maintainer chose the plan view.

## Decision

- `CarPlan.svelte` draws a car from above as a schematic: body outline, wheels and axles, springs and steering rack, brake pads, the engine and its cylinders, the gearbox, driveshaft and differential, the battery, and a dashed electric motor.
- Each system has a leader line, its name and its count. Systems with an open page are drawn in the accent colour.
- A list below the drawing is the real content. Each system gets its count, links to its open pages, and "Next:" with the next planned page. Pointing at a system in the list lights its parts on the drawing.
- The callout positions live in `car-plan.ts`. A test checks that every system in `SYSTEMS` has a callout, and that every label stays inside the drawing.
- On a phone, the drawing has no labels, and the list carries the words.

## Consequences

- The section shows where each system sits in a car, not only what it is called.
- Only the next planned page per system is named, not all of them. The full plan is in `SYSTEMS` and grows into the list as pages open.
- A new system needs a callout in `car-plan.ts`, or the test fails, and its own part of the drawing.
