# 0002. The first backend feature is a "Report a mistake" intake

## Status

Accepted

## Context

A FastAPI backend is planned partly as a learning track, so it should start with a small but real feature. The earlier plan began with accounts and synced progress, and included a server-side search API and discussion threads. Accounts had no user need yet (there is no saved progress to sync), static search already covers the static content, and discussions bring moderation costs with little teaching value.

## Decision

- The first backend feature is a **"Report a mistake" intake**: one endpoint, one table, a private review list, and no accounts. It directly supports the project's accuracy principle.
- Version 1 must include: an optional email field with a clear note on how it's used; strict validation and request size limits; rate limiting; a honeypot field (a CAPTCHA only if abuse appears); no logging of submitted text or email; and a retention and deletion policy, which also covers any IP data used for rate limiting.
- Submissions are never published automatically.
- Accounts and synced progress come later, once local progress exists and readers want it on more than one device.
- A server-side search API and discussion threads are not planned.

## Consequences

- The backend starts small enough to deploy, operate and learn from without auth complexity.
- Running even one endpoint means owning deployment, secrets, migrations, backups and monitoring.
- Until the intake exists, "Report a mistake" links to an email address or a GitHub issue form.
