# 5-Min App Template

Reusable Expo Router template for HASSAR 5-minute mobile apps.

## What It Demonstrates

- Onboarding preview
- Floating blurred header with logo, level, and points
- Dark floating icon-only blurred bottom tabs
- Search pill and category selector
- Large visual poster cards inspired by premium travel, health, learning, and food app surfaces
- Home command screen
- Domain carousel
- Analytics metrics and progress
- Primary five-minute session workflow
- Saved/favorite outputs
- Profile, personalization, settings, and subscription surface
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

The template intentionally solves the product shell before backend integration. The weak premise would be "connect Clerk and Cloudflare first, then design later." That would lock inconsistent UX into every app. The better order is:

1. Mature the reusable shell.
2. Make generated apps consume the shell.
3. Attach Clerk, D1, R2, analytics, and payments through adapters.

## Visual Direction

Reference direction: premium mobile app UI with soft gray canvas, white surface cards, photographic hero cards, compact pill controls, black floating navigation, and a restrained accent system. The implementation keeps HASSAR's product shell contract intact while moving away from generic dashboard density.
