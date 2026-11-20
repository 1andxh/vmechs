# vmechs

Interactive lessons on how machines work: cars, clocks and watches, simple machines, and the mechanisms they share, such as gears, cams and springs. It's written for complete beginners and engineering students alike (ADR 0014). The homepage has no 3D model: a moving headline, "How things move.", and one poster per machine lead to the lessons (ADR 0016). Each lesson is a 3D mechanism you can play, pause, scrub and take apart, with the explanation shown as short subtitles under the moving parts.

## Features

- **Procedural 3D mechanisms.** Parts are built from primitives and moved by real kinematics (the slider-crank equation, valve lift curves), not baked animations.
- **One value drives everything.** A single driving angle feeds the 3D scene, the subtitles, the timeline and the cycle chart, so they can't drift out of sync.
- **Subtitle-style lessons.** One or two sentences per step on stage; the full explanation, cycle chart and notes live in an "All steps" sheet.
- **Accessible by default.** Keyboard-operable timeline, a native `<dialog>` sheet, reduced-motion support (no autoplay, no slide animations), and WCAG AA text contrast.
- **Fast static pages.** Every page is prerendered to HTML. The homepage loads no 3D at all; in a lesson, three.js loads only when the 3D view comes into view.

## Tech stack

| Area      | Choice                                                                                   |
| --------- | ---------------------------------------------------------------------------------------- |
| Framework | [SvelteKit](https://svelte.dev/docs/kit) (Svelte 5, TypeScript), static adapter          |
| Content   | [mdsvex](https://mdsvex.pngwn.io/): Markdown lessons with embedded Svelte components     |
| 3D        | [three.js](https://threejs.org/) via [Threlte](https://threlte.xyz/)                     |
| Font      | Archivo (variable, with its width axis), self-hosted via Fontsource                      |
| Tests     | [Vitest](https://vitest.dev/) (unit) and [Playwright](https://playwright.dev/) (browser) |

## Getting started

Requires Node.js 22.17 or newer and npm. CI and Cloudflare build with the version pinned in `.node-version` (24).

```sh
git clone https://github.com/1andxh/vmechs.git
cd vmechs
npm install
npm run dev
```

Then open the URL Vite prints and go to `/learn/engine/four-stroke-cycle`.

## Scripts

| Command             | What it does                                               |
| ------------------- | ---------------------------------------------------------- |
| `npm run dev`       | Start the dev server                                       |
| `npm run build`     | Prerender the site to `build/`                             |
| `npm run preview`   | Serve the production build locally                         |
| `npm run check`     | Type-check Svelte and TypeScript                           |
| `npm run lint`      | Check formatting with Prettier (`npm run format` fixes it) |
| `npm run test:unit` | Run unit tests in watch mode                               |
| `npm run test:e2e`  | Install Playwright browsers, then run the browser tests    |
| `npm test`          | Run the unit tests once, then the browser tests            |

## Project structure

```
src/
  content/articles/<category>/<slug>.md   Lessons (frontmatter + Markdown)
  lib/
    animation/        Playback state (CycleState) and the per-frame advance logic
    components/       Lesson stage: Lesson, Subtitle, Timeline, Step, LazyCanvas
    content/          Article index, step helpers, the system plan and the homepage poster lists
    mechanisms/       One folder per mechanism: kinematics, 3D scene, 2D chart
    server/           Build-time-only code (article listings)
  routes/             Home page, About, 404, sitemap, section pages /learn/[category] and lessons /learn/[category]/[slug]
  app.css             Design tokens
```

## How a lesson works

A lesson has one driving value, such as the crank angle from 0 to 720° for a four-stroke cycle. Only `CycleState` changes it (when playing, scrubbing or jumping to a step); everything else reads it. The kinematics are pure functions of that value, which is what the unit tests cover.

### Writing a lesson

Short subtitles go in the frontmatter. `*word*` marks the one highlighted word:

```yaml
steps:
  - title: Power
    from: 360
    to: 540
    subtitle: 'The spark fires, and the burning gas drives the *piston* down.'
```

The long explanation for each step goes in the body, matched by number:

```svelte
<Lesson {title} {steps} period={720} visual={FourStrokeVisual}>
	<Step n={3}>The mixture burns in a fraction of a millisecond...</Step>
</Lesson>
```

Step ranges are half-open (`[from, to)`), so a boundary angle belongs to the next step.

## Testing

```sh
npm test
```

Browser tests run in Chromium, Firefox, WebKit (Safari's engine) and an emulated iPhone 15. They wait for the page to hydrate before interacting, because the prerendered HTML is visible before its controls are live.

## Roadmap

- **Done:** shipped on Cloudflare with CI on every push; a landing page that leads to every machine.
- **Now:** help people find the lesson: a system index, and a content and safety standard.
- **Next:** a valvetrain lesson that tests the architecture before any shared kit is built, then bounded reader features: quick checks, warning lights and one "Break it" demo.
- **Later:** a FastAPI backend that starts with a "Report a mistake" intake, then embeds, offline and share images.

See the full plan in [docs/ROADMAP.md](docs/ROADMAP.md).

## License

No open-source licence. The code is public to read, but all rights are reserved.
