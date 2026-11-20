---
title: The lever
category: simple-machines
summary: A bar and a pivot let a small push lift a heavy load. Watch a lever trade distance for force, and meet its three classes.
difficulty: Beginner
order: 1
parts:
  fulcrum: gold
  load: blue
  effort: green
cover: /covers/lever.jpg
published: '2026-11-19'
reviewed: '2026-11-20'
sources:
  - title: 'College Physics 2e, section 9.5: Simple Machines'
    author: Paul Peter Urone and Roger Hinrichs
    publisher: OpenStax
    url: https://openstax.org/books/college-physics-2e/pages/9-5-simple-machines
    note: The law of the lever, mechanical advantage, and why a machine cannot put out more work than goes in.
  - title: 'Physics, section 9.3: Simple Machines'
    author: Paul Peter Urone and Roger Hinrichs
    publisher: OpenStax
    url: https://openstax.org/books/physics/pages/9-3-simple-machines
    note: Ideal mechanical advantage from the lever's arms, efficiency as work out over work in, and why a real machine's efficiency is always below 100 percent.
  - title: Strength Training for All Body Types
    author: Lee Boyce and Melody Schoenfeld
    publisher: Human Kinetics
    url: https://us.humankinetics.com/blogs/excerpt/understand-how-levers-work-with-your-workout
    note: The three classes of lever, with the seesaw, wheelbarrow and biceps curl as examples.
simplifications:
  - The bar weighs nothing, never bends, and turns on a frictionless pivot, so the effort is exactly what the law of the lever says.
  - The forces push straight up and down. The numbers (300 newtons, the arm lengths) were chosen to make the ratios easy to see.
steps:
  - title: Effort, load, fulcrum
    from: 0
    to: 360
    subtitle: 'A lever is a stiff bar that turns on a pivot, the *fulcrum*. Push one end down and the other end lifts.'
  - title: Move the fulcrum
    from: 360
    to: 720
    subtitle: 'Move the fulcrum closer to the load, and 100 newtons of push lifts *300 newtons*.'
  - title: The trade
    from: 720
    to: 1080
    subtitle: 'Nothing comes free: your end travels *three times* as far as the load rises.'
  - title: Load in the middle
    from: 1080
    to: 1440
    subtitle: 'Put the load between the fulcrum and your push, as in a *wheelbarrow*, and the lever still multiplies your force.'
  - title: Effort in the middle
    from: 1440
    to: 1800
    subtitle: 'Put your push in the middle, like your *forearm* lifting a weight. You push harder than the load, but it moves further and faster.'
---

<script>
	import Lesson from '#lib/components/Lesson.svelte';
	import Step from '#lib/components/Step.svelte';
	import LeverVisual from '#lib/mechanisms/lever/LeverVisual.svelte';
	import Numbers from '#lib/components/Numbers.svelte';
</script>

<Lesson meta={metadata} period={1800} angleLabel="Push" visual={LeverVisual}>

A lever is one of the simplest machines: a stiff bar that turns about a fixed point, the
**fulcrum**. Your push is the **effort**, and what you move is the **load**. Each step below is one
push. The numbers in the corner of the stage show the forces, the lever's advantage, and how far
each end has moved.

<Step n={1}>

Each force acts some distance from the fulcrum, called its **arm**. The bar balances when the turning
effects match: **effort × effort arm = load × load arm**. This is the _law of the lever_. Here the
arms are equal, so 100 newtons of push balances 100 newtons of load, like children of the same
weight on a seesaw.

</Step>

<Step n={2}>

Now the effort arm is 2.25 m and the load arm 0.75 m, so 100 N × 2.25 m = 300 N × 0.75 m. The ratio
of the arms, 3, is the lever's **mechanical advantage**: how many times it multiplies your force. It
is why a nail puller with a longer handle pulls harder.

</Step>

<Step n={3}>

When the bar tilts, each end moves in proportion to its arm, so your end moves three times as far as
the load. Force × distance, the **work**, is the same at both ends. A machine cannot put out more
work than goes into it; a lever only trades force for distance.

</Step>

<Step n={4}>

This is a **second-class lever**: the fulcrum at one end (the wheel of a wheelbarrow), your effort at
the other, and the load between them. The effort is always further from the fulcrum than the load,
so a second-class lever always multiplies force. The first two steps were a **first-class lever**,
with the fulcrum in the middle, like a seesaw.

</Step>

<Step n={5}>

In a **third-class lever** the effort sits between the fulcrum and the load, so it is nearer the
fulcrum and the advantage is below 1: here, holding 300 newtons takes 900. In a biceps curl the
elbow is the fulcrum and the biceps pulls between the elbow and the hand. In exchange, the hand
moves three times as far, and three times as fast, as the point where the muscle pulls. A shovel
works the same way.

</Step>

<Numbers>

### Formulas

<p class="formula">Ideal mechanical advantage (IMA) = effort arm ÷ load arm</p>
<p class="formula">Mechanical advantage (MA) = load ÷ effort</p>
<p class="formula">Work = force × distance moved</p>
<p class="formula">Efficiency = work out ÷ work in</p>

The ideal advantage comes from the lever's shape alone; the mechanical advantage comes from the forces
you actually measure. An ideal lever, with a frictionless pivot and a bar that never bends, loses no
work, so work out equals work in and its efficiency is 1, or 100%. A real lever loses a little work
to friction at the pivot and to the bar flexing, so its efficiency is always below 100%.

The two advantages are linked. Work out ÷ work in = (load × load distance) ÷ (effort × effort
distance), and the distances are in the same ratio as the arms, so **efficiency = MA ÷ IMA**.

### A worked example

A crowbar 1.5 m long rests on its bend, 0.10 m from the claw. The load arm is 0.10 m, and the
effort arm is the rest of the bar, 1.40 m.

- IMA = 1.40 m ÷ 0.10 m = **14**.
- Push the handle with 200 N, and an ideal crowbar pulls on the nail with 200 N × 14 = **2,800 N**.
- The handle moves 14 times as far as the claw: lift it 28 cm and the nail rises 2 cm. Work in is
  200 N × 0.28 m = 56 J, and work out is 2,800 N × 0.02 m = 56 J, as it must be with no losses.

### Try it

A child weighing 300 N sits on a seesaw, 1.2 m from the pivot. An adult weighing 400 N sits on the
other side of the pivot. How far from the pivot must the adult sit for the seesaw to balance?

<details>
<summary>Show the answer</summary>
<p>The turning effects must match: 300 N × 1.2 m = 400 N × distance. So the distance is 360 ÷ 400 =
0.9 m. The adult sits 0.9 m from the pivot, nearer than the child, because they push down harder.</p>
</details>

</Numbers>

</Lesson>
