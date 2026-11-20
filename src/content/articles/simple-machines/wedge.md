---
title: The wedge
category: simple-machines
summary: Two inclined planes back to back, driven into the load instead of carrying it. See how a thin wedge turns a push into a much bigger force pressing things apart.
difficulty: Beginner
order: 5
parts:
  wedge: gold
  wood: blue
cover: /covers/wedge.jpg
published: '2026-11-20'
reviewed: '2026-11-20'
sources:
  - title: 'Physics, section 9.3: Simple Machines'
    author: Paul Peter Urone and Roger Hinrichs
    publisher: OpenStax
    url: https://openstax.org/books/physics/pages/9-3-simple-machines
    note: A wedge is two inclined planes back to back, with an ideal mechanical advantage of length ÷ thickness; knives and axe heads are wedges; with a wedge the load stays put and the machine moves; friction depends on the area of the surfaces in contact.
  - title: 'College Physics 2e, section 9.5: Simple Machines'
    author: Paul Peter Urone and Roger Hinrichs
    publisher: OpenStax
    url: https://openstax.org/books/college-physics-2e/pages/9-5-simple-machines
    note: Wedges are simple machines, and a machine cannot do more work than the energy put into it.
simplifications:
  - You push the wedge in steadily. Real axes split wood with a blow, which this lesson doesn't model.
  - There is no friction, and the wedge is the same on both sides. The log is shown as two halves that slide apart, where real wood opens in a V-shaped crack.
  - The numbers (a 100 newton push, a 60 centimetre wedge) were chosen to make the ratios easy to see.
steps:
  - title: Two ramps back to back
    from: 0
    to: 360
    subtitle: 'A *wedge* is two inclined planes back to back. Instead of moving the load up a ramp, you drive the ramp into the load.'
  - title: Push in, press apart
    from: 360
    to: 720
    subtitle: 'Push it in with 100 newtons, and it presses each side of the wood apart with *600 newtons*.'
  - title: The trade
    from: 720
    to: 1080
    subtitle: 'Drive it in *six centimetres*, and the wood opens one.'
  - title: A thicker wedge
    from: 1080
    to: 1440
    subtitle: 'Make it twice as thick, and the same push presses with *half the force*, but opens the wood twice as fast.'
  - title: A blade
    from: 1440
    to: 1800
    subtitle: 'A knife blade is a long, thin *wedge*: 100 newtons presses with 1,000.'
---

<script>
	import Lesson from '#lib/components/Lesson.svelte';
	import Step from '#lib/components/Step.svelte';
	import Numbers from '#lib/components/Numbers.svelte';
	import WedgeVisual from '#lib/mechanisms/wedge/WedgeVisual.svelte';
</script>

<Lesson meta={metadata} period={1800} angleLabel="Push" visual={WedgeVisual}>

A **wedge** tapers from a thick back to a thin edge or point. It is two inclined planes back to back,
but it works the other way round: with a ramp, the load moves and the ramp stays put; with a wedge,
the load stays where it is and the machine moves into it. Each step below is one push. The numbers in
the corner of the stage show your push, the force pressing each side of the **wood** apart, the
advantage, how far the wedge has gone in, and how far the wood has opened.

<Step n={1}>

Here a wedge 60 cm long and 10 cm thick at the back is pushed point first into a log. As it goes in,
its two sloping faces push the halves of the log aside, as a ramp pushes a block up. The wood is the
load, and it moves sideways, not up.

</Step>

<Step n={2}>

The wedge is six times as long as it is thick, so its ideal mechanical advantage is 6: a push of 100
newtons presses each half of the log aside with 600. It is the same rule as the ramp's, the effort's
distance ÷ the load's distance.

</Step>

<Step n={3}>

Drive the wedge in 6 cm and the gap at the top of the log widens by 1 cm, the wedge's thickness at
that depth. Your work, 100 N × 0.06 m, equals the wood's, 600 N × 0.01 m. Like every simple machine,
a wedge trades distance for force.

</Step>

<Step n={4}>

A wedge 20 cm thick and still 60 cm long has an advantage of only 3, so the same push presses with
300 newtons, half as much. But every centimetre it goes in opens the wood twice as far. A thick wedge
opens things quickly; a thin one presses hard.

</Step>

<Step n={5}>

Knives and axe heads are wedges. This one is shaped like a blade, ten times as long as it is thick,
so the same 100 newtons presses with 1,000. The thinner the edge for its length, the greater the
force from the same push.

</Step>

<Numbers>

### Formulas

<p class="formula">Ideal mechanical advantage (IMA) = length ÷ thickness</p>
<p class="formula">Force pressing each side apart = push × IMA</p>
<p class="formula">Opening = depth driven × thickness ÷ length</p>
<p class="formula">Efficiency = work out ÷ work in = MA ÷ IMA</p>

The IMA comes from the general rule, the effort's distance ÷ the load's distance: driven in by its
whole length, a wedge pushes the two sides apart by its whole thickness. The length is measured from
the tip to the back, and the thickness across the back. A real wedge rubs over large surfaces as it
slides, and friction grows with the area of the surfaces in contact, so wedges lose much more work to
friction than the ideal formula shows.

### A worked example

An axe head is 12 cm from its edge to its back and 3 cm thick at the back.

- IMA = 12 cm ÷ 3 cm = **4**, so a steady 200 N push would ideally press the wood apart with
  200 N × 4 = **800 N**.
- Pushed in 4 cm, it opens the wood 4 cm × 3 ÷ 12 = 1 cm. Work in is 200 N × 0.04 m = 8 J, and work
  out is 800 N × 0.01 m = 8 J, as it must be with no friction.

### Try it

A chisel's blade is 5 cm long and 0.5 cm thick at the back. Ideally, how hard must you push it to
press the wood apart with 500 N?

<details>
<summary>Show the answer</summary>
<p>The IMA is 5 cm ÷ 0.5 cm = 10, so you need 500 N ÷ 10 = 50 N. With friction, you would need more.</p>
</details>

</Numbers>

</Lesson>
