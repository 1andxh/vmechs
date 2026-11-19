---
title: How a four-stroke engine works
category: engine
summary: Intake, compression, power, exhaust. Watch the piston, valves and crankshaft move through the cycle that powers almost every petrol car.
difficulty: Beginner
order: 1
parts:
  intake valve: blue
  exhaust valve: slate
  piston: green
  connecting rod: gold
  crankshaft: red
cover: /covers/four-stroke-cycle.jpg
published: '2026-11-13'
reviewed: '2026-11-16'
sources:
  - title: Internal Combustion Engine Fundamentals
    author: John B. Heywood
    publisher: McGraw-Hill
    year: 2018
    note: The four-stroke cycle, the crank–slider geometry behind the piston motion, and how long combustion takes.
  - title: Bosch Automotive Handbook
    author: Robert Bosch GmbH
    note: How petrol engines operate, including valve timing and ignition.
  - title: 'Seventy-three percent of all light-duty vehicles produced in 2023 came with gasoline direct injection'
    author: U.S. Department of Energy, Vehicle Technologies Office
    year: 2024
    url: https://www.energy.gov/eere/vehicles/articles/fotw-1331-february-26-2024-seventy-three-percent-all-light-duty-vehicles
    note: How common direct injection, which sprays fuel straight into the cylinder, has become.
simplifications:
  - Valve timing is idealised. Each valve opens and closes exactly at the top or bottom of the stroke; real engines open them early and close them late, with a brief overlap.
  - The spark always fires at the same point just before the top of the compression stroke. Real engines move that point with engine speed and load.
  - Fuel arrives with the air, as in port-injected engines. Many newer engines spray it straight into the cylinder instead, so they draw in only air.
  - It's a single cylinder shown cut in half, and the gas colours show what the gas is doing, not its real colour or temperature.
steps:
  - title: Intake
    from: 0
    to: 180
    subtitle: 'The piston drops and the *intake valve* opens, pulling in air and fuel.'
  - title: Compression
    from: 180
    to: 360
    subtitle: 'Both valves close, and the rising piston *squeezes* the mixture tight.'
  - title: Power
    from: 360
    to: 540
    subtitle: 'The spark fires, and the burning gas drives the *piston* down.'
  - title: Exhaust
    from: 540
    to: 720
    subtitle: 'The *exhaust valve* opens, and the rising piston pushes the burnt gas out.'
---

<script>
	import Lesson from '#lib/components/Lesson.svelte';
	import Step from '#lib/components/Step.svelte';
	import FourStrokeVisual from '#lib/mechanisms/engine/FourStrokeVisual.svelte';
	import CycleChart from '#lib/mechanisms/engine/CycleChart.svelte';
</script>

<Lesson meta={metadata} period={720} visual={FourStrokeVisual}>

Almost every petrol car engine does the same thing over and over, thousands of times a minute: it
pulls in air and fuel, squeezes it, burns it, and pushes the leftovers out. Engineers call those four
steps **strokes**, and mechanics remember them as _suck, squeeze, bang, blow_. One full cycle takes
**two complete turns of the crankshaft**, which is 720°.

<Step n={1}>

The piston starts at the very top (**top dead centre**, TDC) and moves down. The **intake valve**
opens, and the falling piston lowers the pressure inside the cylinder, so air and fuel rush in to fill
the space.

</Step>

<Step n={2}>

Both valves close and the piston comes back up, squeezing the mixture into roughly a tenth of its
original space. A tightly squeezed mixture burns faster and pushes harder. Just _before_ the piston
reaches the top, the **spark plug** fires.

</Step>

<Step n={3}>

The mixture burns in a few thousandths of a second. The hot gas expands violently and shoves the piston
down. This is the **only stroke that makes power**. The spinning crankshaft (and its heavy
flywheel) carries the engine through the other three.

</Step>

<Step n={4}>

The **exhaust valve** opens and the piston rises again, pushing the burnt gas out into the exhaust
pipe. Then the intake valve opens and the whole cycle starts over.

</Step>

## The whole cycle at a glance

The line shows where the piston is (top or bottom of the cylinder) and the shaded hills show when each
valve is open. The marker follows the engine on stage.

<CycleChart />

## Things to notice

**The crankshaft turns twice per cycle.** The piston goes up and down twice for every cycle, but the valves open only
once each. That's because the camshaft, which opens the valves, is geared to turn at _half_ the crankshaft's speed.

**At 90° of crank rotation, the piston is past halfway down.** The connecting rod tilts as the crank swings sideways,
and that tilt pulls the piston a little further down. As a result, the piston moves faster near the top of the
cylinder than near the bottom.

**This model uses idealized valve timing.** Here each valve opens and closes exactly at the top or bottom. Real
engines open them a little early and close them a little late, and briefly have both open at once (_valve overlap_)
so the moving gas helps fill and empty the cylinder. That gets its own lesson.

</Lesson>
