# 5-Min App Template Runbook

## 003. User Flow And Pages

### App Shell And Page Contract

Product type: 5-minute mobile utility/coach template.

Selected page set:
- Onboarding
- Home
- Analytics
- Session/Main Action
- Bookmarks/Favorites
- Profile/Settings
- Detail/Drilldown

Route table:

| route | page_job | nav_slot | header_title | primary_shared_components | required_states |
| --- | --- | --- | --- | --- | --- |
| `/` | current state, next action, progress/activity, recommendations | Home | Product Shell Lab | `AppScreen`, `OnboardingFlow`, `DomainCarousel`, `Card`, `Metric`, `Button` | demo, selected domain, onboarding step |
| `/analytics` | metrics, progress, session results, score/level, validation trend | Analytics | Analytics | `Metric`, `ProgressStatus`, `ListRow`, `Card` | demo metrics, session rows |
| `/session` | primary five-minute action workflow | Session | 5-Min Session | `TextInput`, `ProgressStatus`, `Button`, `Card` | input, current step, saved output |
| `/bookmarks` | saved, favorited, resumable outputs | Bookmarks | Bookmarks | `ListRow`, `Card`, `Button` | saved outputs, non-empty demo, empty state copy |
| `/profile` | avatar, settings, personalization, account/subscription | Profile | Profile | `IconButton`, `Switch`, `ListRow`, `ProgressStatus` | avatar, personalization toggle, subscription rows |
| `/details/[id]` | useful drilldown for cards/rows/metrics | none | Detail | `Card`, `ProgressStatus`, `ListRow`, `Button` | session or recommendation fallback |

Internal navigation/detail table:

| source_screen | interactive_element | expected_action_or_route | target_screen_job | fallback_if_backend_missing |
| --- | --- | --- | --- | --- |
| Home | Start session | `/session` | run main workflow | local demo state |
| Home | Recommendation cards | `/details/[id]` | inspect recommendation | static recommendation detail |
| Analytics | Session result rows | `/details/[id]` | inspect score/result | static session detail |
| Session | Save | `/details/launch-plan` | inspect saved result | local generated brief |
| Bookmarks | Saved rows | `/details/[id]` | continue/review saved output | static saved output |
| Profile | Settings rows | `/details/[id]` | inspect setting/integration | adapter notes |

Bottom nav slots and icons:
- Home: `Home`
- Analytics: `BarChart3`
- Session/Main Action: `PlayCircle`
- Bookmarks/Favorites: `Bookmark`
- Profile: `UserCircle`

Header standard:
- Blurred inset `BlurView`
- Rounded shell
- `logoMark`
- `levelPill`
- `points`
- Compact product identity and screen context

Implementation expectations:
- `components/app-shell.tsx` owns shell primitives.
- `lib/template-data.ts` owns domain, sessions, recommendations, metrics.
- `lib/platform-adapters.ts` owns future Clerk, Cloudflare D1, Cloudflare R2, analytics integration points.

### Product-Level Home Contract

Home archetype: product command home for a 5-minute app portfolio.

First opened route: `/`.

Required slots:
- product identity
- current state
- next action
- progress/activity
- domain-specific recommendations
- carousel to compare product variants
- session CTA
- saved/detail navigation

Demo state:
- onboarding visible
- selected focus domain
- weekly progress
- recommendation cards
- metric cards

### Generated App Visual Direction

Generated bitmap visuals are deferred for this template. The core product problem is shell interaction fidelity, not hero imagery. Future app variants can add domain visuals inside cards or onboarding panels without changing the shell contract.

## 004. System Architecture

Architecture mode: copied native adaptation of the HASSAR shared design system, not a direct dependency on the web Storybook package.

State/data source:
- local static data for template review
- future `TemplateRepository` adapter for Cloudflare D1 and R2
- future auth adapter for Clerk

Backend rule:
- screens do not import Clerk, D1, R2, or analytics SDKs directly
- platform services attach through `lib/platform-adapters.ts`

## 007. Codex Plan

- Build Expo Router shell with five canonical tabs.
- Build reusable shell primitives under `components/`.
- Build domain/template state under `lib/`.
- Build non-placeholder Home, Analytics, Session, Bookmarks, Profile screens.
- Build detail route for actionable cards and rows.
- Run typecheck and HASSAR platform validator.

## 008. Parallel Agent Tasks

- `003-techlead`: keep services behind adapters and maintain route contract.
- `004-ux`: mature onboarding, carousel, header, tab nav, and tactile card/button language.
- `006-frontend`: implement Expo Router screens and reusable native components.
- `005-backend`: later replace local repository adapter with Cloudflare Worker, D1, and R2.
- `011-security`: later review Clerk auth boundaries, local-first handling, and upload policy.
- `013-analytics`: later map event names for onboarding, session, save, detail, and profile interactions.
