# vmechs roadmap

## Where vmechs is headed

vmechs (virtual mechanics) teaches how cars work through interactive mechanisms you can play, pause, scrub and take apart. Today it has one polished lesson, the four-stroke engine, built on a calm "stage and subtitles" design. This roadmap covers what comes next: launching, helping people find lessons, growing the curriculum, features for each kind of reader, and a backend.

It's written for four kinds of readers:

- **Curious car owners** who want to understand their car
- **Auto students** who need accurate, structured material
- **DIY and maintenance** readers who want to connect symptoms to causes
- **Enthusiasts** who want depth and comparisons

## Guiding principles

1. **Calm, single-focus screens.** One visual, one or two sentences, one control. Detail is always one tap away, never on screen by default.
2. **Content is the bottleneck, not code.** Each lesson needs a mechanism and careful writing. Shared parts are extracted from real lessons, not designed in advance.
3. **One lesson, four depths.** Rather than a separate site per audience, each lesson has layers: Basics, Deep dive, and In the real world.
4. **Accuracy is the brand.** Every lesson cites sources, shows when it was last reviewed, labels its simplifications, and has a way to report a mistake.
5. **Explain, never diagnose.** vmechs teaches how systems work. It doesn't diagnose a reader's car, and it always says when to stop driving or see a mechanic.
6. **Let real needs pull features in.** Bigger features (the car map, a mechanism kit, accounts) arrive when the content or the readers need them.

## Now / Next / Later

|       | Phase                        | Outcome                                                                           |
| ----- | ---------------------------- | --------------------------------------------------------------------------------- |
| Now   | 0. Ship it                   | Live on Cloudflare, CI across 4 browsers, a licence, privacy-friendly analytics   |
| Now   | 1. Find the lesson           | Landing page, system index, About page, and a content and safety standard         |
| Next  | 2. Second lesson as the test | Valvetrain lesson, then extract what really repeats; a named learning path        |
| Next  | 3. Bounded reader features   | Quick checks, warning lights, one "Break it" demo; then glossary, search, car map |
| Later | 4. FastAPI backend           | Correction intake first; accounts and synced progress when they're needed         |
| Later | 5. Reach and polish          | Embeds, offline, share images and clips                                           |

---

## Phase 0: Ship it

- **Deploy** the static build to Cloudflare as a Worker serving static assets: build command `npm run build`, deploy command `npx wrangler deploy`, configured by `wrangler.jsonc`.
- **CI:** GitHub Actions runs linting, type checks, unit tests and the browser tests on every push and pull request. The browser suite already covers Chromium, Firefox, desktop WebKit and WebKit at iPhone size with touch, runs in under 20 seconds, and has already caught a real hydration bug.
- **Licence:** choose one; the repo is currently public without a licence.
- **Analytics:** a privacy-friendly, cookie-free option such as Cloudflare Web Analytics. Decide first which few questions it should answer (do people finish the lesson? do they open "All steps"?).
- **Real phones:** test on an actual iPhone and Android phone, and set budgets for what matters: time until the lesson can be used, and smooth frame rate while the engine runs on a mid-range phone.

**Done when** the site works on a phone at a public URL, and a failing CI run blocks a merge.

## Phase 1: Find the lesson

- **Landing page:** what vmechs is, and a clear path to the lesson that exists. No interactive car map yet: with one lesson, it doesn't help anyone find anything.
- **System index:** the car's systems as a simple list, showing which have lessons and which are coming.
- **About page:** why vmechs exists, how accuracy is handled, and how to report a mistake.
- **Content standard**, applied to the four-stroke lesson before any new lesson is written:
  - a source list for each lesson, and a "last reviewed" date
  - simplifications labelled where they appear
  - a "Report a mistake" link (an email address or GitHub issue form until the backend exists)
  - safety rules for repair-related content: no diagnosis from symptoms, clear stop-and-tow guidance where it applies, and extra review for brakes, steering and EV high voltage
- **Keyboard and screen-reader pass** before the launch is announced, not at the end.
- **The basics:** a 404 page, a sitemap, page metadata.

**Done when** a first-time visitor can land, understand what the site is, and reach and finish the lesson without help.

## Phase 2: Second lesson as the architecture test

