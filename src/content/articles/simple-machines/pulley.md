---
title: The pulley
category: simple-machines
summary: A wheel with a rope over it turns your pull around. Add pulleys that move with the load, and the ropes share its weight.
difficulty: Beginner
order: 3
parts:
  fixed pulley: gold
  moving pulley: red
  load: blue
cover: /covers/pulley.jpg
published: '2026-11-20'
reviewed: '2026-11-20'
sources:
  - title: 'College Physics 2e, section 9.5: Simple Machines'
    author: Paul Peter Urone and Roger Hinrichs
    publisher: OpenStax
    url: https://openstax.org/books/college-physics-2e/pages/9-5-simple-machines
    note: An ordinary pulley has a mechanical advantage of 1 and only changes the force's direction; with pulleys combined, the number of cables pulling up on the load is about the mechanical advantage (2, 3 and 4 in its figures).
  - title: 'Physics, section 9.3: Simple Machines'
    author: Paul Peter Urone and Roger Hinrichs
    publisher: OpenStax
    url: https://openstax.org/books/physics/pages/9-3-simple-machines
    note: Count the ropes supporting the load for the ideal mechanical advantage; to raise a load 1 metre you pull N metres of rope; flags, window blinds and construction cranes as examples; real machines lose work to friction.
simplifications:
  - The pulleys and ropes weigh nothing, the ropes don't stretch, and the pulleys turn without friction, so every rope carries exactly your pull.
  - The pulleys are drawn side by side so that every rope hangs straight down and can be counted. Real pulley blocks stack their pulleys on one axle, and the ropes lean a little.
steps:
  - title: One pulley
    from: 0
    to: 360
    subtitle: 'A single *fixed pulley* changes the direction of your pull, not its size: pull down with 300 newtons to lift 300.'
  - title: A pulley that moves
    from: 360
    to: 720
    subtitle: 'Hang a second pulley on the load, and two ropes hold it up: *150 newtons* lifts 300.'
  - title: The trade
    from: 720
    to: 1080
    subtitle: 'To lift the load one metre, you pull *two metres* of rope.'
  - title: Four ropes
    from: 1080
    to: 1440
    subtitle: 'Two pulleys above and two below, and four ropes share the load: *75 newtons* lifts 300. Cranes work this way.'
  - title: Count the ropes
    from: 1440
    to: 1800
    subtitle: "Tie the rope's end to the lower pulleys, and *three ropes* hold the load: the advantage is 3."
---

<script>
	import Lesson from '#lib/components/Lesson.svelte';
	import Step from '#lib/components/Step.svelte';
	import Numbers from '#lib/components/Numbers.svelte';
	import PulleyVisual from '#lib/mechanisms/pulley/PulleyVisual.svelte';
</script>

<Lesson meta={metadata} period={1800} angleLabel="Pull" visual={PulleyVisual}>

A pulley is a wheel with a groove for a rope, turning on an axle. A **fixed pulley** hangs from a
beam and stays put; a **moving pulley** hangs on the **load** and rises with it. Each step below is
one pull. The numbers in the corner of the stage show the forces, the advantage, and how much rope
you've pulled for how far the load has risen.

<Step n={1}>

With one fixed pulley, a single rope holds the load, so you pull with the whole 300 newtons: its
mechanical advantage is 1. What it changes is the direction. You pull down to lift the load up. Flags
and window blinds are raised with pulleys this way.

</Step>

<Step n={2}>

Now the rope is tied to the beam, runs down under a moving pulley that carries the load, and up over
the fixed one to your hand. Two ropes hold the load up, and each carries the same pull, 150 newtons,
so together they lift 300. The ideal mechanical advantage of a pulley system is simply the number of
ropes supporting the load: here, 2.

</Step>

<Step n={3}>

For the load to rise one metre, both ropes holding it must each get a metre shorter, and that rope
has to come out through your hands: two metres. Force × distance, the **work**, is 150 × 2 on your
side and 300 × 1 on the load's. Like the lever and the wheel and axle, a pulley trades force for
distance.

</Step>

<Step n={4}>

Two fixed pulleys above and two moving pulleys below make four ropes holding the load, so 75 newtons
lifts 300, and you pull four metres of rope for every metre it rises. Construction cranes use pulley systems to lift their heavy loads.

</Step>

<Step n={5}>

Here the rope starts at the moving pulleys instead of the beam, so three ropes hold the load and the
advantage is 3. That is the rule for any pulley system: **count the ropes that hold the moving
pulleys up**. The rope you pull doesn't count, because it pulls down on a fixed pulley, not up on
the load.

</Step>

<Numbers>

### Formulas

<p class="formula">Ideal mechanical advantage (IMA) = number of ropes supporting the load</p>
<p class="formula">Rope pulled = IMA × height the load rises</p>
<p class="formula">Mechanical advantage (MA) = load ÷ effort</p>
<p class="formula">Efficiency = work out ÷ work in = MA ÷ IMA</p>

The IMA assumes ideal pulleys and ropes, with no friction and no weight. Every real pulley loses a little work to friction as it turns, so a real pulley system's efficiency is always below 100%.

### A worked example

A workshop hoist lifts an engine weighing 800 N with four ropes supporting it.

- IMA = **4**, so the ideal pull is 800 N ÷ 4 = **200 N**.
- To lift the engine 0.5 m, you pull 4 × 0.5 m = **2 m** of rope.
- Work in is 200 N × 2 m = 400 J, and work out is 800 N × 0.5 m = 400 J, as it must be with no
  losses.

### Try it

A sailor raises a sail weighing 240 N with a pulley system in which three ropes support it. They
find they have to pull with 100 N. What are the system's IMA, its MA and its efficiency?

<details>
<summary>Show the answer</summary>
<p>The IMA is 3, the number of ropes supporting the sail. The MA is 240 N ÷ 100 N = 2.4. The
efficiency is MA ÷ IMA = 2.4 ÷ 3 = 0.8, or 80%: a fifth of the work goes into friction. With no
friction, the pull would be 240 N ÷ 3 = 80 N.</p>
</details>

</Numbers>

</Lesson>
