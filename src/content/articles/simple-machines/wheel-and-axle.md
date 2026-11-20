---
title: The wheel and axle
category: simple-machines
summary: A big wheel fixed to a thin axle is a lever that goes round. Pull on the wheel to lift with the axle, and see what you trade for it.
difficulty: Beginner
order: 2
parts:
  wheel: green
  axle: gold
  load: blue
cover: /covers/wheel-and-axle.jpg
published: '2026-11-20'
reviewed: '2026-11-20'
sources:
  - title: 'Physics, section 9.3: Simple Machines'
    author: Paul Peter Urone and Roger Hinrichs
    publisher: OpenStax
    url: https://openstax.org/books/physics/pages/9-3-simple-machines
    note: The wheel and axle as a form of lever turning about the axle's centre, its ideal mechanical advantage (wheel radius ÷ axle radius), and the windlass, steering wheel and doorknob as examples.
  - title: 'College Physics 2e, section 9.5: Simple Machines'
    author: Paul Peter Urone and Roger Hinrichs
    publisher: OpenStax
    url: https://openstax.org/books/college-physics-2e/pages/9-5-simple-machines
    note: Mechanical advantage as the ratio of the radii, and a car's axle driving a larger wheel, where the advantage is below 1.
simplifications:
  - The wheel, axle and ropes weigh nothing, the ropes don't stretch, and the axle turns without friction, so the effort is exactly what the radii say.
  - Each radius is measured to the middle of its rope. The numbers (300 newtons, radii of 0.1, 0.3 and 0.6 metres) were chosen to make the ratios easy to see.
steps:
  - title: A lever that goes round
    from: 0
    to: 360
    subtitle: 'A *wheel and axle* is a big wheel fixed to a thin rod, so both turn together around one centre.'
  - title: The wheel's advantage
    from: 360
    to: 720
    subtitle: 'Pull the rope on the wheel with 100 newtons, and the axle lifts *300 newtons*.'
  - title: The trade
    from: 720
    to: 1080
    subtitle: 'As it turns, your rope moves *three times* as far as the load rises.'
  - title: A bigger wheel
    from: 1080
    to: 1440
    subtitle: 'Double the wheel, and the same load needs *half the pull*. That is why steering wheels are wide.'
  - title: Turn it round
    from: 1440
    to: 1800
    subtitle: "Turn the *axle* instead, and the rim moves three times as far, like a car's axle driving its larger wheel."
---

<script>
	import Lesson from '#lib/components/Lesson.svelte';
	import Step from '#lib/components/Step.svelte';
	import Numbers from '#lib/components/Numbers.svelte';
	import WheelAxleVisual from '#lib/mechanisms/wheel-axle/WheelAxleVisual.svelte';
</script>

<Lesson meta={metadata} period={1800} angleLabel="Turn" visual={WheelAxleVisual}>

A wheel and axle is a big **wheel** fixed to a thin rod, the **axle**, so that both turn together.
It is a lever that never runs out of room: instead of tilting a little and stopping, it can turn
round and round. Each step below is one pull. The numbers in the corner of the stage show the forces,
the advantage, and how far each rope has moved.

<Step n={1}>

The centre of the axle is the fulcrum. A rope pulled at the wheel's edge acts 0.30 m from it, and the
**load** hangs from the axle 0.10 m from it. Those two radii are the arms of a lever, and the law of
the lever still holds: **effort × wheel radius = load × axle radius**.

</Step>

<Step n={2}>

The wheel's radius is three times the axle's, so the **mechanical advantage** is 3: 100 newtons on
the wheel's rope balances 300 newtons on the axle's. A hand-powered windlass, the crank that winds a
bucket up a well, works the same way, with the crank's handle as the wheel.

</Step>

<Step n={3}>

Wheel and axle turn through the same angle, so each rope moves by its radius times that angle. Your
rope, at three times the radius, moves three times as far as the load rises. Force × distance, the
**work**, comes out the same on both ropes: like the lever, a wheel and axle only trades force for
distance.

</Step>

<Step n={4}>

The wheel's radius is now 0.60 m, six times the axle's, so the advantage is 6 and 50 newtons
lifts the same 300. The price is rope: yours now moves six times as far as the load. A steering wheel
and a doorknob are wheels and axles too; a wider wheel or knob makes a stiff shaft easier to turn.

</Step>

<Step n={5}>

Here the effort turns the axle and the load hangs from the wheel. The advantage is the axle's radius
÷ the wheel's, ⅓, so lifting 100 newtons takes 300. In exchange, the rim moves three times as far,
and three times as fast, as the axle's surface. That is what happens when a car's axle drives a much
larger wheel: the engine pushes hard on a small axle, and the tyre covers more ground.

</Step>

<Numbers>

### Formulas

<p class="formula">Ideal mechanical advantage (IMA) = wheel radius ÷ axle radius</p>
<p class="formula">Mechanical advantage (MA) = load ÷ effort</p>
<p class="formula">Rope moved = radius × angle turned (in radians)</p>
<p class="formula">Efficiency = work out ÷ work in = MA ÷ IMA</p>

The formula for IMA is for turning the wheel to move the axle. Turn the axle to move the wheel and
the ratio flips, to axle radius ÷ wheel radius, which is below 1. In one full turn, each rope moves one
circumference, 2π × its radius, so the ropes always move in the ratio of the radii. An ideal wheel
and axle loses no work; a real one loses some to friction where the axle turns in its bearing, so its
efficiency is below 100%.

### A worked example

A well's windlass has a handle 0.40 m from the centre and a drum of radius 0.08 m that winds the rope.

- IMA = 0.40 m ÷ 0.08 m = **5**.
- A bucket of water weighing 200 N needs an ideal effort of 200 N ÷ 5 = **40 N** on the handle.
- In one turn the hand travels 2π × 0.40 m = 2.51 m and the bucket rises 2π × 0.08 m = 0.50 m. Work in
  is 40 N × 2.51 m, about 100 J, and work out is 200 N × 0.50 m, also about 100 J, as it must be with
  no losses.

### Try it

A doorknob has a radius of 3 cm, fixed to a spindle of radius 0.5 cm. Turning the spindle needs a
force of 12 N at its surface. Ideally, how much force do you need at the edge of the knob?

<details>
<summary>Show the answer</summary>
<p>The IMA is 3 cm ÷ 0.5 cm = 6, so you need 12 N ÷ 6 = 2 N at the edge of the knob. With a knob
the size of the spindle you would need the full 12 N.</p>
</details>

</Numbers>

</Lesson>
