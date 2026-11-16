# 0009. The homepage stays real-time; no pre-rendered image sequence

## Status

Accepted. Confirms ADR 0006 after testing an alternative to it.

Corrected on 2026-11-16, the day it was written: the first version said the lessons are drawn by `InkRenderer` too. They are shaded; see ADR 0010.

## Context

For the gearbox homepage, a pre-rendered route was considered, in the style of scroll-scrubbed product pages:

- Blender models the detailed parts with a committed Python script.
- Our tested maths stays the source of motion: a Node script exports each frame's part positions to JSON, and Blender applies them.
- Blender's Freestyle line renderer draws the ink look.
- The site plays 120 to 180 frames as a flipbook on a canvas.

Before building it, the pipeline was tested on the gears lesson's 12:30 pair. One JSON file, exported from `gears.ts`, fed both Blender and the current `InkRenderer` with the same geometry and camera. The frames were compared at 2×, with matched line weights:

- **At viewing size, the two look like the same drawing.** Line weight is a setting in both, not an advantage of either.
- **Close up, where the teeth touch, Freestyle is cleaner.** It traces the mesh's edges, so its lines stay continuous. `InkRenderer` finds lines by comparing neighbouring pixels, and its lines step and break where two surfaces sit at nearly the same depth.
- **Chamfered edges looked worse in Freestyle,** with blobs at each short edge's end caps.
- **The pipeline itself worked:** four 2880×1800 frames rendered headless in about seven seconds.

Freestyle was not clearly better, and the maintainer preferred the real-time drawing.

## Decision

- The homepage stays real-time, drawn by `InkRenderer` (ADR 0006). The lessons stay real-time too.
- No pre-rendered image sequence, and no Blender in the toolchain.

## Consequences

- No 5 to 15 MB frame download, and the scene stays interactive and resolution-independent.
- Detail is still limited by modelling in code, as ADR 0006 accepted.
- The broken lines where surfaces nearly touch are a known `InkRenderer` weakness. They matter most where the homepage shows parts in contact, such as a gearbox's meshing teeth, so they are worth fixing before that.
- Revisit only if a part needs detail that modelling in code can't reach, or measurements show phones can't run the real-time scene. Test with such a part, not a simple one: this test could not show Blender's advantage in detail.
