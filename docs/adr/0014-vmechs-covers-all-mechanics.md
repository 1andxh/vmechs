# 0014. vmechs covers all mechanics, for beginners and engineering students

## Status

Accepted. Widens the scope that ADRs 0001 to 0013 took for granted (cars only). The decisions in those ADRs stand.

## Context

vmechs started with cars: a four-stroke engine page, then gears, a car system plan (`SYSTEMS`), and a homepage that said "How cars actually work". The maintainer clarified that the point of the site was never cars alone: "anything mechanics". He also named its audience: "a study point for dummies and engineering students as well".

For the homepage section that shows what vmechs covers, three directions were mocked up: two shelves of machines and mechanisms, two ways in (from a machine or from a principle), and a study-guide contents page. A route map was considered and rejected for the homepage. The maintainer chose the machines-and-mechanisms shelves.

## Decision

- vmechs explains how machines work: cars, clocks and watches, simple machines and the principles behind them, and any machinery worth understanding.
- It is written for complete beginners and engineering students alike. Plain words come first; the deeper detail is there for those who want it, as the depth layers in the roadmap describe.
- The site's tagline is "How machines actually work".
- Content is organised as **machines** (a car, a clock) and **mechanisms** (gears, cranks, cams, springs). A mechanism lists the machines it appears in, so a page about gears serves cars, clocks and bicycles alike.
- The car keeps its systems, and existing page addresses don't change.
- The starting plan, to be changed freely in one data file:
  - **Clocks and watches:** gear train, escapement, mainspring, balance wheel.
  - **Simple machines:** lever, wheel and axle, pulley, inclined plane, wedge, screw.
  - **Mechanisms:** gears, crank and slider, cam and follower, belts and chains, escapement, springs, linkages, ratchet and pawl.

## Consequences

- The homepage's "The whole car" section (ADR 0013) is replaced by the machines-and-mechanisms shelves.
- Car-only wording goes from the homepage, the README and the roadmap.
- One page can belong to a machine and be a mechanism at the same time (gears does). The content model allows this rather than forcing a single category.