- **Build the valvetrain lesson next:** camshaft, timing belt or chain, and valve overlap. It sits right next to the four-stroke lesson and removes that lesson's "idealised valve timing" caveat.
- **Then extract what genuinely repeats.** Write down which parts and patterns transferred from the first lesson, and turn only those into shared components. The shared kit grows from real lessons, never ahead of them.
- **Lesson state grows only when a lesson needs it.** Today one driving angle drives everything. A fault demo or a side-by-side comparison will need more (a fault setting, two models), and that's the moment to generalise into a lesson-owned state object with named values.
- **Low-end phones:** measure on weak devices and add a lighter fallback (simpler 3D or a 2D version) where the measurements show it's needed. Checking for WebGL support alone isn't enough.
- **A named learning path:** "Powertrain basics", defined up front with its lessons, the order, and what a reader should understand at the end. It's published and reviewed as a whole.

**Powertrain basics, in order**

1. Four-stroke engine (done)
2. Valvetrain: camshaft, timing, valve overlap
3. Engine layouts: inline-4, V6, boxer, and firing order
4. Gears and gear ratios: trading speed for torque
5. Clutch
6. Manual gearbox, including synchros
7. Differential
8. Automatic gearbox: planetary gearsets

After that: turbocharging, cooling and lubrication, then chassis (brakes and ABS, suspension, steering), electrical (battery, starter, alternator, ignition), and EVs and hybrids.

**Done when** the valvetrain lesson is live, the shared parts are extracted from two real lessons, and the Powertrain basics path is defined.

## Phase 3: Bounded reader features

Small, self-contained features first:

- **Quick checks:** two or three optional questions at the end of a lesson, answered by scrubbing to the right moment ("Drag to where the intake valve closes"). Results stay in the browser.
- **Dashboard warning lights:** what each common light means, how urgent it is, and which system it relates to. It follows the safety rules: "stop safely and get help" comes first where it applies.
- **One "Break it" demo:** a single fault, such as a slipping clutch (revs rise but the car doesn't speed up), shown as a clearly labelled scenario with a note on what the visual simplifies.
- **Depth layers:** a Basics / Deep dive switch on lessons where there's genuine depth to add.

Once there are at least three lessons:

- **Glossary** with tappable terms in lesson text, **search** (a static Pagefind index), and an **interactive car map** on the homepage.

Later, when the content and lesson state can support them:

- **More "Break it" scenarios**, **compare mode** (two mechanisms side by side), and a cautious **symptom guide** that points to possible systems and urgency, never to a diagnosis.

**Done when** each audience has at least one feature built for it, and every feature follows the content and safety standard.

## Phase 4: FastAPI backend

The site stays static and keeps working if the API is down. The API is a separate service, hosted on a VPS. It's also a deliberate way to learn backend development, so each step is a small, real feature.

| Step | Feature                                                                                                                          | What it teaches                                                |
| ---- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| 4.1  | **"Report a mistake" intake**: one endpoint, one table, a private review list. No accounts                                       | FastAPI, Postgres, migrations, validation, deploying a service |
| 4.2  | **Hardening the intake:** rate limits, a honeypot field, size limits, no logging of submissions, a retention and deletion policy | Abuse prevention, privacy by design, operations                |
| 4.3  | **Accounts**, once readers want progress on more than one device. Start with one simple sign-in method                           | Auth flows, cross-domain sessions and cookies, CORS            |
| 4.4  | **Synced progress:** move browser-saved progress and quick-check results into the account                                        | Data modelling, idempotent sync, conflict handling             |

Not planned: a server-side search API (static search covers the static content) and discussion threads (moderation cost with little teaching value).

**Done when** mistakes can be reported from any lesson and reviewed privately, and, once accounts exist, progress is the same on a phone and a laptop.

## Phase 5: Reach and polish

- **Embeds:** an "Embed this lesson" option for teachers and bloggers.
- **Offline:** save lessons for use without a connection.
- **Sharing:** a share image for each lesson, and short looping clips of a stroke.
- **Later:** structured courses for schools, and more languages.

Each of these is its own project with ongoing costs, so it waits until readers or teachers ask for it.

---

## Changes in this revision

This roadmap was revised after an independent review. The main changes:

- Phase 1 now focuses on finding the existing lesson; the car map, glossary and search wait for more lessons.
- A content and safety standard comes before new lessons.
- The second lesson tests the architecture before any shared kit is built.
- The backend starts with a "Report a mistake" intake instead of accounts. The search API and discussions were dropped.
- The low-end-phone fallback moved earlier, and performance targets are now measured on real devices.
- Kept as planned: browser coverage in CI from the start, and the backend as a deliberate learning track.
