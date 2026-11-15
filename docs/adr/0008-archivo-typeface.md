# 0008. Archivo is the site's typeface, set wide for headlines

## Status

Accepted

## Context

The site launched with Schibsted Grotesk. For the homepage redesign, a type study compared it with three pairings drawn from the world of cars and technical drawings, each shown on the real headline, a caption and the content section:

- **Archivo:** wide headlines, like a spec plate or a badge on a car.
- **Barlow:** semi-condensed, in the road-sign and DIN tradition.
- **IBM Plex Sans:** condensed, like an engineering manual.

Archivo was chosen.

## Decision

- Archivo is the site's only typeface. It is the variable font with its width axis, self-hosted through `@fontsource-variable/archivo` (OFL licence).
- Headlines are set wide, using the `--display-stretch` token (118%). Reading text is normal width.
- Long titles stay normal width. On a phone a wide setting would truncate them, for example on the lesson page.

## Consequences

- One typeface family keeps the page calm. The width axis gives headlines their character without a second font.
- Schibsted Grotesk has been removed from the project.
