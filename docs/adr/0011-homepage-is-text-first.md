# 0011. The homepage is text-first; the 3D lives in the lessons

## Status

Superseded by ADR 0012: the text-first homepage felt empty, and the running engine came back as a drawing sheet.

Was: accepted. Replaces the homepage parts of ADR 0006 and ADR 0009, and drops the homepage gearbox planned in ADR 0005.

## Context

The homepage opened with a procedural V8, drawn by our own `InkRenderer`, which came apart in six stages as you scrolled (ADR 0006). Two things counted against it:

- **The scroll was a lot of work for a visitor.** Six screens of disassembly stood between the headline and the first page you could open. The site's design rule is one visual, one sentence and one control per screen, and the tour was the least calm part of the site.
- **It made the browser tests flaky.** In CI, Chromium draws WebGL in software. Link tests on the homepage failed on three runs in a row because the URL was still `/` five seconds after a click. In the failure snapshots, Playwright checked the URL only two to six times in those five seconds, so the page's main thread was busy for seconds at a time. Stopping the engine before leaving the page (commit `0d3f0d8`) did not fix it.

Three options were weighed: a still image drawn by `InkRenderer`, one live scene without scrolling, and text only. The maintainer chose text only.

## Decision

- The homepage opens with its headline and one sentence: "Look inside the machine." and "How cars actually work, taken apart and set in motion." No hero image and no link; the "Open now" cards come straight after, and their covers are the page's pictures.
- The headline is the picture: set very large and wide, with "machine." in the accent colour. Under a thin rule, the sentence sits beside a spec plate of three numbers: pages open now, systems, and planned pages on the way. `planTotals` counts them from the same data as "The whole car", so the two always agree. This replaced a first, plainer version that felt empty; a turning SVG gear pair was mocked up as well and not chosen.
- No WebGL on the homepage. Things move in the lessons.
- The V8, `InkRenderer` and the scroll tour are deleted: `HeroEngine`, `V8Canvas`, `V8Scene`, `InkPart`, `InkRenderer`, the `v8/` folder with its tests, and the `?fps` readout (`FrameRate`). Git keeps them.
- The homepage gearbox (ADR 0005) is dropped. The gear code stays in the gears lesson.

## Consequences

- The homepage is light and quick, and its tests no longer depend on software WebGL.
- The site loses its one signature moment on arrival. The lesson covers and the lessons themselves have to carry the first impression.
- ADR 0010 already has the lessons drawn shaded, so nothing else uses the ink look. If an ink drawing is wanted again, `InkRenderer` can be restored from git; its known weakness (broken lines where surfaces nearly touch) is recorded in ADR 0009.
- Lesson pages still use WebGL. If their tests start to flake in CI the same way, that is a separate problem to diagnose.
