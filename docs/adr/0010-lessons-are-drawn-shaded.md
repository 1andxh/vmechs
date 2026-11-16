# 0010. Lessons are drawn shaded; the homepage is drawn in ink

## Status

Accepted.

## Context

The site has two looks:

- **Ink** (ADR 0006): flat black surfaces, with lines drawn by `InkRenderer`. The homepage engine uses it.
- **Shaded:** lit dark metal, with highlighted parts glowing in the accent colour. The four-stroke lesson uses it.

The gears lesson's scene was built so the look could be swapped, and both were compared on the same frames: every step, on desktop and phone. Both read well. Shaded showed two practical advantages:

- It has no ink artefacts. `InkRenderer` breaks its lines where two surfaces nearly touch (ADR 0009), which is exactly where gear teeth meet, and it left faint speckles on the big gear's face.
- Solid metal helps a beginner read depth.

The deciding reason was consistency: a reader moving between lessons should see one style.

## Decision

- Lesson scenes are shaded, as in the four-stroke lesson:
  - dark metal (`MeshStandardMaterial`);
  - a warm key light from above, a faint rim light behind, little ambient light, and a soft room environment;
  - the highlighted part glows in the accent colour (`emissive`).
- The homepage stays in ink (ADR 0006).

## Consequences

- The homepage and the lessons look different. The homepage gearbox will be drawn in ink and lead to a shaded lesson. That is accepted: the homepage is an illustration, and the lessons are the working models.
- The lighting is now repeated in two lessons. Under ADR 0003, it is a candidate for a shared part, extracted from these two real uses rather than ahead of them.
- The gears lesson no longer depends on `InkRenderer`.
