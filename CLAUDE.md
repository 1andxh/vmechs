@AGENTS.md

## Claude Code only

- **Start each unit of work with `/skilla:dev`** and follow the skill it routes to.
- **"Relay to Codex" means the `skilla:claude-code-relay` skill.** Never call `codex exec` by hand. Afterwards, confirm with `git status` and `git log` that Codex wrote nothing.
- **Committing:** show the diff and the local check results, ask "Commit and push?", and wait. Push straight to `main`.
- **Report after each unit,** with the reasoning, before starting the next.
- **The local preview server needs a restart after every build.** `vite preview` lists the build's files once, at start-up. After a rebuild it returns 404 for the newly hashed chunks, and the page fails to hydrate. That looks like a broken page, but it isn't.
