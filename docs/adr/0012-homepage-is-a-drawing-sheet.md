# 0012. The homepage is a drawing sheet of the running engine

## Status

Superseded by ADR 0016: the engine made vmechs look like a car site, so the homepage dropped the model for a moving headline and posters. The V8 drawing will get its own page.

## Context

ADR 0011 removed the homepage V8 and made the page text-first, because the six-screen scroll tour was a lot of work for a visitor and the homepage link tests were flaky in CI. Two text-first versions followed, a plain one and one with a huge headline and a spec plate. The maintainer rejected both as empty and said the old direction was better.

Live sites in the same genre were looked at. Animagraffs, the closest one, leads with its cutaway pictures, big and full-width; the mechanism is the attraction. Dribbble searches turned up nothing in the genre. Three full redesigns were then mocked up with the real V8 drawing and lesson covers: a poster, a drawing sheet, and a type index. The maintainer chose the drawing sheet, with the engine live and running, and fewer gas-flow streaks.

The tour's length was the problem, not the engine. The CI flake was a test-machine effect: CI draws WebGL in software, and a click during the first frame, when the shaders compile, could wait for seconds. The engine ran at 60 fps on a real iPhone.

## Decision

- The homepage opens as an engineering drawing sheet: a faint grid, "Sheet 1 · Engine", the running ink V8 from one fixed view, and a title block.
- Beside the drawing, a numbered parts list names each part with a planned engine page. `PARTS` in `v8/sheet.ts` holds them, and a test checks that every entry points to a planned engine page and that every planned page has one. Open pages link; the rest say "on the way". The drawing itself carries no numbers: numbered pins on the engine were tried and removed at the maintainer's request.
- Pointing at a part's line in the list draws that part in the accent ink. Pointing at the pistons and crankshaft also cuts the block open to show them running.
- No scroll tour. The tour's module, `explode.ts`, and its tests are deleted.
- `InkRenderer` adds shade hatching, as in a technical illustration: surfaces turned away from a light at the upper left get fine screen-space lines on the opposite diagonal from cut faces, and the darkest are cross-hatched. It brings out the form without any fill colour.
- The gas-flow streaks are half as dense as before (one every 2.6 units along a pipe instead of 1.3), at the same length.
- Tests wait for the engine's first frame (`.sheet[data-drawn]`), or for "no WebGL", before clicking on the homepage.

## Consequences

- The homepage has its signature back, and pointing at the parts list shows where each part is on the engine.
- The parts list is the only route to the pages, for mouse, keyboard and screen reader alike, so nothing depends on the canvas.
- The sheet covers only the engine. Sheets for the other systems would need their own drawings.
- `three.js` loads on the homepage again, lazily, after the page itself.
