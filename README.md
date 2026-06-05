# Solara Trips

A single imaginary travel app used as the visual reference product for the HASSAR mobile shell.

## What It Demonstrates

- Destination discovery
- Floating blurred header with logo, level, and points
- Dark floating icon-only blurred bottom tabs
- Search pill and category selector
- Large visual poster cards inspired by premium travel, health, learning, and food app surfaces
- Home command screen
- Tour carousel
- Analytics metrics and progress
- Booking workflow
- Saved/favorite trips
- Traveler profile, personalization, settings, and rewards surface
- Detail routes for every actionable row/card pattern
- Adapter points for Clerk, Cloudflare D1, Cloudflare R2, and analytics

## Commands

```sh
npm install
npm run typecheck
npm run start:check
npm run platform:validate
npm run web
```

## Design Decision

The product intentionally solves the visual and interaction shell before backend integration. The weak premise would be "connect Clerk and Cloudflare first, then design later." That would lock inconsistent UX into every app. The better order is:

1. Mature Solara Trips as the reference experience.
2. Make generated apps consume the shell language.
3. Attach Clerk, D1, R2, analytics, and payments through adapters.

## Visual Direction

Reference direction: premium mobile travel UI with soft gray canvas, photographic hero cards, compact pill controls, black floating navigation, and a restrained accent system. The implementation keeps HASSAR's product shell contract intact while moving away from generic dashboard density.
