# 0016. The landing page has no 3D model: a moving headline and quiet posters

## Status

Accepted. Supersedes ADR 0012. The V8 drawing stays in the repo for its own page, "Engine layouts and firing order".

## Context

After the warm light redesign (ADR 0015), the homepage still opened on the colour-coded V8 drawing sheet. The maintainer liked the engine but found that it sold vmechs as a car site, when vmechs covers all mechanics (ADR 0014). The V8 is to become a page of its own instead.

A first replacement put a live lever with a slider beside a type-led headline. It was rejected: the lever didn't give the "oh wow, nice" moment. The maintainer then asked for a landing page with no model at all, and better wording.

Three model-free directions were mocked up: kinetic type, the word MACHINE as an exploded drawing, and solid colour posters. The maintainer chose kinetic type combined with the posters. He asked for the posters to stay minimal so the page doesn't look like an Apple Store page. He picked soft tints over paper with a coloured rule, and no icons.

## Decision

- The page opens on one line, "How things move." Its "o" is a green gear that turns slowly, and its full stop is a red piston that rises and falls. These are the only moving things on the page. They are plain SVG and CSS, hidden from screen readers, which read the words. They stop when reduced motion is preferred.
- Under the headline, one sentence says what vmechs is for, for the curious and for engineering students alike. There is no link into one machine there: the engine will get its own page, and the posters lead everywhere.
- The slogan, "Mechanics made easy.", signs off the footer. Beside the paragraph or under it, it read as a second headline and competed with the moving one.
- A row of four posters follows: one for each machine in `MACHINES` and one for the mechanisms. Each poster is a soft tint of a part colour with ink type, and has no pictures or icons. Its name and a short line sit at the top. Below a divider are up to two open pages as links, then one line about the rest (`posterList`). The dividers line up across a row (CSS subgrid). The whole poster deepens its tint on hover. Each machine's colour is set in `MACHINES`.
- The posters replace the "Machines" cards and the "Mechanisms" grid. "Open now", the sources pledge and the footer stay as they were.
- There is no 3D on the homepage, so three.js doesn't load there and the tests no longer wait for a first frame.

## Consequences

- The homepage loads only HTML, CSS and a little JavaScript, and is usable at once.
- The first look at a machine in 3D is the "Open now" pictures and the pages themselves.
- The half-car drawing (`static/covers/car.svg`) and the "Found in" labels on mechanisms are no longer shown on the homepage.
- With no section pages yet, the posters link straight to lesson pages. When section pages exist, each poster can link to its section.
