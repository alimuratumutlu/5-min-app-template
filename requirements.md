# Solara Trips Requirements

## Product Brief

Solara Trips is a fictional travel discovery and booking app used as the reference product for the HASSAR mobile shell. It exists to mature header, bottom navigation, search, category pills, destination poster cards, booking workflow, analytics, bookmarks, profile, and detail-route experience before connecting production services.

## Target User

- HASSAR agents generating mobile apps.
- Founder/operator reviewing app UX standards before scaling app generation.
- Future product variants that need Clerk auth, Cloudflare D1 records, Cloudflare R2 assets, analytics, and monetization without redesigning the shell.

## Core User Flow

1. User searches destinations and selects a region.
2. Home shows the next trip, destination poster, tour carousel, travel services, and recommendations.
3. Booking tab runs the strongest action surface: input, generated trip brief, save path, result preview, and step progress.
4. Analytics shows trip result metrics, reward level, progress, trend, and booking signals.
5. Bookmarks shows real saved/favorite/resumable trips, not an empty placeholder.
6. Profile shows avatar, personalization, settings, account/rewards surface, and score.
7. Detail routes prove rows/cards/buttons are not inert.

## Product Boundary

This is not yet a backend-integrated production app. The point is to establish the product shell and interaction standard first. Clerk, D1, R2, payment, and analytics are intentionally represented as adapter seams under `lib/platform-adapters.ts`.

## MVP Requirements

- Expo Router with five canonical icon-only tabs: Home, Analytics, Session, Bookmarks, Profile.
- Blurred/glass inset header with logo, level, and points.
- Blurred/glass inset bottom nav with active icon state.
- Reusable `AppScreen`, `ScreenScaffold`, `AppHeader`, `Card`, `Button`, `IconButton`, `Metric`, `ProgressStatus`, `DomainCarousel`, `OnboardingFlow`, and `ListRow`.
- Travel adapter data so agents can replace content without changing structure.
- Internal detail route for saved outputs, recommendations, metrics, and profile rows.
- Local-first demo data with clear adapter points for Clerk and Cloudflare.

## Guardrails

- Do not fragment the five-tab shell per product.
- Do not put reusable components inside `app/`.
- Do not add backend SDKs directly into screens.
- Do not mark pipeline QA/launch stages complete if the platform validator fails.
