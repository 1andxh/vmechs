# Content standard

Every lesson on vmechs meets this standard before it's published. Rules marked **(enforced)** are checked by the test suite (`src/lib/content/lesson-meta.ts`), so a lesson that breaks them fails CI. The rest are checked by a person during review.

## Accuracy

- **Sources (enforced).** At least one source in the frontmatter: a textbook, service manual, manufacturer documentation or standard. Links must use `https`. Use the `note` field to say what the source supports.
- **Review date (enforced).** `reviewed` is the date the lesson was last checked against its sources, as `YYYY-MM-DD`, and it can't be in the future. Update it whenever the content is re-checked, not when typos are fixed.
- **Simplifications are labelled.** List every place the lesson departs from a real car in `simplifications`, in plain language. Mention the important ones in the lesson body too, where they appear.
- **Physics lives in tested code.** Positions, timings and ratios come from pure functions with unit tests (for example `src/lib/mechanisms/engine/kinematics.ts`), never from hand-placed animation.
- **Cover image (optional, enforced if set).** `cover: /covers/<slug>.jpg` shows the lesson on the homepage. The file must exist in `static/covers/`; use a still of the lesson itself at 1280×860, saved as JPEG.
- **Corrections are welcome.** Every lesson ends with a "Report a mistake" link to the issue form. Fix confirmed mistakes promptly and update `reviewed`.

## Writing

- **Subtitles: one or two sentences (enforced),** written for someone who has never opened a bonnet. One thing may be highlighted with `*word*`: a single word or a short phrase of up to three words, such as `*intake valve*` (enforced). It is the thing to look at on screen right now.
- **Steps cover the whole cycle (enforced).** The first step starts at 0, each step starts where the previous one ends, and there are no gaps or overlaps.
- **The long explanation goes in the sheet**, inside `<Step n={…}>`. Write it for the curious reader; the subtitle is for everyone.
- **Plain words first.** Introduce the technical term after the plain description ("the very top, called top dead centre").

## Safety

vmechs explains how cars work. It never diagnoses a reader's car.

- **No diagnosis from symptoms.** Lessons can describe what a fault does to a mechanism. They don't tell a reader what is wrong with their own car.
- **Say when to stop.** Wherever a lesson touches something that can be dangerous (brakes, steering, tyres, overheating, fuel or oil leaks, warning lights), say clearly when to stop driving and get help, before anything else.
- **Point to the professionals.** Repair-related content ends with "check your vehicle's manual or ask a qualified mechanic", and never encourages work beyond a reader's skill or tools.
- **Extra review for high-risk systems.** Lessons on brakes, steering, airbags and EV or hybrid high-voltage systems get a second review before publishing, and never include step-by-step repair instructions.

## Before publishing a lesson

- [ ] `npm test` passes (this checks the enforced rules above)
- [ ] Every claim can be traced to a listed source
- [ ] Simplifications are listed and, where important, mentioned in the lesson
- [ ] Subtitles read well aloud, in order, with the animation
- [ ] Safety rules followed; second review done for high-risk systems
- [ ] Checked on a phone
