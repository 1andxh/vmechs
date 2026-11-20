---
title: The inclined plane
category: simple-machines
summary: A slope lets a smaller push raise a heavy load, if you push it further. See what friction takes back on a real ramp.
difficulty: Beginner
order: 4
ima: 'slope length ÷ height'
parts:
  inclined plane: gold
  load: blue
  friction: red
cover: /covers/inclined-plane.jpg
published: '2026-11-20'
reviewed: '2026-11-20'
sources:
  - title: 'College Physics 2e, section 9.5: Simple Machines'
    author: Paul Peter Urone and Roger Hinrichs
    publisher: OpenStax
    url: https://openstax.org/books/college-physics-2e/pages/9-5-simple-machines
    note: Pushing a cart up an inclined plane takes less force than lifting it straight up, and with negligible friction the work is the same; ramps were probably used to build the Egyptian pyramids.
  - title: 'Physics, section 9.3: Simple Machines'
    author: Paul Peter Urone and Roger Hinrichs
    publisher: OpenStax
    url: https://openstax.org/books/physics/pages/9-3-simple-machines
    note: The inclined plane as a simple machine, sloping paved surfaces as inclined planes, and the ideal mechanical advantage as the effort's distance ÷ the load's distance.
  - title: 'College Physics 2e, section 5.1: Friction'
    author: Paul Peter Urone and Roger Hinrichs
    publisher: OpenStax
    url: https://openstax.org/books/college-physics-2e/pages/5-1-friction
    note: Kinetic friction is the coefficient × the normal force, which on a slope is the weight × cos θ; the coefficient for wood on wood is 0.3 (Table 5.1).
simplifications:
  - You push steadily, parallel to the slope, so the block never speeds up or slows down, and it never tips.
  - The first four steps leave out friction. The last uses one coefficient, 0.3, for the whole slide; real surfaces vary.
  - The numbers (300 newtons, a 1 metre rise, ramps of 1.5, 3 and 6 metres) were chosen to make the ratios easy to see.
steps:
  - title: A slope instead of a lift
    from: 0
    to: 360
    subtitle: 'An *inclined plane* is a slope. Pushing a load up it takes less force than lifting it straight up.'
  - title: A longer ramp
    from: 360
    to: 720
    subtitle: 'Make the ramp three times as long as it is high, and *100 newtons* pushes 300 up it.'
  - title: The trade
    from: 720
    to: 1080
    subtitle: 'You push it *three metres* to raise it one. Lifting it straight up would take the same work.'
  - title: Gentler still
    from: 1080
    to: 1440
    subtitle: 'Double the length and the push halves again: *50 newtons*. Paths and roads up hills are inclined planes.'
  - title: "Friction's share"
    from: 1440
    to: 1800
    subtitle: 'On a real ramp, *friction* adds to the push: a wooden block needs about 185 newtons, not 100.'
---

<script>
	import Lesson from '#lib/components/Lesson.svelte';
	import Step from '#lib/components/Step.svelte';
	import Numbers from '#lib/components/Numbers.svelte';
	import InclineVisual from '#lib/mechanisms/incline/InclineVisual.svelte';
</script>

<Lesson meta={metadata} period={1800} angleLabel="Push" visual={InclineVisual}>

An inclined plane is a flat surface set at a slope: a **ramp**. It has no moving parts at all, yet it
lets you raise a **load** with less force than lifting it. Each step below is one push. The numbers
in the corner of the stage show the forces, the advantage, how far you've pushed the block along the
slope, and how far it has risen.

<Step n={1}>

To get the block onto a ledge 1 m high you could lift it straight up, with a force equal to its
weight, 300 newtons. Or you can push it up a ramp. This one is 1.5 m long, and the push it needs is
the weight × height ÷ length: 300 × 1 ÷ 1.5 = 200 newtons.

</Step>

<Step n={2}>

On a slope, only part of the block's weight pulls it back down the ramp; the rest presses it into the
surface. With a ramp three times as long as it is high, that part is a third of the weight, so 100
newtons pushes it up. The ideal mechanical advantage is the slope's length ÷ its height: 3.

</Step>

<Step n={3}>

Pushing the block 3 m along the slope raises it 1 m. Your work, 100 N × 3 m = 300 J, is the same as
lifting it straight up, 300 N × 1 m. With no friction, the work is the same either way; the ramp only
lets you use less force for longer. Ramps were probably how the builders of the Egyptian pyramids
raised their stone blocks.

</Step>

<Step n={4}>

A 6 m ramp to the same height halves the push again, to 50 newtons, and doubles how far you push.
All sloping paths and roads are inclined planes: a road that winds up a hill is longer than one
that goes straight up it, and gentler to climb.

</Step>

<Step n={5}>

A real block rubs on the ramp. **Friction** acts down the slope, against the motion, and it grows with
how hard the block presses into the surface: the coefficient of kinetic friction × that part of the
weight. For wood on wood the coefficient is about 0.3, so friction adds about 85 newtons and the push
is about 185 instead of 100. Only about 54% of your work raises the block; the rest becomes heat.

</Step>

<Numbers>

### Formulas

<p class="formula">Ideal mechanical advantage (IMA) = slope length ÷ height</p>
<p class="formula">Ideal push = load × height ÷ slope length</p>
<p class="formula">Friction = μ × load × (horizontal run ÷ slope length)</p>
<p class="formula">Efficiency = work out ÷ work in = MA ÷ IMA</p>

The IMA comes from the general rule, the effort's distance ÷ the load's distance: you push along the
whole slope, and the load rises by its height. It assumes you push parallel to the slope. The
horizontal run ÷ the slope length is cos θ, the share of the weight pressing into the surface, and μ
is the coefficient of kinetic friction. With friction, the push is the ideal push + friction.

### A worked example

A crate weighing 900 N is pushed up a 4.8 m ramp into a truck whose floor is 1.2 m high.

- IMA = 4.8 m ÷ 1.2 m = **4**, so the ideal push is 900 N ÷ 4 = **225 N**.
- Work in is 225 N × 4.8 m = 1,080 J, and work out is 900 N × 1.2 m = 1,080 J, as it must be with no
  friction.

### Try it

A cart weighing 400 N has to be raised 0.5 m, and you want to push it with no more than 50 N. Ideally,
how long must the ramp be?

<details>
<summary>Show the answer</summary>
<p>The IMA must be 400 N ÷ 50 N = 8. Since the IMA is the slope length ÷ the height, the ramp must be
8 × 0.5 m = 4 m long. Any friction means a longer ramp, or a harder push.</p>
</details>

</Numbers>

</Lesson>
