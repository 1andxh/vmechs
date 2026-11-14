# vmechs roadmap

## Where vmechs is headed

vmechs (virtual mechanics) teaches how cars work through interactive mechanisms you can play, pause, scrub and take apart. Today it has one polished lesson, the four-stroke engine, built on a calm "stage and subtitles" design. This roadmap covers everything around that lesson: the homepage, a full curriculum, features for each kind of reader, and a backend.

It's written for four kinds of readers:

- **Curious car owners** who want to understand their car
- **Auto students** who need accurate, structured material
- **DIY and maintenance** readers who want to connect symptoms to causes
- **Enthusiasts** who want depth and comparisons

## Guiding principles

1. **Calm, single-focus screens.** One visual, one or two sentences, one control. Detail is always one tap away, never on screen by default.
2. **Content is the bottleneck, not code.** Each lesson needs a mechanism and careful writing, so making lessons cheap to produce comes before making many of them.
3. **One lesson, four depths.** Rather than a separate site per audience, each lesson has layers: Basics, Deep dive, and In the real world.
4. **Accuracy is the brand.** Lessons cite sources, physics lives in tested pure functions, and simplifications are labelled.
5. **Static until a feature truly needs a server.** Then a FastAPI backend, one step at a time.

## Now / Next / Later

|       | Phase                              | Outcome                                                            |
| ----- | ---------------------------------- | ------------------------------------------------------------------ |
| Now   | 0. Ship it                         | Live URL, CI on every push, a licence chosen                       |
| Now   | 1. The site around the lesson      | Homepage car map, system pages, glossary, search                   |
| Next  | 2. Mechanism kit + core curriculum | Reusable 3D parts; about 10 powertrain lessons                     |
| Next  | 3. Useful for every audience       | Depth layers, "Break it" mode, warning lights, symptom finder      |
| Later | 4. FastAPI backend                 | Accounts, synced progress, quiz results, corrections, search API   |
| Later | 5. Reach and polish                | Embeds for teachers, low-end-device fallback, offline, share cards |

---

## Phase 0: Ship it

- **Deploy** the static build to Cloudflare Pages or Netlify, with a preview deploy for every branch.
- **CI:** GitHub Actions runs linting, type checks, unit tests and browser tests (Chromium, Firefox, WebKit, iPhone) on every push and pull request.
- **Licence:** choose one; the repo is currently public without a licence.
- **Real devices:** test on an actual iPhone and Android phone (GPU, touch orbit, frame rate) and set a Lighthouse budget: performance of at least 90, and a size cap on the initial JavaScript.
- **Sharing:** a share image and page metadata for each lesson.

**Done when** the site works on a phone at a public URL, and a failing CI run blocks a merge.

## Phase 1: The site around the lesson

- **Homepage: "Explore the car."** A calm stage with one car in a slow cutaway. Hotspots name each system: engine, transmission, brakes, suspension, steering, cooling, electrical, EV. Tap one to open it. Below it: "Start here" and "Recently added". The first version can be a simple low-poly car or a 2D silhouette.
- **System pages** such as `/learn/engine`: a short intro, then the lessons in a recommended order with your progress.
- **Lesson navigation:** previous and next lesson, plus links to the parts used in a lesson.
- **Glossary:** a page per term (`/glossary/top-dead-centre`) with a short definition and a small visual. Terms in lesson text open a popover.
- **Search:** a static Pagefind index across lessons, glossary terms and parts.
- **Progress without accounts:** watched lessons are saved in the browser.
- **The basics:** a 404 page, an About page explaining how accuracy is handled, a sitemap and an RSS feed.

**Done when** a first-time visitor can land, find a system and finish a lesson without help.

## Phase 2: Mechanism kit + core curriculum

### 2a. Make lessons cheap to build (first)

