# 0006. The homepage engine is our own procedural 3D, drawn by our own ink renderer

## Status

Accepted, as amended by ADR 0012: the V8 and `InkRenderer` stay, but the scroll tour is replaced by a drawing sheet with pins. (ADR 0011 had removed them; ADR 0012 brought them back.)

## Context

The homepage needed a signature visual, a twin-turbo V8 in the style of a technical line illustration. Three routes were considered:

- **A hand-drawn or stock SVG illustration.** It gives the closest match to a printed line drawing. But detailed artwork needs an illustrator, and stock vectors are usually flattened into merged paths, so parts can't move. An SVG is also fixed to one viewpoint.
- **A licensed, sculpted 3D model** (a CC BY twin-turbo V8 on Sketchfab was found). It is far denser than hand-placed shapes, but a sculpt has no pistons or crankshaft inside, so it can't run. It also needs attribution and a branding check.
- **Our own procedural model** of simple solids (boxes, extrusions, lathed and swept shapes), placed by tested kinematics.

The licensed model was chosen first, for its detail. The direction then moved to an engine that comes apart and runs as you scroll: pistons in firing order, crankshaft, belt drive, turbos and gas flow. Only our own model has the moving insides that needs.

## Decision

- The homepage V8 is procedural, built from simple solids in `src/lib/mechanisms/engine/v8/`. Its motion comes from tested kinematics: firing order, crank throws, belt ratios and pipe routes.
- It is drawn by our own renderer, `InkRenderer.svelte`, in three passes:
  1. **Surfaces.** Each mesh's surface direction and depth are drawn into a hidden image.
  2. **Lines.** Each pixel is compared with its neighbours: a jump in depth draws a heavy silhouette line, and a sharp turn in surface direction draws a fine crease line. A section cut with hatched faces and an accent colour are handled here too.
  3. **Gas flow,** drawn on top, hidden only behind parts clearly in front of it.
- One value drives it all: scroll progress, which sets where the parts are, which part is highlighted, and the camera. The engine's own crank angle sets its running motion.

## Consequences

- Detail is limited by hand modelling. It is enough for the illustration, but not as dense as a sculpted model.
- The renderer is ours to maintain. Its line weights and passes are documented in the file.
- GPU cost has been measured: about 348 draw calls and 368,000 vertices per frame. It runs smoothly on an iPhone 16. Merging static parts would cut the draw calls if weaker phones need it.
- The licensed-model swap is on hold. A sculpted shell could only replace the outside, and only if its parts separate cleanly.
