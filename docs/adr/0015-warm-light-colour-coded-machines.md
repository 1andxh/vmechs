# 0015. Warm light pages and colour-coded machines

## Status

Accepted. Replaces the dark "D2 · Subtitles" look (set on 2026-11-13, before ADRs recorded design), ADR 0010 (lessons drawn shaded) and the look described in ADR 0006 (white ink on a dark page). ADR 0006's procedural engine and renderer stay.

## Context

The maintainer found the site good but not appealing. The lessons' grey shaded 3D looked dull next to the ink V8, the dark pages felt cold, the homepage changed style section by section, and nothing gave a moment of delight.

A reference board compared six sites. He chose three: Bartosz Ciechanowski's engine explainer for its machines (each part in its own clear colour, with crisp outlines), Brilliant for its warmth, and Apple for its polish. A prototype ran the real four-stroke scene in that style, on a warm light page and a dark one. He chose the warm light page.

## Decision

- **Pages are warm and light.** The background is warm paper (`#f5f1ea`) with dark warm ink. The tokens in `src/app.css` hold every colour, and every text colour passes WCAG AA on the background.
- **Machines are colour-coded.** Each part has its own colour, in matte, softly lit 3D. `InkRenderer` draws the outlines over the coloured scene, each in a darker shade of its part's colour.
- **Every part colour has two shades.** A bright fill for the 3D part, and a darker shade for a word in the text that names it, so the coloured words also pass AA. The text names a part in the same colour as the part.
- **The palette:**

| Part colour | Fill      | Text      |
| ----------- | --------- | --------- |
| Red         | `#e5484d` | `#c42d33` |
| Green       | `#3fa35a` | `#2a7a40` |
| Blue        | `#3d7ad6` | `#2c62b4` |
| Gold        | `#e2b33c` | `#8f6400` |
| Slate       | `#748190` | `#525d69` |

The structure (blocks, heads, housings) is warm grey.

- **The accent is a burnt orange** (`#b4500e`), for links and the brand's one highlight. Inside a lesson, the part colours take over that role.
- The whole site moves together: the homepage, the lessons, About and the error page.

## Consequences

- The lessons and the homepage share one look again. The ink V8 on the homepage is redrawn in colour.
- A lesson must say which colour each part is, and its text must use the same colours. That becomes part of the content standard.
- Glow and the dark spotlight drama are gone. Emphasis comes from colour and outline instead.
- More colours on screen means more discipline: five part colours at most, one meaning each within a lesson. Slate, a cool grey, was added for the four-stroke engine's exhaust valve, so it can match the smoke and still stand out from the warm grey head.
