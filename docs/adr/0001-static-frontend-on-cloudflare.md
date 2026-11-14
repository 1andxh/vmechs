# 0001. Static frontend on Cloudflare (Workers static assets); API hosted separately

## Status

Accepted

## Context

The site is a SvelteKit app built with `adapter-static`: every page is prerendered to plain files in `build/`. It needs a host now, and a FastAPI service will be added later. The options considered were Cloudflare, Vercel, and a self-managed VPS.

## Decision

- Host the static site on **Cloudflare, as a Worker that serves static assets**: build command `npm run build`, deploy command `npx wrangler deploy`. `wrangler.jsonc` points the assets at `build/` and defines no server script.
- When the backend arrives, host the **FastAPI service separately**, on the VPS, rather than on the static host.
- The static site must keep working when the API is unavailable; API-backed features degrade gracefully.

## Consequences

- No adapter change is needed: the Worker serves the prerendered output as-is, and `/learn/x` resolves to `learn/x.html`.
- `wrangler.jsonc` must stay in the repo. Without it, `wrangler deploy` auto-configures SvelteKit for server rendering, swapping the adapter and rewriting the build script, which breaks the static build.
- Vercel would have worked equally well for a static site. Cloudflare was chosen because an account already exists, and Vercel's free tier is limited to non-commercial use.
- Using the VPS for static hosting was rejected: it adds patching and monitoring with no benefit for prerendered files.
- A separate API means planning its URL, CORS policy, cookies and error handling independently of the static host.
