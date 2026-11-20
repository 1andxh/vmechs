---
title: The screw
category: simple-machines
summary: An inclined plane wrapped round a rod, turned by a lever. See how a screw jack lifts the corner of a car with a push you could make with one hand.
difficulty: Beginner
order: 6
parts:
  screw: gold
  load: blue
cover: /covers/screw.jpg
published: '2026-11-20'
reviewed: '2026-11-20'
sources:
  - title: 'Physics, section 9.3: Simple Machines'
    author: Paul Peter Urone and Roger Hinrichs
    publisher: OpenStax
    url: https://openstax.org/books/physics/pages/9-3-simple-machines
    note: The screw as a lever attached to a circular inclined plane; the distance between threads is the pitch; the input distance is the circumference of the circle the force is applied round and the output distance is the pitch; screw jacks lift the corner of a car a short distance; wood screws are turned by a screwdriver, the lever.
  - title: 'College Physics 2e, section 9.5: Simple Machines'
    author: Paul Peter Urone and Roger Hinrichs
    publisher: OpenStax
    url: https://openstax.org/books/college-physics-2e/pages/9-5-simple-machines
    note: Screws are simple machines, and a machine cannot do more work than the energy put into it.
simplifications:
  - You push steadily, at right angles to the handle, and there is no friction. Real screw jacks lose much of the work to friction in the thread.
  - The thread is drawn as a round wire wound on the rod, and the numbers (3,000 newtons, a 30 centimetre handle, pitches of 2 and 1 centimetres) were chosen to make the ratios easy to see.
steps:
  - title: A ramp wrapped round a rod
    from: 0
    to: 360
    subtitle: 'A *screw* is an inclined plane wrapped round a rod. Turn it, and its thread climbs like a spiral ramp.'
  - title: One turn, one thread
    from: 360
    to: 720
    subtitle: 'Each full turn lifts it by the gap between two threads, the *pitch*: here 2 centimetres.'
  - title: Add a lever
    from: 720
    to: 1080
    subtitle: 'Add a handle 30 centimetres long, and a *32 newton* push lifts 3,000 newtons, the corner of a car.'
  - title: The trade
    from: 1080
    to: 1440
    subtitle: 'Your hand goes nearly *two metres* round for every turn, to lift the car two centimetres.'
  - title: A finer thread
    from: 1440
    to: 1800
    subtitle: 'Halve the pitch, and the push halves to 16 newtons, but it takes *twice as many* turns.'
---

<script>
	import Lesson from '#lib/components/Lesson.svelte';
	import Step from '#lib/components/Step.svelte';
	import Numbers from '#lib/components/Numbers.svelte';
	import ScrewVisual from '#lib/mechanisms/screw/ScrewVisual.svelte';
</script>

<Lesson meta={metadata} period={1800} angleLabel="Turn" visual={ScrewVisual}>

A **screw** is an inclined plane wrapped round a rod: a thread that winds up it like a spiral ramp. It
is usually turned by a lever, such as a screwdriver or a handle, so it is two simple machines in one.
This one is a screw jack, the kind used to lift the corner of a car or a house a short way. Each step
below is two turns. The numbers in the corner of the stage show your push, the **load**, the
advantage, how far your hand has gone round, and how far the load has risen.

<Step n={1}>

Unwrap one turn of the thread and you get a ramp: it climbs by the gap between threads over the
length of one trip round the rod. Turning the screw carries the load up that ramp, round and round
instead of in a straight line. Here it is turned by its head, 5 cm out from the middle, and lifting
3,000 newtons takes about 191.

</Step>

<Step n={2}>

The distance between threads is the **pitch**, here 2 cm. Each full turn lifts the screw by one pitch,
while the rim of the head travels round a circle of 2π × 5 cm, about 31 cm. That ratio, about 16, is
the screw's advantage when it is turned by its head.

</Step>

<Step n={3}>

A handle 30 cm long is a lever on the screw. Your hand now goes round a circle of 2π × 30 cm, about
1.9 m, for the same 2 cm of lift, so the advantage is about 94 and a push of about 32 newtons lifts
3,000. The two machines multiply: the handle is six times the head's radius, and 6 × 16 is about 94.

</Step>

<Step n={4}>

For each turn your hand goes nearly two metres round to lift the car two centimetres. Your work,
about 32 N × 1.9 m = 60 J, equals the work done on the load, 3,000 N × 0.02 m = 60 J. The screw gives
the biggest advantage of all the simple machines here, and makes you pay for it in distance.

</Step>

<Step n={5}>

With threads 1 cm apart the advantage doubles to about 188, and the push halves to about 16 newtons.
But each turn now lifts the load only 1 cm, so the same lift takes twice as many turns. Wood screws
work the same way, with the screwdriver as the lever.

</Step>

<Numbers>

### Formulas

<p class="formula">Ideal mechanical advantage (IMA) = 2π × radius you turn it at ÷ pitch</p>
<p class="formula">Rise = number of turns × pitch</p>
<p class="formula">Mechanical advantage (MA) = load ÷ effort</p>
<p class="formula">Efficiency = work out ÷ work in = MA ÷ IMA</p>

The IMA comes from the general rule, the effort's distance ÷ the load's distance: in one turn your
hand goes once round a circle, 2π × its radius, while the screw moves along by one pitch. The radius
is the handle's length, or the screwdriver's handle, wherever you push. Like the ramp and the wedge, a
real screw rubs along all the thread in contact, so it loses much more work to friction than the
ideal formula shows.

### A worked example

A wood screw has a pitch of 3 mm and is driven with a screwdriver whose handle has a radius of 1.5 cm.

- IMA = 2π × 1.5 cm ÷ 0.3 cm ≈ **31**, so a 20 N twist at the handle's rim would ideally push the
  screw into the wood with about **630 N**.
- In one turn your hand goes 2π × 1.5 cm ≈ 9.4 cm round and the screw goes in 0.3 cm. Work in is
  20 N × 0.094 m ≈ 1.9 J, and work out is 630 N × 0.003 m ≈ 1.9 J.

### Try it

A screw jack has a pitch of 0.5 cm and a handle 25 cm long. Ideally, what push at the end of the
handle lifts a load of 5,000 N?

<details>
<summary>Show the answer</summary>
<p>The IMA is 2π × 25 cm ÷ 0.5 cm ≈ 314, so the push is 5,000 N ÷ 314 ≈ 16 N. Each turn lifts the
load only half a centimetre, so raising it 5 cm takes ten turns.</p>
</details>

</Numbers>

</Lesson>
