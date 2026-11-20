# 0017. Every system with open pages gets a section page

## Status

Accepted. Fulfils the note in ADR 0016 that posters can link to a section once section pages exist.

## Context

With all six simple machines open, the homepage's Simple machines poster could show only two links and "4 more open", which pointed at "Open now", a list of everything, newest first. A reader had no page showing a machine's pages together, in teaching order. The series teaches the simple machines as two families: those that turn about a point (lever, wheel and axle, pulley) and the slopes (inclined plane, wedge, screw).

Two layouts were considered: the two families with each machine's formula, or a plain grid of six covers. The maintainer chose the families. He also chose one generic route for every system over a page for simple machines alone.

## Decision

- `/learn/[system]` is a prerendered section page for every system with at least one open lesson (`sectionIds` in `systems.ts`). A system with nothing open yet has no page, so its address is a 404.
- The page lists every planned page of the system in plan order, numbered. Open pages show their cover, summary and a link; pages still to come say "On the way" and don't link.
- A system may set `families` in `SYSTEMS`: named groups of planned slugs that together cover every planned page once (tested). The page groups by them; without families it is one plain list. Only simple machines has families.
- A lesson may set `ima` in its frontmatter, a short formula (validated, at most 40 characters). The section page shows it beside the lesson, so the simple machines page doubles as a students' cheat sheet.
- On the homepage, a machine made of one system links its poster's title, and its "N more open", to that system's section page. The car spans several systems, so it keeps its lesson links. The sitemap lists the section pages.
- The footer is a shared component (`SiteFooter.svelte`), used by the homepage and the section pages.

## Consequences

- Each new system gets its page automatically when its first lesson opens; nothing else needs adding.
- The car has no page of its own yet. A car page would list its systems rather than its lessons, and would be a separate decision.
- Lessons don't yet link back to their section page.