- **Mechanism kit:** tested, reusable parts for shafts, spur and planetary gears, belts and chains, cams and followers, pistons and cranks, springs, levers, hydraulic pistons, flowing air and fluid, and wires with current. Each part is driven by the lesson's single driving value.
- **2D lesson mode** for electrical and conceptual topics: the same stage, subtitles and timeline, with an SVG visual instead of 3D.
- **Authoring tools:** a `new:lesson` command that scaffolds a lesson, a development page for tuning camera, lighting and step ranges live, and a content checklist covering sources, simplifications and subtitle length.

### 2b. Core curriculum, in teaching order

1. Four-stroke engine (done)
2. Engine layouts: inline-4, V6, boxer, and firing order
3. Valvetrain: camshaft, timing belt or chain, valve overlap
4. Gears and gear ratios: trading speed for torque
5. Clutch
6. Manual gearbox, including synchros
7. Differential: open, then limited-slip
8. Automatic gearbox: planetary gearsets
9. Turbocharger
10. Cooling and lubrication

After the powertrain: chassis (brakes and ABS, suspension, steering), then electrical (battery, starter, alternator, ignition), then EVs and hybrids.

**Done when** a new lesson built from the kit takes days rather than weeks, and the powertrain path is complete.

## Phase 3: Useful for every audience

- **Depth layers:** each lesson gets a Basics / Deep dive switch. Deep dive adds the numbers, formulas and physics.
- **"Break it" mode:** switch on a fault and watch the mechanism misbehave, alongside the symptom you'd notice in a real car. Examples: worn piston rings (blue smoke, lost compression), a burnt valve (misfire), a slipping clutch (revs rise but the car doesn't speed up), worn brake pads.
- **Dashboard warning lights:** what each common light means, how urgent it is, and which system and lesson it relates to.
- **Symptom finder:** a short guided flow (a noise, a smell, a feeling, a warning light) that ends at the likely systems, the matching "Break it" scenarios, and clear advice on when to see a mechanic. It is curated by hand.
- **Compare mode:** two mechanisms side by side on one timeline, such as inline-4 vs boxer, or manual vs automatic vs CVT.
- **Quick checks:** two or three optional questions at the end of a lesson, answered by scrubbing to the right moment ("Drag to where the intake valve closes").

**Done when** each audience has at least one feature built for it, and one lesson clearly serves all of them.

## Phase 4: FastAPI backend

The site stays static; the API is a separate service. Each step is added only when a feature from earlier phases needs it.

| Step | Feature                                                                                | What it involves                                      |
| ---- | -------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 4.1  | Service skeleton: FastAPI, Postgres, SQLAlchemy and Alembic, deployed with tests in CI | Project layout, migrations, configuration, deployment |
| 4.2  | Accounts: sign in with an email link or with GitHub or Google                          | Auth flows, cross-domain sessions and cookies, CORS   |
| 4.3  | Synced progress: move browser-saved progress into the account                          | Data modelling, idempotent sync, conflict handling    |
| 4.4  | Quiz results and spaced review                                                         | Relational design, background jobs                    |
| 4.5  | "Suggest a correction" on any step, with a review queue                                | Validation, rate limiting, roles and permissions      |
| 4.6  | Search API with Postgres full-text search, powering a better symptom finder            | Indexing, ranking, query design                       |
| 4.7  | Lesson discussions (optional)                                                          | Moderation, abuse prevention, pagination              |

**Done when** you can sign in on a phone and a laptop and see the same progress, and corrections go through the review queue.

## Phase 5: Reach and polish

- **Embeds:** an "Embed this lesson" option so teachers and bloggers can put a lesson on their own pages.
- **Low-end devices:** detect a weak GPU and show a 2D version of the mechanism instead.
- **Offline:** save lessons to use without a connection, for the garage or the classroom.
- **Sharing:** export a short looping clip of a stroke, and share cards for each lesson.
- **Accessibility:** a full screen-reader audit, and a transcript view of each lesson's subtitles.
- **Later:** structured courses for schools, and more languages.
