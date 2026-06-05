# 5-Min App Template Requirements

## Product Brief

Reusable Expo Router product shell for the HASSAR 5-minute app portfolio. The template exists to mature onboarding, header, bottom navigation, carousel, session workflow, analytics, bookmarks, profile, and detail-route experience before connecting production services.

## Target User

- HASSAR agents generating new `5-min-*` mobile apps.
- Founder/operator reviewing app UX standards before scaling app generation.
- Future product variants that need Clerk auth, Cloudflare D1 records, Cloudflare R2 assets, analytics, and monetization without redesigning the shell.

## Core User Flow

1. User sees a compact onboarding preview explaining app job, five-minute loop, and platform stack.
2. Home answers what to do now with state, progress, next action, carousel domain preview, and recommendations.
3. Session tab runs the strongest action surface: input, generated brief, save path, result preview, and step progress.
4. Analytics shows session result metrics, score/level, progress, trend, and validation signals.
5. Bookmarks shows real saved/favorite/resumable outputs, not an empty placeholder.
6. Profile shows avatar, personalization, settings, account/subscription surface, and score.
7. Detail routes prove rows/cards/buttons are not inert.

## Template Boundary

This is not yet a backend-integrated production app. The point is to establish the product shell and interaction standard first. Clerk, D1, R2, payment, and analytics are intentionally represented as adapter seams under `lib/platform-adapters.ts`.

## MVP Requirements

- Expo Router with five canonical icon-only tabs: Home, Analytics, Session, Bookmarks, Profile.
- Blurred/glass inset header with logo, level, and points.
- Blurred/glass inset bottom nav with active icon state.
- Reusable `AppScreen`, `ScreenScaffold`, `AppHeader`, `Card`, `Button`, `IconButton`, `Metric`, `ProgressStatus`, `DomainCarousel`, `OnboardingFlow`, and `ListRow`.
- Domain adapter data so agents can turn the shell into focus, health, learning, family, or work apps by replacing content, not structure.
- Internal detail route for saved outputs, recommendations, metrics, and profile rows.
- Local-first demo data with clear adapter points for Clerk and Cloudflare.

## Guardrails

- Do not fragment the five-tab shell per product.
- Do not put reusable components inside `app/`.
- Do not add backend SDKs directly into screens.
- Do not mark pipeline QA/launch stages complete if the platform validator fails.
