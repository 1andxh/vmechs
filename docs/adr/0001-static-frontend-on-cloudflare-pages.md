# 0001. Static frontend on Cloudflare Pages; API hosted separately

## Status

Accepted

## Context

The site is a SvelteKit app built with `adapter-static`: every page is prerendered to plain files in `build/`. It needs a host now, and a FastAPI service will be added later. The options considered were Cloudflare Pages, Vercel, and a self-managed VPS.

## Decision

- Host the static site on **Cloudflare Pages** (build command `npm run build`, output folder `build`).
- When the backend arrives, host the **FastAPI service separately**, on the VPS, rather than on the static host.
- The static site must keep working when the API is unavailable; API-backed features degrade gracefully.

## Consequences

- No adapter change is needed: Pages serves the static output as-is, with preview deploys per branch.
- Vercel would have worked equally well for a static site. Pages was chosen because an account already exists, and Vercel's free tier is limited to non-commercial use.
- Using the VPS for static hosting was rejected: it adds patching and monitoring with no benefit for prerendered files.
- A separate API means planning its URL, CORS policy, cookies and error handling independently of the static host.
