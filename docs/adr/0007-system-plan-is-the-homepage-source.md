# 0007. The system plan is the single source for the homepage, and every lesson must be in it

## Status

Accepted

## Context

The homepage lists the car's systems and their pages. Each page is either open, as a link, or planned, dimmed as "on the way". The list is built from the plan, `SYSTEMS` in `src/lib/content/systems.ts`, plus the lesson files that exist.

At first, a published lesson that wasn't in the plan was simply appended to its system. A review (Codex, 2026-11-14) pointed out the failure this hides: if a lesson file's name doesn't match its planned slug, through a typo or a rename, the homepage shows that lesson twice. It appears once dimmed under the planned slug, and once as a live link under the file name. Nothing fails.

## Decision

- `SYSTEMS` is the single source for what the homepage shows, and in what order.
- Every published lesson must be planned in it. `buildSystemIndex` throws otherwise, so the build fails.
- A test over the real lessons checks the result: every lesson is linked exactly once, at its correct address, and planned pages without a file are never links.

## Consequences

- Adding a lesson means adding it to the plan in the same change. The build error says so.
- The order and grouping of lessons on the homepage are decided in one place, not by file names.
