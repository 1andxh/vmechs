# 0004. Cross-browser browser tests run in CI from day one

## Status

Accepted

## Context

It was suggested that broad browser coverage could wait until after launch. The Playwright suite already existed: it runs on Chromium, Firefox, desktop WebKit, and the `iPhone 15` device preset in under 20 seconds (`playwright.config.ts`). It had already caught a real bug: a slider drag made before hydration was silently reverted, which was fixed by rendering controls disabled until mount.

The `iPhone 15` preset was also questioned: does it run Chromium or WebKit? It sets `defaultBrowserType: 'webkit'`, and a probe test confirmed the project runs WebKit with an iPhone user agent. It reproduces Safari behaviour, such as buttons not taking focus on mouse click.

## Decision

- Run the full Playwright matrix (Chromium, Firefox, WebKit, iPhone 15 on WebKit) in CI on every push and pull request, from the first CI setup.
- Tests wait for the lesson's `data-hydrated` marker before interacting.

## Consequences

- WebKit's quirks are caught before they reach iPhone readers.
- CI has to install three browser engines, which adds setup time to each run but not much test time.
- Emulated devices don't replace real-device checks for GPU performance, which are done separately.
