# AGENTS.md

Instructions for coding agents working in this repository (Codex, Claude Code and others). The [README](README.md) covers what vmechs is and how to run it; this file covers how to work on it.

## Git: hands off

**Do not run any git or GitHub command that writes.** That includes `commit`, `push`, `pull`, `merge`, `rebase`, `reset`, `restore`, `checkout` of files, `stash`, `branch`, `tag`, `clean`, and every `gh` command that creates or changes something. Read-only commands (`status`, `diff`, `log`, `show`, `blame`) are fine.

Leave your changes in the working tree. The maintainer reviews the diff and makes every commit himself, or approves each one explicitly. Approval for one commit is not approval for the next. There is one branch, `main`; do not create others.

This rule exists because an agent once committed and pushed unreviewed work while it had only been asked to review a diff.

## Before you say it's done

Run all of these and read the output, not just the last line:

```sh
npm run lint     # Prettier check; `npm run format` fixes it
npm run check    # svelte-check: must be 0 errors and 0 warnings
npx vitest run   # unit tests, including the content standard
npm run build    # static build into build/
npx playwright test   # chromium, firefox, webkit, iphone (WebKit)
```

CI runs the same checks, but CI is not where things get verified: run them locally first.

If a check fails, stop and report what failed, the evidence and the fix you propose before changing anything. Do not loop a test hundreds of times to diagnose a flake; ask first.

## How the code is organised

| Path                                      | What lives there                                                                       |
| ----------------------------------------- | -------------------------------------------------------------------------------------- |
| `src/content/articles/<system>/<slug>.md` | Lessons: mdsvex Markdown with frontmatter and `<Step>` components                      |
| `src/lib/content/`                        | Lesson index, the content validator (`lesson-meta.ts`), the system plan (`systems.ts`) |
| `src/lib/mechanisms/<topic>/`             | Each lesson's 3D scene and its kinematics                                              |
| `src/lib/components/`                     | The lesson shell: stage, subtitles, timeline, steps sheet, lazy canvas                 |
| `src/routes/`                             | Pages, all prerendered; `site.e2e.ts` holds the browser tests                          |
| `docs/`                                   | `CONTENT.md` (content standard), `ROADMAP.md`, `adr/` (decision records)               |

## Conventions

- **One driving value per lesson.** A single value (for the engine, the crank angle) drives the 3D scene, subtitles, timeline and chart. Don't add a second source of truth.
- **Physics is pure, tested functions.** Kinematics live in plain `.ts` files with unit tests; Svelte components only read them.
- **Content meets [docs/CONTENT.md](docs/CONTENT.md),** and the validator enforces it in the unit tests: sources, a review date, contiguous steps, subtitles of at most two sentences, one highlight of up to three words. A new lesson must also be planned in `SYSTEMS` in `src/lib/content/systems.ts`, or the build fails.
- **Static only.** The site is prerendered with adapter-static and served as a Cloudflare Worker with static assets (`wrangler.jsonc`). Don't add server routes or runtime server code.
- **`#lib/*` imports need the file extension** (`#lib/site.ts`). The alias is a Node subpath import that maps straight to a file, so nothing fills the extension in. Relative imports work either way.
- **Tests must survive missing WebGL.** Firefox in CI has none; tests take the fallback branch. Tests wait for `.lesson[data-hydrated]` before interacting, because controls are disabled until hydration.
- **Design.** Use the tokens in `src/app.css` (dark background, warm ink, one amber accent). Screens are calm and single-focus: one visual, one sentence, one control. The homepage must not read like an online course: no "lesson", "start" or "enrol" wording there.
- **Accessibility is a requirement:** keyboard operable, visible focus, reduced motion respected, AA contrast.
- **Settled decisions get an ADR** in `docs/adr/`. Read the existing ones before proposing to change something they cover.

## Licence and third-party material

The code is all rights reserved (no open-source licence). Check the licence of anything you bring in, whether code, models, fonts or images, before using it, and credit it where the licence requires, for example CC BY.

## Files to leave alone

`LIVE.md`, `THINKING.md`, `transcript-*.md` and `thinking-*.md` are local agent-conversation logs. They are gitignored; never commit, edit or delete them.
