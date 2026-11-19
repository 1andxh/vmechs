---
title: The lever
category: simple-machines
summary: A bar and a pivot let a small push lift a heavy load. Watch a lever trade distance for force, and meet its three classes.
difficulty: Beginner
order: 1
cover: /covers/lever.jpg
published: '2026-11-19'
reviewed: '2026-11-19'
sources:
  - title: 'College Physics 2e, section 9.5: Simple Machines'
    author: Paul Peter Urone and Roger Hinrichs
    publisher: OpenStax
    url: https://openstax.org/books/college-physics-2e/pages/9-5-simple-machines
    note: The law of the lever, mechanical advantage, and why a machine cannot put out more work than goes in.
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

</Lesson>
