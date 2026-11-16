---
title: Gears and gear ratios
category: transmission
summary: A small gear driving a big one turns it slower but harder. Watch two gears mesh and see how a gear ratio trades speed for torque.
difficulty: Beginner
order: 1
cover: /covers/gears.jpg
reviewed: '2026-11-16'
sources:
  - title: ISO 53, Cylindrical gears for general and heavy engineering — Standard basic rack tooth profile
    author: International Organization for Standardization
    note: The 20° involute tooth profile, with an addendum of one module and a dedendum of 1.25 modules.
  - title: Shigley's Mechanical Engineering Design
    author: Richard G. Budynas and J. Keith Nisbett
    publisher: McGraw-Hill
    note: Involute gear geometry, conjugate action, and how gear ratios set speed and torque.
  - title: Bosch Automotive Handbook
    author: Robert Bosch GmbH
    note: Gears in vehicle transmissions.
simplifications:
  - Friction is ignored, so the big gear's torque is exactly 2½ times the small gear's. Real gear pairs lose a little to friction.
  - These are straight-cut (spur) gears. Most car gearboxes use helical gears, with slanted teeth, because they run more quietly.
  - The tooth counts, 12 and 30, were chosen to make the ratio easy to see.
steps:
  - title: Teeth push teeth
    from: 0
    to: 360
    subtitle: "The small gear's teeth push on the big gear's teeth, so turning one *turns the other*."
  - title: Opposite ways
    from: 360
    to: 720
    subtitle: 'Two gears in mesh always spin in *opposite directions*.'
  - title: Speed
    from: 720
    to: 1080
    subtitle: 'The small gear has 12 teeth and the big one 30, so the small one turns *2½ times* for each turn of the big one.'
  - title: Torque
    from: 1080
    to: 1440
    subtitle: 'The big gear turns more slowly but 2½ times as hard: the pair trades *speed for torque*.'
  - title: The tooth shape
    from: 1440
    to: 1800
    subtitle: 'Each tooth is a special curve, an *involute*, that keeps the speed perfectly steady as one tooth hands over to the next.'
---

<script>
	import Lesson from '#lib/components/Lesson.svelte';
	import Step from '#lib/components/Step.svelte';
	import GearsVisual from '#lib/mechanisms/gears/GearsVisual.svelte';
	import { PAIR, cyclePeriod } from '#lib/mechanisms/gears/pair.ts';

	const period = cyclePeriod(PAIR.z1, PAIR.z2);
</script>

<Lesson meta={metadata} {period} angleLabel="Small gear angle" visual={GearsVisual}>

A gear is a wheel with teeth around its edge. Set two gears side by side so their teeth interlock
(engineers say they are **in mesh**), and turning one turns the other. A car's gearbox is built from
pairs like this, and even a single pair shows the big idea: it can **trade speed for turning force**.

Here the small gear, with 12 teeth, does the driving. The big gear, with 30, is driven.

<Step n={1}>

Each tooth on the small gear pushes against a tooth on the big gear, and that push is what turns it.
Before one pair of teeth lets go, the next pair has already started touching, so the push never
stops. In this pair, two pairs of teeth share the load about half the time.

</Step>

<Step n={2}>

Where the teeth meet, both gears' edges move the same way, at the same speed. For that to happen
the two gears must turn in opposite directions: when the small gear turns anticlockwise, the big
one turns clockwise.

</Step>

<Step n={3}>

The teeth pass the meeting point one at a time, at the same rate on both gears. So when the small
gear has turned once, 12 teeth have gone by: only 12 of the big gear's 30, which is two fifths of a
turn. The small gear has to turn two and a half times to turn the big one once. That number, the big
gear's teeth divided by the small gear's (30 ÷ 12), is the **gear ratio**, written 2.5:1.

</Step>

<Step n={4}>

Ignoring friction, a gear pair passes on all the power it is given, and power is turning force
(**torque**) times speed. So if the big gear turns 2½ times more slowly, it must push 2½ times as
hard. That is what a car's gearbox is for: in first gear, a big ratio multiplies the engine's torque
to get the car moving; in the higher gears, smaller ratios let the wheels turn faster at the same
engine speed. Real gears lose a little of the power to friction.

</Step>

<Step n={5}>

The sides of the teeth aren't just any curve. Each is an **involute**: the path traced by the end of
a taut string as it unwinds from a circle. With this shape, the push between two teeth always points
through the same spot on the line between the gears' centres (the **pitch point**), and that keeps
the speed ratio exactly constant as each tooth hands over to the next: no speeding up and slowing
down.

</Step>

## Things to notice

**The teeth follow a standard.** Each gear is sized by its **pitch circle**, an invisible circle
partway up the teeth; the two gears' pitch circles are in the same ratio as their teeth, 30 to 12.
Most gears use the same basic tooth shape: a 20° pressure angle, the tooth reaching one **module**
(the pitch circle's diameter divided by the number of teeth) beyond the pitch circle, and its root
1.25 modules inside it. The extra quarter is clearance, so a tooth's tip never
hits the bottom of the gap it sits in. That is why two gears with the same module mesh, whoever made them.

**Why the timeline is five turns long.** After one turn of the big gear the small one has turned 2½
times, so its teeth are half a turn round from where they started. Both gears are only back to their
starting positions after 60 teeth have passed: five turns of the small gear and two of the big one.
In that time each small-gear tooth meets only 5 of the big gear's 30 teeth (every sixth one), because
12 and 30 share a factor of 6.

**Car gearboxes use slanted teeth.** These are straight-cut (**spur**) gears, the easiest to see.
Most car gearboxes use **helical** gears, whose teeth are cut at an angle across the gear. They engage
gradually rather than all at once, so they run more quietly.

</Lesson>
