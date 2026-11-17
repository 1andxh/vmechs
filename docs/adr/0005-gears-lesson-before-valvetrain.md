# 0005. The gears lesson comes before the valvetrain

## Status

Accepted. Changes which lesson ADR 0003 names as next; its rule on shared parts stands.

The homepage gearbox mentioned below was dropped (ADRs 0011 and 0012); the lesson order stands.

## Context

ADR 0003 named the valvetrain as the next lesson. Since then the homepage has become a running, exploded V8 (ADR 0006), and the next homepage direction chosen was a manual gearbox you shift through by scrolling. That direction teaches gear ratios: how a gear pair trades speed for torque.

The homepage's job is to lead somewhere real. A gearbox on the homepage that leads to the four-stroke engine page would break that promise. So the page behind it has to exist first.

## Decision

- Build **"Gears and gear ratios"** next. The valvetrain follows it.
- Keep the gear code (tooth geometry, meshing, ratios) in the gears lesson's own folder, `src/lib/mechanisms/gears/`. The homepage imports from there.
- ADR 0003's rule is unchanged: no general mechanism kit ahead of need. The gear code becomes shared only if a second lesson, likely the manual gearbox, really uses the same parts.

## Consequences

- The gear maths is built once, for the lesson, and reused by the homepage, not drawn twice.
- The engine lessons pause after the four-stroke. The valvetrain's fix for the four-stroke lesson's "idealised valve timing" caveat waits one lesson longer.
- ROADMAP.md's lesson order changes to match.
