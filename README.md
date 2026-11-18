# Coy Discover

A standalone, privacy-first dating discovery app built for the Coy SDE Intern Assignment. One demo user browses profiles, likes or passes (by swipe, button or arrow key), and a match is created **only when the like is mutual**.

> It does not touch Coy's codebase, and no authentication is required: the app assumes a single seeded demo user.

## Assignment overview

| Requirement | Where |
| --- | --- |
| Home tab (blank placeholder) | `/app/home` |
| Discover tab, swipe like/pass | `/app/discover` |
| Matches view | `/app/matches` |
| Extras: marketing landing page, dashboard | `/`, `/app/dashboard` |
| `GET /api/feed`, `POST /api/swipe`, `GET /api/matches` | `src/app/api/*` |
| Part A product recommendations | [`docs/PRODUCT_RECOMMENDATIONS.md`](docs/PRODUCT_RECOMMENDATIONS.md) |

## Features

- Marketing landing page (`/`) and an app dashboard (`/app/dashboard`) with stats derived only from the user's own actions. The dashboard is additional; Home stays a blank placeholder. Old `/home`, `/discover`, `/matches` URLs redirect.
- Playfair Display (editorial headings, bundled locally via Fontsource) + Geist (interface).
- Drag-to-swipe card (Framer Motion) with LIKE / PASS stamps, plus Like/Pass buttons and ←/→ keys.
- Server-side mutual matching and a match celebration dialog.
- Persistent swipe history in PostgreSQL (Neon); swiped profiles never return, across refreshes and restarts.
- Skeleton loaders, image fallbacks, and friendly error / empty / exhausted states.
- Responsive layout: sticky header on desktop, fixed bottom nav (with safe-area padding) on mobile, full footer.
- 32 seeded profiles; 9 have privately liked the demo user.

## Technology stack

Next.js 15 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · Framer Motion · Radix primitives (shadcn-style `Button` / `Dialog`) · Lucide · Sonner · Zod · date-fns · **PostgreSQL (Neon) with Drizzle ORM** · Vitest + Testing Library.

> **Deviation from the brief:** the brief names Prisma + SQLite. This project uses Drizzle ORM on PostgreSQL (Neon) instead. The models (User, Profile, Swipe, Match), unique constraints and transactional logic are the same as specified.

## Architecture

```
UI (client components) ──fetch──▶ Route handlers ──▶ lib/matching.ts ──▶ Drizzle ──▶ PostgreSQL
                                   (Zod validation)    (all business rules)
```

- `src/lib/matching.ts` holds every rule: feed filtering, swipe recording, match creation. The frontend never decides whether something is a match.
- `toPublicProfile()` is the single whitelist mapper from DB row to client object.
- Swipe + match creation runs in one transaction; unique indexes on `(user, profile)` for swipes and matches are the last line of defence against duplicates.

## Folder structure

```
src/
  app/            pages (home, discover, matches, info pages) and api/{feed,swipe,matches}
  components/     layout/, discover/, matches/, ui/
  db/             schema.ts, profiles-data.ts, seed.ts
  hooks/          use-discover.ts
  lib/            db.ts, matching.ts, validation.ts, api.ts, client-api.ts, errors.ts
  types/
drizzle/          generated SQL migrations
tests/            backend (matching, api) and ui/ tests
docs/             PRODUCT_RECOMMENDATIONS.md
## API

All responses are JSON with `success: true | false`. Errors look like `{ "success": false, "error": { "code", "message" } }`.

### `GET /api/feed`
Unswiped profiles (up to 20) plus `remaining`. Each profile has only `id, name, age, photo, bio, location, interests`.

### `POST /api/swipe`
Body: `{ "profileId": "p01", "action": "like" | "pass" }`

- `200` `{ "success": true, "matched": false }` or `{ "success": true, "matched": true, "match": { "id": "…" } }`
- `400` invalid body / JSON · `404` unknown profile · `409` already swiped

### `GET /api/stats` (extra, for the dashboard)
`likesSent, mutualMatches, profilesViewed, totalProfiles, activityLast7Days`. Counts only the user's own swipes and confirmed matches; there is deliberately no "total likes" metric.

### `GET /api/matches`
`{ "success": true, "count": n, "matches": [{ "id", "matchedAt", "profile": {…} }] }`, newest first, mutual matches only.

## Privacy implementation

1. "Likes the user" is a server-only column (`profiles.likes_user`) that no query result or serializer exposes.
2. Matches exist only as rows created server-side when `action = like` **and** the profile liked the user. One-sided likes have no row anywhere a client can read.
3. The feed and matches responses go through the whitelist mapper; tests assert the JSON never contains the private field.
4. Every swipe body is validated with Zod; unknown profile IDs return a uniform 404, duplicates a 409.
5. Responses are sent with `Cache-Control: no-store`.


## Known limitations

- **Not yet checked in a real browser:** swipe gestures, visual polish, responsive breakpoints and the console have not been inspected by me. Please do a quick pass at 360 / 390 / 430 / 1280 px.
- Profile images are locally generated illustrated avatars (`public/avatars`, made by `npm run avatars` with DiceBear), so nothing depends on an external image host. They are illustrations, not photographs; replace them with real photos by editing `portraitUrl` in `src/db/profiles-data.ts`. A fallback (initial on a gradient) shows if an image ever fails.
- The landing page and dashboard follow the written brief only; no reference images were available. The landing page uses the same illustrated avatars; add your own photography for a more premium look.
- "Watch Demo", the premium card, Settings, Help, and Log out are labelled placeholders (no video, payments or sessions).
- Tested against a local Postgres-compatible server, not against a live Neon project.
- Single demo user, no auth, no real-time updates, no filters or preferences.
- The user avatar menu and footer info pages (About, Safety, Privacy, Terms, Contact, Feedback) are clearly labelled placeholders.
